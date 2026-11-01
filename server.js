import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { MongoClient, ObjectId } from 'mongodb'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 4000
const jwtSecret = process.env.JWT_SECRET || 'dev-change-this-secret'
const mongoUri = process.env.MONGODB_URI
const mongoDbName = process.env.MONGODB_DB || 'sheilagh_place'

let mongoClient = null
let adminUsersCollection = null
const contentCollectionNames = {
  events: 'content_events',
  newsletters: 'content_newsletters',
  gallery: 'content_gallery',
  enquiries: 'content_enquiries',
}

async function ensureDatabaseCollections() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured. Add your MongoDB connection string to your .env file.')
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri)
    await mongoClient.connect()
  }

  const db = mongoClient.db(mongoDbName)

  if (!adminUsersCollection) {
    adminUsersCollection = db.collection('admin_users')
    await adminUsersCollection.createIndex({ email: 1 }, { unique: true })
  }

  for (const collectionName of Object.values(contentCollectionNames)) {
    const collection = db.collection(collectionName)
    await collection.createIndex({ id: 1 }, { unique: true })
  }

  return db
}

async function getContentCollection(type) {
  const normalizedType = String(type || '').trim().toLowerCase()
  const collectionName = contentCollectionNames[normalizedType]

  if (!collectionName) {
    throw new Error('Unsupported content type')
  }

  const db = await ensureDatabaseCollections()
  return db.collection(collectionName)
}

function sanitizeDocument(entry) {
  if (!entry || typeof entry !== 'object') {
    return entry
  }

  const { _id, ...rest } = entry
  return {
    ...rest,
    id: rest.id ?? String(_id),
  }
}

async function ensureAdminCollection() {
  await ensureDatabaseCollections()
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

app.post('/api/admin/update-account', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword, email, name } = req.body || {}

    if (!currentPassword) {
      return res.status(400).json({ error: 'Your current password is required to update admin login details.' })
    }

    const collection = await ensureAdminCollection()
    const userId = req.user.id
    const existingUser = await collection.findOne({ _id: new ObjectId(userId) })

    if (!existingUser) {
      return res.status(404).json({ error: 'Admin account not found.' })
    }

    const isCurrentPasswordValid = await bcrypt.compare(String(currentPassword), existingUser.passwordHash)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect.' })
    }

    const nextName = name ? String(name).trim() : existingUser.name
    const nextEmail = email ? String(email).trim().toLowerCase() : existingUser.email

    if (!nextName || !nextEmail) {
      return res.status(400).json({ error: 'A display name and login email are required.' })
    }

    if (nextEmail !== existingUser.email) {
      const emailTaken = await collection.findOne({ email: nextEmail, _id: { $ne: existingUser._id } })
      if (emailTaken) {
        return res.status(409).json({ error: 'That admin email is already in use.' })
      }
    }

    const nextUpdate = {
      name: nextName,
      email: nextEmail,
      updatedAt: new Date(),
    }

    if (newPassword && String(newPassword).trim()) {
      const trimmedPassword = String(newPassword).trim()

      if (trimmedPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long.' })
      }

      nextUpdate.passwordHash = await bcrypt.hash(trimmedPassword, 12)
    }

    await collection.updateOne(
      { _id: existingUser._id },
      { $set: nextUpdate },
    )

    const updatedUser = {
      id: String(existingUser._id),
      email: nextEmail,
      name: nextName,
      role: 'admin',
    }

    const token = createToken(updatedUser)
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    })

    return res.json({
      ok: true,
      user: updatedUser,
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to update admin account',
      details: error.message,
    })
  }
})

app.get('/api/content/:type', async (req, res) => {
  try {
    const collection = await getContentCollection(req.params.type)
    const items = await collection.find({}).sort({ _id: -1 }).toArray()
    return res.json({
      ok: true,
      items: items.map((entry) => sanitizeDocument(entry)),
    })
  } catch (error) {
    return res.status(400).json({
      error: 'Could not load content',
      details: error.message,
    })
  }
})

app.post('/api/content/:type', async (req, res, next) => {
  if (req.params.type === 'enquiries') {
    return next()
  }

  return requireAdmin(req, res, next)
}, async (req, res) => {
  try {
    const collection = await getContentCollection(req.params.type)
    const payload = req.body || {}
    const nextItem = {
      ...payload,
      id: payload.id ?? Date.now(),
    }

    await collection.insertOne(nextItem)
    return res.status(201).json({ ok: true, item: sanitizeDocument(nextItem) })
  } catch (error) {
    return res.status(500).json({
      error: 'Could not save content',
      details: error.message,
    })
  }
})

app.put('/api/content/:type/:id', requireAdmin, async (req, res) => {
  try {
    const collection = await getContentCollection(req.params.type)
    const payload = req.body || {}
    const itemId = String(req.params.id)
    const nextItem = {
      ...payload,
      id: itemId,
    }

    await collection.updateOne(
      { id: itemId },
      { $set: nextItem },
      { upsert: true },
    )

    const savedDocument = await collection.findOne({ id: itemId })
    return res.json({
      ok: true,
      item: sanitizeDocument(savedDocument || nextItem),
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Could not update content',
      details: error.message,
    })
  }
})

app.delete('/api/content/:type/:id', requireAdmin, async (req, res) => {
  try {
    const collection = await getContentCollection(req.params.type)
    const itemId = String(req.params.id)
    const result = await collection.deleteOne({ id: itemId })

    return res.json({
      ok: true,
      deleted: result.deletedCount > 0,
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Could not delete content',
      details: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`MongoDB admin auth server running on http://localhost:${port}`)
})
