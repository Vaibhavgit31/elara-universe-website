'use client'

import { Scrapbook } from '@/components/events/scrapbook'
import { UpcomingEvents } from '@/components/events/upcoming-events'
import { FlipPad } from '@/components/flip/flip-pad'
import { FlipPage } from '@/components/flip/flip-page'
import { SectionHeading } from '@/components/ui/section-heading'
import { splitEvents } from '@/lib/events'
import { useToday } from '@/lib/use-today'

/** The events flip pad: upcoming tickets on the notice board, then past events as a scrapbook. */
export function EventsBook({ buildDate }: { buildDate: string }) {
  const { upcoming, past } = splitEvents(useToday(buildDate))
  return (
    <FlipPad>
      <FlipPage>
        <SectionHeading
          as="h1"
          eyebrow="Launches, workshops, training and fairs"
          title="Events"
          lead="Upcoming events are pinned here; past ones go into the scrapbook on the next page."
        />
        <UpcomingEvents events={upcoming} />
      </FlipPage>
      {past.length > 0 && (
        <FlipPage>
          <Scrapbook events={past} />
        </FlipPage>
      )}
    </FlipPad>
  )
}
