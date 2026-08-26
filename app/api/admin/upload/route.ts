import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  handleUpload,
  type HandleUploadBody,
} from '@vercel/blob/client'
import {
  apiError,
  apiSuccess,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/lib/admin/api'
import {
  uploadKindValue,
  uploadRules,
} from '@/lib/admin/uploads'

export const runtime = 'nodejs'

function localFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase()
  const name = path.basename(filename, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return (name || 'upload') + extension
}

export async function GET(request: Request) {
  const guard = await requireAdmin(request)

  if (guard) {
    return guard
  }

  return apiSuccess({ storage: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local' })
}

export async function POST(request: Request) {
  if (
    !process.env.BLOB_READ_WRITE_TOKEN &&
    request.headers.get('content-type')?.includes('multipart/form-data')
  ) {
    const guard = await requireAdmin(request, true)

    if (guard) {
      return guard
    }

    try {
      const formData = await request.formData()
      const file = formData.get('file')
      const kind = uploadKindValue(formData.get('kind'))
      const rule = uploadRules[kind]

      if (!(file instanceof File)) {
        return apiError('A file is required.')
      }

      if (!rule.allowedContentTypes.includes(file.type)) {
        return apiError('This file type is not supported.')
      }

      if (file.size > rule.maximumSizeInBytes) {
        return apiError('This file is too large.')
      }

      const filename = Date.now() + '-' + localFilename(file.name)
      const relativePath = 'uploads/' + kind + '/' + filename
      const absolutePath = path.join(process.cwd(), 'public', relativePath)
      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()))

      return apiSuccess({ url: '/' + relativePath })
    } catch (error) {
      return errorResponse(error)
    }
  }

  const body = await readJson(request)

  if (!body) {
    return apiError('Invalid upload request.')
  }

  if (body.type === 'blob.generate-client-token') {
    const guard = await requireAdmin(request, true)

    if (guard) {
      return guard
    }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return apiError(
      'BLOB_READ_WRITE_TOKEN is missing. Configure Vercel Blob before uploading files.',
      503,
    )
  }

  try {
    const response = await handleUpload({
      body: body as unknown as HandleUploadBody,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = clientPayload
          ? (JSON.parse(clientPayload) as Record<string, unknown>)
          : {}
        const kind = uploadKindValue(payload.kind)
        const expectedPrefix = 'kaaj-dental/' + kind + '/'

        if (
          !pathname.startsWith(expectedPrefix) ||
          pathname.includes('..')
        ) {
          throw new Error('Invalid upload path.')
        }

        const rule = uploadRules[kind]

        return {
          allowedContentTypes: rule.allowedContentTypes,
          maximumSizeInBytes: rule.maximumSizeInBytes,
          validUntil: Date.now() + 60 * 60 * 1000,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ kind }),
        }
      },
    })

    return apiSuccess(response)
  } catch (error) {
    return errorResponse(error)
  }
}
