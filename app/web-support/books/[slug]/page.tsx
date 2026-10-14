import type { Metadata } from 'next'
import { ArrowLeft, PenLine } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import { PortalShell } from '@/components/portal/portal-shell'
import { ResourceTabs } from '@/components/portal/resource-tabs'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/tag'
import { bookBySlug } from '@/content/books'
import { subjectLabel } from '@/content/series'
import { requireSession } from '@/lib/auth/session'
import { canSeeBook, seriesOfBook, titleHref } from '@/lib/portal'

export const metadata: Metadata = { title: 'Learning resources', robots: { index: false } }

type Props = { params: Promise<{ slug: string }> }

/** One book's learning resources, for accounts that teach it (others get a 404). */
export default async function BookResourcesPage({ params }: Props) {
  const { slug } = await params
  const session = await requireSession(`/web-support/books/${slug}`)
  const book = bookBySlug(slug)
  if (!book || !canSeeBook(session, book)) notFound()
  return (
    <PortalShell session={session}>
      <div className="grid items-start gap-6 sm:grid-cols-[8rem_minmax(0,1fr)] md:gap-8">
        <div className={`w-32 border-l-[3px] border-evergreen/80 ${coverBoxClass}`}>
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
        </div>
        <div className="min-w-0">
          <Tag tone={book.subject}>{subjectLabel[book.subject]}</Tag>
          <SectionHeading
            as="h1"
            eyebrow="Learning resources"
            title={book.series}
            accent={`(Class ${book.class})`}
            crayon={book.subject}
            className="mt-3"
          />
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href={`/web-support/test-maker?book=${book.slug}`}>
              <PenLine aria-hidden size={18} /> Generate Test Paper
            </Button>
            <Button href={titleHref(seriesOfBook(book))} variant="ghost">
              <ArrowLeft aria-hidden size={18} /> My books
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <ResourceTabs book={book} />
      </div>
    </PortalShell>
  )
}
