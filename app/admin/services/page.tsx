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
import {
  serviceIconNames,
  type ManagedService,
  type ServiceIconName,
} from '@/lib/cms/types'

type ServiceForm = {
  name: string
  description: string
  icon: ServiceIconName
  image: string
  imageAlt: string
  imagePosition: string
  active: boolean
}

const emptyForm: ServiceForm = {
  name: '',
  description: '',
  icon: 'Sparkles',
  image: '',
  imageAlt: '',
  imagePosition: '50% 50%',
  active: true,
}

function formFromService(service: ManagedService): ServiceForm {
  return {
    name: service.name,
    description: service.description,
    icon: service.icon,
    image: service.image,
    imageAlt: service.imageAlt,
    imagePosition: service.imagePosition,
    active: service.active,
  }
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ManagedService[]>([])
  const [editing, setEditing] = useState<ManagedService | null>(null)
  const [form, setForm] = useState<ServiceForm>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    void loadServices()
  }, [])

  async function loadServices() {
    setIsLoading(true)
    setError('')

    try {
      const data = await adminRequest<{ services: ManagedService[] }>(
        '/api/admin/services',
      )
      setServices(data.services)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load services.',
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

  function openEdit(service: ManagedService) {
    setEditing(service)
    setForm(formFromService(service))
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

    if (!form.image) {
      setError('Upload a service image before saving.')
      return
    }

    setIsSaving(true)

    try {
      const data = editing
        ? await adminRequest<{ service: ManagedService }>(
            '/api/admin/services/' + editing.id,
            { method: 'PATCH', body: form },
          )
        : await adminRequest<{ service: ManagedService }>('/api/admin/services', {
            method: 'POST',
            body: form,
          })

      setServices((current) =>
        editing
          ? current.map((service) =>
              service.id === data.service.id ? data.service : service,
            )
          : [...current, data.service],
      )
      setSuccess(editing ? 'Service updated.' : 'Service created.')
      closeEditor()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save the service.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function removeService(service: ManagedService) {
    if (!window.confirm('Delete “' + service.name + '”?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await adminRequest('/api/admin/services/' + service.id, {
        method: 'DELETE',
      })
      setServices((current) =>
        current.filter((item) => item.id !== service.id),
      )
      if (editing?.id === service.id) {
        closeEditor()
      }
      setSuccess('Service deleted.')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete the service.',
      )
    }
  }

  async function moveService(index: number, direction: -1 | 1) {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= services.length) {
      return
    }

    const nextServices = [...services]
    const [service] = nextServices.splice(index, 1)
    nextServices.splice(nextIndex, 0, service)
    setServices(nextServices)
    setError('')

    try {
      await adminRequest('/api/admin/services/reorder', {
        method: 'POST',
        body: { ids: nextServices.map((item) => item.id) },
      })
    } catch (reorderError) {
      setServices(services)
      setError(
        reorderError instanceof Error
          ? reorderError.message
          : 'Unable to reorder services.',
      )
    }
  }

  return (
    <AdminShell
      title="Services"
      description="Manage the treatments displayed in the public services section."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service catalogue</h2>
          <p className="mt-1 text-sm text-slate-500">
            Service changes are published on the website immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add service
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="space-y-4">
          {error && <AdminNotice tone="error">{error}</AdminNotice>}
          {success && <AdminNotice tone="success">{success}</AdminNotice>}
          {isLoading ? (
            <AdminLoading label="Loading services…" />
          ) : services.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No services yet. Add the first service to publish it.
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service, index) => (
                <article
                  key={service.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="aspect-[16/10] w-full rounded-2xl bg-slate-100 object-cover sm:w-40"
                    style={{ objectPosition: service.imagePosition }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{service.name}</h3>
                      <span
                        className={
                          service.active
                            ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700'
                            : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500'
                        }
                      >
                        {service.active ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moveService(index, -1)}
                      disabled={index === 0}
                      aria-label={'Move ' + service.name + ' up'}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveService(index, 1)}
                      disabled={index === services.length - 1}
                      aria-label={'Move ' + service.name + ' down'}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      aria-label={'Delete ' + service.name}
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
                {editing ? 'Edit service' : 'New service'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editing
                  ? 'Update this service and save your changes.'
                  : 'Add a treatment to the public catalogue.'}
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
            <div>
              <label htmlFor="service-name" className="text-sm font-medium text-slate-800">
                Service name
              </label>
              <input
                id="service-name"
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
              <label htmlFor="service-description" className="text-sm font-medium text-slate-800">
                Description
              </label>
              <textarea
                id="service-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className={adminInputClass + ' min-h-28 py-3'}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label htmlFor="service-icon" className="text-sm font-medium text-slate-800">
                Icon
              </label>
              <select
                id="service-icon"
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    icon: event.target.value as ServiceIconName,
                  }))
                }
                className={adminInputClass}
                disabled={isSaving}
              >
                {serviceIconNames.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <MediaUploadField
              kind="image"
              label="Service image"
              value={form.image}
              onChange={(image) =>
                setForm((current) => ({ ...current, image }))
              }
            />
            <div>
              <label htmlFor="service-alt" className="text-sm font-medium text-slate-800">
                Image description
              </label>
              <input
                id="service-alt"
                value={form.imageAlt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imageAlt: event.target.value,
                  }))
                }
                className={adminInputClass}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label htmlFor="service-position" className="text-sm font-medium text-slate-800">
                Image position
              </label>
              <input
                id="service-position"
                value={form.imagePosition}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imagePosition: event.target.value,
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
              Publish this service
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : editing ? 'Save changes' : 'Create service'}
            </button>
          </form>
        </aside>
      </div>
    </AdminShell>
  )
}
