'use client'

import { m, type Easing } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Glass } from '@/components/ui/glass'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** One loop: the paper builds over ~5.5 s, holds 2.5 s, fades out in 0.3 s and starts again. */
const T = 8.3
const FADE = 0.3

/** A piece of the paper that appears between `start` and `end` seconds (transform + opacity only). */
function Build({
  start,
  end = start + 0.4,
  from = {},
  ease = 'easeOut',
  className,
  children,
}: {
  start: number
  end?: number
  /** Starting transform, e.g. { scaleX: 0 } or { scale: 1.2 }; every build ends at rest. */
  from?: Record<string, number>
  ease?: Easing
  className?: string
  children?: ReactNode
}) {
  const reduced = useReducedMotion()
  const rest = Object.fromEntries(Object.keys(from).map((k) => [k, k.startsWith('scale') ? 1 : 0]))
  const keys = Object.fromEntries(
    Object.keys(from).map((k) => [k, [from[k], from[k], rest[k], rest[k], rest[k]]]),
  )
  const loop = {
    duration: T,
    repeat: Infinity,
    times: [0, start / T, end / T, 1 - FADE / T, 1],
    ease: ['linear', ease, 'linear', 'easeIn'] as Easing[],
  }
  return (
    <m.div
      className={className}
      initial={{ ...from, opacity: 0 }}
      animate={reduced ? { ...rest, opacity: 1 } : { ...keys, opacity: [0, 0, 1, 1, 0] }}
      transition={reduced ? { duration: 0 } : loop}
    >
      {children}
    </m.div>
  )
}

/** A section title, then its question lines typing in one after another (0.5 s each). */
function Section({
  title,
  start,
  lines,
  choice = false,
}: {
  title: string
  start: number
  /** Tailwind width of each question bar. */
  lines: string[]
  /** Multiple choice: four option circles after each bar. */
  choice?: boolean
}) {
  return (
    <div className="mt-5 sm:mt-6">
      <Build start={start} from={{ y: 4 }}>
        <p className="font-heading text-small font-semibold text-evergreen">{title}</p>
      </Build>
      {lines.map((w, i) => (
        <Build
          key={w}
          start={start + 0.4 + i * 0.5}
          end={start + 0.9 + i * 0.5}
          from={{ scaleX: 0 }}
          ease="linear"
          className="mt-2.5 flex origin-left items-center gap-2"
        >
          <div className={cn('h-2 rounded-full bg-sage-100', w)} />
          {choice &&
            [0, 1, 2, 3].map((o) => (
              <span key={o} className="size-2 rounded-full border border-sage" />
            ))}
        </Build>
      ))}
    </div>
  )
}

/** An A4 sheet on glass that drafts itself section by section, then gets stamped and ticked. */
export function TestPaperPreview({ className }: { className?: string }) {
  return (
    <Glass
      radius="md"
      role="img"
      aria-label="A test paper being drafted section by section"
      className={cn('p-4 sm:p-6', className)}
    >
      <div className="relative aspect-[1/1.414] overflow-hidden rounded-sm bg-cream p-5 shadow-page sm:p-7">
        {/* school header: a name line, a class line and a rule */}
        <Build start={0} from={{ y: 6 }} className="space-y-2 border-b border-sage-100 pb-3">
          <div className="h-3 w-1/2 rounded-full bg-forest" />
          <div className="h-2 w-1/4 rounded-full bg-sage-100" />
        </Build>
        {/* [PLACEHOLDER] wording: section titles of the sample paper */}
        <Section
          title="Section A — Multiple choice"
          start={0.7}
          lines={['w-5/6', 'w-2/3', 'w-3/4']}
          choice
        />
        <Section title="Section B — Short answer" start={2.8} lines={['w-3/5', 'w-4/5']} />
        <div className="absolute right-5 bottom-5 flex items-center gap-2 sm:right-7 sm:bottom-7">
          <Build start={4.5} from={{ scale: 1.2 }} ease="backOut" className="-rotate-6">
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-hindi-tint px-3 text-label tracking-normal whitespace-nowrap text-gold-ink">
              <Sparkles aria-hidden size={14} />
              AI draft — please check
            </span>
          </Build>
          <Build start={5.1} from={{ scale: 0 }} ease="backOut">
            <span className="grid size-7 place-items-center rounded-full bg-leaf text-paper">
              <Check aria-hidden size={16} strokeWidth={3} />
            </span>
          </Build>
        </div>
      </div>
    </Glass>
  )
}
