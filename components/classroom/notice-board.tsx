import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Cork texture: brass dots at low alpha on the hindi tint, repeating every 10px.
const cork =
  'bg-[radial-gradient(color-mix(in_srgb,var(--color-brass)_22%,transparent)_1px,transparent_1.6px)] bg-size-[10px_10px]'

// Each tilt pairs a small static rotation with its pin-head colour.
const tilts = {
  left: { card: 'rotate-[-1.5deg]', pin: 'fill-drawing' },
  right: { card: 'rotate-[1.5deg]', pin: 'fill-leaf' },
  none: { card: '', pin: 'fill-leaf' },
}

/** A cork notice board in a wooden (brass) frame; children are laid out in a responsive grid. */
export function NoticeBoard({
  title,
  className,
  children,
}: {
  title?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      {title && (
        <div className="mb-6 max-w-prose">
          <p className="eyebrow">Notice board</p>
          <h2 className="mt-2">{title}</h2>
        </div>
      )}
      <div className="rounded-md bg-brass p-2 shadow-lift">
        <div className={cn('rounded-sm bg-hindi-tint p-6 md:p-8', cork)}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** One notice pinned to the board: a paper card with a push-pin and a slight tilt. */
export function Pinned({
  tilt = 'none',
  className,
  children,
}: {
  tilt?: keyof typeof tilts
  className?: string
  children: ReactNode
}) {
  return (
    <article
      className={cn(
        'relative rounded-sm bg-paper p-6 pt-8 shadow-page transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        tilts[tilt].card,
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 32"
        className="absolute -top-3 left-1/2 h-8 w-6 -translate-x-1/2"
      >
        <path d="M12 20v10" className="stroke-sage" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="11" r="10" className={tilts[tilt].pin} />
        <circle cx="12" cy="13" r="7" className="fill-evergreen/15" />
        <ellipse cx="8.5" cy="7.5" rx="3" ry="2" className="fill-cream/70" />
      </svg>
      {children}
    </article>
  )
}
