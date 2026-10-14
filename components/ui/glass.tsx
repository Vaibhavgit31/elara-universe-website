'use client'

import { m } from 'framer-motion'
import type { ComponentProps, PointerEvent } from 'react'
import { cn } from '@/lib/cn'
import { useTilt } from '@/lib/use-tilt'

const radii = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg' }

type Props = ComponentProps<'div'> & {
  radius?: keyof typeof radii
  /** Cursor spotlight glow (on by default, off with reduced motion). */
  spotlight?: boolean
  /** Gentle 3D tilt towards the mouse. */
  tilt?: boolean
}

/** An acrylic panel: the only way to put content on glass. */
export function Glass({
  radius = 'md',
  spotlight = true,
  tilt = false,
  className,
  style,
  children,
  onPointerMove: consumerMove,
  ...rest
}: Props) {
  const { rotateX, rotateY, onPointerMove, onPointerLeave, reduced } = useTilt(6)
  const spot = (e: PointerEvent<HTMLDivElement>) => {
    consumerMove?.(e)
    if (reduced || !spotlight) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const classes = cn('glass', radii[radius], spotlight && 'glass-spot', className)
  if (!tilt)
    return (
      <div {...rest} className={classes} style={style} onPointerMove={spot}>
        {children}
      </div>
    )
  return (
    <div
      style={{ perspective: '1000px' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <m.div
        {...(rest as ComponentProps<typeof m.div>)}
        className={classes}
        style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={spot}
      >
        {children}
      </m.div>
    </div>
  )
}
