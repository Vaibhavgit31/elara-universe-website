'use client'

import { LazyMotion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

// One place for the site's motion defaults. Animation features load in their own chunk
// (LazyMotion), so the first paint ships only the small `m` components; reducedMotion="user"
// makes every component drop transform animations (keeping fades) when the visitor asks for it.
export const easeOut = [0.22, 1, 0.36, 1] as const
const loadFeatures = () => import('@/components/motion/features').then((mod) => mod.default)

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: easeOut }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
