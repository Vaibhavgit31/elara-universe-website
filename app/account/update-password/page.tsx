import type { Metadata } from 'next'
import { PasswordForm } from '@/components/auth/password-form'
import { Main } from '@/components/frame/main'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { requireSession } from '@/lib/auth/session'

export const metadata: Metadata = { title: 'Set a new password', robots: { index: false } }

/** Reached from the reset or invite email (after /auth/confirm) or from the portal's Profile. */
export default async function UpdatePasswordPage() {
  const session = await requireSession('/account/update-password')
  return (
    <Main>
      <Section className="grid items-start gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <SectionHeading
          as="h1"
          eyebrow={session.email}
          title="Set a new"
          accent="password"
          crayon="leaf"
          lead="Choose a password only you know. You stay signed in afterwards."
        />
        <Glass radius="lg" className="w-full max-w-md p-6 sm:p-8 md:justify-self-end">
          <PasswordForm />
        </Glass>
      </Section>
    </Main>
  )
}
