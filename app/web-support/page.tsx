import type { Metadata } from 'next'
import { MockNote } from '@/components/auth/mock-note'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Web Support',
  description:
    'Teacher portal for Elara Universe books: learning resources, worksheets, quizzes and the Test Maker.',
}

// Step G replaces both states with the full portal (select your title, book grid) and the public
// intro (the four steps, request-access form, Help & Doubts). Step F only adds the signed-in state.
export default async function WebSupportPage() {
  const session = await getSession()
  return (
    <Main>
      <Section className="py-12 md:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Web Support"
          title={session ? `Hello, ${session.name || session.email}` : 'Teacher'}
          accent={session ? undefined : 'portal'}
          crayon="computer"
        />
        <Glass radius="lg" className="mt-10 max-w-2xl p-6 md:p-8" data-testid="portal-home">
          {session ? (
            <>
              <p>
                You are signed in as a{session.role === 'admin' ? 'n admin' : ' teacher'}
                {session.school && ` at ${session.school}`}. Your books, tests and resources arrive
                here in the next step.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {session.role === 'admin' && <Button href="/admin">Admin</Button>}
                <Button href="/account/update-password" variant="secondary">
                  Change password
                </Button>
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <p>
                Learning resources, worksheets, quizzes and the Test Maker for every Elara Universe
                book live here. Accounts are created for teachers by Elara Universe; ask us for
                access and we will set yours up.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/contact">Request access</Button>
                <Button href="/login" variant="secondary">
                  Teacher login
                </Button>
              </div>
            </>
          )}
          <div className="mt-6">
            <MockNote />
          </div>
        </Glass>
      </Section>
    </Main>
  )
}
