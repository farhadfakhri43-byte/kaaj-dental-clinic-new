export const serviceIconNames = [
  'Sparkles',
  'Braces',
  'Layers',
  'Sun',
  'HeartPulse',
  'Crown',
  'Shield',
  'Leaf',
  'Baby',
  'Stethoscope',
] as const

export type ServiceIconName = (typeof serviceIconNames)[number]

export type ManagedService = {
  id: string
  name: string
  description: string
  icon: ServiceIconName
  image: string
  imageAlt: string
  imagePosition: string
  active: boolean
  sortOrder: number
}

export type ClinicGalleryItem = {
  id: string
  src: string
  alt: string
  label: string
  objectPosition: string
  active: boolean
  sortOrder: number
}

export type PatientStory = {
  id: string
  name: string
  treatment: string
  video: string
  quote: string
  duration: string
  rating: number
  active: boolean
  sortOrder: number
}

export type ManagedDoctor = {
  id: string
  name: string
  specialty: string
  experience: string
  image: string
  active: boolean
  sortOrder: number
}

export type ClinicSettings = {
  clinicName: string
  phone: string
  whatsapp: string
  address: string
  workingHours: string
  email: string
  instagram: string
  facebook: string
  telegram: string
  googleMapsUrl: string
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export type Appointment = {
  id: string
  name: string
  phone: string
  email: string
  service: string
  preferredDate: string
  preferredTime: string
  message: string
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}

export type PublicClinicContent = {
  services: ManagedService[]
  gallery: ClinicGalleryItem[]
  patientStories: PatientStory[]
  doctors: ManagedDoctor[]
  settings: ClinicSettings
}
