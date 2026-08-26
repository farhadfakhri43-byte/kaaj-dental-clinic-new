'use client'

import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'
import {
  useState,
  type FormEvent,
} from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import {
  AdminNotice,
  adminInputClass,
} from '@/components/admin/admin-ui'
import { adminRequest } from '@/lib/admin/client'

const passwordFields = [
  { id: 'current-password', name: 'currentPassword', label: 'Current password' },
  { id: 'new-password', name: 'newPassword', label: 'New password' },
  { id: 'confirm-password', name: 'confirmPassword', label: 'Confirm new password' },
] as const

export default function AdminSecurityPage() {
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function updateValue(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  function toggleVisibility(name: string) {
    setVisible((current) => ({ ...current, [name]: !current[name] }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      await adminRequest('/api/admin/auth/password', {
        method: 'POST',
        body: values,
      })
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSuccess('Your control panel password has been changed successfully.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to change the password.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminShell
      title="Security"
      description="Keep administrator access private with a strong, regularly updated password."
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-blue-200">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            Account protection
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Your control panel, kept private.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Change your password whenever access needs to be updated. Passwords are protected using a one-way secure hash and are never shown in the panel.
          </p>
          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-slate-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            Minimum 12 characters
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Change password</h2>
              <p className="mt-1 text-sm text-slate-500">Use a password only you and your trusted team know.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {error && <AdminNotice tone="error">{error}</AdminNotice>}
            {success && <AdminNotice tone="success">{success}</AdminNotice>}

            {passwordFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.id} className="text-sm font-medium text-slate-800">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={field.id}
                    name={field.name}
                    type={visible[field.name] ? 'text' : 'password'}
                    value={values[field.name]}
                    onChange={(event) => updateValue(field.name, event.target.value)}
                    className={adminInputClass + ' pr-12'}
                    minLength={12}
                    required
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(field.name)}
                    aria-label={visible[field.name] ? `Hide ${field.label}` : `Show ${field.label}`}
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    {visible[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <KeyRound className="h-4 w-4" />
              {isSaving ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        </section>
      </div>
    </AdminShell>
  )
}
