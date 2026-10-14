'use client'

import { ArrowUp } from 'lucide-react'
import { m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useLenis } from 'lenis/react'
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { DeskMood } from '@/components/extras/desk-mood'
import { SoundToggle } from '@/components/ui/sound-toggle'
import { siteConfig } from '@/content/site-config'
import { cn } from '@/lib/cn'
import { playFlipSound, useFlipSound } from '@/lib/flip-sound'

import type { FlipPageElementProps, FlipPageProps } from '@/components/flip/flip-page'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const FlipPageContext = createContext(true)
/** True while this page is the one being read (always true outside a flip pad). */
export const useFlipPageActive = () => useContext(FlipPageContext)
const useFlipProgress = (local: MotionValue<number>, start: number, extra: number, len: number) =>
  useTransform(local, (v) => (len ? clamp01((v - start - extra) / len) : 0))

const contentClass = (bare?: boolean) => (bare ? 'relative' : 'relative container-page pt-16 pb-14')

/** Keys that turn pages: PageUp/PageDown and the left/right arrows. Up/Down keep scrolling. */
const keyStep: Record<string, number> = { PageDown: 1, ArrowRight: 1, PageUp: -1, ArrowLeft: -1 }
const inField = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable ||
    !!el.closest('input, textarea, select, dialog, [data-testid="flipbook"]'))

/** The pad's binding: a board across the top with rings holding every page. */
const Binding = () => (
  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-50 h-9 bg-sage-100">
    <svg className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <pattern id="rings" width="56" height="36" patternUnits="userSpaceOnUse">
          <circle cx="28" cy="27" r="4" fill="var(--color-paper)" />
          <path
            d="M28 27V8a8 8 0 0 1 8-8"
            fill="none"
            stroke="var(--color-evergreen)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rings)" />
    </svg>
  </div>
)

type Jump = (index: number) => void

const PageNumber = ({ current, count, jump }: { current: number; count: number; jump: Jump }) => (
  <div className="absolute top-0.5 right-2 z-[60] flex items-center gap-2 md:top-auto md:right-auto md:bottom-4 md:left-[max(1.25rem,calc((100vw-var(--container-page))/2))]">
    <p
      aria-live="polite"
      className="rounded-full bg-paper px-3 py-0.5 font-hand text-base text-forest shadow-page md:bg-paper/85 md:py-1 md:text-lg md:shadow-none"
    >
      Page {current + 1} of {count}
    </p>
    {siteConfig.pageTurnSound && <SoundToggle className="size-8 md:size-9" />}
    {current > 0 && (
      <button
        type="button"
        onClick={() => jump(0)}
        aria-label="Back to top"
        className="flex size-8 items-center justify-center rounded-full bg-sage-100 text-forest hover:bg-sage md:size-9"
      >
        <ArrowUp aria-hidden size={18} />
      </button>
    )}
  </div>
)

/** Page dots on the right: one per page, the ones already read thin out; each jumps to its page. */
const PageDots = ({ current, count, jump }: { current: number; count: number; jump: Jump }) => (
  <nav
    aria-label="Pages"
    className="absolute top-1/2 right-0 z-50 -translate-y-1/2 md:right-1"
    data-testid="page-dots"
  >
    <ol className="flex flex-col">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() => jump(i)}
            aria-label={`Page ${i + 1} of ${count}`}
            aria-current={i === current ? 'page' : undefined}
            className="flex h-6 w-11 items-center justify-end pr-2 md:h-7"
          >
            <m.span
              className="block h-1.5 w-5 origin-right rounded-full bg-forest"
              initial={false}
              animate={{ opacity: i < current ? 0.25 : 1, scaleX: i < current ? 0.45 : 1 }}
            />
          </button>
        </li>
      ))}
    </ol>
  </nav>
)

/** PageUp/PageDown and left/right arrows turn pages while the pad is on screen. */
function usePageKeys(
  wrapper: React.RefObject<HTMLDivElement | null>,
  current: number,
  count: number,
  jump: Jump,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const step = keyStep[e.key]
      const rect = wrapper.current?.getBoundingClientRect()
      if (!step || !rect || rect.bottom < 0 || rect.top > innerHeight || inField(e.target)) return
      const next = current + step
      if (next < 0 || next >= count) return
      e.preventDefault()
      jump(next)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [wrapper, current, count, jump])
}

type SheetProps = FlipPageProps & {
  index: number
  count: number
  active: boolean
  local: MotionValue<number>
  start: number
  extra: number
  flipLen: number
  prev?: { start: number; extra: number }
  contentRef: (el: HTMLDivElement | null) => void
}

/** One cream sheet in the stack. Scrolls inside first (y), then rotates up around its top edge. */
function Sheet({
  index,
  count,
  local,
  start,
  extra,
  flipLen,
  prev,
  contentRef,
  children,
  className,
  bare,
  active,
}: SheetProps) {
  const p = useFlipProgress(local, start, extra, flipLen)
  const prevP = useFlipProgress(local, prev?.start ?? 0, prev?.extra ?? 0, flipLen)
  const rotateX = useTransform(p, [0, 1], [0, -180])
  const y = useTransform(local, (v) => -Math.min(Math.max(0, v - start), extra))
  const visibility = useTransform(p, (v) => (v >= 1 ? 'hidden' : 'visible'))
  // The lifting page darkens as it curls; the page beneath catches its moving shadow.
  const curl = useTransform(p, [0, 0.5, 1], [0, 0.35, 0.6])
  const castShadow = useTransform(prevP, (v) => (prev ? Math.sin(v * Math.PI) * 0.45 : 0))

  return (
    <m.section
      aria-label={`Page ${index + 1} of ${count}`}
      className={cn(
        'absolute inset-0 origin-top overflow-hidden bg-cream [backface-visibility:hidden]',
        className,
      )}
      style={{ rotateX, visibility, zIndex: count - index }}
    >
      <m.div ref={contentRef} className={contentClass(bare)} style={{ y }}>
        <FlipPageContext value={active}>{children}</FlipPageContext>
      </m.div>
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-evergreen/30 to-evergreen/70"
        style={{ opacity: curl }}
      />
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-evergreen/70 via-evergreen/25 to-transparent"
        style={{ opacity: castShadow }}
      />
    </m.section>
  )
}

type Layout = { top: number; stageH: number; heights: number[] }

/** Each page owns a scroll slot: its inner-scroll distance (content taller than the stage) plus
 *  one stage height for the flip. The last page only scrolls; nothing lies beneath it. */
function slotsFor({ stageH, heights }: Layout, count: number) {
  const extras = Array.from({ length: count }, (_, i) => Math.max(0, (heights[i] ?? 0) - stageH))
  const slots = extras.map((e, i) => e + (i < count - 1 ? stageH : 0))
  const starts = slots.map((_, i) => slots.slice(0, i).reduce((a, b) => a + b, 0))
  const range = slots.reduce((a, b) => a + b, 0)
  // The page being read: a page counts as read once it has flipped halfway.
  const indexAt = (local: number) =>
    starts.findIndex((s, i) => i === count - 1 || local < s + extras[i] + stageH / 2)
  return { extras, starts, range, indexAt }
}

/** Scroll-driven flip pad: a sticky stage (below the fixed top bar) where each page lifts over
 *  the top binding. Page dots, a back-to-top button and PageUp/PageDown jump between pages. */
function ScrollPad({ pages }: { pages: ReactElement<FlipPageElementProps>[] }) {
  const count = pages.length
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const [layout, setLayout] = useState<Layout>({ top: 0, stageH: 0, heights: [] })
  const [current, setCurrent] = useState(0)
  const reduced = useReducedMotion()
  const lenis = useLenis()

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const next = {
        top: wrapper.getBoundingClientRect().top + window.scrollY,
        stageH: stageRef.current?.offsetHeight ?? 0,
        heights: contentRefs.current.map((el) => el?.offsetHeight ?? 0),
      }
      setLayout(next)
      setCurrent(slotsFor(next, count).indexAt(window.scrollY - next.top))
    })
    for (const el of [stageRef.current, ...contentRefs.current]) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [count])

  const { extras, starts, range, indexAt } = slotsFor(layout, count)
  const { scrollY } = useScroll()
  const local = useTransform(scrollY, (y) => y - layout.top)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const index = indexAt(y - layout.top)
    if (index !== current) setCurrent(index)
  })
  const sound = useFlipSound()
  useEffect(() => {
    if (sound && current > 0) playFlipSound()
  }, [current, sound])

  // Scroll to where page i lies flat. Lenis (docs: lenis/react useLenis) animates it; without
  // Lenis (reduced motion) the browser jumps.
  const jump: Jump = (i) => {
    const y = layout.top + starts[i]
    if (lenis) lenis.scrollTo(y, { immediate: reduced })
    else window.scrollTo({ top: y, behavior: 'auto' })
  }
  usePageKeys(wrapperRef, current, count, jump)

  return (
    <div
      ref={wrapperRef}
      data-testid="flip-pad"
      data-starts={starts.join(',')}
      className="relative min-h-svh"
      style={{ height: layout.stageH ? layout.stageH + range : undefined }}
    >
      <div
        ref={stageRef}
        className="sticky top-[var(--topbar-h)] h-[calc(100svh-var(--topbar-h))] overflow-hidden"
        style={{ perspective: '1400px' }}
      >
        {pages.map((page, i) => (
          <Sheet
            key={i}
            index={i}
            count={count}
            active={current === i}
            local={local}
            start={starts[i]}
            extra={extras[i]}
            flipLen={layout.stageH}
            prev={i ? { start: starts[i - 1], extra: extras[i - 1] } : undefined}
            contentRef={(el) => {
              contentRefs.current[i] = el
            }}
            className={page.props.className}
            bare={page.props['data-bare'] ?? page.props.bare}
          >
            {page.props.children}
          </Sheet>
        ))}
        <DeskMood />
        <Binding />
        <PageDots current={current} count={count} jump={jump} />
        <PageNumber current={current} count={count} jump={jump} />
      </div>
    </div>
  )
}

/** Reduced motion: no 3D. Pages stack in normal flow and fade in as they arrive; the dots
 *  follow the page in view and jump between sections. */
function StackedPages({ pages }: { pages: ReactElement<FlipPageElementProps>[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sections = useRef<(HTMLElement | null)[]>([])
  const [current, setCurrent] = useState(0)
  const [starts, setStarts] = useState<number[]>([])
  useEffect(() => {
    // Where each page starts, relative to the pad (used by the tests and the dots).
    const measure = new ResizeObserver(() =>
      setStarts(sections.current.map((el) => el?.offsetTop ?? 0)),
    )
    for (const el of sections.current) if (el) measure.observe(el)
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setCurrent(sections.current.indexOf(hit.target as HTMLElement))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    for (const el of sections.current) if (el) observer.observe(el)
    return () => {
      measure.disconnect()
      observer.disconnect()
    }
  }, [])
  const jump: Jump = (i) => sections.current[i]?.scrollIntoView()
  usePageKeys(wrapperRef, current, pages.length, jump)
  return (
    <div
      ref={wrapperRef}
      data-testid="flip-pad"
      data-stacked=""
      data-starts={starts.join(',')}
      className="relative"
    >
      <div className="sticky top-[40svh] z-50 float-right h-0">
        <PageDots current={current} count={pages.length} jump={jump} />
      </div>
      {pages.map((page, i) => (
        <m.section
          key={i}
          ref={(el) => {
            sections.current[i] = el
          }}
          aria-label={`Page ${i + 1} of ${pages.length}`}
          className={cn(
            'relative min-h-[calc(100svh-var(--topbar-h))] scroll-mt-[var(--topbar-h)] bg-cream',
            page.props.className,
          )}
          initial={i ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <Binding />
          <div className={contentClass(page.props['data-bare'] ?? page.props.bare)}>
            {page.props.children}
          </div>
          <PageNumber current={i} count={pages.length} jump={jump} />
        </m.section>
      ))}
    </div>
  )
}

export function FlipPad({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children).filter(
    (child): child is ReactElement<FlipPageElementProps> => isValidElement(child),
  )
  const reduced = useReducedMotion()
  return reduced ? <StackedPages pages={pages} /> : <ScrollPad pages={pages} />
}
