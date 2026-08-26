import 'server-only'

import { unstable_noStore } from 'next/cache'
import { revalidatePath } from 'next/cache'

import { randomUUID } from 'node:crypto'
import {
  defaultClinicGallery,
  defaultClinicSettings,
  defaultDoctors,
  defaultPatientStories,
  defaultServices,
} from '@/lib/cms/defaults'
import {
  getSql,
  isDatabaseConfigured,
} from '@/lib/cms/db'
import type {
  Appointment,
  AppointmentStatus,
  ClinicGalleryItem,
  ClinicSettings,
  ManagedService,
  PatientStory,
  PublicClinicContent,
  ServiceIconName,
  ManagedDoctor,
} from '@/lib/cms/types'
import {
  localCreateAppointment,
  localCreateGallery,
  localCreateService,
  localCreateDoctor,
  localCreateStory,
  localDeleteGallery,
  localDeleteService,
  localDeleteDoctor,
  localDeleteStory,
  localGetSettings,
  localGetAdminPasswordHash,
  localListAppointments,
  localListGallery,
  localListServices,
  localListDoctors,
  localListStories,
  localPublicContent,
  localReorderGallery,
  localReorderServices,
  localReorderDoctors,
  localReorderStories,
  localUpdateAppointmentStatus,
  localUpdateGallery,
  localUpdateService,
  localUpdateDoctor,
  localUpdateSettings,
  localUpdateAdminPasswordHash,
  localUpdateStory,
} from '@/lib/cms/local-store'

type ServiceRow = {
  id: string
  name: string
  description: string
  icon: string
  image_url: string
  image_alt: string
  image_position: string
  active: boolean
  sort_order: number
}

type DoctorRow = {
  id: string
  name: string
  specialty: string
  experience: string
  image_url: string
  active: boolean
  sort_order: number
}

type GalleryRow = {
  id: string
  image_url: string
  alt: string
  label: string
  image_position: string
  active: boolean
  sort_order: number
}

type StoryRow = {
  id: string
  name: string
  treatment: string
  quote: string
  video_url: string
  duration: string
  rating: number
  active: boolean
  sort_order: number
}

type SettingsRow = {
  clinic_name: string
  phone: string
  whatsapp: string
  address: string
  working_hours: string
  email: string
  instagram: string
  facebook: string
  telegram: string
  google_maps_url: string
}

type AppointmentRow = {
  id: string
  name: string
  phone: string
  email: string
  service: string
  preferred_date: string | Date | null
  preferred_time: string | null
  message: string
  status: AppointmentStatus
  created_at: string | Date
  updated_at: string | Date
}

function invalidatePublicSite() {
  revalidatePath('/')
}

export type ServiceInput = Omit<ManagedService, 'id' | 'sortOrder'>
export type GalleryInput = Omit<ClinicGalleryItem, 'id' | 'sortOrder' | 'src'>
export type StoryInput = Omit<PatientStory, 'id' | 'sortOrder' | 'video'>
export type AppointmentInput = Pick<
  Appointment,
  | 'name'
  | 'phone'
  | 'email'
  | 'service'
  | 'preferredDate'
  | 'preferredTime'
  | 'message'
>

function rows<T>(value: unknown) {
  return value as T[]
}

function dateString(value: string | Date | null | undefined) {
  if (!value) {
    return ''
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return value
}

function toService(row: ServiceRow): ManagedService {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon as ServiceIconName,
    image: row.image_url,
    imageAlt: row.image_alt,
    imagePosition: row.image_position,
    active: row.active,
    sortOrder: Number(row.sort_order),
  }
}

function toDoctor(row: DoctorRow): ManagedDoctor {
  return { id: row.id, name: row.name, specialty: row.specialty, experience: row.experience, image: row.image_url, active: row.active, sortOrder: Number(row.sort_order) }
}

function toGalleryItem(row: GalleryRow): ClinicGalleryItem {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.alt,
    label: row.label,
    objectPosition: row.image_position,
    active: row.active,
    sortOrder: Number(row.sort_order),
  }
}

function toPatientStory(row: StoryRow): PatientStory {
  return {
    id: row.id,
    name: row.name,
    treatment: row.treatment,
    quote: row.quote,
    video: row.video_url,
    duration: row.duration,
    rating: Number(row.rating),
    active: row.active,
    sortOrder: Number(row.sort_order),
  }
}

function toSettings(row: SettingsRow): ClinicSettings {
  return {
    clinicName: row.clinic_name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    address: row.address,
    workingHours: row.working_hours,
    email: row.email,
    instagram: row.instagram,
    facebook: row.facebook,
    telegram: row.telegram,
    googleMapsUrl: row.google_maps_url,
  }
}

function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    service: row.service,
    preferredDate: dateString(row.preferred_date),
    preferredTime: row.preferred_time ?? '',
    message: row.message,
    status: row.status,
    createdAt: dateString(row.created_at),
    updatedAt: dateString(row.updated_at),
  }
}

function defaultPublicContent(): PublicClinicContent {
  return {
    services: defaultServices.map((service) => ({ ...service })),
    gallery: defaultClinicGallery.map((image) => ({ ...image })),
    patientStories: defaultPatientStories.map((story) => ({ ...story })),
    doctors: defaultDoctors.map((doctor) => ({ ...doctor })),
    settings: { ...defaultClinicSettings },
  }
}

let seedPromise: Promise<void> | undefined

async function seedDefaultContent() {
  const sql = getSql()

  for (const service of defaultServices) {
    await sql.query(
      'INSERT INTO services (id, name, description, icon, image_url, image_alt, image_position, active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING',
      [
        service.id,
        service.name,
        service.description,
        service.icon,
        service.image,
        service.imageAlt,
        service.imagePosition,
        service.active,
        service.sortOrder,
      ],
    )
  }

  for (const image of defaultClinicGallery) {
    await sql.query(
      'INSERT INTO clinic_gallery (id, image_url, alt, label, image_position, active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
      [
        image.id,
        image.src,
        image.alt,
        image.label,
        image.objectPosition,
        image.active,
        image.sortOrder,
      ],
    )
  }

  for (const story of defaultPatientStories) {
    await sql.query(
      'INSERT INTO patient_stories (id, name, treatment, quote, video_url, duration, rating, active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING',
      [
        story.id,
        story.name,
        story.treatment,
        story.quote,
        story.video,
        story.duration,
        story.rating,
        story.active,
        story.sortOrder,
      ],
    )
  }

  await sql.query(
    'INSERT INTO clinic_settings (id, clinic_name, phone, whatsapp, address, working_hours, email, instagram, facebook, telegram, google_maps_url) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING',
    [
      defaultClinicSettings.clinicName,
      defaultClinicSettings.phone,
      defaultClinicSettings.whatsapp,
      defaultClinicSettings.address,
      defaultClinicSettings.workingHours,
      defaultClinicSettings.email,
      defaultClinicSettings.instagram,
      defaultClinicSettings.facebook,
      defaultClinicSettings.telegram,
      defaultClinicSettings.googleMapsUrl,
    ],
  )
}

export async function ensureDefaultContent() {
  if (!seedPromise) {
    seedPromise = seedDefaultContent().catch((error) => {
      seedPromise = undefined
      throw error
    })
  }

  return seedPromise
}

async function readySql() {
  await ensureDefaultContent()
  return getSql()
}

export async function getPublicContent(): Promise<PublicClinicContent> {
  unstable_noStore()

  if (!isDatabaseConfigured()) {
    return localPublicContent()
  }

  try {
    const sql = await readySql()
    const [serviceRows, galleryRows, storyRows, settingsRows] =
      await Promise.all([
        sql.query(
          'SELECT id, name, description, icon, image_url, image_alt, image_position, active, sort_order FROM services WHERE active = true ORDER BY sort_order ASC, created_at ASC',
        ),
        sql.query(
          'SELECT id, image_url, alt, label, image_position, active, sort_order FROM clinic_gallery WHERE active = true ORDER BY sort_order ASC, created_at ASC',
        ),
        sql.query(
          'SELECT id, name, treatment, quote, video_url, duration, rating, active, sort_order FROM patient_stories WHERE active = true ORDER BY sort_order ASC, created_at ASC',
        ),
        sql.query(
          'SELECT clinic_name, phone, whatsapp, address, working_hours, email, instagram, facebook, telegram, google_maps_url FROM clinic_settings WHERE id = 1',
        ),
      ])

    const settings = rows<SettingsRow>(settingsRows)[0]

    return {
      services: rows<ServiceRow>(serviceRows).map(toService),
      gallery: rows<GalleryRow>(galleryRows).map(toGalleryItem),
      patientStories: rows<StoryRow>(storyRows).map(toPatientStory),
      settings: settings ? toSettings(settings) : { ...defaultClinicSettings },
      doctors: defaultDoctors.map((doctor) => ({ ...doctor })),
    }
  } catch {
    return defaultPublicContent()
  }
}

export async function listServices() {
  if (!isDatabaseConfigured()) return localListServices()
  const sql = await readySql()
  const result = await sql.query(
    'SELECT id, name, description, icon, image_url, image_alt, image_position, active, sort_order FROM services ORDER BY sort_order ASC, created_at ASC',
  )

  return rows<ServiceRow>(result).map(toService)
}

export type DoctorInput = Omit<ManagedDoctor, 'id' | 'sortOrder'>

export async function listDoctors() {
  if (!isDatabaseConfigured()) return localListDoctors()
  return defaultDoctors
}

export async function createDoctor(input: DoctorInput) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localCreateDoctor(input)
  throw new Error('Doctor management requires the doctors table in the database.')
}

export async function updateDoctor(id: string, input: DoctorInput) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localUpdateDoctor(id, input)
  throw new Error('Doctor management requires the doctors table in the database.')
}

export async function deleteDoctor(id: string) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localDeleteDoctor(id)
  throw new Error('Doctor management requires the doctors table in the database.')
}

export async function reorderDoctors(ids: string[]) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localReorderDoctors(ids)
  throw new Error('Doctor management requires the doctors table in the database.')
}

export async function createService(input: ServiceInput) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localCreateService(input)
  const sql = await readySql()
  const orderRows = rows<{ next_order: number | string }>(
    await sql.query(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM services',
    ),
  )
  const id = randomUUID()
  const sortOrder = Number(orderRows[0]?.next_order ?? 0)
  const result = await sql.query(
    'INSERT INTO services (id, name, description, icon, image_url, image_alt, image_position, active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, description, icon, image_url, image_alt, image_position, active, sort_order',
    [
      id,
      input.name,
      input.description,
      input.icon,
      input.image,
      input.imageAlt,
      input.imagePosition,
      input.active,
      sortOrder,
    ],
  )

  return toService(rows<ServiceRow>(result)[0])
}

export async function updateService(id: string, input: ServiceInput) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localUpdateService(id, input)
  const sql = await readySql()
  const result = await sql.query(
    'UPDATE services SET name = $2, description = $3, icon = $4, image_url = $5, image_alt = $6, image_position = $7, active = $8, updated_at = now() WHERE id = $1 RETURNING id, name, description, icon, image_url, image_alt, image_position, active, sort_order',
    [
      id,
      input.name,
      input.description,
      input.icon,
      input.image,
      input.imageAlt,
      input.imagePosition,
      input.active,
    ],
  )
  const service = rows<ServiceRow>(result)[0]

  if (!service) {
    throw new Error('Service not found.')
  }

  return toService(service)
}

export async function deleteService(id: string) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localDeleteService(id)
  const sql = await readySql()
  const result = await sql.query(
    'DELETE FROM services WHERE id = $1 RETURNING id, name, description, icon, image_url, image_alt, image_position, active, sort_order',
    [id],
  )
  const service = rows<ServiceRow>(result)[0]

  if (!service) {
    throw new Error('Service not found.')
  }

  return toService(service)
}

export async function reorderServices(ids: string[]) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localReorderServices(ids)
  const sql = await readySql()
  const current = rows<{ id: string }>(
    await sql.query('SELECT id FROM services'),
  )

  if (
    current.length !== ids.length ||
    current.some((item) => !ids.includes(item.id))
  ) {
    throw new Error('The order must include every service exactly once.')
  }

  await sql.transaction(
    ids.map((id, index) =>
      sql.query(
        'UPDATE services SET sort_order = $1, updated_at = now() WHERE id = $2',
        [index, id],
      ),
    ),
  )
}

export async function listGallery() {
  if (!isDatabaseConfigured()) return localListGallery()
  const sql = await readySql()
  const result = await sql.query(
    'SELECT id, image_url, alt, label, image_position, active, sort_order FROM clinic_gallery ORDER BY sort_order ASC, created_at ASC',
  )

  return rows<GalleryRow>(result).map(toGalleryItem)
}

export async function createGalleryItem(
  src: string,
  input: GalleryInput,
) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localCreateGallery(src, input)
  const sql = await readySql()
  const itemCount = rows<{ item_count: number | string }>(
    await sql.query('SELECT COUNT(*) AS item_count FROM clinic_gallery'),
  )

  if (Number(itemCount[0]?.item_count ?? 0) >= 8) {
    throw new Error(
      'The gallery supports up to eight clinic photos. Replace an existing photo instead.',
    )
  }

  const orderRows = rows<{ next_order: number | string }>(
    await sql.query(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM clinic_gallery',
    ),
  )
  const id = randomUUID()
  const sortOrder = Number(orderRows[0]?.next_order ?? 0)
  const result = await sql.query(
    'INSERT INTO clinic_gallery (id, image_url, alt, label, image_position, active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, image_url, alt, label, image_position, active, sort_order',
    [
      id,
      src,
      input.alt,
      input.label,
      input.objectPosition,
      input.active,
      sortOrder,
    ],
  )

  return toGalleryItem(rows<GalleryRow>(result)[0])
}

export async function updateGalleryItem(
  id: string,
  src: string,
  input: GalleryInput,
) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localUpdateGallery(id, src, input)
  const sql = await readySql()
  const result = await sql.query(
    'UPDATE clinic_gallery SET image_url = $2, alt = $3, label = $4, image_position = $5, active = $6, updated_at = now() WHERE id = $1 RETURNING id, image_url, alt, label, image_position, active, sort_order',
    [
      id,
      src,
      input.alt,
      input.label,
      input.objectPosition,
      input.active,
    ],
  )
  const item = rows<GalleryRow>(result)[0]

  if (!item) {
    throw new Error('Gallery image not found.')
  }

  return toGalleryItem(item)
}

export async function deleteGalleryItem(id: string) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localDeleteGallery(id)
  const sql = await readySql()
  const result = await sql.query(
    'DELETE FROM clinic_gallery WHERE id = $1 RETURNING id, image_url, alt, label, image_position, active, sort_order',
    [id],
  )
  const item = rows<GalleryRow>(result)[0]

  if (!item) {
    throw new Error('Gallery image not found.')
  }

  return toGalleryItem(item)
}

export async function reorderGallery(ids: string[]) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localReorderGallery(ids)
  const sql = await readySql()
  const current = rows<{ id: string }>(
    await sql.query('SELECT id FROM clinic_gallery'),
  )

  if (
    current.length !== ids.length ||
    current.some((item) => !ids.includes(item.id))
  ) {
    throw new Error('The order must include every gallery image exactly once.')
  }

  await sql.transaction(
    ids.map((id, index) =>
      sql.query(
        'UPDATE clinic_gallery SET sort_order = $1, updated_at = now() WHERE id = $2',
        [index, id],
      ),
    ),
  )
}

export async function listPatientStories() {
  if (!isDatabaseConfigured()) return localListStories()
  const sql = await readySql()
  const result = await sql.query(
    'SELECT id, name, treatment, quote, video_url, duration, rating, active, sort_order FROM patient_stories ORDER BY sort_order ASC, created_at ASC',
  )

  return rows<StoryRow>(result).map(toPatientStory)
}

export async function createPatientStory(
  video: string,
  input: StoryInput,
) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localCreateStory(video, input)
  const sql = await readySql()
  const orderRows = rows<{ next_order: number | string }>(
    await sql.query(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM patient_stories',
    ),
  )
  const id = randomUUID()
  const sortOrder = Number(orderRows[0]?.next_order ?? 0)
  const result = await sql.query(
    'INSERT INTO patient_stories (id, name, treatment, quote, video_url, duration, rating, active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, treatment, quote, video_url, duration, rating, active, sort_order',
    [
      id,
      input.name,
      input.treatment,
      input.quote,
      video,
      input.duration,
      input.rating,
      input.active,
      sortOrder,
    ],
  )

  return toPatientStory(rows<StoryRow>(result)[0])
}

export async function updatePatientStory(
  id: string,
  video: string,
  input: StoryInput,
) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localUpdateStory(id, video, input)
  const sql = await readySql()
  const result = await sql.query(
    'UPDATE patient_stories SET name = $2, treatment = $3, quote = $4, video_url = $5, duration = $6, rating = $7, active = $8, updated_at = now() WHERE id = $1 RETURNING id, name, treatment, quote, video_url, duration, rating, active, sort_order',
    [
      id,
      input.name,
      input.treatment,
      input.quote,
      video,
      input.duration,
      input.rating,
      input.active,
    ],
  )
  const story = rows<StoryRow>(result)[0]

  if (!story) {
    throw new Error('Patient story not found.')
  }

  return toPatientStory(story)
}

export async function deletePatientStory(id: string) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localDeleteStory(id)
  const sql = await readySql()
  const result = await sql.query(
    'DELETE FROM patient_stories WHERE id = $1 RETURNING id, name, treatment, quote, video_url, duration, rating, active, sort_order',
    [id],
  )
  const story = rows<StoryRow>(result)[0]

  if (!story) {
    throw new Error('Patient story not found.')
  }

  return toPatientStory(story)
}

export async function reorderPatientStories(ids: string[]) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localReorderStories(ids)
  const sql = await readySql()
  const current = rows<{ id: string }>(
    await sql.query('SELECT id FROM patient_stories'),
  )

  if (
    current.length !== ids.length ||
    current.some((item) => !ids.includes(item.id))
  ) {
    throw new Error('The order must include every patient story exactly once.')
  }

  await sql.transaction(
    ids.map((id, index) =>
      sql.query(
        'UPDATE patient_stories SET sort_order = $1, updated_at = now() WHERE id = $2',
        [index, id],
      ),
    ),
  )
}

export async function getClinicSettings() {
  if (!isDatabaseConfigured()) return localGetSettings()
  const sql = await readySql()
  const result = await sql.query(
    'SELECT clinic_name, phone, whatsapp, address, working_hours, email, instagram, facebook, telegram, google_maps_url FROM clinic_settings WHERE id = 1',
  )
  const settings = rows<SettingsRow>(result)[0]

  return settings ? toSettings(settings) : { ...defaultClinicSettings }
}

export async function updateClinicSettings(input: ClinicSettings) {
  invalidatePublicSite()
  if (!isDatabaseConfigured()) return localUpdateSettings(input)
  const sql = await readySql()
  const result = await sql.query(
    'INSERT INTO clinic_settings (id, clinic_name, phone, whatsapp, address, working_hours, email, instagram, facebook, telegram, google_maps_url) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO UPDATE SET clinic_name = EXCLUDED.clinic_name, phone = EXCLUDED.phone, whatsapp = EXCLUDED.whatsapp, address = EXCLUDED.address, working_hours = EXCLUDED.working_hours, email = EXCLUDED.email, instagram = EXCLUDED.instagram, facebook = EXCLUDED.facebook, telegram = EXCLUDED.telegram, google_maps_url = EXCLUDED.google_maps_url, updated_at = now() RETURNING clinic_name, phone, whatsapp, address, working_hours, email, instagram, facebook, telegram, google_maps_url',
    [
      input.clinicName,
      input.phone,
      input.whatsapp,
      input.address,
      input.workingHours,
      input.email,
      input.instagram,
      input.facebook,
      input.telegram,
      input.googleMapsUrl,
    ],
  )

  return toSettings(rows<SettingsRow>(result)[0])
}

export async function getAdminPasswordHash() {
  if (!isDatabaseConfigured()) return localGetAdminPasswordHash()

  const sql = getSql()
  const result = (await sql.query(
    'SELECT password_hash FROM admin_credentials WHERE id = 1',
  )) as Array<{ password_hash: string }>
  return result[0]?.password_hash ?? ''
}

export async function updateAdminPasswordHash(passwordHash: string) {
  if (!isDatabaseConfigured()) {
    await localUpdateAdminPasswordHash(passwordHash)
    return
  }

  const sql = getSql()
  await sql.query(
    'INSERT INTO admin_credentials (id, password_hash, updated_at) VALUES (1, $1, now()) ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()',
    [passwordHash],
  )
}

export async function createAppointment(input: AppointmentInput) {
  if (!isDatabaseConfigured()) return localCreateAppointment(input)
  const sql = await readySql()
  const id = randomUUID()
  const result = await sql.query(
    'INSERT INTO appointments (id, name, phone, email, service, preferred_date, preferred_time, message) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, phone, email, service, preferred_date, preferred_time, message, status, created_at, updated_at',
    [
      id,
      input.name,
      input.phone,
      input.email,
      input.service,
      input.preferredDate || null,
      input.preferredTime || null,
      input.message,
    ],
  )

  return toAppointment(rows<AppointmentRow>(result)[0])
}

export async function listAppointments() {
  if (!isDatabaseConfigured()) return localListAppointments()
  const sql = await readySql()
  const result = await sql.query(
    'SELECT id, name, phone, email, service, preferred_date, preferred_time, message, status, created_at, updated_at FROM appointments ORDER BY created_at DESC',
  )

  return rows<AppointmentRow>(result).map(toAppointment)
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
) {
  if (!isDatabaseConfigured()) return localUpdateAppointmentStatus(id, status)
  const sql = await readySql()
  const result = await sql.query(
    'UPDATE appointments SET status = $2, updated_at = now() WHERE id = $1 RETURNING id, name, phone, email, service, preferred_date, preferred_time, message, status, created_at, updated_at',
    [id, status],
  )
  const appointment = rows<AppointmentRow>(result)[0]

  if (!appointment) {
    throw new Error('Appointment not found.')
  }

  return toAppointment(appointment)
}
