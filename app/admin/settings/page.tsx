'use client'

import {
  Save,
  Settings,
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
import { adminRequest } from '@/lib/admin/client'
import type { ClinicSettings } from '@/lib/cms/types'

const emptySettings: ClinicSettings = {
  clinicName: '',
  phone: '',
  whatsapp: '',
  address: '',
  workingHours: '',
  email: '',
  instagram: '',
  facebook: '',
  telegram: '',
  googleMapsUrl: '',
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ClinicSettings>(emptySettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    void loadSettings()
  }, [])

  async function loadSettings() {
    setIsLoading(true)
    setError('')

    try {
      const data = await adminRequest<{ settings: ClinicSettings }>(
        '/api/admin/settings',
      )
      setSettings(data.settings)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load clinic settings.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      const data = await adminRequest<{ settings: ClinicSettings }>(
        '/api/admin/settings',
        {
          method: 'PATCH',
          body: settings,
        },
      )
      setSettings(data.settings)
      setSuccess('Clinic settings saved. The public contact details are updated.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save clinic settings.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  function updateField<K extends keyof ClinicSettings>(
    field: K,
    value: ClinicSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <AdminShell
      title="Clinic Settings"
      description="Keep contact details, working hours, social links, and map information current."
    >
      {isLoading ? (
        <AdminLoading label="Loading clinic settings…" />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-4xl space-y-6"
        >
          {error && <AdminNotice tone="error">{error}</AdminNotice>}
          {success && <AdminNotice tone="success">{success}</AdminNotice>}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                <Settings className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">Clinic information</h2>
                <p className="mt-1 text-sm text-slate-500">
                  This information is shown in the contact section and footer.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="clinic-name" className="text-sm font-medium text-slate-800">
                  Clinic name
                </label>
                <input
                  id="clinic-name"
                  value={settings.clinicName}
                  onChange={(event) => updateField('clinicName', event.target.value)}
                  className={adminInputClass}
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="clinic-phone" className="text-sm font-medium text-slate-800">
                  Phone
                </label>
                <input
                  id="clinic-phone"
                  value={settings.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className={adminInputClass}
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="clinic-whatsapp" className="text-sm font-medium text-slate-800">
                  WhatsApp
                </label>
                <input
                  id="clinic-whatsapp"
                  value={settings.whatsapp}
                  onChange={(event) => updateField('whatsapp', event.target.value)}
                  className={adminInputClass}
                  placeholder="+937..."
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="clinic-email" className="text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  id="clinic-email"
                  type="email"
                  value={settings.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className={adminInputClass}
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="clinic-hours" className="text-sm font-medium text-slate-800">
                  Working hours
                </label>
                <input
                  id="clinic-hours"
                  value={settings.workingHours}
                  onChange={(event) => updateField('workingHours', event.target.value)}
                  className={adminInputClass}
                  placeholder="Saturday to Thursday, 8:00 AM to 6:00 PM"
                  disabled={isSaving}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="clinic-address" className="text-sm font-medium text-slate-800">
                  Address
                </label>
                <textarea
                  id="clinic-address"
                  value={settings.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  className={adminInputClass + ' min-h-24 py-3'}
                  disabled={isSaving}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="clinic-map" className="text-sm font-medium text-slate-800">
                  Google Maps embed URL
                </label>
                <input
                  id="clinic-map"
                  type="url"
                  value={settings.googleMapsUrl}
                  onChange={(event) => updateField('googleMapsUrl', event.target.value)}
                  className={adminInputClass}
                  placeholder="https://www.google.com/maps?...&output=embed"
                  disabled={isSaving}
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Paste a Google Maps URL ending in <code>output=embed</code> for the exact map view. Leaving it blank uses the clinic address.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-bold text-slate-900">Social links</h2>
              <p className="mt-1 text-sm text-slate-500">
                Leave a link empty to hide it from the footer.
              </p>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="clinic-instagram" className="text-sm font-medium text-slate-800">
                  Instagram URL
                </label>
                <input
                  id="clinic-instagram"
                  type="url"
                  value={settings.instagram}
                  onChange={(event) => updateField('instagram', event.target.value)}
                  className={adminInputClass}
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="clinic-facebook" className="text-sm font-medium text-slate-800">
                  Facebook URL
                </label>
                <input
                  id="clinic-facebook"
                  type="url"
                  value={settings.facebook}
                  onChange={(event) => updateField('facebook', event.target.value)}
                  className={adminInputClass}
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="clinic-telegram" className="text-sm font-medium text-slate-800">
                  Telegram URL
                </label>
                <input
                  id="clinic-telegram"
                  type="url"
                  value={settings.telegram}
                  onChange={(event) => updateField('telegram', event.target.value)}
                  className={adminInputClass}
                  disabled={isSaving}
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving settings...' : 'Save clinic settings'}
          </button>
        </form>
      )}
    </AdminShell>
  )
}
