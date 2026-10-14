'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import { TurnLink } from '@/components/ui/turn-link'
import { formatMrp, type Book } from '@/content/books'
import { subjectLabel } from '@/content/series'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** A book on a glass card: the cover (a link), its subject tag, class, price or sample-copy link
 *  and "Peek inside". The card lifts a little on hover and stays put with reduced motion. */
export function BookCard({ book }: { book: Book }) {
  const href = `/catalog/${book.slug}`
  const reduced = useReducedMotion()
  return (
    <m.article
      data-testid="book-card"
      className="h-full"
      whileHover={reduced ? undefined : { y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Glass className="flex h-full flex-col gap-2 p-2">
        <TurnLink
          href={href}
          aria-label={`${book.title}: peek inside`}
          className={`block border-l-[3px] border-evergreen/80 ${coverBoxClass}`}
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
            <CoverPlaceholder series={book.series} cls={book.class} subject={book.subject} />
          )}
        </TurnLink>
        <Tag tone={book.subject} className="self-start">
          {subjectLabel[book.subject]}
        </Tag>
        <p className="eyebrow">Class {book.class}</p>
        <p className="mt-auto text-small leading-8 font-semibold text-forest">
          {book.mrp ? (
            formatMrp(book.mrp)
          ) : (
            // py-1.5 with -my-1.5 gives a 44px tap target without changing the line height.
            <TurnLink
              href={`/contact?book=${book.slug}`}
              className="link -my-1.5 inline-block py-1.5"
            >
              Request a sample copy
            </TurnLink>
          )}
        </p>
        <Button href={href} variant="secondary" className="w-full px-2 text-small">
          Peek inside
        </Button>
      </Glass>
    </m.article>
  )
}
