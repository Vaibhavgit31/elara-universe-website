'use client'

import { m, useSpring, type MotionStyle } from 'framer-motion'
import { Globe, KeyRound, Library, Monitor, Palette, Pin, Presentation } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from 'react'
import { ChalkText } from '@/components/classroom/chalkboard'
import { ClassroomScene, COMPACT_BOX, setClock } from '@/components/home/classroom-scene'
import { Glass } from '@/components/ui/glass'
import { TurnLink } from '@/components/ui/turn-link'
import {
  chalkboardText,
  hero,
  hotspots,
  sceneSize,
  type HotspotId,
  type PctBox,
} from '@/content/hero'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const icons = {
  library: Library,
  monitor: Monitor,
  palette: Palette,
  pin: Pin,
  globe: Globe,
  presentation: Presentation,
  key: KeyRound,
}

const p = (n: number) => `${n}%`

/** A scene box as absolute-position styles over the full scene. */
const boxStyle = (b: PctBox): CSSProperties => ({
  left: p(b.x),
  top: p(b.y),
  width: p(b.w),
  height: p(b.h),
})

/** The same box as a percent of the phone crop (COMPACT_BOX). */
const toCrop = (b: PctBox): PctBox => ({
  x: (((b.x / 100) * sceneSize.w - COMPACT_BOX.x) / COMPACT_BOX.w) * 100,
  y: (((b.y / 100) * sceneSize.h - COMPACT_BOX.y) / COMPACT_BOX.h) * 100,
  w: (((b.w / 100) * sceneSize.w) / COMPACT_BOX.w) * 100,
  h: (((b.h / 100) * sceneSize.h) / COMPACT_BOX.h) * 100,
})

// Phone crop: the full SVG is scaled and shifted inside an overflow-hidden box of the crop's aspect.
const crop = toCrop(chalkboardText)
const cropVars = {
  '--a': `${sceneSize.w} / ${sceneSize.h}`,
  '--ca': `${COMPACT_BOX.w} / ${COMPACT_BOX.h}`,
  '--sw': p((sceneSize.w / COMPACT_BOX.w) * 100),
  '--sl': p((-COMPACT_BOX.x / COMPACT_BOX.w) * 100),
  '--st': p((-COMPACT_BOX.y / COMPACT_BOX.h) * 100),
  '--x': p(chalkboardText.x),
  '--y': p(chalkboardText.y),
  '--w': p(chalkboardText.w),
  '--h': p(chalkboardText.h),
  '--cx': p(crop.x),
  '--cy': p(crop.y),
  '--cw': p(crop.w),
  '--ch': p(crop.h),
} as CSSProperties

/** Keeps the scene's clock on the visitor's local time (the server renders 10:10). */
function useLiveClock(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const tick = () => setClock(root, new Date())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [ref])
}

/** Mouse parallax as unitless px written to --px/--py; the scene's layers scale them by depth. */
function useParallax() {
  const reduced = useReducedMotion()
  const spring = { stiffness: 50, damping: 16 }
  const px = useSpring(0, spring)
  const py = useSpring(0, spring)
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 6)
  }
  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }
  return { style: { '--px': px, '--py': py } as MotionStyle, onPointerMove, onPointerLeave }
}

/**
 * The home hero: the illustrated classroom with the headline chalked on the board and a real link
 * over every object. Phones get a crop of the board end of the room and the links as chips below.
 */
export function ClassroomHero() {
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState<HotspotId | null>(null)
  const { style: parallaxStyle, ...pointer } = useParallax()
  useLiveClock(ref)
  return (
    <section className="flex flex-col justify-center py-6 md:min-h-[calc(100svh-var(--topbar-h))] md:py-10">
      <p className="eyebrow">{hero.eyebrow}</p>
      <m.div
        ref={ref}
        className="relative mt-4 w-full"
        style={{ ...cropVars, ...parallaxStyle }}
        {...pointer}
      >
        <div className="relative aspect-(--ca) overflow-hidden rounded-lg shadow-lift md:aspect-(--a)">
          <ClassroomScene
            glow={glow}
            className="absolute top-(--st) left-(--sl) w-(--sw) max-w-none md:static md:w-full"
          />
          <div className="@container pointer-events-none absolute top-(--cy) left-(--cx) flex h-(--ch) w-(--cw) flex-col justify-center p-[4%] md:top-(--y) md:left-(--x) md:h-(--h) md:w-(--w)">
            <ChalkText
              as="h1"
              text={hero.headline}
              write
              className="text-[length:9cqw] leading-[1.05]"
            />
            <p className="mt-[2cqw] font-body text-[length:max(0.8125rem,3cqw)] leading-snug text-cream/90">
              {hero.tagline}
            </p>
          </div>
          <div className="absolute inset-0 hidden md:block">
            {hotspots.map(({ id, label, href, icon, box }) => {
              const Icon = icons[icon]
              return (
                <TurnLink
                  key={id}
                  href={href}
                  aria-label={label}
                  className="group absolute flex items-end justify-center rounded-md"
                  style={boxStyle(box)}
                  onPointerEnter={() => setGlow(id)}
                  onPointerLeave={() => setGlow(null)}
                  onFocus={() => setGlow(id)}
                  onBlur={() => setGlow(null)}
                >
                  <Glass
                    radius="sm"
                    spotlight={false}
                    className={cn(
                      'mb-2 flex items-center gap-2 px-3 py-1.5 text-small font-semibold whitespace-nowrap text-forest',
                      'opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100',
                    )}
                  >
                    <Icon size={16} aria-hidden />
                    {label}
                  </Glass>
                </TurnLink>
              )
            })}
          </div>
        </div>
      </m.div>
      <p className="mt-3 hidden text-small text-forest md:block">{hero.hint}</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:hidden">
        {hotspots.map(({ id, label, href, icon }) => {
          const Icon = icons[icon]
          return (
            <li key={id}>
              <Glass radius="sm" spotlight={false} className="rounded-full">
                <TurnLink
                  href={href}
                  className="focus-glow flex min-h-11 items-center gap-2 rounded-full px-4 text-small font-semibold text-forest"
                >
                  <Icon size={18} aria-hidden className="shrink-0" />
                  {label}
                </TurnLink>
              </Glass>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
