'use client'

import { motion } from 'motion/react'
import { HeartHandshake, Microscope, Users, ShieldCheck } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/reveal'

const pillars = [
  {
    icon: Microscope,
    title: 'Modern Equipment',
    text: 'Digital imaging, intraoral scanners, and precision tools for accurate, comfortable care.',
  },
  {
    icon: Users,
    title: 'Experienced Specialists',
    text: 'A dedicated team of certified dentists across every field of modern dentistry.',
  },
  {
    icon: HeartHandshake,
    title: 'Patient-Centered Care',
    text: 'Personalized treatment plans built around your comfort, goals, and wellbeing.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Standards',
    text: 'Rigorous hygiene and international safety protocols on every single visit.',
  },
]

export function About() {
  return (
    <section id="about" className="relative bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="relative overflow-hidden rounded-3xl bg-primary shadow-[0_40px_80px_-40px_rgba(30,41,59,0.5)]">
          <div className="relative aspect-video min-h-56 w-full">
            <video
              src="/videos/welcome-clinic.mp4"
              poster="/images/hero-clinic.png"
              autoPlay
              muted
              loop
              playsInline
              controls
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/70 via-transparent to-transparent" />
            <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-3 text-white sm:bottom-7 sm:left-7">
              <span className="grid size-10 place-items-center rounded-full border border-white/30 bg-white/15 font-serif text-lg">10+</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Years of Trusted Care</span>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 max-w-4xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              <span className="h-px w-6 bg-gold" />
              About Kaaj Dental Clinic
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-primary text-balance sm:text-4xl">
              Where world-class dentistry meets genuine, personal care.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Kaaj Dental Clinic was founded on a simple belief: exceptional dental care should feel
              calm, precise, and deeply personal. From our home in Kabul, we combine advanced
              technology with the warmth of a team that treats every patient like family.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
              <span className="font-medium text-primary">Our mission</span> is to give every patient
              a confident, healthy smile through honest advice, meticulous craftsmanship, and care
              designed entirely around them.
            </p>
          </Reveal>

          <StaggerGroup className="mt-10 grid gap-x-6 gap-y-7 sm:grid-cols-2">
            {pillars.map((p) => (
              <StaggerItem key={p.title} className="flex gap-4">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft/50 text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-primary">{p.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {p.text}
                  </span>
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
