'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/**
 * Text that writes itself in letter by letter, like ink. The full text stays readable by
 * screen readers and search engines; with reduced motion it simply appears.
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
  if (reduced) return <span className={className}>{text}</span>
  return (
    <span className={className} aria-label={text} role="text">
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={false}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.35, delay: delay + i * 0.035 }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  )
}
