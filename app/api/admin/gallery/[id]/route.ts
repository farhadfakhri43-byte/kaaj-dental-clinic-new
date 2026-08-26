import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { galleryInput } from '@/lib/admin/content-inputs'
import {
  assetUrlValue,
  identifierValue,
} from '@/lib/admin/validation'
import { deleteManagedBlob } from '@/lib/admin/uploads'
import {
  deleteGalleryItem,
  listGallery,
  updateGalleryItem,
} from '@/lib/cms/repository'

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
    const current = (await listGallery()).find((item) => item.id === id)

    if (!current) {
      return errorResponse(new Error('Gallery image not found.'))
    }

    const item = await updateGalleryItem(
      id,
      assetUrlValue(body.src, 'Gallery image'),
      galleryInput(body),
    )

    if (current.src !== item.src) {
      await deleteManagedBlob(current.src)
    }

    return apiSuccess({ item })
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
    const item = await deleteGalleryItem(id)

    await deleteManagedBlob(item.src)

    return apiSuccess({ item })
  } catch (error) {
    return errorResponse(error)
  }
}
