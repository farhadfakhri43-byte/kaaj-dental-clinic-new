'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { ReactNode, MouseEvent } from 'react'
import { useRef } from 'react'

type MagneticButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  className?: string
  strength?: number
  'aria-label'?: string
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  strength = 0.35,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

  function handleMove(e: MouseEvent) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  const variants = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_30px_-10px_rgba(30,41,59,0.5)]',
    outline:
      'border border-primary/20 bg-transparent text-primary hover:border-primary/40 hover:bg-primary/[0.03]',
    ghost: 'bg-transparent text-primary hover:bg-primary/[0.04]',
  }

  const MotionComp = motion[href ? 'a' : 'button'] as typeof motion.a

  return (
    <MotionComp
      ref={ref as never}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </MotionComp>
  )
}
