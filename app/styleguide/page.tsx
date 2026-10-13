import type { Metadata } from 'next'
import Image from 'next/image'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Tag, subjectTag } from '@/components/ui/tag'

export const metadata: Metadata = { title: 'Style guide', robots: { index: false } }

// Hex values repeat the tokens in app/globals.css only so the page can print them as labels.
const colours = [
  ['paper', '#FBF9F4', 'Main page background'],
  ['cream', '#F5F0E8', 'Book pages and cards'],
  ['mist', '#EEF3EA', 'Light green section backgrounds'],
  ['sage-100', '#DCE5D2', 'Borders, hover tints, shelf boards'],
  ['sage', '#8A9A74', 'Icons and secondary elements'],
  ['forest', '#3F5645', 'Buttons and links'],
  ['evergreen', '#1B241D', 'Body text and headings'],
  ['brass', '#B68235', 'Bookmark ribbons and highlights'],
  ['gold-ink', '#8A6122', 'Small uppercase labels'],
  ['hindi', '#E8A53A', 'Hindi tags, shelf label, ribbon'],
  ['hindi-tint', '#FCEFD6', 'Hindi tint'],
  ['computer', '#4A90C2', 'Computer tags, shelf label, ribbon'],
  ['computer-tint', '#E1EEF7', 'Computer tint'],
  ['drawing', '#E07A5F', 'Drawing tags, shelf label, ribbon'],
  ['drawing-tint', '#FBE4DD', 'Drawing tint'],
]

const fonts = [
  ['font-heading', 'Lora 600/700', 'Headings: Books that grow curious minds'],
  ['font-display font-medium', 'Cormorant Garamond 500', 'Hero lines and the wordmark'],
  ['font-body', 'Nunito 400/600/700', 'Body text, buttons and forms'],
  ['font-hand', 'Caveat', 'Handwritten margin notes and sticky-note labels'],
  ['font-devanagari', 'Noto Sans Devanagari', 'बेसिक हिंदी रीडर · अ आ क'],
]

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-6">
    <h2 className="border-b border-sage-100 pb-2">{title}</h2>
    {children}
  </section>
)

export default function StyleguidePage() {
  return (
    <Main className="mx-auto w-full max-w-5xl gap-16 px-4 py-12 sm:px-6">
      <header>
        <p className="eyebrow">Design system</p>
        <h1>The Living Book</h1>
        <p className="mt-3 max-w-2xl">
          Cream paper, soft sage greens from the logo, touches of brass-gold. Every colour, font,
          button and tag style on the site is shown here.
        </p>
      </header>

      <Section title="Colours">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colours.map(([name, hex, use]) => (
            <li key={name} className="overflow-hidden rounded-xl border border-sage-100 bg-cream">
              <div className="h-20" style={{ background: `var(--color-${name})` }} />
              <div className="p-3 text-small">
                <p className="font-bold">{name}</p>
                <p className="text-forest">{hex}</p>
                <p className="text-forest">{use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Fonts">
        <ul className="space-y-6">
          {fonts.map(([cls, name, sample]) => (
            <li key={name} className="grid gap-1 sm:grid-cols-[14rem_1fr]">
              <p className="self-center eyebrow">{name}</p>
              <p className={`${cls} text-h3`}>{sample}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Type scale">
        <h1>Heading one · clamp 36–64px</h1>
        <h2>Heading two · clamp 28–44px</h2>
        <h3>Heading three · clamp 22–28px</h3>
        <p>
          Body text is 18px on desktop and at least 16px on phones, with a line height of 1.6, so
          both children and teachers can read it comfortably.{' '}
          <a href="#top" className="link">
            Links look like this.
          </a>
        </p>
        <p className="text-small">Small text · 15px for captions and card details.</p>
        <p className="eyebrow">Eyebrow label · gold ink</p>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-4">
          <Button>Explore the catalog</Button>
          <Button variant="secondary">Request a sample copy</Button>
          <Button variant="brass">Peek inside</Button>
          <Button variant="ghost">Skip intro</Button>
        </div>
      </Section>

      <Section title="Brand">
        <div className="grid gap-6 sm:grid-cols-2">
          <figure className="rounded-xl bg-cream p-6">
            <Image
              src="/brand/logo-full.svg"
              alt="Elara Universe Publishers Private Limited logo"
              width={1204}
              height={672}
              className="mx-auto w-full max-w-xs"
            />
            <figcaption className="mt-4 text-center eyebrow">Full logo · logo-full.svg</figcaption>
          </figure>
          <div className="flex flex-col justify-between gap-6">
            <figure className="rounded-xl bg-paper p-6 ring-1 ring-sage-100">
              <Image
                src="/brand/logo-horizontal.svg"
                alt="Elara Universe horizontal logo"
                width={1874}
                height={220}
                className="w-full"
              />
              <figcaption className="mt-4 text-center eyebrow">
                Header lockup · logo-horizontal.svg
              </figcaption>
            </figure>
            <figure className="flex items-center justify-center gap-6 rounded-xl bg-cream p-6">
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
                className="h-16 w-16 rounded-2xl"
              />
              <Image
                src="/brand/icon-32.png"
                alt="Favicon"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <figcaption className="eyebrow">Mark and icons</figcaption>
            </figure>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {['technova-1', 'technova-5', 'hindi-1', 'hindi-3'].map((name) => (
            <li key={name}>
              <Image
                src={`/books/${name}-thumb.webp`}
                alt={`${name} cover`}
                width={309}
                height={400}
                className="w-full rounded shadow-page"
              />
            </li>
          ))}
          {[1, 2].map((n) => (
            <li key={n}>
              <Image
                src={`/books/art-journey-${n}.svg`}
                alt={`Art Journey ${n} placeholder cover`}
                width={309}
                height={400}
                className="w-full rounded shadow-page"
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tags">
        <div className="flex flex-wrap gap-3">
          {(Object.keys(subjectTag) as (keyof typeof subjectTag)[]).map((tone) => (
            <Tag key={tone} tone={tone}>
              {tone === 'neutral' ? 'Class 3' : tone[0].toUpperCase() + tone.slice(1)}
            </Tag>
          ))}
        </div>
      </Section>
    </Main>
  )
}
