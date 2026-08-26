import 'server-only'

import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto'
import { cookies } from 'next/headers'
import {
  createSessionToken,
  sessionMaxAge,
  type AdminSession,
  verifySessionToken,
} from '@/lib/admin/session'
import {
  getAdminPasswordHash,
  updateAdminPasswordHash,
} from '@/lib/cms/repository'

export const ADMIN_SESSION_COOKIE = 'kaaj_admin_session'

type AuthenticationResult =
  | {
      ok: false
      configurationMissing: boolean
    }
  | {
      ok: true
      configurationMissing: false
      token: string
      email: string
    }

function configuredEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? ''
}

function environmentPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH?.trim() ?? ''
}

async function configuredPasswordHash() {
  return (await getAdminPasswordHash()) || environmentPasswordHash()
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHash, extraSegment] = storedHash.split(':')

  if (!salt || !expectedHash || extraSegment) {
    return false
  }

  try {
    const actualHash = scryptSync(password, salt, 64).toString('hex')
    const actualBuffer = Buffer.from(actualHash, 'hex')
    const expectedBuffer = Buffer.from(expectedHash, 'hex')

    return (
      actualBuffer.length === expectedBuffer.length &&
      timingSafeEqual(actualBuffer, expectedBuffer)
    )
  } catch {
    return false
  }
}

export async function isAdminAuthConfigured() {
  return Boolean(
    configuredEmail() &&
      (await configuredPasswordHash()) &&
      process.env.ADMIN_SESSION_SECRET &&
      process.env.ADMIN_SESSION_SECRET.length >= 32,
  )
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AuthenticationResult> {
  const normalizedEmail = email.trim().toLowerCase()
  const adminEmail = configuredEmail()
  const passwordHash = await configuredPasswordHash()

  if (
    !adminEmail ||
    !passwordHash ||
    !process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET.length < 32
  ) {
    return {
      ok: false,
      configurationMissing: true,
    }
  }

  const emailMatches = normalizedEmail === adminEmail
  const passwordMatches = verifyPassword(password, passwordHash)

  if (!emailMatches || !passwordMatches) {
    return {
      ok: false,
      configurationMissing: false,
    }
  }

  return {
    ok: true,
    configurationMissing: false,
    token: createSessionToken(adminEmail),
    email: adminEmail,
  }
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
) {
  const passwordHash = await configuredPasswordHash()

  if (!passwordHash || !verifyPassword(currentPassword, passwordHash)) {
    return false
  }

  const salt = randomBytes(16).toString('hex')
  const nextHash = scryptSync(newPassword, salt, 64).toString('hex')
  await updateAdminPasswordHash(salt + ':' + nextHash)
  return true
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const session = verifySessionToken(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  )

  if (!session || session.email !== configuredEmail()) {
    return null
  }

  return session
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionMaxAge(),
  }
}
