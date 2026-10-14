'use client'

import { m, useMotionValue, useSpring } from 'framer-motion'
import { useState, type ComponentProps, type PointerEvent, type ReactNode } from 'react'
import { buttonClass, type Variant } from '@/components/ui/button-class'
import { TurnLink } from '@/components/ui/turn-link'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type Common = { variant?: Variant; className?: string; children: ReactNode }
type Props = Common &
  (
    | ({ href: string } & Omit<ComponentProps<typeof TurnLink>, 'href' | 'className' | 'children'>)
    | ({ href?: undefined } & Omit<ComponentProps<'button'>, 'className' | 'children'>)
  )

/** Pulls a little toward the cursor and ripples where it is tapped; still with reduced motion. */
function useMagnetic() {
  const reduced = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 })
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null)
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width - 0.5) * 8)
    y.set(((e.clientY - r.top) / r.height - 0.5) * 6)
  }
  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, key: e.timeStamp })
  }
  // The ripple is clipped by its own layer, so the focus ring outside the button stays visible.
  const rippleNode = ripple && (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <span
        key={ripple.key}
        className="ripple"
        style={{ left: ripple.x, top: ripple.y }}
        onAnimationEnd={() => setRipple(null)}
      />
    </span>
  )
  return { style: { x, y }, onPointerMove, onPointerLeave, onPointerDown, rippleNode }
}

/** A link or button in the system: magnetic, with a ripple on tap and the focus glow. */
export function Button({ variant = 'primary', className, children, ...rest }: Props) {
  const classes = buttonClass(variant, className)
  const { style, rippleNode, ...handlers } = useMagnetic()
  return (
    <m.span style={style} className="inline-flex" {...handlers}>
      {rest.href !== undefined ? (
        <TurnLink {...rest} className={classes}>
          {rippleNode}
          {children}
        </TurnLink>
      ) : (
        <button type="button" {...rest} className={classes}>
          {rippleNode}
          {children}
        </button>
      )}
    </m.span>
  )
}
