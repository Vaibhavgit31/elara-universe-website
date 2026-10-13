'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'

// Subject doodles for page margins: light line drawings that drift gently as you scroll.
const doodles = {
  hindi: (
    <text
      x="6"
      y="78"
      fontSize="54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="font-devanagari"
    >
      अ आ क
    </text>
  ),
  computer: (
    <>
      <path
        d="M14 10l18 44 6-16 16-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {[
        [66, 20],
        [80, 20],
        [94, 34],
        [66, 48],
        [80, 62],
      ].map(([x, y]) => (
        <rect
          key={`${x}${y}`}
          x={x}
          y={y}
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ))}
    </>
  ),
  drawing: (
    <>
      <path
        d="M22 98l46-70 14 9-46 70-18 6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M68 28l7-9 14 9-7 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M78 76c8-10 24-8 26 4 2 10-10 16-18 12s-4 10-14 8 0-14 6-24z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </>
  ),
}

export function Doodle({
  kind,
  className,
  speed = 0.08,
}: {
  kind: keyof typeof doodles
  className?: string
  speed?: number
}) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => -v * speed)
  return (
    <motion.svg
      aria-hidden
      viewBox={kind === 'hindi' ? '0 0 190 120' : '0 0 120 120'}
      style={{ y }}
      className={cn('pointer-events-none absolute w-24 text-sage/70 md:w-32', className)}
    >
      {doodles[kind]}
    </motion.svg>
  )
}
