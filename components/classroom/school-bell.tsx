'use client'

import { m } from 'framer-motion'
import { useState } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const swing = { rotate: [0, -14, 12, -8, 5, 0] }

/** A brass hand bell that rings (swings from the handle) on hover, tap or when `ring` turns true. */
export function SchoolBell({
  ring = false,
  label,
  className,
}: {
  ring?: boolean
  label?: string
  className?: string
}) {
  const reduced = useReducedMotion()
  const [ringing, setRinging] = useState(false)
  const start = () => setRinging(true)
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  return (
    <m.svg
      viewBox="0 0 64 80"
      className={className}
      style={{ originX: 0.5, originY: 0 }}
      animate={!reduced && (ringing || ring) ? swing : { rotate: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      onHoverStart={start}
      onTap={start}
      onAnimationComplete={() => setRinging(false)}
      {...a11y}
    >
      {/* handle and knob */}
      <circle cx="32" cy="7" r="6" className="fill-forest" />
      <rect x="28" y="8" width="8" height="20" rx="4" className="fill-forest" />
      {/* bell body with a flared lip */}
      <path
        d="M32 22C18 22 14 34 14 46v10c0 4-4 6-4 10h44c0-4-4-6-4-10V46c0-12-4-24-18-24z"
        className="fill-brass"
      />
      <ellipse cx="42" cy="46" rx="5" ry="14" className="fill-gold-ink/25" />
      <ellipse cx="24" cy="40" rx="3" ry="10" className="fill-cream/50" />
      <rect x="9" y="63" width="46" height="5" rx="2.5" className="fill-gold-ink" />
      {/* clapper */}
      <path d="M32 62v9" className="stroke-evergreen" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="73" r="5" className="fill-evergreen" />
    </m.svg>
  )
}
