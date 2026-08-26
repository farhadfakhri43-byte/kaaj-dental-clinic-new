'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ExternalLink,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import {
  useState,
  type ReactNode,
} from 'react'

type AdminShellProps = {
  title: string
  description: string
  children: ReactNode
  showBack?: boolean
}

export function AdminShell({
  title,
  description,
  children,
  showBack = true,
}: AdminShellProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function logout() {
    setIsLoggingOut(true)

    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      })
    } finally {
      router.replace('/admin/login')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              KAAJ Dental Clinic
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {showBack && (
              <Link
                href="/admin"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {!showBack && (
              <a
                href="/"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Website
              </a>
            )}
            {showBack && (
              <a
                href="/"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Website
              </a>
            )}
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </section>
    </main>
  )
}

export function DashboardLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      <LayoutDashboard className="h-4 w-4" />
      {children}
    </Link>
  )
}
