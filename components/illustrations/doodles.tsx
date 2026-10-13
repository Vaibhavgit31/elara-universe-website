'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { cn } from '@/lib/cn'

// Subject doodles for page margins: light line drawings that draw themselves in and drift
// gently as you scroll. Devanagari letters are real text (no path to draw), so they fade in.
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}
const doodles: Record<string, { viewBox: string; paths: string[]; text?: string }> = {
  hindi: { viewBox: '0 0 190 120', paths: [], text: 'अ आ क' },
  computer: {
    viewBox: '0 0 120 120',
    paths: [
      'M14 10l18 44 6-16 16-6z',
      'M66 20h11v11H66z',
      'M80 20h11v11H80z',
      'M94 34h11v11H94z',
      'M66 48h11v11H66z',
      'M80 62h11v11H80z',
    ],
  },
  drawing: {
    viewBox: '0 0 120 120',
    paths: [
      'M22 98l46-70 14 9-46 70-18 6z',
      'M68 28l7-9 14 9-7 9',
      'M78 76c8-10 24-8 26 4 2 10-10 16-18 12s-4 10-14 8 0-14 6-24z',
    ],
  },
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
  const active = useFlipPageActive()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => -v * speed)
  const { viewBox, paths, text } = doodles[kind]
  return (
    <motion.svg
      aria-hidden
      viewBox={viewBox}
      style={{ y }}
      className={cn('pointer-events-none absolute w-24 text-sage/70 md:w-32', className)}
    >
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          {...stroke}
          initial={false}
          animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3 + i * 0.25, ease: 'easeInOut' }}
        />
      ))}
      {text && (
        <motion.text
          x="6"
          y="78"
          fontSize="54"
          {...stroke}
          strokeWidth={1.4}
          className="font-devanagari"
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {text}
        </motion.text>
      )}
    </motion.svg>
  )
}
