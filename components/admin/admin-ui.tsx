import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react'
import type { ReactNode } from 'react'

export const adminInputClass =
  'mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'

export function AdminNotice({
  tone,
  children,
}: {
  tone: 'error' | 'success'
  children: ReactNode
}) {
  const Icon = tone === 'error' ? AlertCircle : CheckCircle2

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={
        tone === 'error'
          ? 'flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
          : 'flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
      }
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

export function AdminLoading({
  label = 'Loading…',
}: {
  label?: string
}) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-500 shadow-sm">
      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
      {label}
    </div>
  )
}
