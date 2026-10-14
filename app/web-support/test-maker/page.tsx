import type { Metadata } from 'next'
import { PortalShell } from '@/components/portal/portal-shell'
import { SectionHeading } from '@/components/ui/section-heading'
import { requireSession } from '@/lib/auth/session'

export const metadata: Metadata = { title: 'Test Maker', robots: { index: false } }

/** Step I builds the Test Maker here; Step G only needs the protected address. */
export default async function TestMakerPage() {
  const session = await requireSession('/web-support/test-maker')
  return (
    <PortalShell session={session}>
      <SectionHeading as="h1" eyebrow="Web Support" title="Test" accent="Maker" crayon="leaf" />
    </PortalShell>
  )
}
