import {
  serviceIconNames,
  type AppointmentStatus,
  type ServiceIconName,
} from '@/lib/cms/types'

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestValidationError'
  }
}

type StringOptions = {
  min?: number
  max: number
  optional?: boolean
}

export function stringValue(
  value: unknown,
  label: string,
  options: StringOptions,
) {
  const text = typeof value === 'string' ? value.trim() : ''

  if (!text && options.optional) {
    return ''
  }

  if (!text) {
    throw new RequestValidationError(label + ' is required.')
  }

  if (options.min && text.length < options.min) {
    throw new RequestValidationError(
      label + ' must be at least ' + options.min + ' characters.',
    )
  }

  if (text.length > options.max) {
    throw new RequestValidationError(
      label + ' must be ' + options.max + ' characters or fewer.',
    )
  }

  return text
}

export function passwordValue(value: unknown, label: string) {
  return stringValue(value, label, { min: 12, max: 512 })
}

export function booleanValue(value: unknown, label: string) {
  if (typeof value !== 'boolean') {
    throw new RequestValidationError(label + ' must be true or false.')
  }

  return value
}

export function identifierValue(value: unknown) {
  const identifier = stringValue(value, 'ID', { min: 1, max: 100 })

  if (!/^[a-zA-Z0-9_-]+$/.test(identifier)) {
    throw new RequestValidationError('ID is invalid.')
  }

  return identifier
}

export function assetUrlValue(value: unknown, label: string) {
  const url = stringValue(value, label, { min: 1, max: 2000 })

  if (url.startsWith('/')) {
    return url
  }

  try {
    const parsed = new URL(url)

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error()
    }

    return url
  } catch {
    throw new RequestValidationError(label + ' must be a valid URL.')
  }
}

export function optionalUrlValue(value: unknown, label: string) {
  const url = stringValue(value, label, { max: 2000, optional: true })

  if (!url) {
    return ''
  }

  return assetUrlValue(url, label)
}

export function objectPositionValue(value: unknown) {
  const position = stringValue(value, 'Image position', {
    max: 48,
    optional: true,
  })

  if (!position) {
    return '50% 50%'
  }

  if (!/^[0-9.%\s\-a-zA-Z]+$/.test(position)) {
    throw new RequestValidationError('Image position is invalid.')
  }

  return position
}

export function serviceIconValue(value: unknown): ServiceIconName {
  if (
    typeof value !== 'string' ||
    !serviceIconNames.includes(value as ServiceIconName)
  ) {
    throw new RequestValidationError('Service icon is invalid.')
  }

  return value as ServiceIconName
}

export function ratingValue(value: unknown) {
  if (!Number.isInteger(value) || typeof value !== 'number') {
    throw new RequestValidationError('Rating must be a whole number.')
  }

  if (value < 1 || value > 5) {
    throw new RequestValidationError('Rating must be between 1 and 5.')
  }

  return value
}

export function appointmentStatusValue(value: unknown): AppointmentStatus {
  const allowed: AppointmentStatus[] = [
    'pending',
    'confirmed',
    'completed',
    'cancelled',
  ]

  if (typeof value !== 'string' || !allowed.includes(value as AppointmentStatus)) {
    throw new RequestValidationError('Appointment status is invalid.')
  }

  return value as AppointmentStatus
}

export function optionalDateValue(value: unknown) {
  const date = stringValue(value, 'Preferred date', {
    max: 10,
    optional: true,
  })

  if (!date) {
    return ''
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new RequestValidationError('Preferred date is invalid.')
  }

  return date
}

export function optionalTimeValue(value: unknown) {
  const time = stringValue(value, 'Preferred time', {
    max: 5,
    optional: true,
  })

  if (!time) {
    return ''
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new RequestValidationError('Preferred time is invalid.')
  }

  return time
}

export function reorderIdsValue(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) {
    throw new RequestValidationError('A valid list of items is required.')
  }

  const ids = value.map(identifierValue)

  if (new Set(ids).size !== ids.length) {
    throw new RequestValidationError('The order list contains duplicate IDs.')
  }

  return ids
}
