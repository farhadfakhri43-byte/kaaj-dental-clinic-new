'use client'

import {
  useState,
  type ChangeEvent,
} from 'react'
import {
  Film,
  ImagePlus,
  LoaderCircle,
  Upload,
} from 'lucide-react'
import {
  uploadMedia,
  type UploadMediaKind,
} from '@/lib/admin/client'
import { AdminNotice } from '@/components/admin/admin-ui'

type MediaUploadFieldProps = {
  kind: UploadMediaKind
  label: string
  value: string
  onChange: (url: string) => void
}

export function MediaUploadField({
  kind,
  label,
  value,
  onChange,
}: MediaUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    setError('')
    setProgress(0)
    setIsUploading(true)

    try {
      const url = await uploadMedia(file, kind, setProgress)
      onChange(url)
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'The file could not be uploaded.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  const Icon = kind === 'image' ? ImagePlus : Film
  const accept =
    kind === 'image'
      ? 'image/jpeg,image/png,image/webp,image/avif'
      : 'video/mp4,video/webm,video/quicktime'

  return (
    <div>
      <span className="block text-sm font-medium text-slate-800">{label}</span>
      <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        {value ? (
          kind === 'image' ? (
            <img
              src={value}
              alt="Selected upload preview"
              className="aspect-video w-full object-cover"
            />
          ) : (
            <video
              src={value}
              controls
              preload="metadata"
              className="aspect-video w-full bg-slate-950 object-contain"
            />
          )
        ) : (
          <div className="grid aspect-video place-items-center text-slate-400">
            <Icon className="h-9 w-9" />
          </div>
        )}
      </div>
      <label
        className={
          'mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2 ' +
          (isUploading ? 'pointer-events-none opacity-60' : '')
        }
      >
        {isUploading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading
          ? 'Uploading' + (progress ? ' ' + progress + '%' : '...')
          : value
            ? 'Replace ' + (kind === 'image' ? 'image' : 'video')
            : 'Upload ' + (kind === 'image' ? 'image' : 'video')}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      {error && (
        <div className="mt-3">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}
    </div>
  )
}
