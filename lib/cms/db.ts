import 'server-only'

import {
  neon,
  type NeonQueryFunction,
} from '@neondatabase/serverless'

export class CmsConfigurationError extends Error {
  constructor(message = 'Database configuration is required.') {
    super(message)
    this.name = 'CmsConfigurationError'
  }
}

let sqlClient: NeonQueryFunction<false, false> | undefined

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new CmsConfigurationError(
      'DATABASE_URL is missing. Add your Neon connection string before using the control panel.',
    )
  }

  sqlClient ??= neon(databaseUrl)
  return sqlClient
}
