import {
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import { storyInput } from '@/lib/admin/content-inputs'
import { assetUrlValue } from '@/lib/admin/validation'
import {
  createPatientStory,
  listPatientStories,
} from '@/lib/cms/repository'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const guard = await requireAdmin(request)

  if (guard) {
    return guard
  }

  try {
    return apiSuccess({ stories: await listPatientStories() })
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
    const story = await createPatientStory(
      assetUrlValue(body.video, 'Patient video'),
      storyInput(body),
    )

    return apiSuccess({ story }, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
