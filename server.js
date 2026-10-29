import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pg from 'pg'

dotenv.config()

const { Pool } = pg
const app = express()
const port = Number(process.env.PORT) || 4000
const jwtSecret = process.env.JWT_SECRET || 'dev-change-this-secret'

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null

async function ensureAdminTable() {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured. Add it to your .env file before creating the admin account.')
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name || null,
      role: 'admin',
    },
    jwtSecret,
    { expiresIn: '8h' },
  )
}

function requireAdmin(req, res, next) {
  const token = req.cookies?.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Admin auth server is running' })
})

app.post('/api/create-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    await ensureAdminTable()

    const normalizedEmail = String(email).trim().toLowerCase()
    const trimmedPassword = String(password)
    const safeName = name ? String(name).trim() : normalizedEmail.split('@')[0]

    if (trimmedPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, 12)

    const result = await pool.query(
      `
        INSERT INTO admin_users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
      `,
      [safeName, normalizedEmail, passwordHash],
    )

    return res.status(201).json({ ok: true, user: result.rows[0] })
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'An admin account with that email already exists' })
    }

    return res.status(500).json({
      error: 'Could not create admin user',
      details: error.message,
    })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    await ensureAdminTable()

    const normalizedEmail = String(email).trim().toLowerCase()
    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [normalizedEmail])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(String(password), user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = createToken(user)

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    })

    return res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Login failed',
      details: error.message,
    })
  }
})

app.post('/api/logout', (_req, res) => {
  res.clearCookie('auth_token')
  return res.json({ ok: true })
})

app.get('/api/session', requireAdmin, (req, res) => {
  return res.json({
    ok: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  })
})

app.listen(port, () => {
  console.log(`Custom admin auth server running on http://localhost:${port}`)
})
