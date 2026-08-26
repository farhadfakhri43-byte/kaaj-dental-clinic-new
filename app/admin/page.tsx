'use client'

import Link from 'next/link'
import {
  CalendarDays,
  GalleryVerticalEnd,
  KeyRound,
  Settings,
  Sparkles,
  Star,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'

const sections = [
  {
    title: 'Clinic Gallery',
    description: 'Upload, reorder, and publish real clinic photos.',
    icon: GalleryVerticalEnd,
    href: '/admin/images',
  },
  {
    title: 'Patient Stories',
    description: 'Manage patient video stories, copy, ratings, and visibility.',
    icon: Star,
    href: '/admin/stories',
  },
  {
    title: 'Services',
    description: 'Create and update treatments, service images, and order.',
    icon: Stethoscope,
    href: '/admin/services',
  },
  {
    title: 'Doctors',
    description: 'Add and update the doctors shown on the public website.',
    icon: UserRound,
    href: '/admin/doctors',
  },
  {
    title: 'Appointments',
    description: 'Review new appointment requests and update their status.',
    icon: CalendarDays,
    href: '/admin/appointments',
  },
  {
    title: 'Clinic Settings',
    description: 'Keep contact details, hours, map, and social links current.',
    icon: Settings,
    href: '/admin/settings',
  },
  {
    title: 'Security',
    description: 'Change the control panel password and protect administrator access.',
    icon: KeyRound,
    href: '/admin/security',
  },
  {
    title: 'Public Website',
    description: 'Open the live-facing experience and review recent changes.',
    icon: Sparkles,
    href: '/',
  },
]

export default function AdminPage() {
  return (
    <AdminShell
      title="Admin Dashboard"
      description="Manage the website content that patients see."
      showBack={false}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back
        </h2>
        <p className="mt-2 text-slate-500">
          Choose an area to keep KAAJ Dental Clinic accurate and up to date.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon

          return (
            <Link
              key={section.title}
              href={section.href}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-800 transition group-hover:bg-slate-900 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {section.description}
              </p>
              <span className="mt-5 inline-flex text-sm font-medium text-blue-600">
                Manage →
              </span>
            </Link>
          )
        })}
      </div>
    </AdminShell>
  )
}
