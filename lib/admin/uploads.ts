import { del } from '@vercel/blob'

export type UploadKind = 'image' | 'video'

export const uploadRules: Record<
  UploadKind,
  {
    allowedContentTypes: string[]
    maximumSizeInBytes: number
  }
> = {
  image: {
    allowedContentTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
    ],
    maximumSizeInBytes: 10 * 1024 * 1024,
  },
  video: {
    allowedContentTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ],
    maximumSizeInBytes: 250 * 1024 * 1024,
  },
}

export function uploadKindValue(value: unknown): UploadKind {
  if (value === 'image' || value === 'video') {
    return value
  }

  throw new Error('Upload type is invalid.')
}

export function isManagedBlobUrl(value: string) {
  try {
    const url = new URL(value)

    return (
      url.protocol === 'https:' &&
      url.hostname.endsWith('.public.blob.vercel-storage.com')
    )
  } catch {
    return false
  }
}

export async function deleteManagedBlob(value: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN || !isManagedBlobUrl(value)) {
    return
  }

  try {
    await del(value, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch {
    return
  }
}
