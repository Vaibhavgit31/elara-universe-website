// The three series at launch. Source: PLAYBOOK.md "Books at launch" table.
export type Subject = 'hindi' | 'computer' | 'drawing'

export const subjectLabel: Record<Subject, string> = {
  hindi: 'Hindi',
  computer: 'Computer',
  drawing: 'Drawing',
}

export const series = [
  {
    id: 'hindi',
    subject: 'hindi' as Subject,
    name: 'Basic Hindi Reader',
    nameHindi: 'बेसिक हिंदी रीडर',
    tagline: 'Read • Learn • Grow',
    blurb:
      'Text-cum-workbook for Classes 1–8, also suited to students in non-Hindi-speaking regions.',
    thumb: '/books/hindi-1-thumb.webp',
    peek: ['/books/samples/hindi-1/01.webp', '/books/samples/hindi-1/02.webp'],
    isPlaceholder: false,
  },
  {
    id: 'technova',
    subject: 'computer' as Subject,
    name: 'TechNova',
    nameHindi: null,
    tagline: 'Computer Education for a Smarter World',
    blurb:
      'Windows 11 with Office 2024 (works with Office 2019/21) for Classes 1–8. Each class has its own cover colour.',
    thumb: '/books/technova-1-thumb.webp',
    peek: ['/books/technova-1-thumb.webp', '/books/technova-back-thumb.webp'],
    isPlaceholder: false,
  },
  {
    id: 'art-journey',
    subject: 'drawing' as Subject,
    name: 'Art Journey',
    nameHindi: null,
    tagline: 'Drawing',
    // Classes 1–8 "please confirm" in PLAYBOOK.md; covers and samples not received yet.
    blurb:
      'Drawing books for Classes 1–8 (to be confirmed). Covers and sample pages are on their way.',
    thumb: '/books/art-journey-1.svg',
    peek: [],
    isPlaceholder: true,
  },
]

export type Series = (typeof series)[number]
