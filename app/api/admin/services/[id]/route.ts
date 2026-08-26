import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { serviceInput } from '@/lib/admin/content-inputs'
import {
  deleteService,
  listServices,
  updateService,
} from '@/lib/cms/repository'
import { identifierValue } from '@/lib/admin/validation'
import { deleteManagedBlob } from '@/lib/admin/uploads'

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
    const id = identifierValue((await context.params).id)
    const current = (await listServices()).find((service) => service.id === id)

    if (!current) {
      return errorResponse(new Error('Service not found.'))
    }

    const service = await updateService(id, serviceInput(body))

    if (current.image !== service.image) {
      await deleteManagedBlob(current.image)
    }

    return apiSuccess({ service })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request, true)

  if (guard) {
    return guard
  }

  try {
    const id = identifierValue((await context.params).id)
    const service = await deleteService(id)

    await deleteManagedBlob(service.image)

    return apiSuccess({ service })
  } catch (error) {
    return errorResponse(error)
  }
}
