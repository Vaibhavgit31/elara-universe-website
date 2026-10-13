import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { Postcard } from '@/components/contact/postcard'
import { Main } from '@/components/frame/main'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Request sample copies or ask Elara Universe Publishers about Hindi, Computer and Drawing textbooks for Classes 1–8.',
}

export default function ContactPage() {
  return (
    <Main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow">Contact</p>
      <h1>Write us a letter</h1>
      <p className="mt-3 max-w-2xl">
        Request a sample copy, ask about prices for your school, or say hello. We read every letter.
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
        <ContactForm />
        <Postcard />
      </div>
    </Main>
  )
}
