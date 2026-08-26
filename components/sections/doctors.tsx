'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { MagneticButton } from '@/components/motion/magnetic-button'

export function Doctors() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const toothY = useTransform(scrollYProgress, [0, 0.45, 1], [80, 0, -40])
  const toothScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.75, 1, 1.08, 1]
  )

  const crackOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 0.7],
    [1, 1, 0.4, 0]
  )

  const healingGlow = useTransform(
    scrollYProgress,
    [0.35, 0.55, 0.75],
    [0, 0.5, 1]
  )

  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -20])

  return (
    <section
      ref={ref}
      id="transformation"
      className="relative min-h-[900px] overflow-hidden bg-primary py-28 text-primary-foreground md:py-40"
    >
      {/* Ambient glow */}
      <motion.div
        style={{ opacity: healingGlow }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          style={{ y: textY }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold">
            <Sparkles className="h-4 w-4" />
            Smile Transformation
          </div>

          <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-6xl">
            From Broken
            <span className="block italic text-gold">to Beautiful.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70 md:text-lg">
            Every smile deserves a second chance. Watch as damaged teeth
            transform into a healthy, confident smile with expert dental care.
          </p>
        </motion.div>

        {/* Tooth */}
        <div className="relative mx-auto mt-16 flex h-[470px] max-w-xl items-center justify-center md:mt-20">
          <motion.div
            style={{
              y: toothY,
              scale: toothScale,
            }}
            className="relative h-[350px] w-[280px]"
          >
            {/* Glow behind tooth */}
            <motion.div
              style={{ opacity: healingGlow }}
              className="absolute inset-[-50px] rounded-full bg-gold/20 blur-[70px]"
            />

            {/* Tooth */}
            <svg
              viewBox="0 0 280 350"
              className="relative z-10 h-full w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.35)]"
              aria-label="Animated broken tooth transforming into a healthy tooth"
            >
              <defs>
                <linearGradient id="toothGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="55%" stopColor="#f8f4ec" />
                  <stop offset="100%" stopColor="#d9d0bd" />
                </linearGradient>

                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f5d58a" />
                  <stop offset="50%" stopColor="#c89b45" />
                  <stop offset="100%" stopColor="#8d6828" />
                </linearGradient>
              </defs>

              {/* Tooth body */}
              <path
                d="
                  M70 55
                  C42 75 38 115 45 160
                  C51 201 64 252 88 299
                  C98 318 112 318 121 298
                  L140 255
                  L159 298
                  C168 318 182 318 192 299
                  C216 252 229 201 235 160
                  C242 115 238 75 210 55
                  C186 38 160 42 140 58
                  C120 42 94 38 70 55Z
                "
                fill="url(#toothGradient)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="3"
              />

              {/* Broken section */}
              <motion.path
                style={{
                  opacity: crackOpacity,
                }}
                d="
                  M135 60
                  L151 91
                  L139 120
                  L158 151
                  L145 183
                  L164 214
                "
                fill="none"
                stroke="#8d6828"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Gold healing line */}
              <motion.path
                style={{
                  pathLength: healingGlow,
                  opacity: healingGlow,
                }}
                d="
                  M135 60
                  L151 91
                  L139 120
                  L158 151
                  L145 183
                  L164 214
                "
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Floating particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2.5 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: 'easeInOut',
                }}
                className="absolute h-1.5 w-1.5 rounded-full bg-gold"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${15 + (i % 3) * 25}%`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          style={{ opacity: healingGlow, y: textY }}
          className="relative z-20 mx-auto -mt-4 flex flex-col items-center text-center"
        >
          <h3 className="font-serif text-2xl font-semibold md:text-3xl">
            Your smile deserves a second chance.
          </h3>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/60">
            Let KAAJ Dental Clinic help restore your smile with modern,
            precise and compassionate dental care.
          </p>

          <div className="mt-7">
            <MagneticButton href="#contact" variant="primary">
              Book Your Appointment
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}