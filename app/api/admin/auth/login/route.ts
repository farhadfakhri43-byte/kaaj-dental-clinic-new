import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  authenticateAdmin,
} from '@/lib/admin/auth'
import {
  apiError,
  apiSuccess,
  isSameOrigin,
  readJson,
} from '@/lib/admin/api'
import { stringValue } from '@/lib/admin/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return apiError('Invalid request origin.', 403)
  }

  const body = await readJson(request)

  if (!body) {
    return apiError('Invalid request body.')
  }

  try {
    const email = stringValue(body.email, 'Email', { max: 200 })
    const password = stringValue(body.password, 'Password', { max: 512 })
    const result = await authenticateAdmin(email, password)

    if (result.configurationMissing) {
      return apiError(
        'Admin authentication is not configured. Add the required environment variables.',
        503,
      )
    }

    if (!result.ok) {
      return apiError('Email or password is incorrect.', 401)
    }

    const response = apiSuccess({
      authenticated: true,
      email: result.email,
    })

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      result.token,
      adminSessionCookieOptions(),
    )

    return response
  } catch (error) {
    if (error instanceof Error) {
      return apiError(error.message)
    }

    return apiError('Unable to sign in.')
  }
}
