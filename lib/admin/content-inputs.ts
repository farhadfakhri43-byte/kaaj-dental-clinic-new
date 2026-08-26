import {
  assetUrlValue,
  booleanValue,
  objectPositionValue,
  optionalDateValue,
  optionalTimeValue,
  optionalUrlValue,
  ratingValue,
  serviceIconValue,
  stringValue,
} from '@/lib/admin/validation'
import type {
  AppointmentInput,
  GalleryInput,
  ServiceInput,
  StoryInput,
} from '@/lib/cms/repository'
import type { ClinicSettings } from '@/lib/cms/types'

export function serviceInput(body: Record<string, unknown>): ServiceInput {
  return {
    name: stringValue(body.name, 'Service name', { min: 2, max: 120 }),
    description: stringValue(body.description, 'Description', {
      min: 8,
      max: 800,
    }),
    icon: serviceIconValue(body.icon),
    image: assetUrlValue(body.image, 'Service image'),
    imageAlt: stringValue(body.imageAlt, 'Image description', {
      min: 4,
      max: 240,
    }),
    imagePosition: objectPositionValue(body.imagePosition),
    active: booleanValue(body.active, 'Active'),
  }
}

export function galleryInput(body: Record<string, unknown>): GalleryInput {
  return {
    alt: stringValue(body.alt, 'Image description', {
      min: 4,
      max: 240,
    }),
    label: stringValue(body.label, 'Image label', { min: 2, max: 120 }),
    objectPosition: objectPositionValue(body.objectPosition),
    active: booleanValue(body.active, 'Active'),
  }
}

export function storyInput(body: Record<string, unknown>): StoryInput {
  return {
    name: stringValue(body.name, 'Patient name', { min: 2, max: 120 }),
    treatment: stringValue(body.treatment, 'Treatment', { min: 2, max: 160 }),
    quote: stringValue(body.quote, 'Story', { min: 8, max: 800 }),
    duration: stringValue(body.duration, 'Video duration', {
      max: 16,
      optional: true,
    }),
    rating: ratingValue(body.rating),
    active: booleanValue(body.active, 'Active'),
  }
}

export function settingsInput(
  body: Record<string, unknown>,
): ClinicSettings {
  return {
    clinicName: stringValue(body.clinicName, 'Clinic name', {
      min: 2,
      max: 160,
    }),
    phone: stringValue(body.phone, 'Phone', { max: 80, optional: true }),
    whatsapp: stringValue(body.whatsapp, 'WhatsApp', {
      max: 80,
      optional: true,
    }),
    address: stringValue(body.address, 'Address', {
      max: 400,
      optional: true,
    }),
    workingHours: stringValue(body.workingHours, 'Working hours', {
      max: 240,
      optional: true,
    }),
    email: emailValue(body.email),
    instagram: optionalUrlValue(body.instagram, 'Instagram URL'),
    facebook: optionalUrlValue(body.facebook, 'Facebook URL'),
    telegram: optionalUrlValue(body.telegram, 'Telegram URL'),
    googleMapsUrl: optionalUrlValue(body.googleMapsUrl, 'Google Maps URL'),
  }
}

export function appointmentInput(
  body: Record<string, unknown>,
): AppointmentInput {
  return {
    name: stringValue(body.name, 'Full name', { min: 2, max: 120 }),
    phone: stringValue(body.phone, 'Phone number', { min: 5, max: 80 }),
    email: emailValue(body.email),
    service: stringValue(body.service, 'Preferred service', {
      max: 160,
      optional: true,
    }),
    preferredDate: optionalDateValue(body.preferredDate),
    preferredTime: optionalTimeValue(body.preferredTime),
    message: stringValue(body.message, 'Message', {
      max: 1500,
      optional: true,
    }),
  }
}

function emailValue(value: unknown) {
  const email = stringValue(value, 'Email', { max: 200, optional: true })

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email must be valid.')
  }

  return email
}
