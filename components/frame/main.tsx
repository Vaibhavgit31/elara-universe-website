import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** The page's main landmark and skip-link target. Leaves room for the phone bottom bar. */
export const Main = ({ className, children }: { className?: string; children: ReactNode }) => (
  <main id="main" tabIndex={-1} className={cn('flex flex-1 flex-col', className)}>
    {children}
  </main>
)
