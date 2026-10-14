import type { Metadata } from 'next'
import { KeyRound } from 'lucide-react'
import { PortalShell } from '@/components/portal/portal-shell'
import { ProfileForm } from '@/components/portal/profile-form'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import { subjectLabel } from '@/content/series'
import { requireSession } from '@/lib/auth/session'
import { classesFor, subjectsFor } from '@/lib/portal'

export const metadata: Metadata = { title: 'Profile', robots: { index: false } }

/** The signed-in person's details: contact fields to edit, access as granted by the admins. */
export default async function ProfilePage() {
  const session = await requireSession('/web-support/profile')
  const access = [
    ['Email', session.email],
    ['Role', session.role === 'admin' ? 'Admin' : 'Teacher'],
    ['Classes', classesFor(session).join(', ') || '—'],
    [
      'Subjects',
      subjectsFor(session)
        .map((s) => subjectLabel[s])
        .join(', ') || '—',
    ],
  ]
  return (
    <PortalShell session={session}>
      <SectionHeading as="h1" eyebrow="Web Support" title="Your" accent="profile" crayon="leaf" />
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Glass radius="lg" className="p-6 sm:p-8">
          <h2 className="text-h3">Your details</h2>
          <div className="mt-6">
            <ProfileForm profile={session} />
          </div>
        </Glass>
        <Glass radius="lg" className="p-6 sm:p-8">
          <h2 className="text-h3">Your access</h2>
          <dl className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]" data-testid="access">
            {access.map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="eyebrow">{term}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-small text-forest">
            Classes and subjects are set by Elara Universe. Write to us to change them.
          </p>
          <Button href="/account/update-password" variant="secondary" className="mt-6">
            <KeyRound aria-hidden size={18} /> Change password
          </Button>
        </Glass>
      </div>
    </PortalShell>
  )
}
