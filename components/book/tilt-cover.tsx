'use client'

import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, type PointerEvent } from 'react'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import type { Book } from '@/content/books'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v))

/**
 * The book cover tilts in 3D towards the mouse, with a light shine that follows it. On phones it
 * follows device tilt where the browser allows it without a permission prompt; otherwise it stays
 * still. Nothing moves with reduced motion.
 */
export function TiltCover({ book }: { book: Book }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 160, damping: 18 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), spring)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), spring)
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ['-35%', '35%']), spring)
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], ['-35%', '35%']), spring)

  useEffect(() => {
    if (
      reduced ||
      !('DeviceOrientationEvent' in window) ||
      'requestPermission' in DeviceOrientationEvent
    )
      return
    if (!window.matchMedia('(hover: none)').matches) return
    const onTilt = (e: DeviceOrientationEvent) => {
      x.set(clamp((e.gamma ?? 0) / 60))
      y.set(clamp(((e.beta ?? 45) - 45) / 60))
    }
    window.addEventListener('deviceorientation', onTilt)
    return () => window.removeEventListener('deviceorientation', onTilt)
  }, [reduced, x, y])

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      className="mx-auto w-full max-w-xs"
      style={{ perspective: '1000px' }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      data-testid="tilt-cover"
    >
      <motion.div
        className={`relative ${coverBoxClass}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`${book.title} cover`}
            width={773}
            height={1000}
            priority
            className="h-full w-full object-cover"
          />
        ) : (
          <CoverPlaceholder series={book.series} cls={book.class} subject={book.subject} />
        )}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.4),transparent_42%)]"
          style={{ x: shineX, y: shineY }}
        />
      </motion.div>
    </div>
  )
}
