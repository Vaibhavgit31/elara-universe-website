'use client'

import dynamic from 'next/dynamic'
import { LazyMount } from '@/components/home/lazy-mount'
import { BookLoader } from '@/components/ui/book-loader'
import { TurnLink } from '@/components/ui/turn-link'

/** Stands in for the letter until it loads: the size it will take, the little book loader and,
 *  for anyone without JavaScript, the way to the full letter on the contact page. */
const Waiting = () => (
  <div className="flex min-h-[30rem] flex-col items-start gap-4">
    <BookLoader label="Loading the letter" />
    <p className="text-small text-forest">
      The letter opens here. You can also write on the{' '}
      <TurnLink href="/contact" className="link font-semibold">
        contact page
      </TurnLink>
      .
    </p>
  </div>
)

// The letter's form code (react-hook-form, zod, the paper plane) is fetched only when the postbox
// room comes near the screen, so it never delays the first paint of the home page. The contact
// page keeps its fully server-rendered letter.
const ContactForm = dynamic(
  () => import('@/components/contact/contact-form').then((mod) => mod.ContactForm),
  { ssr: false, loading: Waiting },
)

export const LazyLetter = () => (
  <LazyMount fallback={<Waiting />} margin="600px 0px">
    <ContactForm compact />
  </LazyMount>
)
