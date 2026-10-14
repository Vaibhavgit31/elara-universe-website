import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Bell,
  BookOpenText,
  GraduationCap,
  Pencil as PencilIcon,
  QrCode,
  School,
  Sparkles,
} from 'lucide-react'
import { Chalkboard, ChalkLine, ChalkText } from '@/components/classroom/chalkboard'
import { NotebookCard } from '@/components/classroom/notebook-card'
import { NoticeBoard, Pinned } from '@/components/classroom/notice-board'
import { Pencil } from '@/components/classroom/pencil'
import { ReportBadge } from '@/components/classroom/report-badge'
import { SchoolBell } from '@/components/classroom/school-bell'
import { Timetable } from '@/components/classroom/timetable'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section as PageSection } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { StickyNote } from '@/components/ui/sticky-note'
import { Tag, subjectTag } from '@/components/ui/tag'

export const metadata: Metadata = { title: 'Style guide', robots: { index: false } }

// Hex values repeat the tokens in app/globals.css only so the page can print them as labels;
// tests/contrast.spec.ts reads the real tokens from the CSS.
const colours = [
  ['evergreen', '#1B241D', 'Body text and headings (logo)'],
  ['forest', '#3F5645', 'Secondary text, links, dark buttons (logo)'],
  ['sage', '#8A9A74', 'Icons and decoration only (logo)'],
  ['sage-100', '#DCE5D2', 'Borders, grid lines, hover tints'],
  ['brass', '#B68235', 'Ribbons, crayon underlines (logo)'],
  ['gold-ink', '#8A6122', 'Eyebrow labels'],
  ['leaf-700', '#23794B', 'Primary buttons, white text'],
  ['leaf', '#34A56F', 'Decorative leaves and ticks'],
  ['chalkboard', '#2C4A3B', 'Chalkboard panels'],
  ['mint', '#E3F6EA', 'Light bands and hover fills'],
  ['cream', '#F5F0E8', 'Book pages and paper cards'],
  ['paper', '#FBF9F4', 'Notebook pages'],
  ['mesh-mint', '#DFF5E6', 'Background mesh'],
  ['mesh-sage', '#CFE3C8', 'Background mesh'],
  ['mesh-lime', '#F3F8DC', 'Background mesh base'],
  ['mesh-sky', '#DCEFF5', 'Background mesh, a hint of sky'],
  ['hindi', '#E8A53A', 'Hindi tags and ribbons (tint #FCEFD6)'],
  ['computer', '#4A90C2', 'Computer tags (tint #E1EEF7)'],
  ['drawing', '#E07A5F', 'Drawing tags, margin lines (tint #FBE4DD)'],
]

const fonts = [
  ['font-heading', 'Lora 600/700', 'Headings: Books that grow curious minds'],
  ['font-display font-medium', 'Cormorant Garamond 500', 'Hero lines and the wordmark'],
  ['font-body', 'Nunito 400/600/700', 'Body text, buttons and forms'],
  ['font-hand', 'Caveat', 'Chalk headings, margin notes, sticky-note labels'],
  ['font-devanagari', 'Noto Sans Devanagari', 'बेसिक हिंदी रीडर · अ आ क'],
]

const radii = [
  ['rounded-sm', '8 px', 'tags, notebook pages, badges, inputs'],
  ['rounded-md', '16 px', 'glass cards, chalkboards, images'],
  ['rounded-lg', '24 px', 'large panels and sheets'],
  ['rounded-full', 'pill', 'buttons, dots, avatars'],
]

const rules = [
  'One radius scale: 8 / 16 / 24 / pill. Nothing else compiles.',
  'An 8 px spacing grid: paddings, gaps and margins are multiples of 8 (4 only inside controls).',
  'One icon set: lucide. No emoji anywhere in the interface.',
  'No purple, no AI-style gradients, no stock illustrations: the palette is the logo plus leaf, mint and chalkboard.',
  'Editorial, left-aligned layouts. Nothing is centred by default; asymmetry is on purpose.',
  'Real content only: placeholders are marked [PLACEHOLDER] and listed in BUILD_LOG.md.',
  'Two shadows (page, lift) plus the glass recipe. Every surface is Glass, Chalkboard, StickyNote, NotebookCard or a Section band.',
]

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-6">
    <h2 className="border-b border-sage-100 pb-2">{title}</h2>
    {children}
  </section>
)

export default function StyleguidePage() {
  return (
    <Main>
      <PageSection className="flex flex-col gap-16 py-12">
        <SectionHeading
          as="h1"
          eyebrow="Design system"
          title="The Acrylic"
          accent="Classroom"
          crayon="leaf"
          lead="Frosted-glass panels over a slowly moving green mesh, with chalkboards, notebooks and sticky notes from a sunny classroom. The logo colours stay; leaf, mint and chalkboard join them."
        />

        <Block title="Background and glass">
          <p className="max-w-prose">
            The mesh behind every page drifts for 46 seconds per cycle (still with reduced motion).
            Glass is white at 55 % with blur and saturation, a white border, a top highlight,
            green-tinted shadows and 3 % noise; it falls back to near-solid cream where blur is
            unsupported or the device is slow.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <Glass className="p-6" data-testid="glass-spot">
              <p className="eyebrow">Spotlight</p>
              <h3 className="mt-2">Move the cursor over me</h3>
              <p className="mt-2 text-small text-forest">A soft glow follows the pointer.</p>
            </Glass>
            <Glass tilt className="p-6" data-testid="glass-tilt">
              <p className="eyebrow">Tilt</p>
              <h3 className="mt-2">A gentle 3D lean</h3>
              <p className="mt-2 text-small text-forest">Six degrees at most, spring-eased.</p>
            </Glass>
            <Glass radius="lg" spotlight={false} className="p-6">
              <p className="eyebrow">Still</p>
              <h3 className="mt-2">Large radius, no effects</h3>
              <p className="mt-2 text-small text-forest">For long reading panels.</p>
            </Glass>
          </div>
        </Block>

        <Block title="Colours">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {colours.map(([name, hex, use]) => (
              <li key={name} className="glass overflow-hidden rounded-md">
                <div className="h-20" style={{ background: `var(--color-${name})` }} />
                <div className="p-4 text-small">
                  <p className="font-bold">{name}</p>
                  <p className="text-forest">{hex}</p>
                  <p className="text-forest">{use}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="max-w-prose text-small text-forest">
            Every text and background pair used on the site is checked for WCAG AA contrast by{' '}
            <code>tests/contrast.spec.ts</code>, with glass measured over the lightest mesh colour.
          </p>
        </Block>

        <Block title="Radius, spacing and the rules">
          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <ul className="space-y-4">
              {radii.map(([cls, size, use]) => (
                <li key={cls} className="flex items-center gap-4">
                  <span className={`block size-12 shrink-0 bg-leaf-700 ${cls}`} />
                  <span>
                    <span className="font-bold">{cls}</span> · {size}
                    <span className="block text-small text-forest">{use}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ol className="list-decimal space-y-2 pl-6 text-small">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </div>
          <div
            className="flex flex-wrap items-center gap-4"
            role="group"
            aria-label="Icon set: lucide"
          >
            {[School, BookOpenText, GraduationCap, QrCode, Bell, PencilIcon, Sparkles].map(
              (Icon, i) => (
                <Icon key={i} aria-hidden size={28} className="text-forest" />
              ),
            )}
            <span className="text-small text-forest">lucide-react, stroke 2, 28 px here</span>
          </div>
        </Block>

        <Block title="Fonts and type">
          <ul className="space-y-6">
            {fonts.map(([cls, name, sample]) => (
              <li key={name} className="grid gap-2 sm:grid-cols-[14rem_1fr]">
                <p className="self-center eyebrow">{name}</p>
                <p className={`${cls} text-h3`}>{sample}</p>
              </li>
            ))}
          </ul>
          <h1>Heading one · clamp 36–64px</h1>
          <h2>Heading two · clamp 28–44px</h2>
          <h3>Heading three · clamp 22–28px</h3>
          <p className="max-w-prose">
            Body text is 18px on desktop and at least 16px on phones, line height 1.6, at most 65
            characters per line.{' '}
            <a href="#top" className="link">
              Links look like this.
            </a>
          </p>
          <p className="text-small">Small text · 15px for captions and card details.</p>
          <p className="eyebrow">Eyebrow label · gold ink</p>
        </Block>

        <Block title="Buttons">
          <p className="max-w-prose text-small text-forest">
            Primary is leaf-700 with white text. Buttons pull a little toward the cursor, ripple
            where they are tapped, press down like a stamp, and show an animated gradient border on
            keyboard focus. All of it is still with reduced motion.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>Explore the books</Button>
            <Button variant="secondary">Request a sample copy</Button>
            <Button variant="brass">Peek inside</Button>
            <Button variant="ghost">Skip intro</Button>
          </div>
        </Block>

        <Block title="Chalkboard">
          <Chalkboard>
            <ChalkText
              as="h3"
              text="Today: Hindi, Computer and Drawing"
              write
              className="text-h2"
            />
            <ChalkLine className="mt-2 w-56" />
            <p className="mt-6 max-w-prose font-hand text-2xl">
              Headings are written in chalk (Caveat) and can write themselves in when they scroll
              into view.
            </p>
          </Chalkboard>
        </Block>

        <Block title="Notebook card, sticky note and badges">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <NotebookCard title="Ruled notebook page">
              <p>
                Text sits on the lines, with a red margin and punched holes on wide screens. Used
                for notes, FAQ answers and lists.
              </p>
            </NotebookCard>
            <div className="space-y-6">
              <StickyNote tone="hindi" title="Sticky note" tilt="-rotate-2">
                A square of coloured paper held with washi tape.
              </StickyNote>
              <div className="flex flex-wrap gap-4">
                <ReportBadge label="NEP 2020" value="Aligned" />
                <ReportBadge label="Classes" value="1–8" tone="brass" />
              </div>
            </div>
          </div>
        </Block>

        <Block title="Notice board, timetable, pencil and bell">
          <NoticeBoard title="Pinned notices">
            <Pinned tilt="left">
              <p className="eyebrow">Notice</p>
              <p className="mt-2 font-heading font-bold">Sample copies for schools</p>
              <p className="mt-2 text-small text-forest">Ask on the contact page.</p>
            </Pinned>
            <Pinned tilt="right">
              <p className="eyebrow">Notice</p>
              <p className="mt-2 font-heading font-bold">QR Corner</p>
              <p className="mt-2 text-small text-forest">Scan the code on your book.</p>
            </Pinned>
            <Pinned>
              <p className="eyebrow">Notice</p>
              <p className="mt-2 font-heading font-bold">Web Support</p>
              <p className="mt-2 text-small text-forest">For teachers, by invitation.</p>
            </Pinned>
          </NoticeBoard>
          <Timetable
            caption="A timetable layout"
            columns={['Hindi', 'Computer', 'Drawing']}
            rows={[
              { label: 'Class 1', cells: ['Basic Hindi Reader 1', 'TechNova 1', 'Art Journey 1'] },
              { label: 'Class 2', cells: ['Basic Hindi Reader 2', 'TechNova 2', 'Art Journey 2'] },
            ]}
          />
          <div className="flex flex-wrap items-end gap-8">
            <Pencil className="w-48" tilt={-8} />
            <SchoolBell className="w-16" label="School bell" />
            <p className="max-w-xs text-small text-forest">
              Drawn in the brand palette. The bell rings on hover or tap (still with reduced
              motion).
            </p>
          </div>
        </Block>

        <Block title="Section heading and tags">
          <SectionHeading
            eyebrow="Our books"
            title="Three series,"
            accent="eight classes"
            lead="The eyebrow, the heading with a crayon-underlined accent, and a lead paragraph, all left-aligned."
          />
          <div className="flex flex-wrap gap-4">
            {(Object.keys(subjectTag) as (keyof typeof subjectTag)[]).map((tone) => (
              <Tag key={tone} tone={tone}>
                {tone === 'neutral' ? 'Class 3' : tone[0].toUpperCase() + tone.slice(1)}
              </Tag>
            ))}
          </div>
        </Block>

        <Block title="Brand">
          <div className="grid gap-6 sm:grid-cols-2">
            <figure className="rounded-md bg-cream p-6">
              <Image
                src="/brand/logo-full.svg"
                alt="Elara Universe Publishers Private Limited logo"
                width={1204}
                height={672}
                className="mx-auto w-full max-w-xs"
              />
              <figcaption className="mt-4 eyebrow">Full logo · logo-full.svg</figcaption>
            </figure>
            <div className="flex flex-col justify-between gap-6">
              <figure className="glass rounded-md p-6">
                <Image
                  src="/brand/logo-horizontal.svg"
                  alt="Elara Universe horizontal logo"
                  width={1874}
                  height={220}
                  className="w-full"
                />
                <figcaption className="mt-4 eyebrow">
                  Header lockup · logo-horizontal.svg
                </figcaption>
              </figure>
              <figure className="flex items-center gap-6 rounded-md bg-cream p-6">
                <Image
                  src="/brand/mark.svg"
                  alt="Elara Universe lotus-and-book mark"
                  width={324}
                  height={220}
                  className="h-16 w-auto"
                />
                <Image
                  src="/brand/icon-192.png"
                  alt="App icon"
                  width={192}
                  height={192}
                  className="h-16 w-16 rounded-md"
                />
                <figcaption className="eyebrow">Mark and icons</figcaption>
              </figure>
            </div>
          </div>
        </Block>
      </PageSection>
    </Main>
  )
}
