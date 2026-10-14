import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** The classroom's wooden (brass) frame around a board: chalkboard, notice board. */
export const WoodFrame = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn('rounded-md bg-brass p-2 shadow-lift', className)}>
    <div className="overflow-hidden rounded-sm">{children}</div>
  </div>
)
