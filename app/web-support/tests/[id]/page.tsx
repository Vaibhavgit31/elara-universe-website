import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { PortalShell } from '@/components/portal/portal-shell'
import { TestMaker } from '@/components/test-maker/test-maker'
import { SectionHeading } from '@/components/ui/section-heading'
import { bookBySlug, books } from '@/content/books'
import { aiConfigured } from '@/lib/ai/xai'
import { requireSession } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'
import { canSeeBook } from '@/lib/portal'
import { withDefaults } from '@/lib/test-maker/defaults'
import { sectionSchema, settingsSchema } from '@/lib/test-maker/types'

export const metadata: Metadata = { title: 'Saved test', robots: { index: false } }

type Props = { params: Promise<{ id: string }> }

/** A saved paper, opened in the Test Maker. Only its owner can open it: another teacher's id is
 *  a 404, never a peek. A paper whose stored JSON no longer fits starts again from its book. */
export default async function SavedTestPage({ params }: Props) {
  const { id } = await params
  const session = await requireSession(`/web-support/tests/${id}`)
  const test = await (await getStore()).getTest(id, session.id)
  const book = test && bookBySlug(test.bookSlug)
  if (!test || !book) notFound()
  const settings = settingsSchema.safeParse(test.settings)
  const sections = z.array(sectionSchema).safeParse(test.questions)
  const mine = books.filter((b) => canSeeBook(session, b))
  return (
    <PortalShell session={session}>
      <SectionHeading as="h1" eyebrow="My tests" title={test.title} className="print:hidden" />
      <div className="mt-8">
        <TestMaker
          books={mine.some((b) => b.slug === book.slug) ? mine : [book, ...mine]}
          mock={!aiConfigured}
          initial={{
            id: test.id,
            title: test.title,
            settings: settings.success
              ? settings.data
              : withDefaults(book, { schoolName: session.school }),
            sections: settings.success && sections.success ? sections.data : [],
          }}
        />
      </div>
    </PortalShell>
  )
}
