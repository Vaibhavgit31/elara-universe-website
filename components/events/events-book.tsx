'use client'

import { Scrapbook } from '@/components/events/scrapbook'
import { UpcomingEvents } from '@/components/events/upcoming-events'
import { FlipPad } from '@/components/flip/flip-pad'
import { FlipPage } from '@/components/flip/flip-page'
import { splitEvents } from '@/lib/events'
import { useToday } from '@/lib/use-today'

/** The events scrapbook: pinned upcoming tickets, then past events as a photo scrapbook. */
export function EventsBook({ buildDate }: { buildDate: string }) {
  const { past } = splitEvents(useToday(buildDate))
  return (
    <FlipPad>
      <FlipPage>
        <p className="eyebrow">Launches, workshops, training and fairs</p>
        <h1>Events</h1>
        <p className="mt-3 max-w-prose">
          Upcoming events are pinned here; past ones go into the scrapbook on the next page.
        </p>
        <h2 className="mt-10">Upcoming</h2>
        <UpcomingEvents buildDate={buildDate} detailed />
      </FlipPage>
      {past.length > 0 && (
        <FlipPage className="bg-mist">
          <p className="eyebrow">Scrapbook</p>
          <h2>Past events</h2>
          <Scrapbook events={past} />
        </FlipPage>
      )}
    </FlipPad>
  )
}
