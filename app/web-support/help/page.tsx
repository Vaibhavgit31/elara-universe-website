import type { Metadata } from 'next'
import { Main } from '@/components/frame/main'
import { DoubtForm } from '@/components/portal/doubt-form'
import { FaqSearch } from '@/components/portal/faq-search'
import { PortalShell } from '@/components/portal/portal-shell'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Help & Doubts',
  description:
    'Answers to the questions schools ask about Elara Universe books, ordering, sample copies, Web Support, QR codes and the Test Maker, and a form to ask your own.',
}

type Props = { searchParams: Promise<{ q?: string }> }

/** Public on purpose (the chatbot links to its answers); inside the portal for signed-in staff. */
export default async function HelpPage({ searchParams }: Props) {
  const [session, { q }] = await Promise.all([getSession(), searchParams])
  const content = (
    <>
      {/* [PLACEHOLDER] wording: the lead line */}
      <SectionHeading
        as="h1"
        eyebrow="Web Support"
        title="Help &"
        accent="Doubts"
        crayon="leaf"
        lead="Search the answers by topic. If yours is not here, ask our team below."
      />
      <div className="mt-10">
        <FaqSearch />
      </div>
      <div id="ask" className="mt-16 scroll-mt-[calc(var(--topbar-h)+1.5rem)]">
        <SectionHeading eyebrow="Still stuck?" title="Ask a" accent="doubt" />
        <Glass radius="lg" className="mt-8 max-w-3xl p-6 sm:p-8">
          <DoubtForm
            defaults={{
              question: q?.slice(0, 1000),
              name: session?.name,
              email: session?.email,
              school: session?.school,
            }}
          />
        </Glass>
      </div>
    </>
  )
  if (session) return <PortalShell session={session}>{content}</PortalShell>
  return (
    <Main>
      <Section className="py-12 md:py-16">{content}</Section>
    </Main>
  )
}
