'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

const categories = ['Veneers', 'Whitening', 'Orthodontics', 'Smile Makeover'] as const

export function BeforeAfter() {
  const [active, setActive] = useState<(typeof categories)[number]>('Veneers')
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, next)))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    updateFromClientX(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    updateFromClientX(e.clientX)
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <section id="before-after" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Before &amp; After"
          title="Real transformations, real confidence"
          description="Drag the slider to reveal the difference our craftsmanship makes across every treatment."
        />

        <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                'rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300',
                active === cat
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-primary/70 hover:border-primary/40',
              )}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        <Reveal delay={0.15}>
          <div
            ref={containerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="relative mt-10 aspect-[16/10] w-full select-none overflow-hidden rounded-3xl border border-border/70 shadow-[0_40px_80px_-40px_rgba(30,41,59,0.4)] touch-none"
          >
            {/* After (base) */}
            <Image
              src="/images/after.png"
              alt="After dental treatment result"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <span className="absolute right-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold tracking-wide text-primary backdrop-blur">
              After
            </span>

            {/* Before (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Image
                src="/images/before.png"
                alt="Before dental treatment"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-primary/85 px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground backdrop-blur">
                Before
              </span>
            </div>

            {/* Handle */}
            <div
              className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-background"
              style={{ left: `${pos}%` }}
            >
              <motion.span
                whileTap={{ scale: 0.9 }}
                className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-border bg-background text-primary shadow-lg"
              >
                <MoveHorizontal className="h-5 w-5" />
              </motion.span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Showing sample results for{' '}
            <span className="font-medium text-primary">{active}</span>. Individual results vary.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
