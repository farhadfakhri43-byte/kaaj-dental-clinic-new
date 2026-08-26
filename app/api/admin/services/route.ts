import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { serviceInput } from '@/lib/admin/content-inputs'
import {
  createService,
  listServices,
} from '@/lib/cms/repository'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const guard = await requireAdmin(request)

  if (guard) {
    return guard
  }

  try {
    return apiSuccess({ services: await listServices() })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request, true)

  if (guard) {
    return guard
  }

  const body = await readJson(request)

  if (!body) {
    return errorResponse(new Error('Invalid request body.'))
  }

  try {
    const service = await createService(serviceInput(body))

    return apiSuccess({ service }, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
