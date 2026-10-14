import type { Metadata } from 'next'
import { Chalkboard, ChalkText } from '@/components/classroom/chalkboard'
import { Main } from '@/components/frame/main'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata: Metadata = { title: 'Page not found' }

/** An open book with one page torn out and drifting away. */
const MissingPage = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 320 200" className={className} aria-hidden>
    <path
      d="M30 150c40-18 80-18 120 0V40c-40-18-80-18-120 0Z"
      className="fill-cream stroke-forest"
      strokeWidth="3"
    />
    <path
      d="M150 150c40-18 80-18 120 0V40c-40-18-80-18-120 0Z"
      className="fill-cream stroke-forest"
      strokeWidth="3"
    />
    <path d="M30 150c40-18 80-18 120 0 40-18 80-18 120 0v12H30Z" className="fill-evergreen" />
    <path
      d="M52 62h76M52 80h76M52 98h76M52 116h60"
      className="stroke-sage-100"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* the torn edge where the page used to be */}
    <path
      d="M166 70c20-6 40-10 60-6l-6 70c-20-6-40-6-60 0Z"
      className="fill-mist stroke-sage"
      strokeWidth="2"
    />
    <g transform="rotate(-14 240 50)">
      <rect
        x="208"
        y="14"
        width="64"
        height="76"
        rx="4"
        className="fill-paper stroke-brass"
        strokeWidth="3"
      />
      <path
        d="M220 32h40M220 46h40M220 60h28"
        className="stroke-sage-100"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  </svg>
)

export default function NotFound() {
  return (
    <Main>
      <Section className="grid items-center gap-10 py-16 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16 md:py-24">
        <Glass radius="lg" className="w-full max-w-md p-6 pb-16 md:p-8 md:pb-20">
          <MissingPage className="h-auto w-full" />
          <Elu
            pose="search"
            label="Elu searching for the missing page"
            className="absolute -bottom-3 left-4 w-24 sm:w-32"
          />
        </Glass>
        <div>
          {/* A small slate with the error number chalked on it; the eyebrow below says it in words. */}
          <div aria-hidden className="mb-8 inline-block -rotate-2">
            <Chalkboard tray={false}>
              <ChalkText text="404" write className="text-h1 leading-none" />
            </Chalkboard>
          </div>
          <SectionHeading
            as="h1"
            eyebrow="Error 404"
            title="This page is missing from the"
            accent="book"
            crayon="drawing"
            lead="The page you were looking for may have been torn out, moved, or never written. Let's turn back to a page that exists."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/">Back to the cover</Button>
            <Button href="/catalog" variant="secondary">
              Browse the catalog
            </Button>
          </div>
        </div>
      </Section>
    </Main>
  )
}
