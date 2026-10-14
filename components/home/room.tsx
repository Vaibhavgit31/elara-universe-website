'use client'

import { m, useInView } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useHydrated } from '@/lib/use-hydrated'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const tones = {
  none: '',
  paper: 'bg-paper/70',
  cream: 'bg-cream/80',
  mint: 'bg-mint/60',
  chalk: 'bg-chalkboard text-cream',
}

/**
 * One room of the school day: a full-width band whose two "doors" slide open when it scrolls
 * into view (transform only; no doors with reduced motion, and none before hydration, so the
 * server HTML shows every room open). Children are server-rendered, so every detail is in the
 * HTML; wrap the heavy interactive parts in <LazyMount>.
 */
export function Room({
  id,
  tone = 'none',
  eager = false,
  className,
  children,
}: {
  id: string
  tone?: keyof typeof tones
  /** The first room renders at once; the others are laid out only when they near the screen
   *  (content-visibility), so their fonts and pictures are not fetched before the first paint. */
  eager?: boolean
  /** Classes for the inner container (padding, grid). */
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const open = useInView(ref, { once: true, amount: 0.15 })
  const reduced = useReducedMotion()
  const hydrated = useHydrated()
  const [done, setDone] = useState(false)
  const doors = hydrated && !reduced && !done
  return (
    <section
      ref={ref}
      id={id}
      data-room={id}
      data-open={open}
      className={cn(
        'relative w-full scroll-mt-[var(--topbar-h)] overflow-x-clip',
        !eager && '[contain-intrinsic-size:auto_960px] [content-visibility:auto]',
        tones[tone],
      )}
    >
      <div className={cn('container-page py-16 md:py-24', className)}>{children}</div>
      {doors &&
        (['left', 'right'] as const).map((side) => (
          <m.div
            key={side}
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-y-0 z-10 w-1/2 bg-mesh-mint/95',
              side === 'left'
                ? 'left-0 border-r border-white/60'
                : 'right-0 border-l border-white/60',
            )}
            initial={{ x: 0 }}
            animate={open ? { x: side === 'left' ? '-100%' : '100%' } : { x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => open && setDone(true)}
          />
        ))}
    </section>
  )
}
