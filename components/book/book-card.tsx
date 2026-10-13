'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import { StickerPop } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { TurnLink } from '@/components/ui/turn-link'
import { formatMrp, type Book } from '@/content/books'
import { subjectLabel } from '@/content/series'

/** A book standing on its own piece of shelf; neighbours join into one continuous shelf. */
export function BookCard({ book }: { book: Book }) {
  const href = `/catalog/${book.slug}`
  return (
    <article className="flex h-full flex-col" data-testid="book-card">
      <motion.div
        className="px-2 pt-4 sm:px-3"
        whileHover={{ y: -12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
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
      </motion.div>
      <div aria-hidden className="h-3 bg-gradient-to-b from-brass to-gold-ink" />
      <div aria-hidden className="mx-1 h-1.5 rounded-b bg-sage" />
      <div className="flex flex-1 flex-col gap-2 px-2 pt-4 pb-2 sm:px-3">
        <Tag tone={book.subject} className="self-start">
          {subjectLabel[book.subject]}
        </Tag>
        <h3 className="text-base leading-snug">
          {book.series}
          <StickerPop className="block origin-left eyebrow">Class {book.class}</StickerPop>
        </h3>
        <p className="mt-auto text-small font-semibold text-forest">
          {book.mrp ? (
            formatMrp(book.mrp)
          ) : (
            <TurnLink href={`/contact?book=${book.slug}`} className="link">
              Request a sample copy
            </TurnLink>
          )}
        </p>
        <Button href={href} variant="secondary" className="min-h-10 px-4 py-1.5 text-small">
          Peek inside
        </Button>
      </div>
    </article>
  )
}
