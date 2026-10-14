import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortalShell } from '@/components/portal/portal-shell'
import { SectionHeading } from '@/components/ui/section-heading'
import { Glass } from '@/components/ui/glass'
import { requireSession } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'

export const metadata: Metadata = { title: 'Saved test', robots: { index: false } }

type Props = { params: Promise<{ id: string }> }

/** A saved paper. Only its owner can open it: another teacher's id is a 404, never a peek. */
export default async function SavedTestPage({ params }: Props) {
  const { id } = await params
  const session = await requireSession(`/web-support/tests/${id}`)
  const test = await (await getStore()).getTest(id, session.id)
  if (!test) notFound()
  return (
    <PortalShell session={session}>
      <SectionHeading as="h1" eyebrow="My tests" title={test.title} />
      <Glass radius="lg" className="mt-8 p-6">
        <p>Class {test.class}</p>
      </Glass>
    </PortalShell>
  )
}
