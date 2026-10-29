import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config({ path: './.env' })

const mongoUri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'sheilagh_place'
const emailArg = process.argv[2]
const passwordArg = process.argv[3]

if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password>')
  process.exit(1)
}

if (!mongoUri) {
  console.error('MONGODB_URI is not configured. Add your MongoDB connection string to .env before creating an admin account.')
  process.exit(1)
}

async function createAdmin() {
  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection('admin_users')
    await collection.createIndex({ email: 1 }, { unique: true })

    const email = emailArg.trim().toLowerCase()
    const name = email.split('@')[0]
    const passwordHash = await bcrypt.hash(passwordArg, 12)

    const existingUser = await collection.findOne({ email })

    if (existingUser) {
      await collection.updateOne(
        { _id: existingUser._id },
        { $set: { name, passwordHash, updatedAt: new Date() } },
      )

      console.log('Admin account updated:')
      console.log({ id: existingUser._id.toString(), email, name })
      return
    }

    const result = await collection.insertOne({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('Admin account created:')
    console.log({ id: result.insertedId.toString(), email, name })
  } catch (error) {
    console.error('Failed to create admin user:', error.message)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}

createAdmin()
