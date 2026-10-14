import { NotebookCard } from '@/components/classroom/notebook-card'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import { TurnLink } from '@/components/ui/turn-link'
import { topFaqs, type Faq } from '@/content/faq'

/** The six top questions split over two notebook pages (one on small screens, side by side on lg). */
const half = Math.ceil(topFaqs.length / 2)
const pages = [topFaqs.slice(0, half), topFaqs.slice(half)].filter((page) => page.length)

/** Questions and answers on the 32px notebook rhythm: every block is leading-8 and 32px apart. */
function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <dl className="space-y-8">
      {faqs.map((faq) => (
        <div key={faq.id}>
          <dt>
            {/* py-1.5 with -my-1.5 gives a 44px tap target without leaving the rules. */}
            <TurnLink
              href={`/web-support/help#${faq.id}`}
              className="link -my-1.5 inline-block py-1.5 font-semibold"
            >
              {faq.question}
            </TurnLink>
          </dt>
          <dd className="text-small leading-8 text-forest">{faq.answer}</dd>
        </div>
      ))}
    </dl>
  )
}

/** FAQ room: the six questions schools ask most, each linking to its answer on the Help page. */
export function FaqRoom() {
  return (
    <>
      <SectionHeading
        eyebrow="Questions"
        title="Schools often"
        accent="ask"
        lead="Six quick answers. The full list, grouped by topic, is on the Help page." // [PLACEHOLDER] wording
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {pages.map((faqs) => (
          <NotebookCard key={faqs[0].id}>
            <FaqList faqs={faqs} />
          </NotebookCard>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/web-support/help" variant="secondary">
          All questions and answers
        </Button>
        <Button href="/web-support/help#ask" variant="ghost">
          Ask a doubt
        </Button>
      </div>
    </>
  )
}
