import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
} from '@/lib/admin/auth'
import {
  apiSuccess,
  requireAdmin,
} from '@/lib/admin/api'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const guard = await requireAdmin(request, true)

  if (guard) {
    return guard
  }

  const response = apiSuccess({ authenticated: false })
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    ...adminSessionCookieOptions(),
    maxAge: 0,
  })

  return response
}
