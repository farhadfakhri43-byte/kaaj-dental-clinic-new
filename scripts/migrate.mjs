import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import nextEnv from '@next/env'
import { neon } from '@neondatabase/serverless'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL is required to run migrations.')
  process.exit(1)
}

const schema = await readFile(resolve('db/schema.sql'), 'utf8')
const statements = schema
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean)
const sql = neon(databaseUrl)

for (const statement of statements) {
  await sql.query(statement)
}

console.log('Database schema is up to date.')
