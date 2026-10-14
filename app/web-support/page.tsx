import type { Metadata } from 'next'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

export const metadata: Metadata = {
  title: 'Web Support',
  description:
    'Teacher portal for Elara Universe books: learning resources, worksheets, quizzes and the Test Maker.',
}

// Step G replaces this page with the full portal (login, request access, Help & Doubts).
export default function WebSupportPage() {
  return (
    <Main>
      <Section className="py-12">
        <p className="eyebrow">Web Support</p>
        <h1>Teacher portal</h1>
        <p className="mt-3 max-w-prose">
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
      </Section>
    </Main>
  )
}
