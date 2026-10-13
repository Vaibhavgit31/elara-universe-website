'use client'

import Image from 'next/image'
import { AnimatePresence, m } from 'framer-motion'
import { useState } from 'react'
import { Tag } from '@/components/ui/tag'
import { TurnLink } from '@/components/ui/turn-link'
import { series, subjectLabel } from '@/content/series'

/** A tiny two-page peek that pops up above a book. */
const Peek = ({ pages, name }: { pages: string[]; name: string }) => (
  <m.div
    role="dialog"
    aria-label={`Peek inside ${name}`}
    className="absolute bottom-full left-1/2 z-30 mb-3 flex w-44 origin-bottom -translate-x-1/2 gap-0.5 rounded bg-paper p-1.5 shadow-lift sm:w-56"
    initial={{ opacity: 0, scale: 0.6, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 8 }}
    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
  >
    {pages.length ? (
      pages.map((src) => (
        <Image key={src} src={src} alt="" width={160} height={210} className="w-1/2 rounded-sm" />
      ))
    ) : (
      <p className="w-full p-3 text-center font-hand text-lg text-forest">
        Sample pages coming soon
      </p>
    )}
  </m.div>
)

// Three series standing on a wooden-and-sage shelf. Hover (or the Peek button) opens a two-page
// peek; the cover itself links to the catalog filtered by subject.
export function SubjectShelf() {
  const [peek, setPeek] = useState<string | null>(null)
  return (
    <div className="relative mt-10">
      <ul className="grid grid-cols-3 items-end gap-3 px-2 sm:gap-10 sm:px-8">
        {series.map((s) => (
          <li key={s.id} className="relative flex flex-col items-center">
            <m.div
              className="relative w-full max-w-[200px]"
              whileHover={{ y: -14, rotate: [0, -2.5, 2.5, -1.5, 0] }}
              whileTap={{ y: -30, rotate: -6 }}
              onHoverStart={() => setPeek(s.id)}
              onHoverEnd={() => setPeek(null)}
            >
              <AnimatePresence>
                {peek === s.id && <Peek pages={s.peek} name={s.name} />}
              </AnimatePresence>
              <TurnLink
                href={`/catalog?subject=${s.subject}`}
                aria-label={`${s.name}: see the books`}
                className="block rounded-sm"
              >
                <Image
                  src={s.thumb}
                  alt={`${s.name} cover`}
                  width={309}
                  height={400}
                  className="w-full rounded-r-sm border-l-4 border-evergreen/80 shadow-lift"
                />
              </TurnLink>
            </m.div>
            <button
              type="button"
              aria-expanded={peek === s.id}
              onClick={() => setPeek(peek === s.id ? null : s.id)}
              className="mt-3 min-h-11 rounded-full px-3 font-hand text-lg text-forest underline decoration-brass underline-offset-4"
            >
              {peek === s.id ? 'Close' : 'Peek'}
            </button>
          </li>
        ))}
      </ul>
      <div
        aria-hidden
        className="mx-2 h-4 rounded-sm bg-gradient-to-b from-brass to-gold-ink shadow-page sm:mx-8"
      />
      <div aria-hidden className="mx-4 h-2 rounded-b bg-sage sm:mx-10" />
      <ul className="mt-8 grid gap-6 sm:grid-cols-3">
        {series.map((s) => (
          <li key={s.id}>
            <Tag tone={s.subject}>{subjectLabel[s.subject]}</Tag>
            <h3 className="mt-2">
              {s.name}
              {s.nameHindi && (
                <span className="block font-devanagari text-lg font-semibold text-forest">
                  {s.nameHindi}
                </span>
              )}
            </h3>
            <p className="mt-1 text-small">{s.blurb}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
