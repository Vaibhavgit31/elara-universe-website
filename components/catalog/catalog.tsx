'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useSyncExternalStore } from 'react'
import { BookCard } from '@/components/book/book-card'
import { Elu } from '@/components/mascot/elu'
import { StickerPop } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { books } from '@/content/books'
import { series, subjectLabel, type Subject } from '@/content/series'
import { cn } from '@/lib/cn'

const subjects = ['all', ...series.map((s) => s.subject)] as const
const classes = ['all', '1', '2', '3', '4', '5', '6', '7', '8'] as const
const EVENT = 'catalog:filter'

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

/** Sticky-note filter tabs. */
function Tabs<T extends string>({
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
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="float-left mr-3 w-full eyebrow sm:w-auto">{label}</legend>
      {options.map((option, i) => {
        const active = option === value
        return (
          <StickerPop key={option} delay={i * 0.04} className="inline-block">
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={cn(
                'min-h-11 min-w-11 px-3 py-2 text-small font-bold shadow-page transition-transform hover:-translate-y-0.5',
                i % 2 ? 'rotate-1' : '-rotate-1',
                active ? 'bg-brass text-evergreen' : 'bg-hindi-tint text-forest',
              )}
            >
              {render(option)}
            </button>
          </StickerPop>
        )
      })}
    </fieldset>
  )
}

const EmptyShelf = () => (
  <div className="rounded-xl bg-mist p-10 text-center">
    <svg viewBox="0 0 200 90" className="mx-auto w-48" aria-hidden>
      <rect x="10" y="60" width="180" height="10" rx="2" fill="#B68235" />
      <rect x="16" y="70" width="168" height="5" rx="2" fill="#8A9A74" />
      <path
        d="M70 52c10-24 50-24 60 0"
        fill="none"
        stroke="#8A9A74"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="5 6"
      />
      <text
        x="100"
        y="40"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="22"
        fill="#8A9A74"
      >
        ?
      </text>
    </svg>
    <Elu pose="search" label="Elu searching the shelf" className="mx-auto mt-2 w-24" />
    <p className="mt-2 font-hand text-2xl text-forest">Nothing on this shelf yet.</p>
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
)

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
    <div className="space-y-10">
      <div className="space-y-5 rounded-xl bg-cream p-5 shadow-page sm:p-6" aria-label="Filters">
        <Tabs
          label="Subject"
          options={subjects}
          value={subject}
          onChange={(v) => setParam('subject', v)}
          render={(v) => (v === 'all' ? 'All subjects' : subjectLabel[v as Subject])}
        />
        <Tabs
          label="Class"
          options={classes}
          value={cls}
          onChange={(v) => setParam('class', v)}
          render={(v) => (v === 'all' ? 'All classes' : v)}
        />
        <p className="text-small text-forest" aria-live="polite">
          {visible.length} of {books.length} books
        </p>
      </div>
      {shelves.length === 0 && <EmptyShelf />}
      {shelves.map((s) => (
        <section key={s.id} aria-labelledby={`shelf-${s.id}`}>
          <h2 id={`shelf-${s.id}`} className="mb-4 flex flex-wrap items-baseline gap-x-3">
            {s.name}
            {s.nameHindi && (
              <span className="font-devanagari text-h3 font-semibold text-forest">
                {s.nameHindi}
              </span>
            )}
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            <AnimatePresence initial={false}>
              {visible
                .filter((b) => b.subject === s.subject)
                .map((book) => (
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
        </section>
      ))}
    </div>
  )
}
