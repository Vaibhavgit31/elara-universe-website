'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import { useEffect } from 'react'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import type { Book } from '@/content/books'
import { useTilt } from '@/lib/use-tilt'

const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v))

/**
 * The book cover tilts in 3D towards the mouse, with a light shine that follows it. On phones it
 * follows device tilt where the browser allows it without a permission prompt; otherwise it stays
 * still. Nothing moves with reduced motion. Sits inside a glass panel on the book page.
 */
export function TiltCover({ book }: { book: Book }) {
  const { x, y, rotateX, rotateY, shineX, shineY, onPointerMove, onPointerLeave, reduced } =
    useTilt(13)

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

  return (
    <div
      className="mx-auto w-full max-w-xs"
      style={{ perspective: '1000px' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      data-testid="tilt-cover"
    >
      <m.div
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
        <m.div
          aria-hidden
          className="pointer-events-none absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.4),transparent_42%)]"
          style={{ x: shineX, y: shineY }}
        />
      </m.div>
    </div>
  )
}
