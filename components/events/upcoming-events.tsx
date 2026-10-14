'use client'

import { NoticeBoard, Pinned } from '@/components/classroom/notice-board'
import { EventTicket } from '@/components/events/event-ticket'
import { EmptyBoard } from '@/components/illustrations/empty-board'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'
import type { Event } from '@/content/events'

const tilts = ['left', 'right', 'none'] as const

/** Elu points at an empty pinboard until the next event is confirmed. */
const EmptyState = () => (
  <div className="mt-10 flex flex-wrap items-end gap-6">
    <Elu pose="point" label="Elu pointing at the empty board" className="w-20" />
    <EmptyBoard className="w-56 max-w-full" />
    <p className="font-hand text-2xl text-forest">New events coming soon.</p>
  </div>
)

/** Upcoming events as paper tickets pinned to the notice board, plus a note for schools. */
export function UpcomingEvents({ events }: { events: Event[] }) {
  if (!events.length) return <EmptyState />
  return (
    <div className="mt-10" data-testid="upcoming">
      <NoticeBoard title="Upcoming">
        {events.map((event, i) => (
          <Pinned key={event.slug} tilt={tilts[i % tilts.length]} bare>
            <EventTicket event={event} />
          </Pinned>
        ))}
        {/* [PLACEHOLDER] wording. It also fills the board's last column, so no cell stays empty. */}
        <Pinned tilt={tilts[events.length % tilts.length]} className="sm:col-span-2 lg:col-span-1">
          <p className="eyebrow">Your school</p>
          <p className="mt-2 font-hand text-2xl leading-tight">
            A workshop, a training session or a book launch at your school?
          </p>
          <Button href="/contact" className="mt-4">
            Write to us
          </Button>
        </Pinned>
      </NoticeBoard>
    </div>
  )
}
