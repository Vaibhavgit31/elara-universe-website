import type { Metadata } from 'next'
import Image from 'next/image'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata: Metadata = { title: 'Teacher login', robots: { index: false } }

// Step F replaces this page with the real login (Supabase) and forgot-password flow.
export default function LoginPage() {
  return (
    <Main>
      <Section className="grid items-start gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Teacher login"
          title="Logins are on their"
          accent="way"
          crayon="leaf"
          lead="Teacher accounts are created by Elara Universe."
        />
        <Glass radius="lg" className="w-full max-w-md p-6 sm:p-8 md:justify-self-end">
          <Image src="/brand/mark.svg" alt="" width={324} height={220} className="h-14 w-auto" />
          <p className="mt-6 font-hand text-2xl leading-8 text-forest">
            Once yours exists you will sign in here with your email and password.
          </p>
          <Button href="/contact" className="mt-8">
            Ask for an account
          </Button>
        </Glass>
      </Section>
    </Main>
  )
}
