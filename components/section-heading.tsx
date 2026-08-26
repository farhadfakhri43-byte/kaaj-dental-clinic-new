import { AnimatedHeading, Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <Reveal>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-gold">
          <span className="h-px w-6 bg-gold" />
          {eyebrow}
        </span>
      </Reveal>
      <h2
        className={cn(
          'mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight tracking-tight text-primary text-balance sm:text-4xl md:text-[2.75rem]',
        )}
      >
        <AnimatedHeading text={title} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              'mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
