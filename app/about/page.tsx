import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { MakingSteps } from '@/components/about/making-steps'
import { Polaroid } from '@/components/about/polaroid'
import { FlipPad } from '@/components/flip/flip-pad'
import { FlipPage } from '@/components/flip/flip-page'
import { Main } from '@/components/frame/main'
import { StickyNote } from '@/components/ui/sticky-note'
import { site } from '@/content/site'
import { team } from '@/content/team'

export const metadata: Metadata = {
  title: 'About Us',
  description: `The story, beliefs and founders of ${site.name}, publishers of Hindi, Computer and Drawing textbooks for Classes 1–8.`,
}

/** A chapter opening: large number, title, and a drop cap on the first paragraph. */
const Chapter = ({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: ReactNode
}) => (
  <article>
    <p className="eyebrow">Chapter {number}</p>
    <div className="mt-1 flex items-baseline gap-4">
      <span
        aria-hidden
        className="font-display text-[clamp(4rem,9vw,7rem)] leading-none text-brass"
      >
        {number}
      </span>
      <h2>{title}</h2>
    </div>
    <div className="mt-6">{children}</div>
  </article>
)

// From PLAYBOOK.md "What we believe" (the third point comes from the Hindi Reader preface).
const beliefs = [
  {
    tone: 'hindi',
    tilt: '-rotate-1',
    title: 'Joyful, activity-based learning',
    text: 'Children learn best when lessons are playful and hands-on.',
  }, // [PLACEHOLDER] wording
  {
    tone: 'mist',
    tilt: 'rotate-1',
    title: 'NEP-aligned books',
    text: 'Every series is aligned to NEP 2020 and NCF 2023.',
  },
  {
    tone: 'computer',
    tilt: '-rotate-2',
    title: 'Books for every learner',
    text: 'Including students in non-Hindi-speaking regions.',
  },
] as const

export default function AboutPage() {
  return (
    <Main>
      <FlipPad>
        <FlipPage>
          <h1 className="mb-8 font-display text-h3 font-medium text-forest">About Us</h1>
          <Chapter number={1} title="Our story">
            {/* [PLACEHOLDER]: Vaibhav will send when and why Elara Universe started (3–4 sentences). */}
            <p className="dropcap max-w-prose">
              Our story — when and why Elara Universe started, in three or four sentences — will go
              here. [PLACEHOLDER]
            </p>
            <p className="mt-4 max-w-prose">
              {site.name} publishes Hindi, Computer and Drawing textbooks for Classes 1–8, aligned
              to NEP 2020 and NCF 2023, from Noida and Ghaziabad in Uttar Pradesh.
            </p>
          </Chapter>
        </FlipPage>
        <FlipPage className="bg-mist">
          <Chapter number={2} title="What we believe">
            <p className="dropcap max-w-prose">Three ideas sit behind every book we make.</p>
            <ul className="mt-10 grid gap-8 sm:grid-cols-3">
              {beliefs.map((b) => (
                <li key={b.title}>
                  <StickyNote tone={b.tone} tilt={b.tilt} title={b.title} className="h-full">
                    <p>{b.text}</p>
                  </StickyNote>
                </li>
              ))}
            </ul>
          </Chapter>
        </FlipPage>
        <FlipPage>
          <Chapter number={3} title="Meet the founders">
            <p className="dropcap max-w-prose">
              Two co-founders started Elara Universe. Their photos and bios are on their way.
            </p>
            <ul className="mt-10 grid gap-12 md:grid-cols-2">
              {team.map((person, i) => (
                <li
                  key={person.name}
                  className="flex flex-col items-center gap-6 sm:flex-row sm:items-start"
                >
                  <Polaroid person={person} className={i % 2 ? 'rotate-2' : '-rotate-2'} />
                  <div className="max-w-xs">
                    <h3>{person.name}</h3>
                    <p className="eyebrow">{person.role}</p>
                    <p className="mt-3 text-small">{person.bio}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Chapter>
        </FlipPage>
        <FlipPage className="bg-mist">
          <Chapter number={4} title="How a book is made">
            <p className="dropcap max-w-prose">
              From the first draft to the QR code on the back cover, every book passes through four
              steps.
            </p>
            <MakingSteps />
          </Chapter>
        </FlipPage>
      </FlipPad>
    </Main>
  )
}
