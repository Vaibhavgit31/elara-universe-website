'use client'

import { m } from 'framer-motion'
import { useHydrated } from '@/lib/use-hydrated'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/**
 * Text that writes itself in letter by letter, like ink. The full text stays readable by
 * screen readers and search engines, and is visible in the first paint before any script runs;
 * with reduced motion it simply appears.
 */
export function InkText({
  text,
  start = true,
  delay = 0,
  className,
}: {
  text: string
  start?: boolean
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const hydrated = useHydrated()
  const visible = start || !hydrated
  if (reduced) return <span className={className}>{text}</span>
  return (
    <span className={className} aria-label={text} role="text">
      {[...text].map((char, i) => (
        <m.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.35, delay: delay + i * 0.035 }}
        >
          {char === ' ' ? ' ' : char}
        </m.span>
      ))}
    </span>
  )
}
