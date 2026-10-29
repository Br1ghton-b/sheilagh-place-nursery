import pg from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
})

const jwtSecret = process.env.JWT_SECRET || 'dev-change-this-secret'

function jsonResponse(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  }
}

function parseCookies(rawCookieHeader) {
  const cookies = {}

  if (!rawCookieHeader) {
    return cookies
  }

  rawCookieHeader.split(';').forEach((pair) => {
    const [name, ...rest] = pair.trim().split('=')
    if (!name) {
      return
    }
    cookies[name] = decodeURIComponent(rest.join('='))
  })

  return cookies
}

async function ensureAdminTable() {
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

function getRequestBody(event) {
  if (!event.body) {
    return {}
  }

  try {
    return JSON.parse(event.body)
  } catch {
    return {}
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true })
  }

  const path = event.path || '/'
  const action = path.replace(/^.*\/api\//, '').replace(/^.*\//, '') || 'health'

  if (action === 'health') {
    return jsonResponse(200, { ok: true, message: 'Admin auth function is running' })
  }

  if (action === 'create-admin') {
    try {
      const { email, password, name } = getRequestBody(event)

      if (!email || !password) {
        return jsonResponse(400, { error: 'Email and password are required' })
      }

      await ensureAdminTable()

      const normalizedEmail = String(email).trim().toLowerCase()
      const trimmedPassword = String(password)
      const safeName = name ? String(name).trim() : normalizedEmail.split('@')[0]

      if (trimmedPassword.length < 8) {
        return jsonResponse(400, { error: 'Password must be at least 8 characters long' })
      }

      const passwordHash = await bcrypt.hash(trimmedPassword, 12)
      const result = await pool.query(
        `INSERT INTO admin_users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email`,
        [safeName, normalizedEmail, passwordHash],
      )

      return jsonResponse(201, { ok: true, user: result.rows[0] })
    } catch (error) {
      if (error?.code === '23505') {
        return jsonResponse(409, { error: 'An admin account with that email already exists' })
      }

      return jsonResponse(500, {
        error: 'Could not create admin user',
        details: error.message,
      })
    }
  }

  if (action === 'login') {
    try {
      const { email, password } = getRequestBody(event)

      if (!email || !password) {
        return jsonResponse(400, { error: 'Email and password are required' })
      }

      await ensureAdminTable()
      const normalizedEmail = String(email).trim().toLowerCase()
      const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [normalizedEmail])
      const user = result.rows[0]

      if (!user) {
        return jsonResponse(401, { error: 'Invalid credentials' })
      }

      const isValid = await bcrypt.compare(String(password), user.password_hash)
      if (!isValid) {
        return jsonResponse(401, { error: 'Invalid credentials' })
      }

      const token = createToken(user)
      const secure = !event.headers.host?.includes('localhost')

      return jsonResponse(
        200,
        {
          ok: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        {
          'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800; ${secure ? 'Secure;' : ''}`,
        },
      )
    } catch (error) {
      return jsonResponse(500, {
        error: 'Login failed',
        details: error.message,
      })
    }
  }

  if (action === 'logout') {
    return jsonResponse(
      200,
      { ok: true },
      {
        'Set-Cookie': 'auth_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0;',
      },
    )
  }

  if (action === 'session') {
    try {
      const cookies = parseCookies(event.headers.cookie)
      const token = cookies.auth_token

      if (!token) {
        return jsonResponse(401, { error: 'Not authenticated' })
      }

      const decoded = jwt.verify(token, jwtSecret)

      return jsonResponse(200, {
        ok: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        },
      })
    } catch {
      return jsonResponse(401, { error: 'Invalid or expired session' })
    }
  }

  return jsonResponse(404, { error: 'Not found' })
}
