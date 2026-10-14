import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { MockNote } from '@/components/auth/mock-note'
import { Main } from '@/components/frame/main'
import { ClassroomScene } from '@/components/home/classroom-scene'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/ui/form'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { PORTAL_HOME } from '@/lib/auth/config'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = { title: 'Teacher login', robots: { index: false } }

type Props = { searchParams: Promise<{ next?: string; expired?: string }> }

/** The glass login card in front of the classroom; signed-in visitors go straight to the portal. */
export default async function LoginPage({ searchParams }: Props) {
  if (await getSession()) redirect(PORTAL_HOME)
  const { next, expired } = await searchParams
  return (
    <Main className="relative overflow-x-clip">
      {/* The classroom behind the card, faded so the form stays readable (decorative). */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 opacity-30">
        <ClassroomScene compact className="mx-auto max-w-5xl" />
      </div>
      <Section className="grid items-start gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="Teacher login"
            title="Welcome"
            accent="back"
            crayon="leaf"
            lead="Sign in to open your books' learning resources and the Test Maker. Accounts are created by Elara Universe; if you do not have one yet, ask for access."
          />
          <Button href="/web-support#request-access" variant="secondary" className="mt-8">
            Request access
          </Button>
          <div className="mt-8 max-w-md">
            <MockNote accounts />
          </div>
        </div>
        <Glass radius="lg" className="w-full max-w-md p-6 sm:p-8 md:justify-self-end">
          <Image src="/brand/mark.svg" alt="" width={324} height={220} className="h-14 w-auto" />
          {expired && (
            <div className="mt-4">
              <Notice tone="note">
                That email link has expired or was already used. Sign in, or ask for a new reset
                link.
              </Notice>
            </div>
          )}
          <LoginForm next={next} />
        </Glass>
      </Section>
    </Main>
  )
}
