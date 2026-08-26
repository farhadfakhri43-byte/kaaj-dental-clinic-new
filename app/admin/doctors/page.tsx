'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminLoading, AdminNotice, adminInputClass } from '@/components/admin/admin-ui'
import { MediaUploadField } from '@/components/admin/media-upload-field'
import { adminRequest } from '@/lib/admin/client'
import type { ManagedDoctor } from '@/lib/cms/types'

type DoctorForm = Omit<ManagedDoctor, 'id' | 'sortOrder'>
const emptyForm: DoctorForm = { name: '', specialty: '', experience: '', image: '', active: true }

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<ManagedDoctor[]>([])
  const [editing, setEditing] = useState<ManagedDoctor | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [form, setForm] = useState<DoctorForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try { setDoctors((await adminRequest<{ doctors: ManagedDoctor[] }>('/api/admin/doctors')).doctors) }
    catch (value) { setError(value instanceof Error ? value.message : 'Unable to load doctors.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  function edit(doctor: ManagedDoctor) { setEditing(doctor); setEditorOpen(true); setForm({ name: doctor.name, specialty: doctor.specialty, experience: doctor.experience, image: doctor.image, active: doctor.active }); setMessage(''); setError('') }
  function create() { setEditing(null); setEditorOpen(true); setForm(emptyForm); setMessage(''); setError('') }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage(''); setError('')
    try {
      const result = editing
        ? await adminRequest<{ doctor: ManagedDoctor }>('/api/admin/doctors/' + editing.id, { method: 'PATCH', body: form })
        : await adminRequest<{ doctor: ManagedDoctor }>('/api/admin/doctors', { method: 'POST', body: form })
      setDoctors((items) => editing ? items.map((item) => item.id === result.doctor.id ? result.doctor : item) : [...items, result.doctor])
      setEditing(null); setEditorOpen(false); setForm(emptyForm); setMessage(editing ? 'Doctor updated.' : 'Doctor added.')
    } catch (value) { setError(value instanceof Error ? value.message : 'Unable to save doctor.') }
    finally { setSaving(false) }
  }
  async function remove(doctor: ManagedDoctor) {
    if (!window.confirm('Delete ' + doctor.name + '?')) return
    try { await adminRequest('/api/admin/doctors/' + doctor.id, { method: 'DELETE' }); setDoctors((items) => items.filter((item) => item.id !== doctor.id)); setMessage('Doctor deleted.') }
    catch (value) { setError(value instanceof Error ? value.message : 'Unable to delete doctor.') }
  }

  return <AdminShell title="Doctors" description="Manage the doctors shown on the public website.">
    <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-900">Clinic doctors</h2><p className="mt-1 text-sm text-slate-500">Add, edit, hide, or remove doctor profiles.</p></div><button type="button" onClick={create} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add doctor</button></div>
    {error && <AdminNotice tone="error">{error}</AdminNotice>}{message && <div className="mb-4"><AdminNotice tone="success">{message}</AdminNotice></div>}
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-4 sm:grid-cols-2">{loading ? <AdminLoading label="Loading doctors..." /> : doctors.map((doctor) => <article key={doctor.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><img src={doctor.image} alt={doctor.name} className="aspect-4/5 w-full object-cover" /><div className="p-4"><h3 className="font-semibold text-slate-900">{doctor.name}</h3><p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p><p className="mt-1 text-xs text-slate-400">{doctor.experience}</p><div className="mt-4 flex gap-2"><button type="button" onClick={() => edit(doctor)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"><Pencil className="h-3.5 w-3.5" />Edit</button><button type="button" onClick={() => void remove(doctor)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"><Trash2 className="h-3.5 w-3.5" />Delete</button></div></div></article>)}</div>
      {editorOpen && <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><h3 className="font-semibold">{editing ? 'Edit doctor' : 'Add doctor'}</h3><button type="button" onClick={() => { setEditing(null); setEditorOpen(false); setForm(emptyForm) }}><X className="h-5 w-5" /></button></div><label className="block text-sm font-medium">Name<input className={adminInputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label className="mt-4 block text-sm font-medium">Specialty<input className={adminInputClass} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required /></label><label className="mt-4 block text-sm font-medium">Experience<input className={adminInputClass} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="5+ years experience" required /></label><div className="mt-4"><MediaUploadField kind="image" label="Doctor photo" value={form.image} onChange={(image) => setForm({ ...form, image })} /></div><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Show on website</label><button disabled={saving} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save doctor'}</button></form>}
    </div>
  </AdminShell>
}