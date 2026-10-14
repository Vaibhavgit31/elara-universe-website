import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookCard } from '@/components/book/book-card'
import { Flipbook } from '@/components/book/flipbook'
import { TiltCover } from '@/components/book/tilt-cover'
import { Main } from '@/components/frame/main'
import { Section } from '@/components/ui/section'
import { Button, buttonClass } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { bookBySlug, books, formatMrp } from '@/content/books'
import { subjectLabel } from '@/content/series'
import { site, whatsappLink } from '@/content/site'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => books.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = bookBySlug((await params).slug)
  if (!book) return {}
  return {
    title: book.title,
    description: `${book.title} by ${site.shortName}. ${book.description ?? site.tagline}`,
  }
}

const List = ({ title, items }: { title: string; items: string[] }) =>
  items.length ? (
    <section>
      <h2 className="text-h3">{title}</h2>
      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-brass" />
            {item}
          </li>
        ))}
      </ul>
    </section>
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
      <Section className="py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <TiltCover book={book} />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={`/contact?book=${book.slug}`}>Request a sample copy</Button>
              <a
                href={whatsappLink(
                  `Hello ${site.shortName}, I have a question about ${book.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('secondary')}
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
          <div className="space-y-10">
            <header>
              <Tag tone={book.subject}>{subjectLabel[book.subject]}</Tag>
              <h1 className="mt-3">{book.title}</h1>
              {book.titleHindi && (
                <p className="font-devanagari text-h3 font-semibold text-forest">
                  {book.titleHindi}
                </p>
              )}
              {book.description && <p className="mt-4 max-w-prose">{book.description}</p>}
            </header>
            <section>
              <h2 className="text-h3">Peek inside</h2>
              {book.samples.length ? (
                <Flipbook pages={book.samples} title={book.title} className="mt-4" />
              ) : (
                <p className="mt-3 rounded-xl bg-mist p-6 font-hand text-2xl text-forest">
                  Sample pages coming soon.
                </p>
              )}
            </section>
            <List title="What's inside" items={book.features} />
            <List title="Comes with" items={book.support} />
            <section>
              <h2 className="text-h3">Details</h2>
              <table className="mt-3 w-full max-w-md border-collapse text-small">
                <tbody>
                  {details.map(([label, value]) => (
                    <tr key={label} className="border-b border-sage-100">
                      <th scope="row" className="py-2 pr-4 text-left font-bold text-forest">
                        {label}
                      </th>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
        <section className="mt-16">
          <h2>More from this series</h2>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
            {siblings.map((b) => (
              <li key={b.slug}>
                <BookCard book={b} />
              </li>
            ))}
          </ul>
        </section>
      </Section>
    </Main>
  )
}
