'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { reviews } from '@/lib/data'
import type { PatientStory } from '@/lib/cms/types'

const EASE = [0.22, 1, 0.36, 1] as const

export function Reviews({ stories }: { stories: PatientStory[] }) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const paginate = useCallback((d: number) => {
    setDir(d)
    setIndex((prev) => (prev + d + reviews.length) % reviews.length)
  }, [])

  useEffect(() => {
    const t = setInterval(() => paginate(1), 6000)
    return () => clearInterval(t)
  }, [paginate])

  const review = reviews[index]

  return (
    <section id="reviews" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Patient Stories"
          title="Loved by thousands of smiles"
          description="Hear from the patients who trusted us with their care."
        />

        <div className="relative mt-10 min-h-88 sm:mt-14">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mx-auto max-w-2xl rounded-3xl border border-border/70 bg-card p-8 text-center shadow-[0_30px_70px_-45px_rgba(30,41,59,0.4)] md:p-12"
            >
              <Quote className="mx-auto h-9 w-9 text-gold/50" />
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-6 font-serif text-xl leading-relaxed text-primary text-balance md:text-2xl">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <span className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={review.image}
                    alt={`${review.name}, patient`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="text-left">
                  <span className="block font-semibold text-primary">{review.name}</span>
                  <span className="block text-sm text-muted-foreground">{review.treatment}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous review"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-primary transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                onClick={() => {
                  setDir(i > index ? 1 : -1)
                  setIndex(i)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 bg-gold' : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next review"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-primary transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
