import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Bands sit on the moving mesh background: translucent so the classroom shows through.
const tones = {
  none: '',
  paper: 'bg-paper/70',
  cream: 'bg-cream/80',
  mint: 'bg-mint/60',
  chalk: 'bg-chalkboard text-cream',
}

/** A full-width band with the page container inside, so no side of the screen is ever blank. */
export const Section = ({
  tone = 'none',
  id,
  className,
  children,
}: {
  tone?: keyof typeof tones
  id?: string
  /** Classes for the inner container (padding, grid, gap). */
  className?: string
  children: ReactNode
}) => (
  <section id={id} className={cn('w-full', tones[tone])}>
    <div className={cn('container-page', className)}>{children}</div>
  </section>
)
