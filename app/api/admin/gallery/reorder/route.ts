import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { reorderIdsValue } from '@/lib/admin/validation'
import { reorderGallery } from '@/lib/cms/repository'

export const runtime = 'nodejs'

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
    await reorderGallery(reorderIdsValue(body.ids))

    return apiSuccess({ reordered: true })
  } catch (error) {
    return errorResponse(error)
  }
}
