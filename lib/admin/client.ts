'use client'

import { upload } from '@vercel/blob/client'

export type UploadMediaKind = 'image' | 'video'

type ApiError = {
  error?: string
}

type ApiOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown
}

export async function adminRequest<T>(
  pathname: string,
  options: ApiOptions = {},
) {
  const response = await fetch(pathname, {
    ...options,
    headers: options.body
      ? {
          'Content-Type': 'application/json',
        }
      : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  })
  const payload = (await response.json().catch(() => ({}))) as T & ApiError

  if (!response.ok) {
    throw new Error(payload.error || 'The request could not be completed.')
  }

  return payload
}

function safeFilename(filename: string) {
  const extension = filename.includes('.')
    ? '.' + filename.split('.').pop()
    : ''
  const name = filename
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return (name || 'upload') + extension.toLowerCase()
}

function validateUpload(file: File, kind: UploadMediaKind) {
  const limit = kind === 'image' ? 10 * 1024 * 1024 : 250 * 1024 * 1024
  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ]
  const allowedVideoTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ]
  const allowedTypes = kind === 'image' ? allowedImageTypes : allowedVideoTypes

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      kind === 'image'
        ? 'Use a JPG, PNG, WebP, or AVIF image.'
        : 'Use an MP4, WebM, or MOV video.',
    )
  }

  if (file.size > limit) {
    throw new Error(
      kind === 'image'
        ? 'Images must be 10 MB or smaller.'
        : 'Videos must be 250 MB or smaller.',
    )
  }
}

export async function uploadMedia(
  file: File,
  kind: UploadMediaKind,
  onProgress?: (percentage: number) => void,
) {
  validateUpload(file, kind)

  const storageResponse = await fetch('/api/admin/upload', {
    cache: 'no-store',
  })
  const storage = (await storageResponse.json().catch(() => ({}))) as {
    storage?: 'blob' | 'local'
    error?: string
  }

  if (!storageResponse.ok) {
    throw new Error(storage.error || 'Upload storage is unavailable.')
  }

  if (storage.storage === 'local') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('kind', kind)
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    })
    const payload = (await response.json().catch(() => ({}))) as {
      url?: string
      error?: string
    }

    if (!response.ok || !payload.url) {
      throw new Error(payload.error || 'The file could not be uploaded.')
    }

    onProgress?.(100)
    return payload.url
  }

  const blob = await upload(
    'kaaj-dental/' + kind + '/' + Date.now() + '-' + safeFilename(file.name),
    file,
    {
      access: 'public',
      handleUploadUrl: '/api/admin/upload',
      clientPayload: JSON.stringify({ kind }),
      contentType: file.type,
      multipart: kind === 'video',
      onUploadProgress: onProgress
        ? (progress) => onProgress(Math.round(progress.percentage))
        : undefined,
    },
  )

  return blob.url
}
