'use client'

import { m } from 'framer-motion'
import { siteConfig } from '@/content/site-config'
import { isoToday } from '@/lib/events'
import { useToday } from '@/lib/use-today'

const Diya = () => (
  <svg viewBox="0 0 40 40" className="w-8" aria-hidden>
    <ellipse cx="20" cy="30" rx="14" ry="6" fill="#E07A5F" />
    <ellipse cx="20" cy="28" rx="11" ry="4" fill="#B68235" />
    <m.path
      d="M20 8c-4 6-6 10-3 15h6c3-5 1-9-3-15Z"
      fill="#E8A53A"
      animate={{ scale: [1, 1.15, 0.95, 1] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      style={{ originX: '20px', originY: '23px' }}
    />
  </svg>
)
const Kite = ({ color }: { color: string }) => (
  <m.svg
    viewBox="0 0 40 60"
    className="w-8"
    aria-hidden
    animate={{ y: [0, -8, 0], rotate: [-6, 6, -6] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path d="M20 2l16 18-16 22L4 20z" fill={color} />
    <path d="M20 2v40M4 20h32" stroke="#FBF9F4" strokeWidth="1.5" />
    <path d="M20 42c-4 6 2 10-2 16" fill="none" stroke="#3F5645" strokeWidth="1.5" />
  </m.svg>
)

/** Diyas for Diwali, kites for Makar Sankranti, on the dates in content/site-config.ts. */
export function FestivalTouches({ buildDate }: { buildDate: string }) {
  const today = useToday(buildDate)
  const festival =
    siteConfig.festivals && siteConfig.festivalDates.find((f) => today >= f.from && today <= f.to)
  if (!festival) return null
  return (
    <div
      className="pointer-events-none absolute top-full right-4 z-30 flex gap-2 md:right-8"
      data-testid={`festival-${festival.decoration}`}
      role="img"
      aria-label={`${festival.name} decorations`}
    >
      {festival.decoration === 'diyas'
        ? [1, 2, 3].map((i) => <Diya key={i} />)
        : ['#E07A5F', '#4A90C2', '#E8A53A'].map((c) => <Kite key={c} color={c} />)}
    </div>
  )
}

export const festivalBuildDate = isoToday
