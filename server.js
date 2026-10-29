import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 4000
const jwtSecret = process.env.JWT_SECRET || 'dev-change-this-secret'
const mongoUri = process.env.MONGODB_URI
const mongoDbName = process.env.MONGODB_DB || 'sheilagh_place'

let mongoClient = null
let adminUsersCollection = null

async function ensureAdminCollection() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured. Add your MongoDB connection string to your .env file.')
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri)
    await mongoClient.connect()
    const db = mongoClient.db(mongoDbName)
    adminUsersCollection = db.collection('admin_users')
    await adminUsersCollection.createIndex({ email: 1 }, { unique: true })
  }

  return adminUsersCollection
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
  } catch (_error) {
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

    const collection = await ensureAdminCollection()
    const normalizedEmail = String(email).trim().toLowerCase()
    const trimmedPassword = String(password)
    const safeName = name ? String(name).trim() : normalizedEmail.split('@')[0]

    if (trimmedPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, 12)
    const existingUser = await collection.findOne({ email: normalizedEmail })

    const userRecord = existingUser || {
      _id: (await collection.insertOne({
        name: safeName,
        email: normalizedEmail,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      })).insertedId,
      name: safeName,
      email: normalizedEmail,
    }

    if (existingUser) {
      await collection.updateOne(
        { _id: existingUser._id },
        { $set: { name: safeName, passwordHash, updatedAt: new Date() } },
      )
    }

    const token = createToken({
      id: String(userRecord._id),
      email: userRecord.email,
      name: userRecord.name,
    })

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    })

    return res.status(existingUser ? 200 : 201).json({
      ok: true,
      user: {
        id: String(userRecord._id),
        email: userRecord.email,
        name: userRecord.name,
      },
    })
  } catch (error) {
    if (error?.code === 11000) {
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

    const collection = await ensureAdminCollection()
    const normalizedEmail = String(email).trim().toLowerCase()
    const user = await collection.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(String(password), user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = createToken({
      id: String(user._id),
      email: user.email,
      name: user.name,
    })

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    })

    return res.json({
      ok: true,
      user: {
        id: String(user._id),
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
  console.log(`MongoDB admin auth server running on http://localhost:${port}`)
})
