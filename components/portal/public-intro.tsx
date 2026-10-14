import Image from 'next/image'
import { LoginForm } from '@/components/auth/login-form'
import { MockNote } from '@/components/auth/mock-note'
import { Main } from '@/components/frame/main'
import { AccessSteps } from '@/components/portal/access-steps'
import { RequestAccessForm } from '@/components/portal/request-access-form'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

/** Web Support for visitors: how it works, the login card and the request-access form. */
export const PublicIntro = () => (
  <Main>
    <Section className="py-12 md:py-16">
      {/* [PLACEHOLDER] wording: the lead line */}
      <SectionHeading
        as="h1"
        eyebrow="Web Support"
        title="Teacher"
        accent="portal"
        crayon="computer"
        lead="E-books, animated videos, worksheets, quizzes and the Test Maker for every Elara Universe book, for the teachers who use them. Accounts are created by Elara Universe."
      />
      <div className="mt-10">
        <AccessSteps />
      </div>
    </Section>
    <Section
      tone="mint"
      className="grid items-start gap-10 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
    >
      <div id="request-access" className="scroll-mt-[calc(var(--topbar-h)+1.5rem)]">
        <SectionHeading
          eyebrow="Step 2"
          title="Request"
          accent="access"
          lead="Tell us who you are and which book you teach. We create the account and email you."
        />
        <Glass radius="lg" className="mt-8 p-6 sm:p-8">
          <RequestAccessForm />
        </Glass>
      </div>
      <div>
        <SectionHeading eyebrow="Already approved?" title="Sign in" />
        <Glass radius="lg" className="mt-8 p-6 sm:p-8" data-testid="portal-login">
          <Image src="/brand/mark.svg" alt="" width={324} height={220} className="h-12 w-auto" />
          <div className="mt-4">
            <LoginForm next="/web-support" />
          </div>
        </Glass>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button href="/web-support/help" variant="secondary">
            Help & Doubts
          </Button>
        </div>
        <div className="mt-6">
          <MockNote accounts />
        </div>
      </div>
    </Section>
  </Main>
)
