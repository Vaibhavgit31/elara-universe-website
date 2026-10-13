import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const tints = {
  hindi: 'bg-hindi-tint',
  computer: 'bg-computer-tint',
  drawing: 'bg-drawing-tint',
  mist: 'bg-mist',
}

/** A square of coloured paper held with a strip of washi tape. */
export function StickyNote({
  tone = 'mist',
  tilt = 'rotate-0',
  title,
  className,
  children,
}: {
  tone?: keyof typeof tints
  tilt?: string
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('relative p-6 pt-8 shadow-page', tints[tone], tilt, className)}>
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 bg-[repeating-linear-gradient(135deg,rgb(182_130_53/0.45)_0_6px,rgb(182_130_53/0.3)_6px_12px)]"
      />
      <h3 className="font-hand text-2xl leading-tight">{title}</h3>
      <div className="mt-2 text-small">{children}</div>
    </div>
  )
}
