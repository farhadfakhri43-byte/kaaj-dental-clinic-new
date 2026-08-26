'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from 'react'
import type { PatientStory } from '@/lib/cms/types'

const EASE = [0.22, 1, 0.36, 1] as const

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function PatientStoryCard({
  story,
  index,
  featured = false,
  shouldReduceMotion,
  onOpen,
}: {
  story: PatientStory
  index: number
  featured?: boolean
  shouldReduceMotion: boolean
  onOpen: (index: number) => void
}) {
  const revealTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: EASE, delay: index * 0.08 }

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={revealTransition}
      className={featured ? 'md:col-span-2 lg:col-span-1' : ''}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Play ${story.name}`}
        aria-haspopup="dialog"
        className={`group block h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/6 text-left shadow-[0_26px_70px_-38px_rgba(0,0,0,0.75)] outline-none transition-colors hover:bg-white/9 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-primary sm:rounded-3xl ${
          featured
            ? 'flex flex-col'
            : 'flex flex-col lg:min-h-56 lg:grid lg:grid-cols-[minmax(10rem,0.92fr)_minmax(0,1.08fr)] lg:items-stretch xl:min-h-60'
        }`}
      >
        <div className={`relative aspect-video overflow-hidden bg-black/30 ${featured ? '' : 'lg:m-4 lg:self-center lg:rounded-2xl'}`}>
          <motion.video
            src={story.video}
            preload="metadata"
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
            transition={{ duration: 0.55, ease: EASE }}
          />
          <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/75 via-primary/10 to-transparent" aria-hidden="true" />
          <span className={`pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 ${featured ? 'size-16 sm:size-18' : 'size-13'}`} aria-hidden="true">
            <Play className={featured ? 'ml-1 size-7 sm:size-8' : 'ml-0.5 size-5'} fill="currentColor" strokeWidth={1.5} />
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/20 bg-primary/70 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-white backdrop-blur-sm" aria-hidden="true">
            {story.duration}
          </span>
        </div>

        <div className={`p-5 sm:p-6 ${featured ? '' : 'lg:flex lg:flex-col lg:justify-center lg:p-5 xl:p-6'}`}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
            {story.treatment}
          </p>
          <h3 className={`mt-2 font-serif font-semibold tracking-tight text-white ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
            {story.name}
          </h3>
          <p className={`mt-3 leading-relaxed text-primary-foreground/70 ${featured ? 'max-w-xl text-sm sm:text-base' : 'text-sm'}`}>
            {story.quote}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <Play className="size-3.5 fill-current" strokeWidth={1.8} />
              Watch story
            </span>
            <span
              className="text-xs tracking-[0.12em] text-gold"
              aria-label={story.rating + ' out of 5 stars'}
            >
              {'★'.repeat(story.rating)}
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  )
}

type PatientStoriesProps = {
  stories: PatientStory[]
}

export function PatientStories({ stories }: PatientStoriesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const isVideoModalOpen = activeIndex !== null
  const activeStory = activeIndex === null ? null : stories[activeIndex]

  const closeVideoModal = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setActiveIndex(null)
  }, [])

  const showPreviousStory = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null
      return (currentIndex - 1 + stories.length) % stories.length
    })
  }, [stories.length])

  const showNextStory = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null
      return (currentIndex + 1) % stories.length
    })
  }, [stories.length])

  useEffect(() => {
    if (!isVideoModalOpen) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const activeElement = document.activeElement
    lastFocusedElementRef.current = activeElement instanceof HTMLElement ? activeElement : null

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeVideoModal()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPreviousStory()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNextStory()
        return
      }

      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null)

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const currentElement = document.activeElement

      if (!focusableElements.includes(currentElement as HTMLElement)) {
        event.preventDefault()
        firstElement.focus()
        return
      }

      if (event.shiftKey && currentElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && currentElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      videoRef.current?.pause()
      lastFocusedElementRef.current?.focus()
    }
  }, [closeVideoModal, isVideoModalOpen, showNextStory, showPreviousStory])

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchStartX = touchStartXRef.current
    const touchEndX = event.changedTouches[0]?.clientX
    touchStartXRef.current = null

    if (touchStartX === null || touchEndX === undefined) return

    const swipeDistance = touchEndX - touchStartX
    if (Math.abs(swipeDistance) < 56) return

    if (swipeDistance > 0) {
      showPreviousStory()
    } else {
      showNextStory()
    }
  }

  if (stories.length === 0) {
    return null
  }

  return (
    <section id="patient-stories" className="relative overflow-hidden bg-primary py-14 text-primary-foreground sm:py-20 md:py-28 lg:py-32 xl:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-128 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gold/20 via-primary/0 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:tracking-[0.32em]">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            Real Patient Stories
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-white text-balance sm:text-4xl md:text-[2.75rem] lg:text-5xl">
            Smiles That Tell a Story
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-primary-foreground/70 text-pretty sm:text-base md:text-lg">
            Hear directly from our patients about their journey, experience, and transformation at KAAJ Dental Clinic.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:gap-7">
          {stories[0] && (
            <PatientStoryCard
              story={stories[0]}
              index={0}
              featured
              shouldReduceMotion={shouldReduceMotion}
              onOpen={setActiveIndex}
            />
          )}
          <div className="grid gap-5 md:col-span-2 md:grid-cols-2 md:gap-6 lg:col-span-1 lg:grid-cols-1 lg:gap-7">
            {stories.slice(1).map((story, index) => (
              <PatientStoryCard
                key={story.id}
                story={story}
                index={index + 1}
                shouldReduceMotion={shouldReduceMotion}
                onOpen={setActiveIndex}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isVideoModalOpen && activeStory && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-story-modal-title"
            aria-describedby="patient-story-modal-description"
            tabIndex={-1}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: EASE }}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeVideoModal()
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-100 flex items-center justify-center overscroll-contain bg-primary/95 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-6"
          >
            <h2 id="patient-story-modal-title" className="sr-only">
              {activeStory.name}
            </h2>
            <p id="patient-story-modal-description" className="sr-only">
              {activeStory.treatment}. {activeStory.quote}
            </p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.985 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: EASE }}
              className="relative w-full max-w-336"
            >
              <div className="overflow-hidden rounded-2xl bg-black shadow-2xl sm:rounded-3xl">
                <div className="relative aspect-video w-full bg-black">
                  <video
                    ref={videoRef}
                    key={activeStory.video}
                    src={activeStory.video}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex items-start justify-between gap-4 bg-primary px-5 py-4 sm:px-7 sm:py-5">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
                      {activeStory.treatment}
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold text-white sm:text-xl">
                      {activeStory.name}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/80">
                    {activeIndex + 1} of {stories.length}
                  </span>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeVideoModal}
                aria-label="Close video player"
                className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-white/30 bg-primary/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:right-5 sm:top-5"
              >
                <X className="size-5" strokeWidth={1.8} />
              </button>

              <button
                type="button"
                onClick={showPreviousStory}
                aria-label="Play previous patient story"
                className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-primary/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:left-5 sm:size-12"
              >
                <ChevronLeft className="size-5" strokeWidth={1.8} />
              </button>

              <button
                type="button"
                onClick={showNextStory}
                aria-label="Play next patient story"
                className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-primary/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:right-5 sm:size-12"
              >
                <ChevronRight className="size-5" strokeWidth={1.8} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
