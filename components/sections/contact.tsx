'use client'

import { motion } from 'motion/react'
import {
  useState,
  type FormEvent,
} from 'react'
import {
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from '@/components/motion/reveal'
import type {
  ClinicSettings,
  ManagedService,
} from '@/lib/cms/types'

const EASE = [0.22, 1, 0.36, 1] as const

const inputBase =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/25 disabled:cursor-not-allowed disabled:opacity-60'

type ContactProps = {
  services: ManagedService[]
  settings: ClinicSettings
}

function mapEmbedUrl(settings: ClinicSettings) {
  const configuredUrl = settings.googleMapsUrl.trim()

  if (configuredUrl.includes('output=embed')) {
    return configuredUrl
  }

  const query = settings.address || configuredUrl

  return (
    'https://www.google.com/maps?q=' +
    encodeURIComponent(query) +
    '&output=embed'
  )
}

export function Contact({ services, settings }: ContactProps) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const info = [
    { icon: MapPin, label: 'Address', value: settings.address },
    { icon: Phone, label: 'Phone', value: settings.phone },
    { icon: Mail, label: 'Email', value: settings.email },
    { icon: Clock, label: 'Opening Hours', value: settings.workingHours },
  ].filter((item) => item.value)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          service: formData.get('service'),
          preferredDate: formData.get('preferredDate'),
          preferredTime: formData.get('preferredTime'),
          message: formData.get('message'),
        }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send your appointment request.')
      }

      const whatsappMessage = [
        'New appointment request',
        `Name: ${formData.get('name') || '-'}`,
        `Phone: ${formData.get('phone') || '-'}`,
        `Email: ${formData.get('email') || '-'}`,
        `Service: ${formData.get('service') || '-'}`,
        `Preferred date: ${formData.get('preferredDate') || '-'}`,
        `Preferred time: ${formData.get('preferredTime') || '-'}`,
        `Message: ${formData.get('message') || '-'}`,
      ].join('\n')

      form.reset()
      setSubmitted(true)
      window.location.href = `https://wa.me/93700848348?text=${encodeURIComponent(whatsappMessage)}`
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to send your appointment request.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Book an Appointment"
          title="Start Your Smile Journey"
          description="Tell us a little about what you need and our team will confirm your preferred time."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_30px_70px_-50px_rgba(30,41,59,0.4)] md:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-96 flex-col items-center justify-center text-center"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-soft/60 text-primary">
                    <Check className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 font-serif text-2xl font-semibold text-primary">
                    Thank you!
                  </h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Your appointment request has been received. The {settings.clinicName} team will contact you shortly to confirm the details.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-primary">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      className={inputBase}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-primary">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+93 ..."
                      className={inputBase}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-primary">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={inputBase}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="service" className="mb-2 block text-sm font-medium text-primary">
                      Preferred Service
                    </label>
                    <select
                      id="service"
                      name="service"
                      className={inputBase}
                      defaultValue=""
                      disabled={isSubmitting}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="preferredDate" className="mb-2 block text-sm font-medium text-primary">
                      Preferred Date
                    </label>
                    <input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      className={inputBase}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredTime" className="mb-2 block text-sm font-medium text-primary">
                      Preferred Time
                    </label>
                    <input
                      id="preferredTime"
                      name="preferredTime"
                      type="time"
                      className={inputBase}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-primary">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="How can we help?"
                      className={inputBase + ' resize-none'}
                      disabled={isSubmitting}
                    />
                  </div>
                  {error && (
                    <p
                      role="alert"
                      className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}
                  <div className="sm:col-span-2">
                    <motion.button
                      type="submit"
                      whileHover={isSubmitting ? undefined : { y: -2 }}
                      whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-primary py-4 text-sm font-medium text-primary-foreground shadow-[0_16px_40px_-16px_rgba(30,41,59,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Sending request...' : 'Book Appointment'}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            <StaggerGroup className="grid gap-4">
              {info.map((item) => (
                <StaggerItem
                  key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft/50 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm font-medium leading-relaxed text-primary">
                      {item.value}
                    </span>
                  </span>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal delay={0.1} className="grow">
              <div className="h-full min-h-64 overflow-hidden rounded-3xl border border-border/70">
                <iframe
                  title={settings.clinicName + ' location on the map'}
                  src={mapEmbedUrl(settings)}
                  className="h-full min-h-64 w-full grayscale-[0.2]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
