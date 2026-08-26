'use client'

import { useRouter } from 'next/navigation'
import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import {
  LockKeyhole,
  LogIn,
} from 'lucide-react'
import { AdminNotice, adminInputClass } from '@/components/admin/admin-ui'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/auth/session', { cache: 'no-store' }).then((response) => {
      if (response.ok) {
        router.replace('/admin')
      }
    })
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || 'Unable to sign in.')
      }

      router.replace('/admin')
      router.refresh()
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Unable to sign in.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_28px_60px_-36px_rgba(15,23,42,0.45)] sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
          <LockKeyhole className="h-6 w-6" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          KAAJ Dental Clinic
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Control Panel
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in with the administrator account configured for this website.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className={adminInputClass}
              placeholder="admin@example.com"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={adminInputClass}
              disabled={isSubmitting}
            />
          </div>
          {error && <AdminNotice tone="error">{error}</AdminNotice>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
