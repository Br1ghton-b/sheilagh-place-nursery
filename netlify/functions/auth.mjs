import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGODB_URI
const mongoDbName = process.env.MONGODB_DB || 'sheilagh_place'
const jwtSecret = process.env.JWT_SECRET || 'dev-change-this-secret'

let mongoClient = null
let adminUsersCollection = null

async function ensureAdminCollection() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.')
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

      const collection = await ensureAdminCollection()
      const normalizedEmail = String(email).trim().toLowerCase()
      const trimmedPassword = String(password)
      const safeName = name ? String(name).trim() : normalizedEmail.split('@')[0]

      if (trimmedPassword.length < 8) {
        return jsonResponse(400, { error: 'Password must be at least 8 characters long' })
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
      const secure = !event.headers.host?.includes('localhost')

      return jsonResponse(
        existingUser ? 200 : 201,
        {
          ok: true,
          user: {
            id: String(userRecord._id),
            email: userRecord.email,
            name: userRecord.name,
          },
        },
        {
          'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800; ${secure ? 'Secure;' : ''}`,
        },
      )
    } catch (error) {
      if (error?.code === 11000) {
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

      const collection = await ensureAdminCollection()
      const normalizedEmail = String(email).trim().toLowerCase()
      const user = await collection.findOne({ email: normalizedEmail })

      if (!user) {
        return jsonResponse(401, { error: 'Invalid credentials' })
      }

      const isValid = await bcrypt.compare(String(password), user.passwordHash)
      if (!isValid) {
        return jsonResponse(401, { error: 'Invalid credentials' })
      }

      const token = createToken({
        id: String(user._id),
        email: user.email,
        name: user.name,
      })
      const secure = !event.headers.host?.includes('localhost')

      return jsonResponse(
        200,
        {
          ok: true,
          user: {
            id: String(user._id),
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
