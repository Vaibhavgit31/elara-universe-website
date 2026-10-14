import type { ReactNode } from 'react'
import { WoodFrame } from '@/components/classroom/wood-frame'
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
      <WoodFrame>
        <div className={cn('bg-hindi-tint p-6 md:p-8', cork)}>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
        </div>
      </WoodFrame>
    </div>
  )
}

/** One notice pinned to the board (a list item): a paper card with a push-pin and a slight tilt.
 *  `bare` keeps only the pin and the tilt, for notices that are their own piece of paper. */
export function Pinned({
  tilt = 'none',
  bare = false,
  className,
  children,
}: {
  tilt?: keyof typeof tilts
  bare?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <li
      className={cn(
        'relative transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        bare ? 'pt-3' : 'rounded-sm bg-paper p-6 pt-8 shadow-page',
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
    </li>
  )
}
