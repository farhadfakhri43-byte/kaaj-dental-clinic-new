import {
  apiSuccess,
  errorResponse,
  requireAdmin,
} from '@/lib/admin/api'
import { listAppointments } from '@/lib/cms/repository'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const guard = await requireAdmin(request)

  if (guard) {
    return guard
  }

  try {
    return apiSuccess({ appointments: await listAppointments() })
  } catch (error) {
    return errorResponse(error)
  }
}
