import { BookGrid } from '@/components/portal/book-grid'
import { TitlePicker } from '@/components/portal/title-picker'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import type { Profile } from '@/lib/data/types'
import { pickTitle } from '@/lib/portal'

/** "My books": select your title (subject → series, kept in the URL), then that series' books
 *  for the classes this account may see. */
export function MyBooks({
  session,
  query,
}: {
  session: Profile
  query: { subject?: string; series?: string }
}) {
  const title = pickTitle(session, query)
  const empty = !title || !title.books.length
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Web Support · My books"
        title={`Hello, ${session.name || session.email}`}
        crayon="computer"
      />
      {empty ? (
        <Glass radius="lg" className="mt-8 p-6 md:p-8" data-testid="no-books">
          <p>
            No books are assigned to your account yet. Write to us with your classes and subjects
            and we will add them.
          </p>
          <Button href="/contact" variant="secondary" className="mt-6">
            Write to us
          </Button>
        </Glass>
      ) : (
        <>
          <Glass radius="lg" spotlight={false} className="mt-8 p-6 md:p-8">
            <h2 className="text-h3">Select your title</h2>
            <div className="mt-6">
              <TitlePicker
                subjects={title.subjects}
                subject={title.subject}
                series={title.series.slug}
              />
            </div>
          </Glass>
          <h2 className="mt-10 text-h3">
            {title.series.name}
            {title.series.nameHindi && (
              <span lang="hi" className="ml-3 font-devanagari text-lg font-semibold text-forest">
                {title.series.nameHindi}
              </span>
            )}
          </h2>
          <div className="mt-6">
            <BookGrid books={title.books} seriesName={title.series.name} />
          </div>
        </>
      )}
    </>
  )
}
