'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from 'react'
import type { ClinicGalleryItem } from '@/lib/cms/types'

const EASE = [0.22, 1, 0.36, 1] as const

const galleryLayouts = [
  {
    sizes: '(max-width: 767px) 100vw, (max-width: 1023px) 58vw, (max-width: 1439px) 58vw, 745px',
    layout: 'col-span-2 aspect-[4/3] md:col-span-7 md:row-span-2 md:aspect-auto',
  },
  {
    sizes: '(max-width: 767px) 50vw, (max-width: 1023px) 40vw, (max-width: 1439px) 41vw, 447px',
    layout: 'aspect-[4/3] md:col-span-5 md:aspect-auto',
  },
  {
    sizes: '(max-width: 767px) 50vw, (max-width: 1023px) 24vw, (max-width: 1439px) 25vw, 268px',
    layout: 'aspect-[4/3] md:col-span-3 md:aspect-auto',
  },
  {
    sizes: '(max-width: 767px) 100vw, (max-width: 1023px) 17vw, (max-width: 1439px) 17vw, 179px',
    layout: 'col-span-2 aspect-[4/5] md:col-span-2 md:aspect-auto',
  },
] as const

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

type ClinicExperienceProps = {
  images: ClinicGalleryItem[]
}

export function ClinicExperience({ images }: ClinicExperienceProps) {
  const clinicImages = images.map((image, index) => ({
    ...image,
    ...galleryLayouts[index % galleryLayouts.length],
  }))
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const isLightboxOpen = activeIndex !== null
  const activeImage = activeIndex === null ? null : clinicImages[activeIndex]
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: EASE }

  const closeLightbox = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const showPreviousImage = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null
      return (currentIndex - 1 + clinicImages.length) % clinicImages.length
    })
  }, [])

  const showNextImage = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null
      return (currentIndex + 1) % clinicImages.length
    })
  }, [])

  useEffect(() => {
    if (!isLightboxOpen) return

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
        closeLightbox()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPreviousImage()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNextImage()
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
      lastFocusedElementRef.current?.focus()
    }
  }, [closeLightbox, isLightboxOpen, showNextImage, showPreviousImage])

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
      showPreviousImage()
    } else {
      showNextImage()
    }
  }

  if (clinicImages.length === 0) {
    return null
  }

  return (
    <section id="experience" className="relative overflow-hidden bg-background py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 z-0 h-72 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-gold-soft/40 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={transition}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:tracking-[0.32em]">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            The KAAJ Experience
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-primary text-balance sm:text-4xl md:text-[2.75rem] lg:text-5xl">
            Where Care Meets Innovation
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base md:text-lg">
            Modern facilities, advanced technology, and a welcoming environment designed around your comfort.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {clinicImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ ...transition, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              className="relative aspect-4/3 min-h-0"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Open ${image.label} photo in fullscreen`}
                aria-haspopup="dialog"
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-primary/5 text-left shadow-[0_20px_45px_-28px_rgba(30,41,59,0.55)] outline-none transition-shadow duration-300 hover:shadow-[0_28px_56px_-28px_rgba(30,41,59,0.7)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:rounded-3xl"
              >
                <motion.div
                  className="absolute inset-0 will-change-transform"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={image.sizes}
                    className="object-cover"
                    style={{ objectPosition: image.objectPosition }}
                  />
                </motion.div>
                <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/35 via-transparent to-transparent opacity-65" aria-hidden="true" />
                <span className="pointer-events-none absolute bottom-3 right-3 grid size-10 place-items-center rounded-full border border-white/35 bg-primary/50 text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:bottom-4 sm:right-4" aria-hidden="true">
                  <Maximize2 className="size-4" strokeWidth={1.8} />
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isLightboxOpen && activeImage && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clinic-experience-lightbox-title"
            aria-describedby="clinic-experience-lightbox-description"
            tabIndex={-1}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: EASE }}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeLightbox()
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-100 flex items-center justify-center overscroll-contain bg-primary/90 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-6"
          >
            <h2 id="clinic-experience-lightbox-title" className="sr-only">
              {activeImage.label}
            </h2>
            <p id="clinic-experience-lightbox-description" className="sr-only">
              {activeImage.alt}
            </p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.985 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: EASE }}
              className="relative w-full max-w-368"
            >
              <div className="relative h-[min(74svh,46rem)] w-full overflow-hidden rounded-2xl bg-black/20 shadow-2xl sm:h-[min(80svh,52rem)] sm:rounded-3xl">
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-5 pb-5 pt-16 text-white sm:px-7 sm:pb-7" aria-hidden="true">
                  <p className="text-sm font-medium sm:text-base">{activeImage.label}</p>
                  <p className="mt-1 text-xs text-white/70 sm:text-sm">
                    {activeIndex + 1} of {clinicImages.length}
                  </p>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLightbox}
                aria-label="Close image viewer"
                className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-white/30 bg-primary/75 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:right-5 sm:top-5"
              >
                <X className="size-5" strokeWidth={1.8} />
              </button>

              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="View previous photo"
                className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-primary/75 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:left-5 sm:size-12"
              >
                <ChevronLeft className="size-5" strokeWidth={1.8} />
              </button>

              <button
                type="button"
                onClick={showNextImage}
                aria-label="View next photo"
                className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-primary/75 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:right-5 sm:size-12"
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
