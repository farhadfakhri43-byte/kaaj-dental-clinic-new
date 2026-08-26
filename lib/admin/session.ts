import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto'

const SESSION_DURATION_SECONDS = 60 * 60 * 8

type SessionPayload = {
  email: string
  expiresAt: number
  nonce: string
}

export type AdminSession = {
  email: string
  expiresAt: number
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!secret || secret.length < 32) {
    return null
  }

  return secret
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function createSessionToken(email: string) {
  const secret = getSessionSecret()

  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be at least 32 characters long.',
    )
  }

  const payload: SessionPayload = {
    email,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    nonce: randomBytes(18).toString('base64url'),
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  )

  return encodedPayload + '.' + sign(encodedPayload, secret)
}

export function verifySessionToken(token: string | undefined | null) {
  const secret = getSessionSecret()

  if (!secret || !token) {
    return null
  }

  const [encodedPayload, suppliedSignature, extraSegment] = token.split('.')

  if (!encodedPayload || !suppliedSignature || extraSegment) {
    return null
  }

  const expectedSignature = sign(encodedPayload, secret)
  const suppliedBuffer = Buffer.from(suppliedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as SessionPayload

    if (
      typeof payload.email !== 'string' ||
      !payload.email ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }

    return {
      email: payload.email,
      expiresAt: payload.expiresAt,
    } satisfies AdminSession
  } catch {
    return null
  }
}

export function sessionMaxAge() {
  return SESSION_DURATION_SECONDS
}
