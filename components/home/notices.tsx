'use client'

import { NoticeBoard, Pinned } from '@/components/classroom/notice-board'
import { Button } from '@/components/ui/button'
import { DateLeaf } from '@/components/ui/date-leaf'
import { Tag } from '@/components/ui/tag'
import { eventTypeLabel, type Event } from '@/content/events'
import { formatDate, splitEvents } from '@/lib/events'
import { useToday } from '@/lib/use-today'

const tilts = ['left', 'right', 'none'] as const

/** One notice: date leaf, event type, title, date, city · venue and a Sample tag on placeholders. */
const Notice = ({ event }: { event: Event }) => (
  <div className="flex items-start gap-4">
    <DateLeaf date={event.date} decorative />
    <div className="min-w-0">
      <p className="eyebrow">{eventTypeLabel[event.type]}</p>
      <h3 className="mt-1">{event.title}</h3>
      <time dateTime={event.date} className="mt-2 block text-small text-forest">
        {formatDate(event.date)}
      </time>
      <p className="text-small text-forest">
        {event.city} · {event.venue}
      </p>
      {event.isPlaceholder && <Tag className="mt-3">Sample</Tag>}
    </div>
  </div>
)

/** Notice board: the next three events pinned up, or a hand-written note when it is empty. */
export function Notices({ buildDate }: { buildDate: string }) {
  const upcoming = splitEvents(useToday(buildDate)).upcoming.slice(0, 3)
  return (
    <div data-testid="notices">
      <NoticeBoard title="What's happening">
        {upcoming.length ? (
          upcoming.map((event, i) => (
            <Pinned key={event.slug} tilt={tilts[i % tilts.length]}>
              <Notice event={event} />
            </Pinned>
          ))
        ) : (
          <li className="py-10 text-center font-hand text-2xl text-forest sm:col-span-2 lg:col-span-3">
            New notices coming soon.
          </li>
        )}
      </NoticeBoard>
      <Button href="/events" variant="ghost" className="mt-6">
        All events
      </Button>
    </div>
  )
}
