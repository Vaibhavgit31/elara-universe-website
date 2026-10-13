'use client'

import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

// Gentle smooth scrolling with Lenis. Touch scrolling stays native (syncTouch off), and the
// whole thing is skipped when the visitor prefers reduced motion.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  if (reduced) return children
  return (
    <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 1 }}>
      {children}
    </ReactLenis>
  )
}
