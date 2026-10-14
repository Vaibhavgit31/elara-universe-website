import { books } from '@/content/books'

// Chapters per book for the Test Maker (Step I). Basic Hindi Reader Classes 1 and 3 were read by
// eye from the contents pages (विषय-सूची) of the two PDFs and typed in Unicode Devanagari:
// NEEDS CHECKING against the printed books (docs/research/hindi-chapters.md lists every doubt).
// The test papers printed in the books are left out. Every other book is a [PLACEHOLDER] list:
// replace `chapters` with the real titles and set `isPlaceholder: false`.

export type Chapter = {
  id: string
  /** Chapter number as printed (पाठ 1, 2…); null for the unnumbered readings and activities. */
  no: number | null
  title: string
}

export type ChapterList = {
  chapters: Chapter[]
  /** Typed by hand from the page images; someone must compare it with the book. */
  needsChecking: boolean
  isPlaceholder: boolean
}

const list = (rows: [number | null, string][]): Chapter[] =>
  rows.map(([no, title], i) => ({ id: `c${i + 1}`, no, title }))

const hindi1 = list([
  [null, 'स्वस्थ दाँत, खुशहाल जीवन!'],
  [null, 'हाथ धोना है जरूरी!'],
  [1, 'स्वर'],
  [null, 'स्वर गीत'],
  [2, 'व्यंजन'],
  [3, '‘क’ वर्ग'],
  [null, 'नन्हा इंद्रधनुष'],
  [4, '‘च’ वर्ग'],
  [null, 'आलसी बंदर और केला'],
  [5, '‘ट’ वर्ग'],
  [null, 'मेले की सैर'],
  [6, '‘त’ वर्ग'],
  [null, 'छोटी चिड़िया की मदद'],
  [7, '‘प’ वर्ग'],
  [8, 'य से व'],
  [null, 'रोबोट की छुट्टी'],
  [9, 'श से ह'],
  [null, 'प्यासा कौआ'],
  [10, 'क्ष से श्र'],
  [null, 'वर्णमाला दोहराइए'],
  [11, 'दो अक्षर वाले शब्द'],
  [12, 'तीन अक्षर वाले शब्द'],
  [13, 'चार अक्षर वाले शब्द'],
  [null, 'दिनों और महीनों के नाम'],
  [null, 'एक-अनेक'],
  [null, 'गिनती'],
])

const hindi3 = list([
  [null, 'मेरा प्यारा स्कूल'],
  [null, 'ऋतुएँ'],
  [null, 'योगासन'],
  [1, 'गधे जी चश्मा लाए'],
  [2, 'मौसम और हम'],
  [null, 'खेल-खेल में (महीनों के नाम)'],
  [3, 'खेल जीता किसने?'],
  [4, 'दो मित्र और भालू'],
  [null, 'दयालु बालक'],
  [5, 'चंद्रशेखर आज़ाद'],
  [6, 'समय का महत्व'],
  [null, 'छोटी-सी पहल'],
  [7, 'नन्हा बीज'],
  [null, 'खेल-खेल में (पेड़ के भाग)'],
  [8, 'पिकनिक का मज़ा'],
  [9, 'बीरबल की खिचड़ी'],
  [null, 'गिनती'],
])

/** [PLACEHOLDER] Six numbered chapters, to be replaced with the real contents page. */
const placeholder = (): ChapterList => ({
  chapters: list(
    Array.from(
      { length: 6 },
      (_, i) => [i + 1, `[PLACEHOLDER] Chapter ${i + 1}`] as [number, string],
    ),
  ),
  needsChecking: false,
  isPlaceholder: true,
})

const real: Record<string, ChapterList> = {
  'hindi-1': { chapters: hindi1, needsChecking: true, isPlaceholder: false },
  'hindi-3': { chapters: hindi3, needsChecking: true, isPlaceholder: false },
}

export const chapterLists: Record<string, ChapterList> = Object.fromEntries(
  books.map((b) => [b.slug, real[b.slug] ?? placeholder()]),
)

export const chaptersFor = (slug: string): ChapterList => chapterLists[slug] ?? placeholder()
