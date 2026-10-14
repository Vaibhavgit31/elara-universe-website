'use client'

import { useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/** Mounts its children only once the reader is within `margin` of them; shows `fallback`
 *  (static, server-rendered markup) until then. Use it around heavy client-only widgets that are
 *  loaded with next/dynamic, so a room's JavaScript arrives only when the room is reached. */
export function LazyMount({
  children,
  fallback = null,
  margin = '320px 0px',
  className,
}: {
  children: ReactNode
  fallback?: ReactNode
  margin?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInView(ref, { once: true, margin: margin as `${number}px` })
  return (
    <div ref={ref} className={className} data-mounted={near}>
      {near ? children : fallback}
    </div>
  )
}
