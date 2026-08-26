'use client'

import {
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import {
  AdminLoading,
  AdminNotice,
} from '@/components/admin/admin-ui'
import { adminRequest } from '@/lib/admin/client'
import type {
  Appointment,
  AppointmentStatus,
} from '@/lib/cms/types'

const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function statusClass(status: AppointmentStatus) {
  if (status === 'confirmed') {
    return 'bg-blue-50 text-blue-700'
  }

  if (status === 'completed') {
    return 'bg-emerald-50 text-emerald-700'
  }

  if (status === 'cancelled') {
    return 'bg-red-50 text-red-700'
  }

  return 'bg-amber-50 text-amber-700'
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.valueOf())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    void loadAppointments()
  }, [])

  async function loadAppointments() {
    setIsLoading(true)
    setError('')

    try {
      const data = await adminRequest<{ appointments: Appointment[] }>(
        '/api/admin/appointments',
      )
      setAppointments(data.appointments)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load appointments.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(
    appointment: Appointment,
    status: AppointmentStatus,
  ) {
    if (status === appointment.status) {
      return
    }

    setUpdatingId(appointment.id)
    setError('')
    setSuccess('')

    try {
      const data = await adminRequest<{ appointment: Appointment }>(
        '/api/admin/appointments/' + appointment.id,
        {
          method: 'PATCH',
          body: { status },
        },
      )
      setAppointments((current) =>
        current.map((item) =>
          item.id === data.appointment.id ? data.appointment : item,
        ),
      )
      setSuccess('Appointment status updated.')
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update appointment status.',
      )
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <AdminShell
      title="Appointments"
      description="Review appointment requests sent from the public website."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Appointment requests</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update each status as the clinic follows up with the patient.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadAppointments()}
          disabled={isLoading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={isLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {error && <AdminNotice tone="error">{error}</AdminNotice>}
        {success && <AdminNotice tone="success">{success}</AdminNotice>}
        {isLoading ? (
          <AdminLoading label="Loading appointment requests…" />
        ) : appointments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <CalendarDays className="mx-auto h-9 w-9 text-slate-400" />
            <h3 className="mt-4 font-semibold text-slate-900">No appointments yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              New requests from the website will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {appointment.name}
                      </h3>
                      <span
                        className={
                          'rounded-full px-2.5 py-1 text-xs font-semibold ' +
                          statusClass(appointment.status)
                        }
                      >
                        {statusLabels[appointment.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Received {formatDate(appointment.createdAt)}
                    </p>
                    <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                      <a
                        href={'tel:' + appointment.phone.replace(/\s/g, '')}
                        className="inline-flex items-center gap-2 transition hover:text-blue-700"
                      >
                        <Phone className="h-4 w-4 text-slate-400" />
                        {appointment.phone}
                      </a>
                      {appointment.email && (
                        <a
                          href={'mailto:' + appointment.email}
                          className="inline-flex items-center gap-2 break-all transition hover:text-blue-700"
                        >
                          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                          {appointment.email}
                        </a>
                      )}
                      {appointment.service && (
                        <p>
                          <span className="font-semibold">Service: </span>
                          {appointment.service}
                        </p>
                      )}
                      {(appointment.preferredDate || appointment.preferredTime) && (
                        <p className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-slate-400" />
                          {[appointment.preferredDate, appointment.preferredTime]
                            .filter(Boolean)
                            .join(' at ')}
                        </p>
                      )}
                    </div>
                    {appointment.message && (
                      <p className="mt-5 max-w-3xl rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                        {appointment.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full shrink-0 sm:w-48">
                    <label
                      htmlFor={'appointment-status-' + appointment.id}
                      className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                    >
                      Status
                    </label>
                    <select
                      id={'appointment-status-' + appointment.id}
                      value={appointment.status}
                      onChange={(event) =>
                        void updateStatus(
                          appointment,
                          event.target.value as AppointmentStatus,
                        )
                      }
                      disabled={updatingId === appointment.id}
                      className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {(Object.keys(statusLabels) as AppointmentStatus[]).map(
                        (status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
