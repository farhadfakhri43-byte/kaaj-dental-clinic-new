import 'server-only'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  defaultClinicGallery,
  defaultClinicSettings,
  defaultDoctors,
  defaultPatientStories,
  defaultServices,
} from '@/lib/cms/defaults'
import type {
  Appointment,
  AppointmentStatus,
  ClinicGalleryItem,
  ClinicSettings,
  ManagedService,
  ManagedDoctor,
  PatientStory,
} from '@/lib/cms/types'

 type LocalState = {
  services: ManagedService[]
  doctors: ManagedDoctor[]
  gallery: ClinicGalleryItem[]
  patientStories: PatientStory[]
  settings: ClinicSettings
  appointments: Appointment[]
  adminPasswordHash?: string
}

const dataPath = path.join(process.cwd(), '.data', 'cms.json')
let statePromise: Promise<LocalState> | undefined
let writeQueue = Promise.resolve()

function initialState(): LocalState {
  return {
    services: defaultServices.map((item) => ({ ...item })),
    doctors: defaultDoctors.map((item) => ({ ...item })),
    gallery: defaultClinicGallery.map((item) => ({ ...item })),
    patientStories: defaultPatientStories.map((item) => ({ ...item })),
    settings: { ...defaultClinicSettings },
    appointments: [],
  }
}

async function loadState() {
  try {
    const saved = JSON.parse(await readFile(dataPath, 'utf8')) as Partial<LocalState>
    const defaults = initialState()
    return {
      ...defaults,
      ...saved,
      doctors: saved.doctors ?? defaults.doctors,
    }
  } catch {
    const value = initialState()
    await persist(value)
    return value
  }
}

async function getState() {
  statePromise ??= loadState()
  return statePromise
}

async function persist(value: LocalState) {
  await mkdir(path.dirname(dataPath), { recursive: true })
  await writeFile(dataPath, JSON.stringify(value, null, 2) + '\n', 'utf8')
}

async function updateState(mutator: (value: LocalState) => void) {
  const current = await getState()
  const next = structuredClone(current)
  mutator(next)
  statePromise = Promise.resolve(next)
  writeQueue = writeQueue.then(() => persist(next))
  await writeQueue
  return next
}

export async function localPublicContent() {
  const value = await getState()
  return {
    services: value.services.filter((item) => item.active),
    doctors: value.doctors.filter((item) => item.active),
    gallery: value.gallery.filter((item) => item.active),
    patientStories: value.patientStories.filter((item) => item.active),
    settings: { ...value.settings },
  }
}

export async function localListServices() {
  return (await getState()).services
}

export async function localListDoctors() {
  return (await getState()).doctors
}

export async function localCreateDoctor(input: Omit<ManagedDoctor, 'id' | 'sortOrder'>) {
  const value = await updateState((state) => {
    state.doctors.push({ ...input, id: randomUUID(), sortOrder: state.doctors.length })
  })
  return value.doctors[value.doctors.length - 1]
}

export async function localUpdateDoctor(id: string, input: Omit<ManagedDoctor, 'id' | 'sortOrder'>) {
  const value = await updateState((state) => {
    const item = state.doctors.find((entry) => entry.id === id)
    if (!item) throw new Error('Doctor not found.')
    Object.assign(item, input)
  })
  return value.doctors.find((item) => item.id === id)!
}

export async function localDeleteDoctor(id: string) {
  const current = await getState()
  const item = current.doctors.find((entry) => entry.id === id)
  if (!item) throw new Error('Doctor not found.')
  await updateState((state) => { state.doctors = state.doctors.filter((entry) => entry.id !== id) })
  return item
}

export async function localReorderDoctors(ids: string[]) {
  await reorder('doctors', ids)
}

export async function localCreateService(input: Omit<ManagedService, 'id' | 'sortOrder'>) {
  const value = await updateState((state) => {
    state.services.push({ ...input, id: randomUUID(), sortOrder: state.services.length })
  })
  return value.services[value.services.length - 1]
}

export async function localUpdateService(id: string, input: Omit<ManagedService, 'id' | 'sortOrder'>) {
  const value = await updateState((state) => {
    const item = state.services.find((entry) => entry.id === id)
    if (!item) throw new Error('Service not found.')
    Object.assign(item, input)
  })
  return value.services.find((item) => item.id === id)!
}

export async function localDeleteService(id: string) {
  const current = await getState()
  const item = current.services.find((entry) => entry.id === id)
  if (!item) throw new Error('Service not found.')
  await updateState((state) => { state.services = state.services.filter((entry) => entry.id !== id) })
  return item
}

export async function localReorderServices(ids: string[]) {
  await reorder('services', ids)
}

export async function localListGallery() {
  return (await getState()).gallery
}

export async function localCreateGallery(src: string, input: Omit<ClinicGalleryItem, 'id' | 'sortOrder' | 'src'>) {
  const current = await getState()
  if (current.gallery.length >= 8) throw new Error('The gallery supports up to eight clinic photos. Replace an existing photo instead.')
  const value = await updateState((state) => {
    state.gallery.push({ ...input, src, id: randomUUID(), sortOrder: state.gallery.length })
  })
  return value.gallery[value.gallery.length - 1]
}

export async function localUpdateGallery(id: string, src: string, input: Omit<ClinicGalleryItem, 'id' | 'sortOrder' | 'src'>) {
  const value = await updateState((state) => {
    const item = state.gallery.find((entry) => entry.id === id)
    if (!item) throw new Error('Gallery image not found.')
    Object.assign(item, input, { src })
  })
  return value.gallery.find((item) => item.id === id)!
}

export async function localDeleteGallery(id: string) {
  const current = await getState()
  const item = current.gallery.find((entry) => entry.id === id)
  if (!item) throw new Error('Gallery image not found.')
  await updateState((state) => { state.gallery = state.gallery.filter((entry) => entry.id !== id) })
  return item
}

export async function localReorderGallery(ids: string[]) {
  await reorder('gallery', ids)
}

export async function localListStories() {
  return (await getState()).patientStories
}

export async function localCreateStory(video: string, input: Omit<PatientStory, 'id' | 'sortOrder' | 'video'>) {
  const value = await updateState((state) => {
    state.patientStories.push({ ...input, video, id: randomUUID(), sortOrder: state.patientStories.length })
  })
  return value.patientStories[value.patientStories.length - 1]
}

export async function localUpdateStory(id: string, video: string, input: Omit<PatientStory, 'id' | 'sortOrder' | 'video'>) {
  const value = await updateState((state) => {
    const item = state.patientStories.find((entry) => entry.id === id)
    if (!item) throw new Error('Patient story not found.')
    Object.assign(item, input, { video })
  })
  return value.patientStories.find((item) => item.id === id)!
}

export async function localDeleteStory(id: string) {
  const current = await getState()
  const item = current.patientStories.find((entry) => entry.id === id)
  if (!item) throw new Error('Patient story not found.')
  await updateState((state) => { state.patientStories = state.patientStories.filter((entry) => entry.id !== id) })
  return item
}

export async function localReorderStories(ids: string[]) {
  await reorder('patientStories', ids)
}

export async function localGetSettings() {
  return (await getState()).settings
}

export async function localUpdateSettings(input: ClinicSettings) {
  const value = await updateState((state) => { state.settings = { ...input } })
  return value.settings
}

export async function localGetAdminPasswordHash() {
  return (await getState()).adminPasswordHash ?? ''
}

export async function localUpdateAdminPasswordHash(passwordHash: string) {
  await updateState((state) => {
    state.adminPasswordHash = passwordHash
  })
}

export async function localCreateAppointment(input: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString()
  const appointment: Appointment = { ...input, id: randomUUID(), status: 'pending', createdAt: now, updatedAt: now }
  const value = await updateState((state) => { state.appointments.unshift(appointment) })
  return value.appointments[0]
}

export async function localListAppointments() {
  return (await getState()).appointments
}

export async function localUpdateAppointmentStatus(id: string, status: AppointmentStatus) {
  const value = await updateState((state) => {
    const item = state.appointments.find((entry) => entry.id === id)
    if (!item) throw new Error('Appointment not found.')
    item.status = status
    item.updatedAt = new Date().toISOString()
  })
  return value.appointments.find((item) => item.id === id)!
}

type ReorderableItem = { id: string; sortOrder: number }

function reorderItems<T extends ReorderableItem>(items: T[], ids: string[]) {
  return ids.map((id, index) => ({ ...items.find((item) => item.id === id)!, sortOrder: index }))
}

async function reorder(key: 'services' | 'doctors' | 'gallery' | 'patientStories', ids: string[]) {
  const current = await getState()
  const items = current[key]
  if (items.length !== ids.length || items.some((item) => !ids.includes(item.id))) {
    throw new Error('The order must include every item exactly once.')
  }
  await updateState((state) => {
    switch (key) {
      case 'services':
        state.services = reorderItems(state.services, ids)
        break
      case 'doctors':
        state.doctors = reorderItems(state.doctors, ids)
        break
      case 'gallery':
        state.gallery = reorderItems(state.gallery, ids)
        break
      case 'patientStories':
        state.patientStories = reorderItems(state.patientStories, ids)
        break
    }
  })
}
