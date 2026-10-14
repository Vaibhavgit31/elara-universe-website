import type { Metadata } from 'next'
import { PortalShell } from '@/components/portal/portal-shell'
import { TestMaker } from '@/components/test-maker/test-maker'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import { books } from '@/content/books'
import { aiConfigured } from '@/lib/ai/xai'
import { requireSession } from '@/lib/auth/session'
import { canSeeBook } from '@/lib/portal'
import { withDefaults } from '@/lib/test-maker/defaults'

export const metadata: Metadata = { title: 'Test Maker', robots: { index: false } }

type Props = { searchParams: Promise<{ book?: string }> }

/** A new paper; "Generate Test Paper" on a book card arrives with ?book=<slug>. */
export default async function TestMakerPage({ searchParams }: Props) {
  const session = await requireSession('/web-support/test-maker')
  const { book: wanted } = await searchParams
  const mine = books.filter((b) => canSeeBook(session, b))
  const book = mine.find((b) => b.slug === wanted) ?? mine[0]
  return (
    <PortalShell session={session}>
      <SectionHeading
        as="h1"
        eyebrow="Web Support"
        title="Test"
        accent="Maker"
        crayon="leaf"
        className="print:hidden"
        lead="Pick the class, book and chapters, let the AI draft each section, check every question, then print or download the paper."
      />
      <div className="mt-8">
        {book ? (
          <TestMaker
            books={mine}
            mock={!aiConfigured}
            initial={{
              title: '',
              settings: withDefaults(book, { schoolName: session.school }),
              sections: [],
            }}
          />
        ) : (
          <Glass radius="lg" className="p-6 md:p-8">
            <p>
              No books are assigned to your account yet, so there is nothing to make a paper from.
            </p>
            <Button href="/contact" variant="secondary" className="mt-6">
              Write to us
            </Button>
          </Glass>
        )}
      </div>
    </PortalShell>
  )
}
