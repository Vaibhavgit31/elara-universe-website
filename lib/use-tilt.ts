import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { PointerEvent } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** 3D tilt towards the mouse with a light shine, as motion values plus the pointer handlers.
 *  `max` is the largest rotation in degrees. Still with reduced motion or on touch. */
export function useTilt(max = 12) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 160, damping: 18 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring)
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ['-35%', '35%']), spring)
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], ['-35%', '35%']), spring)
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }
  return { x, y, rotateX, rotateY, shineX, shineY, onPointerMove, onPointerLeave, reduced }
}
