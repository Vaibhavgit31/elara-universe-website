import { books, type Book } from '@/content/books'

// Learning resources shown on /web-support/books/<slug> (Step G). Every entry here is a
// placeholder until Vaibhav sends the real videos, worksheets and quizzes: swap `url` for the real
// link or file and set `isPlaceholder: false`. The e-book tab uses the sample pages from
// content/books.ts, so Hindi Reader 1 and 3 already open as flipbooks.
export type ResourceKind = 'ebook' | 'videos' | 'worksheets' | 'quizzes' | 'downloads'

export const resourceKindLabel: Record<ResourceKind, string> = {
  ebook: 'E-book',
  videos: 'Animated videos',
  worksheets: 'Worksheets',
  quizzes: 'Interactive quizzes',
  downloads: 'Downloads',
}
export const resourceKinds = Object.keys(resourceKindLabel) as ResourceKind[]

export type Resource = {
  kind: ResourceKind
  title: string
  /** A video embed URL, a PDF path under /public, a quiz URL or a download; '' = coming soon. */
  url: string
  /** Chapter or topic the resource belongs to, when known. */
  chapter?: string
  isPlaceholder: boolean
}

/** Resources per book slug. Books not listed here show "Coming soon" on every tab. */
export const resources: Record<string, Resource[]> = Object.fromEntries(
  books.map((book) => [book.slug, placeholdersFor(book)]),
)

// [PLACEHOLDER] One empty entry per kind, so the tabs show what is expected for each book.
function placeholdersFor(book: Book): Resource[] {
  return book.support.length
    ? [
        { kind: 'videos', title: `${book.title} · chapter videos`, url: '', isPlaceholder: true },
        {
          kind: 'worksheets',
          title: `${book.title} · worksheets (PDF)`,
          url: '',
          isPlaceholder: true,
        },
        { kind: 'quizzes', title: `${book.title} · chapter quizzes`, url: '', isPlaceholder: true },
        {
          kind: 'downloads',
          title: `${book.title} · answer keys and extras`,
          url: '',
          isPlaceholder: true,
        },
      ]
    : []
}

/** The resources of one kind for a book; the e-book tab is the sample flipbook. */
export const resourcesFor = (slug: string, kind: ResourceKind) =>
  (resources[slug] ?? []).filter((r) => r.kind === kind)
