'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { ArrowRight, ShieldCheck, Microscope, Award, Star } from 'lucide-react'
import { MagneticButton } from '@/components/motion/magnetic-button'
import { translations, useLanguage } from '@/components/language-provider'

const EASE = [0.22, 1, 0.36, 1] as const

const floatingCards = [
  { icon: ShieldCheck, title: 'Advanced Dental Care', sub: 'Gentle & precise' },
  { icon: Microscope, title: 'Modern Technology', sub: 'Digital diagnostics' },
  { icon: Award, title: 'Experienced Specialists', sub: 'Certified team' },
]

export function Hero() {
  const { language } = useLanguage()
  const text = translations[language]
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.04])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-12%'])

  return (
    <section
      ref={ref}
      id="home"
      className="relative overflow-hidden bg-background pt-32 pb-16 md:pt-40 md:pb-24"
    >
      {/* soft ambient shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-20 h-144 w-xl rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--gold) 20%, transparent) 0%, transparent 68%)',
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <motion.div style={{ y: contentY }} className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft/40 px-4 py-1.5 text-xs font-medium tracking-wide text-primary"
          >
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            Premium Dental &amp; Cosmetic Dentistry — Kabul
          </motion.span>

          <h1 className="mt-6 font-serif text-[2.7rem] font-semibold leading-[1.05] tracking-tight text-primary text-balance sm:text-6xl lg:text-[4.1rem]">
            {[text.hero, text.deserves, text.best].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.4 + i * 0.12 }}
                >
                  {i === 2 ? (
                    <span className="italic text-gold">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty md:text-lg"
          >
            {text.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="#contact" variant="primary">
              {text.bookNow}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="#services" variant="outline">
              {text.explore}
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Welcome video */}
        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
            className="relative aspect-video overflow-hidden rounded-[28px] bg-primary/10 shadow-[0_40px_80px_-30px_rgba(30,41,59,0.4)]"
          >
            <motion.video
              src="/videos/welcome-clinic.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/hero-clinic.png"
              aria-hidden="true"
              style={{ scale: mediaScale }}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/25 via-transparent to-transparent" />
          </motion.div>

          {/* Floating cards */}
          <div className="pointer-events-none absolute inset-0 hidden 2xl:block">
            {floatingCards.map((card, i) => {
              const positions = [
                'left-[-6%] top-[14%]',
                'right-[-8%] top-[46%]',
                'left-[6%] bottom-[-4%]',
              ]
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 1.1 + i * 0.18 }}
                  className={`absolute ${positions[i]}`}
                >
                  <motion.div
                    animate={reduce ? undefined : { y: [0, -10, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/85 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(30,41,59,0.45)] backdrop-blur-md"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-soft/60 text-primary">
                      <card.icon className="h-4 w-4" />
                    </span>
                    <span className="pr-1">
                      <span className="block text-sm font-semibold leading-tight text-primary">
                        {card.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">{card.sub}</span>
                    </span>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
