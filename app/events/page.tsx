import type { Metadata } from 'next'
import { EventsBook } from '@/components/events/events-book'
import { Main } from '@/components/frame/main'
import { isoToday } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Book launches, school workshops, teacher training and book fairs with Elara Universe Publishers.',
}

export default function EventsPage() {
  return (
    <Main>
      <EventsBook buildDate={isoToday()} />
    </Main>
  )
}
