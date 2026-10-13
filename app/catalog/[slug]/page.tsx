import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { bookBySlug, books } from '@/content/books'
import { subjectLabel } from '@/content/series'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => books.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = bookBySlug((await params).slug)
  return { title: book?.title ?? 'Book' }
}

// Minimal book page; Phase 7 adds the tilting cover, flipbook, details and series shelf.
export default async function BookPage({ params }: Props) {
  const book = bookBySlug((await params).slug)
  if (!book) notFound()
  return (
    <Main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <Tag tone={book.subject}>{subjectLabel[book.subject]}</Tag>
      <h1 className="mt-3">{book.title}</h1>
      {book.titleHindi && (
        <p className="font-devanagari text-h3 font-semibold text-forest">{book.titleHindi}</p>
      )}
      <div className={`mt-8 w-56 ${coverBoxClass}`}>
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`${book.title} cover`}
            width={773}
            height={1000}
            className="h-full w-full object-cover"
          />
        ) : (
          <CoverPlaceholder series={book.series} cls={book.class} subject={book.subject} />
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href={`/contact?book=${book.slug}`}>Request a sample copy</Button>
        <Button href="/catalog" variant="secondary">
          Back to the catalog
        </Button>
      </div>
    </Main>
  )
}
