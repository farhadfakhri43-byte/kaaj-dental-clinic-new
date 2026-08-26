import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { settingsInput } from '@/lib/admin/content-inputs'
import {
  getClinicSettings,
  updateClinicSettings,
} from '@/lib/cms/repository'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const guard = await requireAdmin(request)

  if (guard) {
    return guard
  }

  try {
    return apiSuccess({ settings: await getClinicSettings() })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin(request, true)

  if (guard) {
    return guard
  }

  const body = await readJson(request)

  if (!body) {
    return errorResponse(new Error('Invalid request body.'))
  }

  try {
    const settings = await updateClinicSettings(settingsInput(body))

    return apiSuccess({ settings })
  } catch (error) {
    return errorResponse(error)
  }
}
