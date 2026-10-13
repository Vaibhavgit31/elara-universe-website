'use client'

import { EventTicket } from '@/components/events/event-ticket'
import { EmptyBoard } from '@/components/illustrations/empty-board'
import { Elu } from '@/components/mascot/elu'
import { splitEvents } from '@/lib/events'
import { useToday } from '@/lib/use-today'

/** Upcoming events as pinned tickets, or a friendly empty board. */
export function UpcomingEvents({
  buildDate,
  limit,
  detailed = false,
}: {
  buildDate: string
  limit?: number
  detailed?: boolean
}) {
  const upcoming = splitEvents(useToday(buildDate)).upcoming.slice(0, limit)
  if (!upcoming.length)
    return (
      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <div className="flex items-end gap-2">
          <Elu pose="point" label="Elu pointing at the empty board" className="w-20" />
          <EmptyBoard className="w-56" />
        </div>
        <p className="font-hand text-2xl text-forest">New events coming soon.</p>
      </div>
    )
  return (
    <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-testid="upcoming">
      {upcoming.map((event, i) => (
        <li key={event.slug}>
          <EventTicket
            event={event}
            detailed={detailed}
            className={i % 2 ? 'rotate-1' : '-rotate-1'}
          />
        </li>
      ))}
    </ul>
  )
}
