'use client'

import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import {
  AdminLoading,
  AdminNotice,
  adminInputClass,
} from '@/components/admin/admin-ui'
import { MediaUploadField } from '@/components/admin/media-upload-field'
import { adminRequest } from '@/lib/admin/client'
import type { ClinicGalleryItem } from '@/lib/cms/types'

type GalleryForm = {
  src: string
  alt: string
  label: string
  objectPosition: string
  active: boolean
}

const emptyForm: GalleryForm = {
  src: '',
  alt: '',
  label: '',
  objectPosition: '50% 50%',
  active: true,
}

function formFromItem(item: ClinicGalleryItem): GalleryForm {
  return {
    src: item.src,
    alt: item.alt,
    label: item.label,
    objectPosition: item.objectPosition,
    active: item.active,
  }
}

export default function AdminImagesPage() {
  const [gallery, setGallery] = useState<ClinicGalleryItem[]>([])
  const [editing, setEditing] = useState<ClinicGalleryItem | null>(null)
  const [form, setForm] = useState<GalleryForm>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    void loadGallery()
  }, [])

  async function loadGallery() {
    setIsLoading(true)
    setError('')

    try {
      const data = await adminRequest<{ gallery: ClinicGalleryItem[] }>(
        '/api/admin/gallery',
      )
      setGallery(data.gallery)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load the clinic gallery.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setSuccess('')
  }

  function openEdit(item: ClinicGalleryItem) {
    setEditing(item)
    setForm(formFromItem(item))
    setError('')
    setSuccess('')
  }

  function closeEditor() {
    setEditing(null)
    setForm(emptyForm)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.src) {
      setError('Upload a clinic photo before saving.')
      return
    }

    setIsSaving(true)

    try {
      const data = editing
        ? await adminRequest<{ item: ClinicGalleryItem }>(
            '/api/admin/gallery/' + editing.id,
            { method: 'PATCH', body: form },
          )
        : await adminRequest<{ item: ClinicGalleryItem }>('/api/admin/gallery', {
            method: 'POST',
            body: form,
          })

      setGallery((current) =>
        editing
          ? current.map((item) => (item.id === data.item.id ? data.item : item))
          : [...current, data.item],
      )
      setSuccess(editing ? 'Clinic photo updated.' : 'Clinic photo added.')
      closeEditor()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save the clinic photo.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function removeItem(item: ClinicGalleryItem) {
    if (!window.confirm('Delete “' + item.label + '” from the gallery?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await adminRequest('/api/admin/gallery/' + item.id, {
        method: 'DELETE',
      })
      setGallery((current) => current.filter((entry) => entry.id !== item.id))
      if (editing?.id === item.id) {
        closeEditor()
      }
      setSuccess('Clinic photo deleted.')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete the clinic photo.',
      )
    }
  }

  async function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= gallery.length) {
      return
    }

    const nextGallery = [...gallery]
    const [item] = nextGallery.splice(index, 1)
    nextGallery.splice(nextIndex, 0, item)
    setGallery(nextGallery)
    setError('')

    try {
      await adminRequest('/api/admin/gallery/reorder', {
        method: 'POST',
        body: { ids: nextGallery.map((entry) => entry.id) },
      })
    } catch (reorderError) {
      setGallery(gallery)
      setError(
        reorderError instanceof Error
          ? reorderError.message
          : 'Unable to reorder gallery photos.',
      )
    }
  }

  return (
    <AdminShell
      title="Clinic Gallery"
      description="Manage the real clinic photos in the KAAJ Experience section."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clinic experience</h2>
          <p className="mt-1 text-sm text-slate-500">
            Publish, replace, hide, and order the photos on the public website.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={gallery.length >= 8}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add clinic photo
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="space-y-4">
          {error && <AdminNotice tone="error">{error}</AdminNotice>}
          {success && <AdminNotice tone="success">{success}</AdminNotice>}
          {!isLoading && gallery.length >= 8 && (
            <p className="text-sm text-slate-500">
              The gallery supports up to eight photos. Edit an existing photo
              to replace it.
            </p>
          )}
          {isLoading ? (
            <AdminLoading label="Loading clinic gallery…" />
          ) : gallery.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No clinic photos are available yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((item, index) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="aspect-16/10 w-full bg-slate-100 object-cover"
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{item.label}</h3>
                      <span
                        className={
                          item.active
                            ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700'
                            : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500'
                        }
                      >
                        {item.active ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {item.alt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        aria-label={'Move ' + item.label + ' up'}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === gallery.length - 1}
                        aria-label={'Move ' + item.label + ' down'}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        aria-label={'Delete ' + item.label}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:sticky xl:top-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? 'Edit clinic photo' : 'New clinic photo'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Photos are shown in the KAAJ Experience lightbox gallery.
              </p>
            </div>
            {editing && (
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Close editor"
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <MediaUploadField
              kind="image"
              label="Clinic photo"
              value={form.src}
              onChange={(src) => setForm((current) => ({ ...current, src }))}
            />
            <div>
              <label htmlFor="gallery-label" className="text-sm font-medium text-slate-800">
                Label
              </label>
              <input
                id="gallery-label"
                value={form.label}
                onChange={(event) =>
                  setForm((current) => ({ ...current, label: event.target.value }))
                }
                className={adminInputClass}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label htmlFor="gallery-alt" className="text-sm font-medium text-slate-800">
                Image description
              </label>
              <textarea
                id="gallery-alt"
                value={form.alt}
                onChange={(event) =>
                  setForm((current) => ({ ...current, alt: event.target.value }))
                }
                className={adminInputClass + ' min-h-24 py-3'}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label htmlFor="gallery-position" className="text-sm font-medium text-slate-800">
                Image position
              </label>
              <input
                id="gallery-position"
                value={form.objectPosition}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    objectPosition: event.target.value,
                  }))
                }
                className={adminInputClass}
                placeholder="50% 50%"
                disabled={isSaving}
              />
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    active: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                disabled={isSaving}
              />
              Publish this photo
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : editing ? 'Save changes' : 'Add photo'}
            </button>
          </form>
        </aside>
      </div>
    </AdminShell>
  )
}
