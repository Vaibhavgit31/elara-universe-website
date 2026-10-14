'use client'

import { useEffect } from 'react'

/** Marks <body data-hydrated> once React is interactive, so tests never click too early, and
 *  <html data-solid> on slow devices so glass surfaces fall back to near-solid cream. */
export function HydrationMarker() {
  useEffect(() => {
    document.body.dataset.hydrated = 'true'
    // Few cores or the data-saver flag: skip backdrop blur (CLAUDE.md, Phase 2 glass fallback).
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    if (nav.hardwareConcurrency <= 2 || nav.connection?.saveData)
      document.documentElement.dataset.solid = ''
  }, [])
  return null
}
