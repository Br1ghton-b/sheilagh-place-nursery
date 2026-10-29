import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config({ path: './.env' })

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const emailArg = process.argv[2]
const passwordArg = process.argv[3]

if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password>')
  process.exit(1)
}

async function createAdmin() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `)

    const email = emailArg.trim().toLowerCase()
    const name = email.split('@')[0]
    const passwordHash = await bcrypt.hash(passwordArg, 12)

    const result = await pool.query(
      `INSERT INTO admin_users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         name = EXCLUDED.name
       RETURNING id, email, name`,
      [name, email, passwordHash],
    )

    console.log('Admin account created or updated:')
    console.log(result.rows[0])
  } catch (error) {
    console.error('Failed to create admin user:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

createAdmin()
