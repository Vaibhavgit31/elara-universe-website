import type { Metadata } from 'next'
import { ChapterBoard } from '@/components/about/chapter-board'
import { MakingSteps } from '@/components/about/making-steps'
import { Polaroid } from '@/components/about/polaroid'
import { NotebookCard } from '@/components/classroom/notebook-card'
import { FlipPad } from '@/components/flip/flip-pad'
import { FlipPage } from '@/components/flip/flip-page'
import { Main } from '@/components/frame/main'
import { Elu } from '@/components/mascot/elu'
import { Glass } from '@/components/ui/glass'
import { StickyNote } from '@/components/ui/sticky-note'
import { site } from '@/content/site'
import { team } from '@/content/team'

export const metadata: Metadata = {
  title: 'About Us',
  description: `The story, beliefs and founders of ${site.name}, publishers of Hindi, Computer and Drawing textbooks for Classes 1–8.`,
}

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

/** About: four chapters, each opened on the classroom board, with the matter on the desk below. */
export default function AboutPage() {
  return (
    <Main>
      <FlipPad>
        <FlipPage>
          <h1 className="font-display text-h3 font-medium text-forest">About Us</h1>
          <div className="mt-8 flex flex-wrap items-end gap-8">
            <ChapterBoard number={1} title="Our story" className="w-full max-w-2xl" />
            <Elu pose="read" className="w-24" />
          </div>
          <NotebookCard className="mt-8 max-w-2xl lg:ml-auto">
            {/* [PLACEHOLDER]: Vaibhav will send when and why Elara Universe started (3–4 sentences). */}
            <p className="dropcap">
              Our story — when and why Elara Universe started, in three or four sentences — will go
              here. [PLACEHOLDER]
            </p>
            <p className="mt-8">
              {site.name} publishes Hindi, Computer and Drawing textbooks for Classes 1–8, aligned
              to NEP 2020 and NCF 2023, from Noida and Ghaziabad in Uttar Pradesh.
            </p>
          </NotebookCard>
        </FlipPage>

        <FlipPage className="bg-mint">
          <ChapterBoard
            number={2}
            title="What we believe"
            note="Three ideas sit behind every book we make."
            className="max-w-2xl"
          />
          <Glass radius="lg" className="mt-8 p-6 md:p-8 lg:ml-auto lg:max-w-4xl">
            <ul className="grid gap-8 md:grid-cols-3">
              {beliefs.map((b) => (
                <li key={b.title} className="max-w-sm">
                  <StickyNote tone={b.tone} tilt={b.tilt} title={b.title} className="h-full">
                    <p>{b.text}</p>
                  </StickyNote>
                </li>
              ))}
            </ul>
          </Glass>
        </FlipPage>

        <FlipPage>
          <ChapterBoard
            number={3}
            title="Meet the founders"
            note="Two co-founders started Elara Universe. Their photos and bios are on their way."
            className="max-w-2xl"
          />
          <ul className="mt-8 grid gap-8">
            {team.map((person, i) => (
              <li
                key={person.name}
                className={`grid gap-8 ${i % 2 ? 'md:grid-cols-[1fr_auto]' : 'md:grid-cols-[auto_1fr]'}`}
              >
                <Polaroid
                  person={person}
                  className={i % 2 ? 'rotate-2 self-start md:order-last' : '-rotate-2 self-start'}
                />
                <NotebookCard>
                  <h3 className="leading-8">{person.name}</h3>
                  <p className="eyebrow leading-8">{person.role}</p>
                  <p className="mt-8 text-small leading-8">{person.bio}</p>
                </NotebookCard>
              </li>
            ))}
          </ul>
        </FlipPage>

        <FlipPage className="bg-mint">
          <ChapterBoard
            number={4}
            title="How a book is made"
            note="From the first draft to the QR code on the back cover, every book passes through four steps."
            className="max-w-2xl"
          />
          <MakingSteps className="mt-8" />
        </FlipPage>
      </FlipPad>
    </Main>
  )
}
