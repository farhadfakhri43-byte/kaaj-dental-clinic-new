'use client'

import Image from 'next/image'
import { ArrowUpRight, Stethoscope } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import type { ManagedDoctor } from '@/lib/cms/types'

export function DoctorDirectory({ doctors }: { doctors: ManagedDoctor[] }) {
  return (
    <section id="doctors" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Our Doctors"
          title="Care led by experienced hands"
          description="Meet the dedicated dental professionals caring for every KAAJ smile."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <article key={doctor.id} className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
              <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-primary shadow-lg">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-gold">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {doctor.experience}
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold text-primary">{doctor.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{doctor.specialty}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
