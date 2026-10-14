import { bookBySlug, type Book } from '@/content/books'
import { chaptersFor } from '@/content/chapters'
import { languageOf } from '@/lib/test-maker/paper'
import { questionTypes, type SectionPlan, type Settings } from '@/lib/test-maker/types'

// Starting values for a new paper. Picture / drawing tasks are offered for Art Journey only.

export const typesFor = (book: Pick<Book, 'subject'>) =>
  questionTypes.filter((t) => t !== 'picture' || book.subject === 'drawing')

const defaultPlan = (book: Book): SectionPlan[] =>
  book.subject === 'drawing'
    ? [
        { type: 'mcq', count: 5, marks: 1 },
        { type: 'truefalse', count: 5, marks: 1 },
        { type: 'picture', count: 2, marks: 10 },
      ]
    : [
        { type: 'mcq', count: 5, marks: 1 },
        { type: 'fill', count: 5, marks: 1 },
        { type: 'short', count: 4, marks: 2 },
        { type: 'long', count: 2, marks: 6 },
      ]

export const sumPlan = (plan: SectionPlan[]) => plan.reduce((sum, p) => sum + p.count * p.marks, 0)

const defaultInstructions = { hi: 'सभी प्रश्न अनिवार्य हैं।', en: 'All questions are compulsory.' }

/** Settings for `book`, keeping the header details (school, exam, date…) from `previous`; the
 *  instructions are kept only while the paper stays in the same language. */
export function withDefaults(book: Book, previous?: Partial<Settings>): Settings {
  const plan = defaultPlan(book)
  const list = chaptersFor(book.slug)
  const language = languageOf(book.subject)
  const before = previous?.bookSlug && bookBySlug(previous.bookSlug)
  const sameLanguage = before && languageOf(before.subject) === language
  return {
    examName: 'Unit Test',
    schoolName: '',
    logo: '',
    date: '',
    minutes: 60,
    difficulty: { easy: 40, medium: 40, hard: 20 },
    ...previous,
    bookSlug: book.slug,
    chapters: list.isPlaceholder ? [] : list.chapters.slice(0, 1).map((c) => c.title),
    plan,
    totalMarks: sumPlan(plan),
    // Standard exam wording in the paper's language ([PLACEHOLDER] until Vaibhav checks it).
    instructions: (sameLanguage && previous?.instructions) || defaultInstructions[language],
  }
}
