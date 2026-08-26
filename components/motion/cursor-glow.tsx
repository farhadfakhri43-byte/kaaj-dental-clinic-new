'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

export function CursorGlow() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 })

  useEffect(() => {
    // Only enable on fine pointer (mouse) devices
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || reduce) return
    setEnabled(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 250)
      y.set(e.clientY - 250)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [reduce, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[500px] w-[500px] rounded-full"
      style={{
        x: sx,
        y: sy,
        background:
          'radial-gradient(circle, color-mix(in oklch, var(--gold) 22%, transparent) 0%, transparent 60%)',
        filter: 'blur(40px)',
      }}
    />
  )
}
