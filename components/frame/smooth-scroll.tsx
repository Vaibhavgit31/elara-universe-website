'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

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
