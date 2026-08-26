import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { CmsConfigurationError } from '@/lib/cms/db'

type JsonValue = Record<string, unknown>

function withNoStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}

export function apiSuccess(payload: JsonValue, status = 200) {
  return withNoStore(NextResponse.json(payload, { status }))
}

export function apiError(error: string, status = 400) {
  return apiSuccess({ error }, status)
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')

  if (!origin) {
    return false
  }

  try {
    return origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export async function requireAdmin(
  request: Request,
  mutation = false,
) {
  if (mutation && !isSameOrigin(request)) {
    return apiError('Invalid request origin.', 403)
  }

  const session = await getAdminSession()

  if (!session) {
    return apiError('Authentication required.', 401)
  }

  return null
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return null
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof CmsConfigurationError) {
    return apiError(error.message, 503)
  }

  if (error instanceof Error) {
    return apiError(error.message, 400)
  }

  return apiError('An unexpected server error occurred.', 500)
}
