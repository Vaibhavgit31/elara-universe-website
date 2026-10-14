import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Level = 'h1' | 'h2' | 'h3'

/** Eyebrow + heading (+ lead), left-aligned on the grid; `accent` gets a crayon underline. */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  lead,
  as: Tag = 'h2',
  className,
  crayon = 'brass',
}: {
  eyebrow?: string
  title: string
  /** A word or two appended to the title and underlined in crayon. */
  accent?: string
  lead?: ReactNode
  as?: Level
  className?: string
  crayon?: 'brass' | 'leaf' | 'drawing' | 'computer' | 'hindi'
}) {
  return (
    <div className={cn('max-w-prose', className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className={cn(eyebrow && 'mt-2')}>
        {title}
        {accent && (
          <>
            {' '}
            <span
              className="crayon"
              style={{ '--crayon': `var(--color-${crayon})` } as React.CSSProperties}
            >
              {accent}
            </span>
          </>
        )}
      </Tag>
      {lead && <div className="mt-4 text-lg text-forest">{lead}</div>}
    </div>
  )
}
