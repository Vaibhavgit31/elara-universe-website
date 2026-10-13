import { events, type Event } from '@/content/events'

/** ISO date (UTC), e.g. 2026-10-13. */
export const isoToday = (date = new Date()) => date.toISOString().slice(0, 10)

const byDate = (a: Event, b: Event) => a.date.localeCompare(b.date)

/** Upcoming (soonest first) and past (most recent first) events relative to `today`. */
export const splitEvents = (today: string) => ({
  upcoming: events.filter((e) => e.date >= today).sort(byDate),
  past: events.filter((e) => e.date < today).sort((a, b) => byDate(b, a)),
})

const formatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
export const formatDate = (iso: string) => formatter.format(new Date(`${iso}T00:00:00`))
export const monthShort = (iso: string) => formatDate(iso).split(' ')[1].slice(0, 3)
