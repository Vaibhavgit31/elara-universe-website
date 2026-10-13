'use client'

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'

import type { FlipPageElementProps, FlipPageProps } from '@/components/flip/flip-page'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const useFlipProgress = (local: MotionValue<number>, start: number, extra: number, len: number) =>
  useTransform(local, (v) => (len ? clamp01((v - start - extra) / len) : 0))

const contentClass = (bare?: boolean) =>
  bare ? 'relative' : 'relative mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-8'

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

const PageNumber = ({ current, count }: { current: number; count: number }) => (
  <p
    aria-live="polite"
    className="absolute top-11 right-3 z-50 rounded-full bg-paper/85 px-3 py-1 font-hand text-lg text-forest md:top-auto md:right-auto md:bottom-5 md:left-5"
  >
    Page {current + 1} of {count}
  </p>
)

/** Page-stack progress: thin page edges on the right that thin out as pages are read. */
const Stack = ({ current, count }: { current: number; count: number }) => (
  <ol
    aria-hidden
    className="absolute top-1/2 right-2 z-50 flex -translate-y-1/2 flex-col gap-1.5 md:right-4"
  >
    {Array.from({ length: count }, (_, i) => (
      <motion.li
        key={i}
        className="h-1 w-5 origin-right rounded-full bg-forest"
        initial={false}
        animate={{ opacity: i < current ? 0.15 : 1, scaleX: i < current ? 0.4 : 1 }}
      />
    ))}
  </ol>
)

type SheetProps = FlipPageProps & {
  index: number
  count: number
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
    <motion.section
      aria-label={`Page ${index + 1} of ${count}`}
      className={cn(
        'absolute inset-0 origin-top overflow-hidden bg-cream [backface-visibility:hidden]',
        className,
      )}
      style={{ rotateX, visibility, zIndex: count - index }}
    >
      <motion.div ref={contentRef} className={contentClass(bare)} style={{ y }}>
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-evergreen/30 to-evergreen/70"
        style={{ opacity: curl }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-evergreen/70 via-evergreen/25 to-transparent"
        style={{ opacity: castShadow }}
      />
    </motion.section>
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

/** Scroll-driven flip pad: a sticky stage where each page lifts over the top binding. */
function ScrollPad({ pages }: { pages: ReactElement<FlipPageElementProps>[] }) {
  const count = pages.length
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const [layout, setLayout] = useState<Layout>({ top: 0, stageH: 0, heights: [] })
  const [current, setCurrent] = useState(0)

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

  return (
    <div
      ref={wrapperRef}
      data-testid="flip-pad"
      className="relative min-h-svh"
      style={{ height: layout.stageH ? layout.stageH + range : undefined }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-svh overflow-hidden bg-mist"
        style={{ perspective: '1400px' }}
      >
        {pages.map((page, i) => (
          <Sheet
            key={i}
            index={i}
            count={count}
            local={local}
            start={starts[i]}
            extra={extras[i]}
            flipLen={layout.stageH}
            prev={i ? { start: starts[i - 1], extra: extras[i - 1] } : undefined}
            contentRef={(el) => {
              contentRefs.current[i] = el
            }}
            className={page.props.className}
            bare={page.props['data-bare']}
          >
            {page.props.children}
          </Sheet>
        ))}
        <Binding />
        <Stack current={current} count={count} />
        <PageNumber current={current} count={count} />
      </div>
    </div>
  )
}

/** Reduced motion: no 3D. Pages stack in normal flow and fade in as they arrive. */
function StackedPages({ pages }: { pages: ReactElement<FlipPageElementProps>[] }) {
  return (
    <div className="bg-mist">
      {pages.map((page, i) => (
        <motion.section
          key={i}
          aria-label={`Page ${i + 1} of ${pages.length}`}
          className={cn('relative min-h-svh bg-cream', page.props.className)}
          initial={i ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <Binding />
          <div className={contentClass(page.props['data-bare'])}>{page.props.children}</div>
          <PageNumber current={i} count={pages.length} />
        </motion.section>
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
