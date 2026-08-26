import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import {
  appointmentStatusValue,
  identifierValue,
} from '@/lib/admin/validation'
import { updateAppointmentStatus } from '@/lib/cms/repository'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request, true)

  if (guard) {
    return guard
  }

  const body = await readJson(request)

  if (!body) {
    return errorResponse(new Error('Invalid request body.'))
  }

  try {
    const appointment = await updateAppointmentStatus(
      identifierValue((await context.params).id),
      appointmentStatusValue(body.status),
    )

    return apiSuccess({ appointment })
  } catch (error) {
    return errorResponse(error)
  }
}
