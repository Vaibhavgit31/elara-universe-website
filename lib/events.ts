import { events, type Event } from '@/content/events'

const today = () => new Date().toISOString().slice(0, 10)
const byDate = (a: Event, b: Event) => a.date.localeCompare(b.date)

/** Events on or after today, soonest first. Evaluated when the site is built. */
export const upcomingEvents = () => events.filter((e) => e.date >= today()).sort(byDate)

/** Events before today, most recent first. */
export const pastEvents = () => events.filter((e) => e.date < today()).sort((a, b) => byDate(b, a))

const formatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
export const formatDate = (iso: string) => formatter.format(new Date(`${iso}T00:00:00`))
