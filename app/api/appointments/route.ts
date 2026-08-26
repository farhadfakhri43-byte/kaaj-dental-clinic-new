import {
  apiError,
  apiSuccess,
  errorResponse,
  isSameOrigin,
  readJson,
} from '@/lib/admin/api'
import { appointmentInput } from '@/lib/admin/content-inputs'
import { createAppointment } from '@/lib/cms/repository'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return apiError('Invalid request origin.', 403)
  }

  const body = await readJson(request)

  if (!body) {
    return errorResponse(new Error('Invalid request body.'))
  }

  try {
    const appointment = await createAppointment(appointmentInput(body))

    return apiSuccess({ appointment }, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
