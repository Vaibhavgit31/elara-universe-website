'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'

/** The Google Map loads only once it scrolls into view. */
export function LazyMap({ query, title }: { query: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '160px' })
  return (
    <div ref={ref} className="aspect-[4/3] overflow-hidden rounded-sm bg-mist" data-testid="map">
      {inView && (
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      )}
    </div>
  )
}
