'use client'

import { Counter } from '@/components/motion/counter'
import { StaggerGroup, StaggerItem } from '@/components/motion/reveal'
import { stats } from '@/lib/data'

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--gold) 30%, transparent) 0%, transparent 65%)',
        }}
      />
      <div className="mx-auto max-w-6xl px-6">
        <StaggerGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem
              key={stat.label}
              className="relative text-center lg:text-left"
            >
              <p className="font-serif text-4xl font-semibold text-primary-foreground md:text-5xl">
                <span className="text-gold">
                  <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                {stat.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
