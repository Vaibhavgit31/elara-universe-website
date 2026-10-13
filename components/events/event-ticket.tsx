import { Tag } from '@/components/ui/tag'
import { eventTypeLabel, type Event } from '@/content/events'
import { formatDate } from '@/lib/events'
import { cn } from '@/lib/cn'

const SampleBadge = () => (
  <span className="absolute top-2 right-2 rotate-6 rounded-sm bg-drawing px-2 py-0.5 text-label text-cream uppercase">
    Sample
  </span>
)

/** A paper ticket pinned to the page, used on Home and the Events page. */
export function EventTicket({ event, className }: { event: Event; className?: string }) {
  return (
    <article
      className={cn(
        'relative flex gap-4 rounded-sm bg-paper [mask-image:radial-gradient(circle_at_0_50%,transparent_9px,black_10px),radial-gradient(circle_at_100%_50%,transparent_9px,black_10px)] [mask-composite:intersect] p-5 shadow-page',
        className,
      )}
    >
      {event.isPlaceholder && <SampleBadge />}
      <time
        dateTime={event.date}
        className="flex shrink-0 flex-col items-center border-r border-dashed border-sage pr-4 font-heading"
      >
        <span className="text-3xl leading-none font-bold">{event.date.slice(8)}</span>
        <span className="mt-1 eyebrow">{formatDate(event.date).split(' ')[1].slice(0, 3)}</span>
        <span className="text-small text-forest">{event.date.slice(0, 4)}</span>
      </time>
      <div className="min-w-0">
        <Tag>{eventTypeLabel[event.type]}</Tag>
        <h3 className="mt-2 pr-10 text-lg leading-snug break-words">{event.title}</h3>
        <p className="mt-1 text-small break-words text-forest">
          {event.city} · {event.venue}
        </p>
      </div>
    </article>
  )
}
