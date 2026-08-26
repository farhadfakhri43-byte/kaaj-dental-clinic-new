'use client'

import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Save,
  Star,
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
import type { PatientStory } from '@/lib/cms/types'

type StoryForm = {
  name: string
  treatment: string
  video: string
  quote: string
  duration: string
  rating: number
  active: boolean
}

const emptyForm: StoryForm = {
  name: '',
  treatment: '',
  video: '',
  quote: '',
  duration: '',
  rating: 5,
  active: true,
}

function formFromStory(story: PatientStory): StoryForm {
  return {
    name: story.name,
    treatment: story.treatment,
    video: story.video,
    quote: story.quote,
    duration: story.duration,
    rating: story.rating,
    active: story.active,
  }
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<PatientStory[]>([])
  const [editing, setEditing] = useState<PatientStory | null>(null)
  const [form, setForm] = useState<StoryForm>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    void loadStories()
  }, [])

  async function loadStories() {
    setIsLoading(true)
    setError('')

    try {
      const data = await adminRequest<{ stories: PatientStory[] }>(
        '/api/admin/stories',
      )
      setStories(data.stories)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load patient stories.',
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

  function openEdit(story: PatientStory) {
    setEditing(story)
    setForm(formFromStory(story))
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

    if (!form.video) {
      setError('Upload a patient video before saving.')
      return
    }

    setIsSaving(true)

    try {
      const data = editing
        ? await adminRequest<{ story: PatientStory }>(
            '/api/admin/stories/' + editing.id,
            { method: 'PATCH', body: form },
          )
        : await adminRequest<{ story: PatientStory }>('/api/admin/stories', {
            method: 'POST',
            body: form,
          })

      setStories((current) =>
        editing
          ? current.map((story) =>
              story.id === data.story.id ? data.story : story,
            )
          : [...current, data.story],
      )
      setSuccess(editing ? 'Patient story updated.' : 'Patient story added.')
      closeEditor()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save the patient story.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function removeStory(story: PatientStory) {
    if (!window.confirm('Delete the story from ' + story.name + '?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await adminRequest('/api/admin/stories/' + story.id, {
        method: 'DELETE',
      })
      setStories((current) =>
        current.filter((item) => item.id !== story.id),
      )
      if (editing?.id === story.id) {
        closeEditor()
      }
      setSuccess('Patient story deleted.')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete the patient story.',
      )
    }
  }

  async function moveStory(index: number, direction: -1 | 1) {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= stories.length) {
      return
    }

    const nextStories = [...stories]
    const [story] = nextStories.splice(index, 1)
    nextStories.splice(nextIndex, 0, story)
    setStories(nextStories)
    setError('')

    try {
      await adminRequest('/api/admin/stories/reorder', {
        method: 'POST',
        body: { ids: nextStories.map((item) => item.id) },
      })
    } catch (reorderError) {
      setStories(stories)
      setError(
        reorderError instanceof Error
          ? reorderError.message
          : 'Unable to reorder patient stories.',
      )
    }
  }

  return (
    <AdminShell
      title="Patient Stories"
      description="Manage the real patient video stories on the public website."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Video testimonials</h2>
          <p className="mt-1 text-sm text-slate-500">
            Only published stories appear in the patient stories section.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add patient story
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="space-y-4">
          {error && <AdminNotice tone="error">{error}</AdminNotice>}
          {success && <AdminNotice tone="success">{success}</AdminNotice>}
          {isLoading ? (
            <AdminLoading label="Loading patient stories…" />
          ) : stories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No patient stories are available yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {stories.map((story, index) => (
                <article
                  key={story.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <video
                    src={story.video}
                    preload="metadata"
                    muted
                    playsInline
                    className="aspect-video w-full rounded-2xl bg-slate-950 object-cover sm:w-48"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{story.name}</h3>
                      <span
                        className={
                          story.active
                            ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700'
                            : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500'
                        }
                      >
                        {story.active ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-blue-700">
                      {story.treatment}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {story.quote}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-amber-500">
                      {Array.from({ length: story.rating }, (_, star) => (
                        <Star
                          key={star}
                          className="h-3.5 w-3.5 fill-current"
                        />
                      ))}
                      {story.duration && (
                        <span className="ml-2 text-xs font-medium text-slate-500">
                          {story.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moveStory(index, -1)}
                      disabled={index === 0}
                      aria-label={'Move ' + story.name + ' up'}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStory(index, 1)}
                      disabled={index === stories.length - 1}
                      aria-label={'Move ' + story.name + ' down'}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(story)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStory(story)}
                      aria-label={'Delete ' + story.name}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                {editing ? 'Edit patient story' : 'New patient story'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Use real, consented patient videos only.
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
              kind="video"
              label="Patient video"
              value={form.video}
              onChange={(video) => setForm((current) => ({ ...current, video }))}
            />
            <div>
              <label htmlFor="story-name" className="text-sm font-medium text-slate-800">
                Patient name
              </label>
              <input
                id="story-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className={adminInputClass}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label htmlFor="story-treatment" className="text-sm font-medium text-slate-800">
                Treatment
              </label>
              <input
                id="story-treatment"
                value={form.treatment}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    treatment: event.target.value,
                  }))
                }
                className={adminInputClass}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label htmlFor="story-quote" className="text-sm font-medium text-slate-800">
                Short story
              </label>
              <textarea
                id="story-quote"
                value={form.quote}
                onChange={(event) =>
                  setForm((current) => ({ ...current, quote: event.target.value }))
                }
                className={adminInputClass + ' min-h-28 py-3'}
                required
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="story-duration" className="text-sm font-medium text-slate-800">
                  Duration
                </label>
                <input
                  id="story-duration"
                  value={form.duration}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      duration: event.target.value,
                    }))
                  }
                  className={adminInputClass}
                  placeholder="1:30"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="story-rating" className="text-sm font-medium text-slate-800">
                  Rating
                </label>
                <select
                  id="story-rating"
                  value={form.rating}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      rating: Number(event.target.value),
                    }))
                  }
                  className={adminInputClass}
                  disabled={isSaving}
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} stars
                    </option>
                  ))}
                </select>
              </div>
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
              Publish this story
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : editing ? 'Save changes' : 'Add story'}
            </button>
          </form>
        </aside>
      </div>
    </AdminShell>
  )
}
