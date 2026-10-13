'use client'

import { motion } from 'motion/react'
import { Tag } from '@/components/ui/tag'
import { buttonClass } from '@/components/ui/button'
import { eventTypeLabel, type Event, type EventType } from '@/content/events'
import { monthShort } from '@/lib/events'
import { cn } from '@/lib/cn'

const stickerTone: Record<EventType, 'hindi' | 'computer' | 'neutral' | 'drawing'> = {
  launch: 'hindi',
  workshop: 'computer',
  training: 'neutral',
  fair: 'drawing',
}

// A torn bottom edge: a zigzag of 18 teeth.
const torn = `polygon(0 0, 100% 0, ${Array.from({ length: 19 }, (_, i) => `${100 - (i * 100) / 18}% ${i % 2 ? 97 : 100}%`).join(', ')})`

/** A paper ticket pinned to the page; it swings gently on its pin. */
export function EventTicket({
  event,
  detailed = false,
  className,
}: {
  event: Event
  detailed?: boolean
  className?: string
}) {
  return (
    <motion.article
      className={cn('relative origin-top pt-4', className)}
      animate={{ rotate: [-1.2, 1.2, -1.2] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span
        aria-hidden
        className="absolute top-0 left-1/2 z-10 size-5 -translate-x-1/2 rounded-full bg-drawing shadow-[inset_-2px_-2px_4px_rgb(0_0_0/0.3),0_2px_3px_rgb(0_0_0/0.3)]"
      />
      <div
        className="relative flex gap-4 bg-paper [mask-image:radial-gradient(circle_at_0_50%,transparent_9px,black_10px),radial-gradient(circle_at_100%_50%,transparent_9px,black_10px)] [mask-composite:intersect] p-5 pb-7 shadow-page"
        style={{ clipPath: torn }}
      >
        {event.isPlaceholder && (
          <span className="absolute top-2 right-2 rotate-6 rounded-sm bg-drawing px-2 py-0.5 text-label text-cream uppercase">
            Sample
          </span>
        )}
        <time
          dateTime={event.date}
          className="flex shrink-0 flex-col items-center border-r border-dashed border-sage pr-4 font-heading"
        >
          <span className="text-3xl leading-none font-bold">{event.date.slice(8)}</span>
          <span className="mt-1 eyebrow">{monthShort(event.date)}</span>
          <span className="text-small text-forest">{event.date.slice(0, 4)}</span>
        </time>
        <div className="min-w-0">
          <Tag tone={stickerTone[event.type]} className="-rotate-2">
            {eventTypeLabel[event.type]}
          </Tag>
          <h3 className="mt-2 pr-10 text-lg leading-snug break-words">{event.title}</h3>
          <p className="mt-1 text-small break-words text-forest">
            {event.city} · {event.venue}
          </p>
          {detailed && <p className="mt-3 text-small">{event.description}</p>}
          {detailed && event.registerUrl && (
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('brass', 'mt-4 min-h-10 px-4 py-1.5 text-small')}
            >
              Register
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
