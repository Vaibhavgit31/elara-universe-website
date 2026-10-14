import type { Metadata } from 'next'
import Image from 'next/image'
import { FlipPad } from '@/components/flip/flip-pad'
import { FlipPage } from '@/components/flip/flip-page'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'

export const metadata: Metadata = { title: 'Flip-pad demo', robots: { index: false } }

// Five sample pages to test the flip-pad on a laptop and a phone. Not linked from the menu.
const paragraphs = [
  'Each section of the site is a page bound at the top edge, like a flip notepad. When you scroll or swipe up, the current page lifts and folds over the top binding with a soft shadow, revealing the next page.',
  'Scroll position drives the motion, so it can be reversed by scrolling back. Pages move up and down, which feels natural on phones.',
  'Sections taller than the screen scroll inside the page first, then flip. This page is deliberately long so you can feel that happen.',
  'Animate only transform and opacity, so motion stays smooth on a mid-range Android phone. A page flip takes 600–800 ms, easing out.',
  'Text must be readable within 1 second of landing on a page. Animation never hides the menu or blocks reading.',
  'If the visitor’s device asks for reduced motion, there are no 3D flips, only gentle fades.',
  'Page content must be real HTML text, not images, so Google and screen readers can read it.',
  'The whole site looks like a storybook lying open on a sunny desk. It uses cream paper, soft sage greens taken from the logo, a few touches of brass-gold, and pages that lift and turn as you scroll.',
]

export default function DemoFlipPage() {
  return (
    <Main>
      <FlipPad>
        <FlipPage>
          <p className="eyebrow">Demo · page one</p>
          <h1>The flip-pad scroll</h1>
          <p className="mt-4 max-w-xl">
            Scroll down slowly. This page lifts over the rings at the top and reveals the next one.
            Scroll back up and it settles down again.
          </p>
          <div className="mt-8 flex gap-3">
            <Tag tone="hindi">Hindi</Tag>
            <Tag tone="computer">Computer</Tag>
            <Tag tone="drawing">Drawing</Tag>
          </div>
        </FlipPage>
        <FlipPage>
          <p className="eyebrow">Demo · page two</p>
          <h2>A page taller than the screen</h2>
          <div className="mt-4 max-w-prose space-y-5">
            {[...paragraphs, ...paragraphs].map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          <p className="mt-8 font-hand text-2xl text-brass">…and only now does it flip.</p>
        </FlipPage>
        <FlipPage className="bg-mist">
          <p className="eyebrow">Demo · page three</p>
          <h2>Pictures stay sharp while turning</h2>
          <ul className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {['technova-1', 'technova-2', 'hindi-1', 'hindi-3', 'technova-7', 'technova-8'].map(
              (name) => (
                <li key={name}>
                  <Image
                    src={`/books/${name}-thumb.webp`}
                    alt={`${name} cover`}
                    width={309}
                    height={400}
                    className="w-full rounded-sm shadow-page"
                  />
                </li>
              ),
            )}
          </ul>
        </FlipPage>
        <FlipPage>
          <p className="eyebrow">Demo · page four</p>
          <h2>A short page</h2>
          <blockquote className="mt-6 max-w-lg rotate-[-1.5deg] bg-hindi-tint p-6 font-hand text-2xl shadow-page">
            “Short pages flip as soon as you scroll; long ones scroll inside first.”
          </blockquote>
        </FlipPage>
        <FlipPage>
          <p className="eyebrow">Demo · page five</p>
          <h2>The last page does not flip</h2>
          <p className="mt-4 max-w-xl">
            There is nothing underneath it, so the pad simply scrolls on to the footer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/">Back to the cover</Button>
            <Button href="/styleguide" variant="secondary">
              Style guide
            </Button>
          </div>
        </FlipPage>
      </FlipPad>
    </Main>
  )
}
