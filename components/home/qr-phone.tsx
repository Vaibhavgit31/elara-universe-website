'use client'

import { m, type Transition } from 'framer-motion'
import { CirclePlay, FileText, ListChecks } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** One loop: the scan line sweeps 1.2 s, the QR glows, the card slides up, holds 2 s, fades, rests. */
const T = 5.4
const at = (seconds: number) => seconds / T
const loop: Transition = { duration: T, repeat: Infinity, ease: 'easeInOut' }

/** A stylised QR: three finder rings and a few data cells on a 7 × 7 grid of 8-unit modules. */
const ring = (x: number, y: number) => `M${x} ${y}h24v24h-24zM${x + 8} ${y + 8}h8v8h-8z`
const cells = '30 32 03 23 33 53 35 44 64 55 46 66'.split(' ') // "xy" grid positions
const cell = (xy: string) => `M${+xy[0] * 8} ${+xy[1] * 8}h8v8h-8z`
const qrPath = ring(0, 0) + ring(32, 0) + ring(0, 32) + cells.map(cell).join('')

/** Resource rows on the phone card: icon + bar for videos, worksheets and quizzes (content/books.ts). */
const rows = [
  [CirclePlay, 34],
  [FileText, 26],
  [ListChecks, 38],
] as const

/** A phone held over an open Elara book, scanning the QR square on the page and opening its resources. */
export function QrPhone({
  className,
  label = 'A phone scanning the QR code in a book and opening its resources',
}: {
  className?: string
  label?: string
}) {
  const reduced = useReducedMotion()
  // Keyframes on the shared loop clock, or the still frame (card open) with reduced motion.
  const anim = (keys: Record<string, number[]>, times: number[], still: Record<string, number>) =>
    reduced
      ? { animate: still, transition: { duration: 0 } }
      : { animate: keys, transition: { ...loop, times } }
  return (
    <figure className={cn('relative', className)}>
      <svg role="img" aria-label={label} viewBox="0 0 320 260" className="h-auto w-full">
        {/* open book: forest cover, two cream pages, ruled lines on the left page */}
        <rect x="10" y="140" width="300" height="110" rx="8" className="fill-forest" />
        <rect x="18" y="148" width="138" height="94" rx="4" className="fill-cream" />
        <rect x="164" y="148" width="138" height="94" rx="4" className="fill-cream" />
        {[108, 108, 108, 60].map((w, i) => (
          <rect
            key={i}
            x="32"
            y={166 + i * 16}
            width={w}
            height="5"
            rx="2.5"
            className="fill-sage-100"
          />
        ))}
        {/* QR square on the right page, with its glow behind and the scan line over it */}
        <g transform="translate(222 166)">
          <m.rect
            x="-8"
            y="-8"
            width="72"
            height="72"
            rx="10"
            className="fill-leaf"
            initial={{ opacity: 0 }}
            {...anim({ opacity: [0, 0, 0.45, 0, 0] }, [0, at(1.15), at(1.45), at(2), 1], {
              opacity: 0,
            })}
          />
          <path d={qrPath} fillRule="evenodd" className="fill-evergreen" />
          <m.rect
            x="-4"
            y="-2"
            width="64"
            height="3"
            rx="1.5"
            className="fill-leaf"
            initial={{ y: 0, opacity: 1 }}
            {...anim({ y: [0, 58, 58, 58], opacity: [1, 1, 0, 0] }, [0, at(1.2), at(1.35), 1], {
              opacity: 0,
            })}
          />
        </g>
        {/* phone: evergreen body, cream screen, viewfinder brackets around what the camera sees */}
        <ellipse cx="160" cy="190" rx="48" ry="6" className="fill-evergreen/15" />
        <g transform="translate(100 12) rotate(-5)">
          <rect width="92" height="180" rx="14" className="fill-evergreen" />
          <rect x="6" y="10" width="80" height="160" rx="9" className="fill-cream" />
          <rect x="36" y="4" width="20" height="3" rx="1.5" className="fill-forest" />
          <path
            d="M18 28h-6v6M74 28h6v6M18 72h-6v-6M74 72h6v-6"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="stroke-leaf"
          />
          <path
            d={qrPath}
            fillRule="evenodd"
            transform="translate(30 34) scale(0.55)"
            className="fill-evergreen/70"
          />
          {/* glass "resources" card that slides up from the bottom of the screen */}
          <m.g
            initial={{ y: 28, opacity: 0 }}
            {...anim(
              { y: [28, 28, 0, 0, 0, 0], opacity: [0, 0, 1, 1, 0, 0] },
              [0, at(1.6), at(2.1), at(4.1), at(4.6), 1],
              { y: 0, opacity: 1 },
            )}
          >
            <rect
              x="12"
              y="84"
              width="68"
              height="78"
              rx="8"
              className="fill-white/75 stroke-white"
            />
            <rect x="20" y="92" width="36" height="4" rx="2" className="fill-forest" />
            {rows.map(([Icon, w], i) => (
              <g key={i} transform={`translate(20 ${104 + i * 18})`}>
                <Icon x="0" y="0" size={11} strokeWidth={2.4} className="text-leaf-700" />
                <rect x="16" y="3.5" width={w} height="4" rx="2" className="fill-sage-100" />
              </g>
            ))}
          </m.g>
        </g>
      </svg>
      <figcaption className="sr-only">Videos, worksheets and quizzes for every chapter</figcaption>
    </figure>
  )
}
