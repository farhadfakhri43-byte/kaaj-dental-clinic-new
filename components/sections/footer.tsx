'use client'

import { motion } from 'motion/react'
import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { navLinks } from '@/lib/data'
import type {
  ClinicSettings,
  ManagedService,
} from '@/lib/cms/types'

type FooterProps = {
  services: ManagedService[]
  settings: ClinicSettings
}

function socialLinks(settings: ClinicSettings) {
  return [
    {
      label: 'Instagram',
      href: settings.instagram,
      path: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07s-3.6 0-4.86-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.2 8.8 2.2 12 2.2Zm0 3.3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 10.72a4.22 4.22 0 1 1 0-8.44 4.22 4.22 0 0 1 0 8.44Zm6.76-10.97a1.52 1.52 0 1 1-3.04 0 1.52 1.52 0 0 1 3.04 0Z',
    },
    {
      label: 'Facebook',
      href: settings.facebook,
      path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z',
    },
    {
      label: 'Telegram',
      href: settings.telegram,
      path: 'M21.5 3.1 2.9 10.2c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.1.8.7.8.4 0 .6-.2.8-.4l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.2-.5-1.8-1.3-1.5Zm-11 10.1-.1 3.2-1.8-5.3 10.9-6.9-8.9 9Z',
    },
  ].filter((social) => social.href)
}

export function Footer({ services, settings }: FooterProps) {
  const socials = socialLinks(settings)

  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo invert />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/60">
              Premium dental and cosmetic dentistry in Kabul — advanced technology and personalized care for every smile.
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -3 }}
                    className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Explore</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/65 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Services</h3>
            <ul className="mt-5 space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm text-primary-foreground/65 transition-colors hover:text-primary-foreground"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-primary-foreground/65">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {settings.address}
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={'tel:' + settings.phone.replace(/\s/g, '')}
                    className="transition-colors hover:text-primary-foreground"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={'mailto:' + settings.email}
                    className="transition-colors hover:text-primary-foreground"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} {settings.clinicName}. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50">
            Crafted with care in Kabul, Afghanistan.
          </p>
        </div>
      </div>
    </footer>
  )
}
