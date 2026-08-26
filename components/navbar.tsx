'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { navLinks } from '@/lib/data'
import { cn } from '@/lib/utils'
import { translations, useLanguage, type SiteLanguage } from '@/components/language-provider'

const EASE = [0.22, 1, 0.36, 1] as const

export function Navbar() {
  const { language, setLanguage } = useLanguage()
  const text = translations[language]
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40)
  })

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
      >
        <motion.nav
          animate={{
            marginTop: scrolled ? 12 : 20,
            paddingTop: scrolled ? 10 : 16,
            paddingBottom: scrolled ? 10 : 16,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className={cn(
            'flex w-full max-w-6xl items-center justify-between rounded-full px-5 transition-[background,box-shadow,border] duration-500 md:px-7',
            scrolled
              ? 'border border-border/70 bg-background/70 shadow-[0_8px_40px_-12px_rgba(30,41,59,0.18)] backdrop-blur-xl'
              : 'border border-transparent bg-transparent',
          )}
        >
          <a href="#home" aria-label="Kaaj Dental Clinic — home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative rounded-full px-3.5 py-2 text-sm font-medium text-primary/75 transition-colors hover:text-primary"
                >
                  {link.href === '#home' ? text.home : link.href === '#services' ? text.services : link.href === '#doctors' ? text.doctors : link.href === '#contact' ? text.contact : link.label}
                  <span className="absolute inset-x-3.5 bottom-1.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as SiteLanguage)} className="h-9 rounded-full border border-border/70 bg-background/80 px-2 text-xs font-medium text-primary outline-none">
              <option value="en">EN</option><option value="fa">دری</option><option value="ps">پښتو</option>
            </select>
            <a
              href="#contact"
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-12px_rgba(30,41,59,0.6)] transition-transform duration-300 hover:-translate-y-0.5 md:inline-flex"
            >
              {text.book}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 text-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.ul
                className="mt-10 flex flex-col gap-1"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              >
                {navLinks.map((link) => (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: 30 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-border/60 py-4 font-serif text-2xl text-primary"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-auto rounded-full bg-primary py-4 text-center text-sm font-medium text-primary-foreground"
              >
                Book Appointment
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
