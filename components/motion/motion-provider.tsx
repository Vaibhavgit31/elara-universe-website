'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

// One place for the site's motion defaults. reducedMotion="user" makes every Motion component
// drop transform animations (keeping fades) when the visitor asks for reduced motion.
export const easeOut = [0.22, 1, 0.36, 1] as const

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: easeOut }}>
      {children}
    </MotionConfig>
  )
}
