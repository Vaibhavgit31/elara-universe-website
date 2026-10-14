'use client'

import { m } from 'framer-motion'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { buttonClass } from '@/components/ui/button-class'
import { DateLeaf } from '@/components/ui/date-leaf'
import { Tag } from '@/components/ui/tag'
import { eventTypeLabel, type Event, type EventType } from '@/content/events'
import { cn } from '@/lib/cn'
import { useHydrated } from '@/lib/use-hydrated'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** Subject colours stay on the small type tag only. */
const tagTone: Record<EventType, 'hindi' | 'computer' | 'neutral' | 'drawing'> = {
  launch: 'hindi',
  workshop: 'computer',
  training: 'neutral',
  fair: 'drawing',
}

// A torn bottom edge: a zigzag of 18 teeth.
const torn = `polygon(0 0, 100% 0, ${Array.from({ length: 19 }, (_, i) => `${100 - (i * 100) / 18}% ${i % 2 ? 97 : 100}%`).join(', ')})`
// Punched sides: a half-circle notch bitten out of each edge, like a ticket stub.
const punched =
  '[mask-image:radial-gradient(circle_at_0_50%,transparent_9px,black_10px),radial-gradient(circle_at_100%_50%,transparent_9px,black_10px)] [mask-composite:intersect]'

/** The "Sample" sticker on placeholder events (a ticket row item or, with `absolute`, a corner). */
export const SampleSticker = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'rotate-6 rounded-sm border border-drawing bg-drawing-tint px-2 py-0.5 text-label text-evergreen uppercase',
      className,
    )}
  >
    Sample
  </span>
)

/** A paper ticket pinned to the notice board: date leaf, type tag, title, place, description and
 *  the Register link. Once its page is being read it swings gently on the pin; it hangs still
 *  before hydration and with reduced motion. */
export function EventTicket({ event }: { event: Event }) {
  const hydrated = useHydrated()
  const active = useFlipPageActive()
  const reduced = useReducedMotion()
  const swing = hydrated && active && !reduced
  return (
    <m.article
      className="origin-top shadow-page"
      initial={false}
      animate={swing ? { rotate: [-1.2, 1.2, -1.2] } : { rotate: 0 }}
      transition={swing ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
    >
      <div
        className={cn('flex gap-4 bg-paper p-4 pb-6 sm:p-6 sm:pb-8', punched)}
        style={{ clipPath: torn }}
      >
        <DateLeaf date={event.date} year />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone={tagTone[event.type]} className="-rotate-2">
              {eventTypeLabel[event.type]}
            </Tag>
            {event.isPlaceholder && <SampleSticker />}
          </div>
          <h3 className="mt-2 text-lg leading-snug break-words">{event.title}</h3>
          <p className="mt-1 text-small break-words text-forest">
            {event.city} · {event.venue}
          </p>
          <p className="mt-3 text-small">{event.description}</p>
          {event.registerUrl && (
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('brass', 'mt-4')}
            >
              Register
            </a>
          )}
        </div>
      </div>
    </m.article>
  )
}
