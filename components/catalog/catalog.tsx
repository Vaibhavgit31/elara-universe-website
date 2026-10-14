'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useSyncExternalStore } from 'react'
import { BookCard } from '@/components/book/book-card'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { books, type Book } from '@/content/books'
import { series, subjectLabel, type Series, type Subject } from '@/content/series'
import { splitAccent } from '@/lib/accent'
import { cn } from '@/lib/cn'

const subjects = ['all', ...series.map((s) => s.subject)] as const
const classes = ['all', '1', '2', '3', '4', '5', '6', '7', '8'] as const
const EVENT = 'catalog:filter'
/** Shelf bands alternate between the two light tones, like the book rooms on the home page. */
const tones = ['paper', 'mint'] as const

// Filters live in the URL (?subject=hindi&class=3) so a teacher can share a filtered link.
// The full catalog is in the HTML; the filter applies as soon as the page is interactive.
const subscribe = (notify: () => void) => {
  for (const e of ['popstate', EVENT]) window.addEventListener(e, notify)
  return () => {
    for (const e of ['popstate', EVENT]) window.removeEventListener(e, notify)
  }
}
const useSearch = () =>
  useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => '',
  )

function setParam(key: string, value: string) {
  const next = new URLSearchParams(window.location.search)
  if (value === 'all') next.delete(key)
  else next.set(key, value)
  const query = next.toString()
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
  window.dispatchEvent(new Event(EVENT))
}

/** One row of filter chips, in the style of the class picker on the home page. */
function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
  render,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  render: (v: T) => string
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={cn(
              'focus-glow stamp inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 font-heading text-lg font-bold transition-colors duration-200',
              option === value ? 'bg-leaf-700 text-white' : 'glass text-forest hover:bg-white/70',
            )}
          >
            {render(option)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/** An empty shelf: Elu searches it, and one button clears both filters. */
const EmptyShelf = () => (
  <Glass radius="lg" className="flex items-center gap-8 p-6 md:p-8">
    <Elu pose="search" label="Elu searching the shelf" className="w-24 shrink-0 sm:w-32" />
    <div className="min-w-0 flex-1">
      <p className="font-hand text-2xl text-forest">Nothing on this shelf yet.</p>
      <Button
        variant="secondary"
        className="mt-4"
        onClick={() => {
          setParam('subject', 'all')
          setParam('class', 'all')
        }}
      >
        Show all books
      </Button>
    </div>
  </Glass>
)

/** One series on its shelf: heading, names and tagline on the left, the blurb on the right,
 *  then the books on a brass rail. */
function Shelf({ s, shelf }: { s: Series; shelf: Book[] }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <div>
          {/* [PLACEHOLDER] wording of the eyebrow */}
          <SectionHeading
            eyebrow={`${subjectLabel[s.subject]} shelf`}
            {...splitAccent(s.name)}
            crayon={s.subject}
          />
          {s.nameHindi && (
            <p lang="hi" className="mt-2 font-devanagari text-h3 font-semibold text-forest">
              {s.nameHindi}
            </p>
          )}
          <p className="mt-2 font-hand text-2xl text-forest">{s.tagline}</p>
        </div>
        <p className="max-w-sm text-small text-forest">{s.blurb}</p>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        <AnimatePresence initial={false}>
          {shelf.map((book) => (
            <m.li
              key={book.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
            >
              <BookCard book={book} />
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
      <div aria-hidden className="mt-4 h-1 rounded-full bg-brass/80 shadow-page" />
    </>
  )
}

export function Catalog() {
  const params = new URLSearchParams(useSearch())
  const subject = (subjects as readonly string[]).includes(params.get('subject') ?? '')
    ? (params.get('subject') as Subject)
    : 'all'
  const cls = (classes as readonly string[]).includes(params.get('class') ?? '')
    ? (params.get('class') as (typeof classes)[number])
    : 'all'
  const visible = books.filter(
    (b) =>
      (subject === 'all' || b.subject === subject) && (cls === 'all' || b.class === Number(cls)),
  )
  const shelves = series.filter((s) => visible.some((b) => b.subject === s.subject))

  return (
    <>
      <Section className="py-8 md:py-12">
        <Glass
          radius="lg"
          role="group"
          aria-label="Filters"
          className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 p-6 md:p-8"
        >
          <div className="flex min-w-0 flex-col gap-6">
            <Chips
              label="Subject"
              options={subjects}
              value={subject}
              onChange={(v) => setParam('subject', v)}
              render={(v) => (v === 'all' ? 'All subjects' : subjectLabel[v])}
            />
            <Chips
              label="Class"
              options={classes}
              value={cls}
              onChange={(v) => setParam('class', v)}
              render={(v) => (v === 'all' ? 'All classes' : v)}
            />
          </div>
          <p className="text-small font-semibold text-forest" aria-live="polite">
            {visible.length} of {books.length} books
          </p>
        </Glass>
      </Section>
      {shelves.length === 0 && (
        <Section className="pb-12">
          <EmptyShelf />
        </Section>
      )}
      {shelves.map((s, i) => (
        <Section
          key={s.id}
          id={`shelf-${s.id}`}
          tone={tones[i % tones.length]}
          className="py-12 md:py-16"
        >
          <Shelf s={s} shelf={visible.filter((b) => b.subject === s.subject)} />
        </Section>
      ))}
    </>
  )
}
