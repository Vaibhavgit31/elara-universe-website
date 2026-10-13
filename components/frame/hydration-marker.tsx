'use client'

import { useEffect } from 'react'

/** Marks <body data-hydrated> once React is interactive, so tests never click too early. */
export function HydrationMarker() {
  useEffect(() => {
    document.body.dataset.hydrated = 'true'
  }, [])
  return null
}
