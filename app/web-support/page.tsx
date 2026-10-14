import type { Metadata } from 'next'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata: Metadata = {
  title: 'Web Support',
  description:
    'Teacher portal for Elara Universe books: learning resources, worksheets, quizzes and the Test Maker.',
}

// Step G replaces this page with the full portal (login, request access, Help & Doubts).
export default function WebSupportPage() {
  return (
    <Main>
      <Section className="py-12 md:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Web Support"
          title="Teacher"
          accent="portal"
          crayon="computer"
        />
        <Glass radius="lg" className="mt-10 max-w-2xl p-6 md:p-8">
          <p>
            Learning resources, worksheets, quizzes and the Test Maker for every Elara Universe book
            live here. Accounts are created for teachers by Elara Universe; ask us for access and we
            will set yours up.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact">Request access</Button>
            <Button href="/login" variant="secondary">
              Teacher login
            </Button>
          </div>
        </Glass>
      </Section>
    </Main>
  )
}
