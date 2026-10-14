import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { Postcard } from '@/components/contact/postcard'
import { Main } from '@/components/frame/main'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Request sample copies or ask Elara Universe Publishers about Hindi, Computer and Drawing textbooks for Classes 1–8.',
}

/** Contact: the full letter on a glass panel, with the postcard of addresses beside it. */
export default function ContactPage() {
  return (
    <Main>
      <Section className="py-12 md:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Write us a"
          accent="letter"
          crayon="drawing"
          lead="Request a sample copy, ask about prices for your school, or say hello. We read every letter."
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-16">
          <Glass radius="lg" className="min-w-0 p-4 sm:p-6 md:p-8">
            <ContactForm />
          </Glass>
          <Postcard />
        </div>
      </Section>
    </Main>
  )
}
