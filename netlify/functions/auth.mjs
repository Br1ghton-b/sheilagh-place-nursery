import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { MongoClient, ObjectId } from 'mongodb'

const mongoUri = process.env.MONGODB_URI
const mongoDbName = process.env.MONGODB_DB || 'sheilagh_place'
const jwtSecret = process.env.JWT_SECRET || 'dev-change-this-secret'

let mongoClient = null
let adminUsersCollection = null

async function ensureAdminCollection() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured in Netlify environment variables.')
  }

  if (!mongoClient) {
    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    })

    try {
      await client.connect()
      mongoClient = client
      const db = mongoClient.db(mongoDbName)
      adminUsersCollection = db.collection('admin_users')
    } catch (err) {
      mongoClient = null
      throw new Error(
        'Database connection failed. Please ensure MongoDB Atlas Network Access has 0.0.0.0/0 allowed. ' +
          (err?.message || ''),
      )
    }
  }

  return adminUsersCollection
}

function getAllowedOrigin(originHeader) {
  const allowedOrigins = new Set([
    'https://sheilaghsplace.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:4173',
  ])

  if (!originHeader) {
    return 'https://sheilaghsplace.netlify.app'
  }

  const normalized = originHeader.trim().toLowerCase()
  return allowedOrigins.has(normalized) ? normalized : 'https://sheilaghsplace.netlify.app'
}

function jsonResponse(statusCode, payload, extraHeaders = {}, event = {}) {
  const originHeader = event.headers?.origin || event.headers?.Origin
  const allowedOrigin = getAllowedOrigin(originHeader)

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin',
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
  if (!event || event.body === undefined || event.body === null || event.body === '') {
    return {}
  }

  let rawBody = event.body

  if (typeof rawBody === 'string' && event.isBase64Encoded) {
    rawBody = Buffer.from(rawBody, 'base64').toString('utf8')
  }

  if (typeof rawBody !== 'string') {
    try {
      return JSON.parse(JSON.stringify(rawBody))
    } catch {
      return rawBody ?? {}
    }
  }

  try {
    return JSON.parse(rawBody)
  } catch {
    return {}
  }
}

export async function handler(event) {
  const respond = (statusCode, payload, extraHeaders = {}) =>
    jsonResponse(statusCode, payload, extraHeaders, event)

  if (event.httpMethod === 'OPTIONS') {
    return respond(200, { ok: true })
  }

  const path = event.path || '/'
  const action = path.replace(/^.*\/api\//, '').replace(/^.*\//, '') || 'health'

  if (action === 'health') {
    return respond(200, { ok: true, message: 'Admin auth function is running' })
  }

  if (action === 'create-admin') {
    try {
      const { email, password, name } = getRequestBody(event)

      if (!email || !password) {
        return respond(400, { error: 'Email and password are required' })
      }

      const collection = await ensureAdminCollection()
      const normalizedEmail = String(email).trim().toLowerCase()
      const trimmedPassword = String(password)
      const safeName = name ? String(name).trim() : normalizedEmail.split('@')[0]

      if (trimmedPassword.length < 8) {
        return respond(400, { error: 'Password must be at least 8 characters long' })
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

      return respond(
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
        return respond(409, { error: 'An admin account with that email already exists' })
      }

      return respond(500, {
        error: 'Could not create admin user',
        details: error.message,
      })
    }
  }

  if (action === 'login') {
    try {
      const { email, password } = getRequestBody(event)

      if (!email || !password) {
        return respond(400, { error: 'Email and password are required' })
      }

      const collection = await ensureAdminCollection()
      const normalizedEmail = String(email).trim().toLowerCase()
      const user = await collection.findOne({ email: normalizedEmail })

      if (!user) {
        return respond(401, { error: 'Invalid credentials' })
      }

      const isValid = await bcrypt.compare(String(password), user.passwordHash)
      if (!isValid) {
        return respond(401, { error: 'Invalid credentials' })
      }

      const token = createToken({
        id: String(user._id),
        email: user.email,
        name: user.name,
      })
      const secure = !event.headers.host?.includes('localhost')

      return respond(
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
      return respond(500, {
        error: 'Login failed',
        details: error.message,
      })
    }
  }

  if (action === 'logout') {
    return respond(
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
        return respond(401, { error: 'Not authenticated' })
      }

      const decoded = jwt.verify(token, jwtSecret)

      return respond(200, {
        ok: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        },
      })
    } catch {
      return respond(401, { error: 'Invalid or expired session' })
    }
  }

  if (action === 'update-account') {
    try {
      const cookies = parseCookies(event.headers.cookie)
      const token = cookies.auth_token

      if (!token) {
        return respond(401, { error: 'Not authenticated' })
      }

      const decoded = jwt.verify(token, jwtSecret)
      const { currentPassword, newPassword, email, name } = getRequestBody(event)

      if (!currentPassword) {
        return respond(400, { error: 'Your current password is required to update admin login details.' })
      }

      const collection = await ensureAdminCollection()
      const existingUser = await collection.findOne({ _id: new ObjectId(decoded.id) })

      if (!existingUser) {
        return respond(404, { error: 'Admin account not found.' })
      }

      const isCurrentPasswordValid = await bcrypt.compare(String(currentPassword), existingUser.passwordHash)
      if (!isCurrentPasswordValid) {
        return respond(401, { error: 'Current password is incorrect.' })
      }

      const nextName = name ? String(name).trim() : existingUser.name
      const nextEmail = email ? String(email).trim().toLowerCase() : existingUser.email

      if (!nextName || !nextEmail) {
        return respond(400, { error: 'A display name and login email are required.' })
      }

      if (nextEmail !== existingUser.email) {
        const emailTaken = await collection.findOne({ email: nextEmail, _id: { $ne: existingUser._id } })
        if (emailTaken) {
          return respond(409, { error: 'That admin email is already in use.' })
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
          return respond(400, { error: 'New password must be at least 8 characters long.' })
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

      const secure = !event.headers.host?.includes('localhost')
      const refreshedToken = createToken(updatedUser)

      return respond(
        200,
        {
          ok: true,
          user: updatedUser,
        },
        {
          'Set-Cookie': `auth_token=${refreshedToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800; ${secure ? 'Secure;' : ''}`,
        },
      )
    } catch (error) {
      return respond(500, {
        error: 'Unable to update admin account',
        details: error.message,
      })
    }
  }

  return respond(404, { error: 'Not found' })
}
