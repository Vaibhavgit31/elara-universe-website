'use client'

import { useId, useRef, type ReactNode } from 'react'
import { m, useInView } from 'framer-motion'
import { WoodFrame } from '@/components/classroom/wood-frame'
import { cn } from '@/lib/cn'
import { useHydrated } from '@/lib/use-hydrated'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** Faint chalk dust: a small tile of desaturated noise, repeated across the board. */
function ChalkDust() {
  const id = useId().replace(/\W/g, '')
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-6 mix-blend-screen"
    >
      <filter id={`${id}f`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <pattern id={`${id}p`} width="160" height="160" patternUnits="userSpaceOnUse">
        <rect width="160" height="160" filter={`url(#${id}f)`} />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id}p)`} />
    </svg>
  )
}

/** A chalkboard panel in a wooden (brass) frame, with chalk dust and a tray of chalk stubs. */
export function Chalkboard({
  className,
  children,
  tray = true,
  frame = 'wood',
}: {
  className?: string
  children: ReactNode
  tray?: boolean
  frame?: 'wood' | 'none'
}) {
  const board = (
    <>
      <div className="relative isolate bg-chalkboard p-6 text-cream md:p-8">
        <ChalkDust />
        <div className="relative">{children}</div>
      </div>
      {tray && (
        <div aria-hidden className="flex h-6 items-center gap-2 bg-cream px-4">
          <span className="h-2 w-8 rounded-full bg-white shadow-page" />
          <span className="h-2 w-6 rounded-full bg-hindi shadow-page" />
        </div>
      )}
    </>
  )
  return frame === 'wood' ? (
    <WoodFrame className={className}>{board}</WoodFrame>
  ) : (
    <div className={cn('overflow-hidden rounded-md shadow-lift', className)}>{board}</div>
  )
}

/**
 * A line written in chalk. With `write` the letters appear one by one once the line scrolls into
 * view (and `start` is true, so a flip page can hold the writing until it is being read); the full
 * text is in the server HTML and stays readable by assistive tech, and with reduced motion it is
 * plain text.
 */
export function ChalkText({
  text,
  write = false,
  start = true,
  delay = 0,
  as: Tag = 'p',
  className,
}: {
  text: string
  write?: boolean
  start?: boolean
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
}) {
  const reduced = useReducedMotion()
  const hydrated = useHydrated()
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true })
  const classes = cn(
    'font-hand text-cream opacity-92 text-shadow-white/40 text-shadow-xs',
    className,
  )
  if (reduced || !write) return <Tag className={classes}>{text}</Tag>
  const visible = (inView && start) || !hydrated
  // Long lines write in faster so every heading is readable within a second (motion rules).
  const step = Math.min(0.035, 0.6 / text.length)
  return (
    <Tag ref={ref} className={classes}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {[...text].map((char, i) => (
          <m.span
            key={i}
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={visible ? { duration: 0.3, delay: delay + i * step } : { duration: 0 }}
          >
            {char}
          </m.span>
        ))}
      </span>
    </Tag>
  )
}

/** A short hand-drawn chalk stroke for underlining a chalk heading. Width comes from className. */
export const ChalkLine = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 160 12" fill="none" className={cn('h-auto w-40', className)}>
    <path
      d="M3 8C25 4 50 10 75 6s55-4 82 1"
      className="stroke-cream"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
)
