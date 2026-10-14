'use client'

import { m } from 'framer-motion'
import { BookOpenText, PenLine } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import type { Book } from '@/content/books'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** One glass card per class: the cover, "<Series> (Class n)", Learning Resources and Generate
 *  Test Paper. Cards lift on hover; when the series changes the covers turn in like a page. */
export function BookGrid({ books, seriesName }: { books: Book[]; seriesName: string }) {
  const reduced = useReducedMotion()
  // Covers flip only after the series changes in the browser, never on the first paint
  // (React's "storing information from previous renders" pattern).
  const [shown, setShown] = useState(seriesName)
  const [flip, setFlip] = useState(false)
  if (shown !== seriesName) {
    setShown(seriesName)
    setFlip(!reduced)
  }
  return (
    // Sized by the space the portal column really has (container queries): one card per row with
    // the cover beside the title when narrow, then two and three cards with the cover on top.
    <div className="@container/grid">
      <ul
        className="grid grid-cols-1 gap-4 @xl/grid:grid-cols-2 @xl/grid:gap-6 @3xl/grid:grid-cols-3"
        data-testid="book-grid"
      >
        {books.map((book, i) => (
          <li key={book.slug}>
            <m.article
              data-testid="portal-book"
              className="h-full"
              whileHover={reduced ? undefined : { y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Glass className="grid h-full grid-cols-[5rem_minmax(0,1fr)] items-start gap-4 p-3 @xl/grid:grid-cols-1 @xl/grid:gap-3 @xl/grid:p-4">
                <div style={{ perspective: '900px' }}>
                  <m.div
                    key={book.slug}
                    initial={flip ? { rotateY: -90, opacity: 0 } : false}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                    style={{ transformOrigin: 'left center' }}
                    className={`border-l-[3px] border-evergreen/80 ${coverBoxClass}`}
                  >
                    {book.thumb ? (
                      <Image
                        src={book.thumb}
                        alt={`${book.title} cover`}
                        width={309}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <CoverPlaceholder
                        series={book.series}
                        cls={book.class}
                        subject={book.subject}
                      />
                    )}
                  </m.div>
                </div>
                <div className="flex h-full flex-col gap-3">
                  <h3 className="text-lg leading-snug">
                    {book.series} (Class {book.class})
                  </h3>
                  <div className="mt-auto flex flex-col gap-2">
                    <Button
                      href={`/web-support/books/${book.slug}`}
                      variant="secondary"
                      className="w-full px-3 text-small"
                    >
                      <BookOpenText aria-hidden size={18} /> Learning Resources
                      <span className="sr-only"> for {book.title}</span>
                    </Button>
                    <Button
                      href={`/web-support/test-maker?book=${book.slug}`}
                      className="w-full px-3 text-small"
                    >
                      <PenLine aria-hidden size={18} /> Generate Test Paper
                      <span className="sr-only"> for {book.title}</span>
                    </Button>
                  </div>
                </div>
              </Glass>
            </m.article>
          </li>
        ))}
      </ul>
    </div>
  )
}
