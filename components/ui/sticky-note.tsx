import type { ReactNode } from 'react'
import { WashiTape } from '@/components/ui/washi-tape'
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
      <WashiTape />
      <h3 className="font-hand text-2xl leading-tight">{title}</h3>
      <div className="mt-2 text-small">{children}</div>
    </div>
  )
}
