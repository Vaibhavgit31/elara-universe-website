import type { Metadata } from 'next'
import { PlayCorner } from '@/components/extras/play-corner'
import { BookRoom } from '@/components/home/book-room'
import { ClassroomHero } from '@/components/home/classroom-hero'
import { FaqRoom } from '@/components/home/faq-room'
import { Notices } from '@/components/home/notices'
import { Postbox } from '@/components/home/postbox'
import { QrPhone } from '@/components/home/qr-phone'
import { Room } from '@/components/home/room'
import { StaffRoom } from '@/components/home/staff-room'
import { TestPaperPreview } from '@/components/home/test-paper-preview'
import { WhyStickers } from '@/components/home/why-stickers'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import { site } from '@/content/site'
import { siteConfig } from '@/content/site-config'
import { isoToday } from '@/lib/events'

export const metadata: Metadata = {
  title: { absolute: `${site.name} · Hindi, Computer and Drawing textbooks for Classes 1–8` },
  description: site.tagline,
}

/** Home: "A day at Elara School". Every key detail is on this page; each room opens as the
 *  reader arrives, and its heavy parts load only then. */
export default function Home() {
  return (
    <Main>
      <Room id="classroom" eager className="py-0 md:py-0">
        <ClassroomHero />
      </Room>

      <Room id="hindi-class" tone="paper">
        <BookRoom seriesId="hindi" />
      </Room>
      <Room id="computer-lab" tone="mint">
        <BookRoom seriesId="technova" />
      </Room>
      <Room id="art-room" tone="paper">
        <BookRoom seriesId="art-journey" />
      </Room>

      <Room id="why">
        <WhyStickers />
      </Room>

      <Room id="digital" tone="mint" className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Digital support and QR"
            title="Scan the book,"
            accent="open the lesson"
            crayon="computer"
            lead="Every Elara book carries a QR code. It opens QR Corner for that book and class; teachers reach videos, worksheets, quizzes and the Test Maker through Web Support."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/web-support">Web Support</Button>
            <Button href="/resources" variant="secondary">
              QR Corner
            </Button>
          </div>
        </div>
        <QrPhone className="w-full max-w-md justify-self-center md:justify-self-end" />
      </Room>

      <Room id="teachers" className="grid items-center gap-12 md:grid-cols-2">
        <TestPaperPreview className="order-last w-full max-w-md md:order-first" />
        <div>
          <SectionHeading
            eyebrow="For teachers"
            title="A test paper"
            accent="in minutes"
            lead="Pick the class, book and chapters; the Test Maker drafts the questions, you check and edit them, then print or download the paper with its answer key. Teacher accounts are created by Elara Universe."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/login">Teacher login</Button>
            <Button href="/web-support" variant="secondary">
              How Web Support works
            </Button>
          </div>
        </div>
      </Room>

      <Room id="events" tone="paper">
        <Notices buildDate={isoToday()} />
      </Room>

      <Room id="staff-room">
        <StaffRoom />
      </Room>

      <Room id="faq" tone="mint">
        <FaqRoom />
      </Room>

      <Room id="contact" tone="paper">
        <Postbox />
      </Room>

      {siteConfig.playCorner && (
        <Room id="play">
          <SectionHeading
            eyebrow="Play corner"
            title="Three little"
            accent="games"
            crayon="drawing"
            lead="About thirty seconds each. One for every subject."
          />
          <PlayCorner />
        </Room>
      )}
    </Main>
  )
}
