import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { Postcard } from '@/components/contact/postcard'
import { Main } from '@/components/frame/main'
import { Section } from '@/components/ui/section'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Request sample copies or ask Elara Universe Publishers about Hindi, Computer and Drawing textbooks for Classes 1–8.',
}

export default function ContactPage() {
  return (
    <Main>
      <Section className="py-12">
        <p className="eyebrow">Contact</p>
        <h1>Write us a letter</h1>
        <p className="mt-3 max-w-prose">
          Request a sample copy, ask about prices for your school, or say hello. We read every
          letter.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
          <ContactForm />
          <Postcard />
        </div>
      </Section>
    </Main>
  )
}
