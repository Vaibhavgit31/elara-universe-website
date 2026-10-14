import type { Metadata } from 'next'
import { ForgotForm } from '@/components/auth/forgot-form'
import { MockNote } from '@/components/auth/mock-note'
import { Main } from '@/components/frame/main'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { TurnLink } from '@/components/ui/turn-link'

export const metadata: Metadata = { title: 'Forgot password', robots: { index: false } }

export default function ForgotPasswordPage() {
  return (
    <Main>
      <Section className="grid items-start gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="Teacher login"
            title="Forgot your"
            accent="password?"
            crayon="brass"
            lead="Tell us the email of your account and we will send a link to set a new one."
          />
          <TurnLink href="/login" className="link mt-6 inline-block font-semibold text-forest">
            Back to sign in
          </TurnLink>
          <div className="mt-8 max-w-md">
            <MockNote />
          </div>
        </div>
        <Glass radius="lg" className="w-full max-w-md p-6 sm:p-8 md:justify-self-end">
          <ForgotForm />
        </Glass>
      </Section>
    </Main>
  )
}
