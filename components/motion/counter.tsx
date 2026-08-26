'use client'

import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export function Counter({
  value,
  suffix = '',
  decimals = 0,
}: {
  value: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (inView) {
      if (reduce) {
        setDisplay(value.toFixed(decimals))
      } else {
        motionValue.set(value)
      }
    }
  }, [inView, value, motionValue, reduce, decimals])

  useEffect(() => {
    const unsub = spring.on('change', (latest) => {
      setDisplay(latest.toFixed(decimals))
    })
    return unsub
  }, [spring, decimals])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
