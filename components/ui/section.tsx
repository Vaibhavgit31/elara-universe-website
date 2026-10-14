import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const tones = { paper: 'bg-paper', cream: 'bg-cream', mist: 'bg-mist' }

/** A full-width band with the page container inside, so no side of the screen is ever blank. */
export const Section = ({
  tone = 'paper',
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
