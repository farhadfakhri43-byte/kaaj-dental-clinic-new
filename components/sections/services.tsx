'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import {
  ArrowUpRight,
  Baby,
  Braces,
  Crown,
  HeartPulse,
  Layers,
  Leaf,
  Shield,
  Sparkles,
  Stethoscope,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import type {
  ManagedService,
  ServiceIconName,
} from '@/lib/cms/types'

const EASE = [0.22, 1, 0.36, 1] as const

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  Sparkles,
  Braces,
  Layers,
  Sun,
  HeartPulse,
  Crown,
  Shield,
  Leaf,
  Baby,
  Stethoscope,
}

type ServicesProps = {
  services: ManagedService[]
}

export function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Our Services"
          title="Comprehensive care for every smile"
          description="From routine check-ups to full smile transformations, every treatment is delivered with precision, comfort, and an eye for detail."
        />

        <motion.ul
          className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {services.map((service) => {
            const Icon = serviceIcons[service.icon]

            return (
            <motion.li
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              <motion.a
                href="#contact"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-35px_rgba(30,41,59,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
              >
                <span className="relative block aspect-[16/10] overflow-hidden bg-primary/10">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) calc(50vw - 2.5rem), 22rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ objectPosition: service.imagePosition }}
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/5 to-transparent" />
                  <span className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-2xl border border-white/30 bg-background/90 text-primary shadow-lg backdrop-blur-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                </span>

                <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-serif text-xl font-semibold text-primary">
                    {service.name}
                  </h3>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </span>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors duration-300 group-hover:text-gold">
                    Learn More
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.a>
            </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
