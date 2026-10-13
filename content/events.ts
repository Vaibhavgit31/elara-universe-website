// Events shown on /events and on the home page. All three are samples (isPlaceholder: true):
// replace them with real events (date, city, venue, photos) when they are confirmed.
export type EventType = 'launch' | 'workshop' | 'training' | 'fair'

export type Event = {
  title: string
  slug: string
  type: EventType
  /** ISO date, e.g. 2026-11-14 */
  date: string
  city: string
  venue: string
  description: string
  /** Photo for the past-events scrapbook, or null */
  image: string | null
  registerUrl: string | null
  isPlaceholder: boolean
}

export const eventTypeLabel: Record<EventType, string> = {
  launch: 'Book launch',
  workshop: 'School workshop',
  training: 'Teacher training',
  fair: 'Book fair',
}

export const events: Event[] = [
  {
    title: 'Basic Hindi Reader launch [PLACEHOLDER]',
    slug: 'sample-hindi-reader-launch',
    type: 'launch',
    date: '2026-11-14',
    city: 'Noida',
    venue: '[PLACEHOLDER] venue',
    description:
      'Sample event. A launch of the Basic Hindi Reader series for principals and Hindi teachers, with a walk-through of the text-cum-workbook design.',
    image: null,
    registerUrl: null,
    isPlaceholder: true,
  },
  {
    title: 'TechNova classroom workshop [PLACEHOLDER]',
    slug: 'sample-technova-workshop',
    type: 'workshop',
    date: '2026-12-05',
    city: 'Ghaziabad',
    venue: '[PLACEHOLDER] school',
    description:
      'Sample event. A hands-on session showing how TechNova lab sessions and worksheets fit a school computer period.',
    image: null,
    registerUrl: null,
    isPlaceholder: true,
  },
  {
    title: 'Book fair stall [PLACEHOLDER]',
    slug: 'sample-book-fair',
    type: 'fair',
    date: '2026-09-19',
    city: 'Delhi NCR',
    venue: '[PLACEHOLDER] fair',
    description:
      'Sample past event. The Elara Universe stall at a regional book fair, with all three series on display.',
    image: '/illustrations/event-placeholder.svg',
    registerUrl: null,
    isPlaceholder: true,
  },
]
