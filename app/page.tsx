import type { Metadata } from 'next'
import { Flipbook } from '@/components/book/flipbook'
import { EventTicket } from '@/components/events/event-ticket'
import { FlipPad } from '@/components/flip/flip-pad'
import { FlipPage } from '@/components/flip/flip-page'
import { Main } from '@/components/frame/main'
import { OpeningCover } from '@/components/home/opening-cover'
import { SubjectShelf } from '@/components/home/subject-shelf'
import { Doodle } from '@/components/illustrations/doodles'
import { QrDoor } from '@/components/illustrations/qr-door'
import { Button, buttonClass } from '@/components/ui/button'
import { StickyNote } from '@/components/ui/sticky-note'
import { TurnLink } from '@/components/ui/turn-link'
import { site, whatsappLink } from '@/content/site'
import { upcomingEvents } from '@/lib/events'

export const metadata: Metadata = {
  title: { absolute: `${site.name} · Hindi, Computer and Drawing textbooks for Classes 1–8` },
  description: site.tagline,
}

const hindiSamples = Array.from({ length: 8 }, (_, i) => `/books/samples/hindi-1/0${i + 1}.webp`)

// Copy marked [PLACEHOLDER] below was written for this build and is open for Vaibhav's review.
const whyNotes = [
  {
    tone: 'mist',
    tilt: '-rotate-2',
    title: 'Aligned to NEP 2020 and NCF 2023',
    text: 'Every series follows the National Education Policy 2020 and the National Curriculum Framework 2023.',
  }, // [PLACEHOLDER] wording
  {
    tone: 'hindi',
    tilt: 'rotate-1',
    title: 'Text-cum-workbook design',
    text: 'Lessons and practice sit side by side in one book, so children read, write and do in the same place.',
  }, // [PLACEHOLDER] wording
  {
    tone: 'computer',
    tilt: '-rotate-1',
    title: 'Digital support',
    text: 'Animated videos, worksheets, interactive quizzes and an e-book back up the printed chapters.',
  }, // [PLACEHOLDER] wording
  {
    tone: 'drawing',
    tilt: 'rotate-2',
    title: 'Teacher support',
    text: 'Worksheet booklets for every class, and a test generator for teachers.',
    soon: 'Test generator: coming soon',
  },
] as const

export default function Home() {
  const events = upcomingEvents().slice(0, 3)
  return (
    <Main>
      <FlipPad>
        {/* 1. Cover → first spread */}
        <FlipPage bare>
          <section
            className="relative flex min-h-svh flex-col justify-center px-4 pt-16 pb-24 sm:px-8"
            style={{ perspective: '1200px' }}
          >
            <OpeningCover />
            <Doodle kind="hindi" className="top-20 right-4 md:right-16" speed={0.1} />
            <Doodle kind="computer" className="bottom-28 left-4 md:left-16" speed={0.05} />
            <Doodle kind="drawing" className="right-8 bottom-24 hidden md:block" speed={0.14} />
            <div className="mx-auto w-full max-w-6xl">
              <p className="eyebrow">{site.name}</p>
              {/* [PLACEHOLDER] headline suggested in PLAYBOOK.md */}
              <h1 className="mt-3 max-w-3xl font-display text-h1 font-medium">
                Books that grow curious minds.
              </h1>
              <p className="mt-5 max-w-2xl text-lg">{site.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/catalog">Explore the catalog</Button>
                <Button href="/contact" variant="secondary">
                  Request a sample copy
                </Button>
              </div>
            </div>
          </section>
        </FlipPage>

        {/* 2. Three subjects on a shelf */}
        <FlipPage>
          <Doodle kind="computer" className="top-10 right-0 hidden md:block" speed={0.07} />
          <p className="eyebrow">Three subjects, Classes 1–8</p>
          <h2>Pick a book off the shelf</h2>
          <SubjectShelf />
        </FlipPage>

        {/* 3. Why schools choose Elara */}
        <FlipPage className="bg-mist">
          <Doodle kind="drawing" className="top-8 right-2 hidden md:block" speed={0.09} />
          <p className="eyebrow">For principals and teachers</p>
          <h2>Why schools choose Elara</h2>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyNotes.map((note) => (
              <li key={note.title}>
                <StickyNote tone={note.tone} tilt={note.tilt} title={note.title} className="h-full">
                  <p>{note.text}</p>
                  {'soon' in note && (
                    <p className="mt-3 inline-block rounded-full bg-paper px-3 py-1 text-label text-gold-ink uppercase">
                      {note.soon}
                    </p>
                  )}
                </StickyNote>
              </li>
            ))}
          </ul>
        </FlipPage>

        {/* 4. QR door */}
        <FlipPage>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow">QR Corner</p>
              <h2>Every book has a QR door</h2>
              {/* [PLACEHOLDER] wording */}
              <p className="mt-4 max-w-md">
                Each Elara book carries a QR code. Scan it with a phone and it opens QR Corner, the
                online home for that book&apos;s extra resources.
              </p>
              <Button href="/resources" variant="secondary" className="mt-8">
                Visit QR Corner
              </Button>
            </div>
            <QrDoor className="w-full max-w-md justify-self-center" />
          </div>
        </FlipPage>

        {/* 5. Peek inside */}
        <FlipPage className="bg-mist">
          <p className="eyebrow">Peek inside</p>
          <h2>
            Basic Hindi Reader, Class 1{' '}
            <span className="block font-devanagari text-h3 font-semibold text-forest">
              बेसिक हिंदी रीडर
            </span>
          </h2>
          <p className="mt-3 max-w-xl">
            Eight sample pages. Drag a corner or use the arrows to turn them.
          </p>
          <Flipbook pages={hindiSamples} title="Basic Hindi Reader Class 1" className="mt-8" />
          <p className="mt-6 text-center">
            <TurnLink href="/catalog?subject=hindi" className="link">
              See all Basic Hindi Reader books
            </TurnLink>
          </p>
        </FlipPage>

        {/* 6. What's happening */}
        <FlipPage>
          <p className="eyebrow">What&apos;s happening</p>
          <h2>Launches, workshops and fairs</h2>
          {events.length ? (
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <li key={event.slug}>
                  <EventTicket event={event} className={i % 2 ? 'rotate-1' : '-rotate-1'} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 font-hand text-2xl text-forest">New events coming soon.</p>
          )}
          <p className="mt-10">
            <TurnLink href="/events" className="link">
              All events
            </TurnLink>
          </p>
        </FlipPage>

        {/* 7. Back cover */}
        <FlipPage className="bg-forest text-cream">
          <div className="flex min-h-[60svh] flex-col items-center justify-center text-center">
            <p className="eyebrow text-brass">The back cover</p>
            <h2 className="text-cream">Bring Elara to your school</h2>
            {/* [PLACEHOLDER] wording */}
            <p className="mt-4 max-w-md text-cream/85">
              Request a sample copy for your school, or ask us anything about the books.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="brass">
                Request a sample copy
              </Button>
              <a
                href={whatsappLink(
                  `Hello ${site.shortName}, I would like sample copies for my school.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('secondary', 'border-cream text-cream hover:bg-cream/10')}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </FlipPage>
      </FlipPad>
    </Main>
  )
}
