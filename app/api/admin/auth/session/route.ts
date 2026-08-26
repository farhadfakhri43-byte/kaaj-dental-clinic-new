import {
  apiSuccess,
  requireAdmin,
} from '@/lib/admin/api'
import { getAdminSession } from '@/lib/admin/auth'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const guard = await requireAdmin(request)

  if (guard) {
    return guard
  }

  const session = await getAdminSession()

  return apiSuccess({
    authenticated: true,
    email: session?.email ?? '',
  })
}
