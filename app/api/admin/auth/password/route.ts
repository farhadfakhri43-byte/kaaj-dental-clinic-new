import { changeAdminPassword } from '@/lib/admin/auth'
import {
  apiError,
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { passwordValue } from '@/lib/admin/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const authenticationError = await requireAdmin(request, true)
  if (authenticationError) return authenticationError

  const body = await readJson(request)
  if (!body) return apiError('Invalid request body.')

  try {
    const currentPassword = passwordValue(body.currentPassword, 'Current password')
    const newPassword = passwordValue(body.newPassword, 'New password')
    const confirmPassword = passwordValue(body.confirmPassword, 'Confirm password')

    if (newPassword !== confirmPassword) {
      return apiError('New passwords do not match.')
    }

    if (currentPassword === newPassword) {
      return apiError('New password must be different from the current password.')
    }

    const changed = await changeAdminPassword(currentPassword, newPassword)
    if (!changed) return apiError('Current password is incorrect.', 401)

    return apiSuccess({ changed: true })
  } catch (error) {
    return errorResponse(error)
  }
}