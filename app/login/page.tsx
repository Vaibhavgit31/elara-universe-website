import type { Metadata } from 'next'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

export const metadata: Metadata = { title: 'Teacher login', robots: { index: false } }

// Step F replaces this page with the real login (Supabase) and forgot-password flow.
export default function LoginPage() {
  return (
    <Main>
      <Section className="py-12">
        <div className="glass max-w-md rounded-lg p-8">
          <p className="eyebrow">Teacher login</p>
          <h1 className="text-h2">Logins are on their way</h1>
          <p className="mt-3">
            Teacher accounts are created by Elara Universe. Once yours exists you will sign in here
            with your email and password.
          </p>
          <Button href="/contact" className="mt-6">
            Ask for an account
          </Button>
        </div>
      </Section>
    </Main>
  )
}
