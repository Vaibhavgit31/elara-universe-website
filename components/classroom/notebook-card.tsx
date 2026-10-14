import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A page torn from a ruled notebook: rules, a margin line and (on larger screens) punched holes. */
export function NotebookCard({
  title,
  titleAs: Title = 'h3',
  holes = true,
  className,
  children,
}: {
  title?: string
  /** Heading level of the hand-written title (h3 by default). */
  titleAs?: 'h2' | 'h3'
  holes?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <article
      className={cn(
        'relative rounded-sm bg-paper ruled py-8 pr-6 pl-10 shadow-page sm:pr-8 sm:pl-16',
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
      {title && <Title className="font-hand text-2xl leading-8 font-normal">{title}</Title>}
      <div className="leading-8">{children}</div>
    </article>
  )
}
