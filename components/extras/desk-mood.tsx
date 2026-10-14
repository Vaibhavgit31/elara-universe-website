'use client'

import { useSyncExternalStore } from 'react'
import { siteConfig } from '@/content/site-config'

const noop = () => () => {}
const isEvening = () => {
  const hour = new Date().getHours()
  return hour >= siteConfig.eveningFromHour || hour < 6
}

/** In the evening the desk behind the pages warms up and a small lamp comes on. */
export function DeskMood() {
  const evening = useSyncExternalStore(noop, isEvening, () => false)
  if (!siteConfig.timeOfDayDesk || !evening) return null
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-brass/20"
        data-testid="desk-evening"
      />
      <svg
        aria-hidden
        viewBox="0 0 80 120"
        className="pointer-events-none absolute top-9 right-10 z-[55] w-14 md:right-16 md:w-16"
      >
        <path d="M14 10h52l-10 34H24z" fill="#3F5645" />
        <path d="M24 44h32l24 60H0z" fill="#E8A53A" opacity=".35" />
        <path d="M40 44v62" stroke="#3F5645" strokeWidth="4" />
        <ellipse cx="40" cy="108" rx="18" ry="5" fill="#3F5645" />
      </svg>
    </>
  )
}
