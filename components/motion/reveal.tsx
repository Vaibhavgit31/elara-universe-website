'use client'

import { motion, useInView, type HTMLMotionProps } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { easeOut } from '@/components/motion/motion-provider'

/** True once the element is in view and its flip page (if any) is the one being read. */
export function useReveal(ref: React.RefObject<Element | null>, margin = '-10% 0px') {
  const active = useFlipPageActive()
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` })
  return active && inView
}

type Props = HTMLMotionProps<'div'> & { children: ReactNode; delay?: number; y?: number }

/** Fades and rises into place when it comes into view (a plain fade with reduced motion). */
export function Reveal({ children, delay = 0, y = 18, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const show = useReveal(ref)
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, delay, ease: easeOut }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Pops in like a sticker being pressed on: scale from nothing with a little overshoot. */
export function StickerPop({ children, delay = 0, ...rest }: Omit<Props, 'y'>) {
  const ref = useRef<HTMLDivElement>(null)
  const show = useReveal(ref, '0px')
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={show ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.3, rotate: -8 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Wobbles like a book being nudged on a shelf when hovered. */
export function Wobble({ children, ...rest }: HTMLMotionProps<'div'> & { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ rotate: [0, -2.5, 2.5, -1.5, 0], y: -10 }}
      transition={{ duration: 0.6 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
