import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { BookCard } from '@/components/book/book-card'
import { Flipbook } from '@/components/book/flipbook'
import { TiltCover } from '@/components/book/tilt-cover'
import { NotebookCard } from '@/components/classroom/notebook-card'
import { Pencil } from '@/components/classroom/pencil'
import { ReportBadge } from '@/components/classroom/report-badge'
import { WoodFrame } from '@/components/classroom/wood-frame'
import { Main } from '@/components/frame/main'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'
import { buttonClass } from '@/components/ui/button-class'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { StickyNote } from '@/components/ui/sticky-note'
import { Tag } from '@/components/ui/tag'
import { bookBySlug, books, formatMrp } from '@/content/books'
import { subjectLabel } from '@/content/series'
import { site, whatsappLink } from '@/content/site'
import { cn } from '@/lib/cn'

type Props = { params: Promise<{ slug: string }> }

// Every book is prerendered; an unknown slug is a 404 (on a server build dynamicParams would
// otherwise render it on demand).
export const dynamicParams = false
export const generateStaticParams = () => books.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = bookBySlug((await params).slug)
  if (!book) return {}
  return {
    title: book.title,
    description: `${book.title} by ${site.shortName}. ${book.description ?? site.tagline}`,
  }
}

/** A ruled notebook page: a hand-written heading and a leaf-ticked list on the 32px lines. */
const Checklist = ({ title, items, wide }: { title: string; items: string[]; wide?: boolean }) =>
  items.length ? (
    <NotebookCard title={title} titleAs="h2">
      <ul className={cn('mt-8 grid gap-x-6', wide && 'sm:grid-cols-2')}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check aria-hidden size={20} className="mt-1.5 shrink-0 text-leaf-700" />
            {item}
          </li>
        ))}
      </ul>
    </NotebookCard>
  ) : null

export default async function BookPage({ params }: Props) {
  const book = bookBySlug((await params).slug)
  if (!book) notFound()
  const details = [
    ['Class', String(book.class)],
    ['Pages', book.pages && String(book.pages)],
    ['Size', book.size],
    ['ISBN', book.isbn],
    ['MRP', book.mrp && formatMrp(book.mrp)],
    ['Edition', book.edition],
    ['Curriculum', site.curriculum],
  ].filter((row): row is [string, string] => Boolean(row[1]))
  const hasLists = book.features.length + book.support.length > 0
  const siblings = books.filter((b) => b.series === book.series && b.slug !== book.slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    ...(book.titleHindi && { alternateName: book.titleHindi }),
    ...(book.isbn && { isbn: book.isbn }),
    ...(book.pages && { numberOfPages: book.pages }),
    ...(book.edition && { bookEdition: book.edition }),
    ...(book.cover && { image: `${site.url}${book.cover}` }),
    inLanguage: book.subject === 'hindi' ? 'hi' : 'en',
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    ...(book.mrp && { offers: { '@type': 'Offer', price: book.mrp, priceCurrency: 'INR' } }),
  }

  return (
    <Main>
      <Section className="grid gap-10 py-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-12 md:py-16">
        <script
          type="application/ld+json"
          // `<` escaped as in the Next.js JSON-LD guide (node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <Glass radius="lg" className="max-w-sm p-6 md:p-8">
          <TiltCover book={book} />
          {book.mrp && (
            <p className="mt-4 font-heading font-semibold text-forest">{formatMrp(book.mrp)}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href={`/contact?book=${book.slug}`}>Request a sample copy</Button>
            <a
              href={whatsappLink(`Hello ${site.shortName}, I have a question about ${book.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('secondary')}
            >
              Ask on WhatsApp
            </a>
          </div>
        </Glass>
        <div>
          <Tag tone={book.subject}>{subjectLabel[book.subject]}</Tag>
          <SectionHeading
            as="h1"
            className="mt-4"
            title={book.series}
            accent={`Class ${book.class}`}
            crayon={book.subject}
          />
          {book.titleHindi && (
            <p lang="hi" className="mt-2 font-devanagari text-h3 font-semibold text-forest">
              {book.titleHindi}
            </p>
          )}
          {book.description && <p className="mt-4 max-w-prose">{book.description}</p>}
          <div className="mt-8 flex flex-wrap gap-4">
            <ReportBadge label="Class" value={String(book.class)} tone="brass" />
            <ReportBadge label="NEP 2020" value="Aligned" />
          </div>
        </div>
      </Section>

      <Section tone="paper" className="py-12 md:py-16">
        {/* [PLACEHOLDER] wording of the eyebrow and of the sticky note */}
        <SectionHeading eyebrow="Sample pages" title="Peek" accent="inside" crayon={book.subject} />
        {book.samples.length ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:items-start">
            <Glass radius="lg" spotlight={false} className="p-4 sm:p-8">
              <Flipbook pages={book.samples} title={book.title} />
            </Glass>
            <StickyNote
              tone={book.subject}
              tilt="rotate-2"
              title="Turn the pages"
              className="max-w-xs lg:mt-8"
            >
              Tap or drag a page corner, use the arrows, or press the arrow keys once the book has
              focus. The page-turn sound stays off until you switch it on.
            </StickyNote>
          </div>
        ) : (
          <NotebookCard className="mt-8 max-w-xl">
            <div className="flex items-end justify-between gap-6">
              <p className="font-hand text-2xl text-forest">Sample pages coming soon.</p>
              <Elu pose="read" className="w-24 shrink-0" />
            </div>
          </NotebookCard>
        )}
      </Section>

      {hasLists && (
        <Section
          tone="cream"
          className="grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
        >
          <Checklist title="What's inside" items={book.features} wide />
          <Checklist title="Comes with" items={book.support} />
        </Section>
      )}

      <Section className="grid gap-8 py-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 md:py-16">
        <div>
          {/* [PLACEHOLDER] wording of the eyebrow */}
          <SectionHeading eyebrow="Report card" title="Details" />
          <Pencil className="mt-8 hidden w-48 md:block" tilt={-6} />
        </div>
        <WoodFrame className="max-w-xl">
          <table className="w-full border-collapse bg-cream text-left">
            <tbody>
              {details.map(([label, value]) => (
                <tr key={label} className="border-b border-sage-100 last:border-0">
                  <th scope="row" className="px-4 py-2 align-baseline eyebrow whitespace-nowrap">
                    {label}
                  </th>
                  <td className="w-full px-4 py-2 align-baseline font-bold">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </WoodFrame>
      </Section>

      <Section tone="mint" className="py-12 md:py-16">
        <SectionHeading
          eyebrow={book.series}
          title="More from this"
          accent="series"
          crayon={book.subject}
        />
        <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
          {siblings.map((b) => (
            <li key={b.slug}>
              <BookCard book={b} />
            </li>
          ))}
        </ul>
      </Section>
    </Main>
  )
}
