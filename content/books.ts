import { series, type Subject } from '@/content/series'

// 24 books: 3 series × Classes 1–8. Only facts from PLAYBOOK.md and the cover files are filled
// in; everything else is null and the pages hide empty fields.
export type Book = {
  slug: string
  series: string
  subject: Subject
  class: number
  title: string
  titleHindi: string | null
  /** Cover image, or null when the artwork has not arrived yet */
  cover: string | null
  thumb: string | null
  samples: string[]
  pages: number | null
  size: string | null
  isbn: string | null
  /** MRP in rupees */
  mrp: number | null
  edition: string | null
  /** "What's inside" */
  features: string[]
  /** Digital and teacher support that comes with the book */
  support: string[]
  description: string | null
  isPlaceholder: boolean
}

const classes = [1, 2, 3, 4, 5, 6, 7, 8]

// From the TechNova back cover, "Salient Features".
const technovaFeatures = [
  'Learning Objectives',
  'Do You Know?',
  'Fact File',
  'Quick Backup',
  'Check Your Learning',
  'Exercise',
  'Application Based Questions',
  'Fun Zone',
  'Lab Session',
  'Higher Ordered Thinking',
  'Project Work',
  'Step by Step Approach',
]

const hindiSamples = (cls: number) =>
  Array.from({ length: 8 }, (_, i) => `/books/samples/hindi-${cls}/0${i + 1}.webp`)

// Cover trim size measured from the supplied PDFs (US Letter artwork).
const letter = '8.5 × 11 in'

const hindi = (cls: number): Book => {
  const hasFiles = cls === 1 || cls === 3
  return {
    slug: `hindi-${cls}`,
    series: series[0].name,
    subject: 'hindi',
    class: cls,
    title: `Basic Hindi Reader Class ${cls}`,
    titleHindi: series[0].nameHindi,
    cover: hasFiles ? `/books/hindi-${cls}.webp` : null,
    thumb: hasFiles ? `/books/hindi-${cls}-thumb.webp` : null,
    samples: hasFiles ? hindiSamples(cls) : [],
    pages: cls === 1 ? 72 : cls === 3 ? 84 : null,
    size: hasFiles ? letter : null,
    isbn: null,
    mrp: cls === 1 ? 240 : null,
    edition: null,
    features: ['Text-cum-workbook', 'Suited to students in non-Hindi-speaking regions'],
    support: ['Animated videos', 'Worksheets', 'Interactive quizzes', 'Downloadable resources'],
    description: `${series[0].blurb} Tagline: ${series[0].tagline}.`,
    isPlaceholder: !hasFiles,
  }
}

const technova = (cls: number): Book => ({
  slug: `technova-${cls}`,
  series: series[1].name,
  subject: 'computer',
  class: cls,
  title: `TechNova Class ${cls}`,
  titleHindi: null,
  cover: `/books/technova-${cls}.webp`,
  thumb: `/books/technova-${cls}-thumb.webp`,
  samples: [],
  pages: null,
  size: letter,
  isbn: cls === 1 ? '978-93-93258-70-0' : null,
  mrp: null,
  edition: null,
  features: technovaFeatures,
  support: [
    'Web support',
    'Test generator',
    'E-book',
    'Animated videos',
    'Worksheet booklet',
    'AI worksheet',
  ],
  description: `${series[1].tagline}. Windows 11 with Office 2024, compatible with Office 2019/21.`,
  isPlaceholder: false,
})

const artJourney = (cls: number): Book => ({
  slug: `art-journey-${cls}`,
  series: series[2].name,
  subject: 'drawing',
  class: cls,
  title: `Art Journey Class ${cls}`,
  titleHindi: null,
  cover: `/books/art-journey-${cls}.svg`,
  thumb: `/books/art-journey-${cls}.svg`,
  samples: [],
  pages: null,
  size: null,
  isbn: null,
  mrp: null,
  edition: null,
  features: [],
  support: [],
  description: null,
  isPlaceholder: true,
})

export const books: Book[] = [
  ...classes.map(hindi),
  ...classes.map(technova),
  ...classes.map(artJourney),
]

export const bookBySlug = (slug: string) => books.find((b) => b.slug === slug)
export const formatMrp = (mrp: number) => `MRP ₹${mrp}`
