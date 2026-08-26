import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { storyInput } from '@/lib/admin/content-inputs'
import {
  assetUrlValue,
  identifierValue,
} from '@/lib/admin/validation'
import { deleteManagedBlob } from '@/lib/admin/uploads'
import {
  deletePatientStory,
  listPatientStories,
  updatePatientStory,
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
    const current = (await listPatientStories()).find(
      (story) => story.id === id,
    )

    if (!current) {
      return errorResponse(new Error('Patient story not found.'))
    }

    const story = await updatePatientStory(
      id,
      assetUrlValue(body.video, 'Patient video'),
      storyInput(body),
    )

    if (current.video !== story.video) {
      await deleteManagedBlob(current.video)
    }

    return apiSuccess({ story })
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
    const story = await deletePatientStory(id)

    await deleteManagedBlob(story.video)

    return apiSuccess({ story })
  } catch (error) {
    return errorResponse(error)
  }
}
