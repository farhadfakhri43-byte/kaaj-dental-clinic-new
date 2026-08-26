import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { galleryInput } from '@/lib/admin/content-inputs'
import { assetUrlValue } from '@/lib/admin/validation'
import {
  createGalleryItem,
  listGallery,
} from '@/lib/cms/repository'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const guard = await requireAdmin(request)

  if (guard) {
    return guard
  }

  try {
    return apiSuccess({ gallery: await listGallery() })
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
    const item = await createGalleryItem(
      assetUrlValue(body.src, 'Gallery image'),
      galleryInput(body),
    )

    return apiSuccess({ item }, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
