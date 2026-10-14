// Home hero: the classroom scene's hotspots and copy. Facts come from content/site.ts.
import { site } from '@/content/site'

/** Size of the classroom SVG's full viewBox (components/home/classroom-scene.tsx). */
export const sceneSize = { w: 1200, h: 700 } as const

export type HotspotId =
  'bookshelf' | 'computer' | 'easel' | 'board' | 'globe' | 'chalkboard' | 'desk'

/** Lucide icon keys the hero maps to components (content stays free of React). */
export type HotspotIcon =
  'library' | 'monitor' | 'palette' | 'pin' | 'globe' | 'presentation' | 'key'

/** A box in percent of the full scene viewBox. */
export type PctBox = { x: number; y: number; w: number; h: number }

export type Hotspot = {
  id: HotspotId
  label: string
  href: string
  hint: string
  icon: HotspotIcon
  box: PctBox
}

const r2 = (n: number) => Math.round(n * 100) / 100

/** Scene user units → percent of the viewBox. */
export const pct = (x: number, y: number, w: number, h: number): PctBox => ({
  x: r2((x / sceneSize.w) * 100),
  y: r2((y / sceneSize.h) * 100),
  w: r2((w / sceneSize.w) * 100),
  h: r2((h / sceneSize.h) * 100),
})

/** The chalkboard's writing surface, where the hero lays the headline (percent of the viewBox). */
export const chalkboardText = pct(282, 72, 516, 246)

export const hero = {
  eyebrow: site.name,
  headline: 'Books that grow curious minds.', // [PLACEHOLDER] wording (PLAYBOOK.md suggestion)
  tagline: site.tagline,
  hint: 'Hover over the classroom to explore', // [PLACEHOLDER] wording
} as const

// Hint copy below is [PLACEHOLDER] wording; labels name the destination page.
export const hotspots: Hotspot[] = [
  {
    id: 'chalkboard',
    label: 'Web support',
    href: '/web-support',
    hint: 'Videos, worksheets and quizzes for every chapter',
    icon: 'presentation',
    box: pct(270, 60, 540, 290),
  },
  {
    id: 'board',
    label: 'Events',
    href: '/events',
    hint: 'Launches, workshops and book fairs',
    icon: 'pin',
    box: pct(920, 70, 240, 160),
  },
  {
    id: 'bookshelf',
    label: 'Catalog',
    href: '/catalog',
    hint: 'All books for Classes 1–8',
    icon: 'library',
    box: pct(920, 256, 240, 214),
  },
  {
    id: 'desk',
    label: 'Teacher login',
    href: '/login',
    hint: 'Teacher resources and the test generator',
    icon: 'key',
    box: pct(300, 360, 220, 116),
  },
  {
    id: 'globe',
    label: 'About us',
    href: '/about',
    hint: 'Who we are and what we publish',
    icon: 'globe',
    box: pct(455, 306, 80, 72),
  },
  {
    id: 'computer',
    label: 'TechNova',
    href: '/catalog?subject=computer',
    hint: 'Computer books, Classes 1–8',
    icon: 'monitor',
    box: pct(876, 420, 190, 180),
  },
  {
    id: 'easel',
    label: 'Art Journey',
    href: '/catalog?subject=drawing',
    hint: 'Drawing books',
    icon: 'palette',
    box: pct(1060, 456, 130, 230),
  },
]
