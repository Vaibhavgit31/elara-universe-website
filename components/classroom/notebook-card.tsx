import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Ruled every 32px (one rule = sage-100 at 80%) so leading-8 text sits exactly on the lines.
const rules =
  'bg-[repeating-linear-gradient(transparent_0,transparent_31px,rgba(220,229,210,0.8)_31px,rgba(220,229,210,0.8)_32px)]'

/** A page torn from a ruled notebook: rules, a margin line and (on larger screens) punched holes. */
export function NotebookCard({
  title,
  holes = true,
  className,
  children,
}: {
  title?: string
  holes?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <article
      className={cn(
        'relative rounded-sm bg-paper py-8 pr-6 pl-10 shadow-page sm:pr-8 sm:pl-16',
        rules,
        className,
      )}
    >
      <span aria-hidden className="absolute inset-y-0 left-8 w-0.5 bg-drawing/60 sm:left-12" />
      {holes && (
        <span
          aria-hidden
          className="absolute inset-y-6 left-3 hidden flex-col justify-between sm:flex"
        >
          {[0, 1, 2].map((hole) => (
            <span key={hole} className="size-3 rounded-full bg-mist inset-shadow-sm" />
          ))}
        </span>
      )}
      {title && <h3 className="font-hand text-2xl leading-8 font-normal">{title}</h3>}
      <div className="leading-8">{children}</div>
    </article>
  )
}
