import type { Metadata } from 'next'
import { FilePlus2 } from 'lucide-react'
import { PortalShell } from '@/components/portal/portal-shell'
import { SavedTestCard } from '@/components/portal/saved-test-card'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import { requireSession } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'

export const metadata: Metadata = { title: 'My tests', robots: { index: false } }

/** The signed-in teacher's saved papers, newest first (never anyone else's). */
export default async function MyTestsPage() {
  const session = await requireSession('/web-support/tests')
  const tests = await (await getStore()).listTests(session.id)
  return (
    <PortalShell session={session}>
      <SectionHeading as="h1" eyebrow="Web Support" title="My" accent="tests" crayon="leaf" />
      <Button href="/web-support/test-maker" className="mt-6">
        <FilePlus2 aria-hidden size={18} /> New test paper
      </Button>
      {tests.length ? (
        <ul className="mt-8 grid gap-4 lg:grid-cols-2" data-testid="saved-tests">
          {tests.map((test) => (
            <li key={test.id}>
              <SavedTestCard test={test} />
            </li>
          ))}
        </ul>
      ) : (
        <Glass radius="lg" className="mt-8 p-6 md:p-8">
          <p>No saved tests yet. Make one from a book in My books or with “New test paper”.</p>
        </Glass>
      )}
    </PortalShell>
  )
}
