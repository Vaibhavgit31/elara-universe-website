import { bookBySlug, type Book } from '@/content/books'
import { subjectLabel, type Subject } from '@/content/series'
import type { Question, QuestionType, Section, Settings } from '@/lib/test-maker/types'

// Everything the printed paper and the Word file share: labels in the paper's language, numbering,
// the Set A / Set B shuffle and the answer key. Hindi papers are in Devanagari; Computer and
// Drawing papers are in English (PLAYBOOK, Step I). The Hindi labels are standard exam wording
// written for this build: Vaibhav to check them once (BUILD_LOG "For Vaibhav").

export type Language = 'hi' | 'en'
export const languageOf = (subject: Subject): Language => (subject === 'hindi' ? 'hi' : 'en')

/** How each question type is called in the Test Maker form (the interface is English). */
export const typeName: Record<QuestionType, string> = {
  mcq: 'Multiple choice',
  fill: 'Fill in the blanks',
  truefalse: 'True or false',
  match: 'Match the following',
  oneword: 'One word answer',
  short: 'Short answer',
  long: 'Long answer',
  picture: 'Picture / drawing task',
}

const labels = {
  en: {
    sections: {
      mcq: 'Choose the correct answer',
      fill: 'Fill in the blanks',
      truefalse: 'Write True or False',
      match: 'Match the following',
      oneword: 'Answer in one word',
      short: 'Answer in short',
      long: 'Answer in detail',
      picture: 'Drawing tasks',
    } satisfies Record<QuestionType, string>,
    section: 'Section',
    letters: 'ABCDEFGH',
    options: ['a', 'b', 'c', 'd', 'e', 'f'],
    name: 'Name',
    roll: 'Roll no.',
    class: 'Class',
    time: 'Time',
    minutes: 'minutes',
    maxMarks: 'Maximum marks',
    date: 'Date',
    instructions: 'General instructions',
    key: 'Answer key',
    set: 'Set',
    true: 'True',
    false: 'False',
    marks: (n: number) => `${n} ${n === 1 ? 'mark' : 'marks'}`,
    subject: subjectLabel,
  },
  hi: {
    sections: {
      mcq: 'सही उत्तर चुनिए',
      fill: 'रिक्त स्थान भरिए',
      truefalse: 'सही या गलत लिखिए',
      match: 'सही मिलान कीजिए',
      oneword: 'एक शब्द में उत्तर दीजिए',
      short: 'संक्षेप में उत्तर दीजिए',
      long: 'विस्तार से उत्तर दीजिए',
      picture: 'चित्र बनाइए',
    } satisfies Record<QuestionType, string>,
    section: 'खंड',
    letters: 'कखगघङचछज',
    options: ['क', 'ख', 'ग', 'घ', 'ङ', 'च'],
    name: 'नाम',
    roll: 'अनुक्रमांक',
    class: 'कक्षा',
    time: 'समय',
    minutes: 'मिनट',
    maxMarks: 'पूर्णांक',
    date: 'दिनांक',
    instructions: 'सामान्य निर्देश',
    key: 'उत्तर कुंजी',
    set: 'सेट',
    true: 'सही',
    false: 'गलत',
    marks: (n: number) => `${n} अंक`,
    subject: { hindi: 'हिंदी', computer: 'कंप्यूटर', drawing: 'चित्रकला' } as Record<
      Subject,
      string
    >,
  },
}
export const paperLabels = (language: Language) => labels[language]

/** A small seeded random generator (mulberry32), so a set shuffles the same way every time. */
function seeded(seed: string) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703)
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const shuffled = <T>(items: T[], random: () => number) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export type PaperQuestion = {
  n: number
  question: Question
  /** MCQ options in printed order. */
  options: string[]
  /** Match: the right-hand column in printed order (left keeps its order). */
  right: string[]
}
export type PaperSection = {
  title: string
  subtitle: string
  marks: number
  items: PaperQuestion[]
}
export type Paper = {
  book: Book
  language: Language
  set: 'A' | 'B'
  sections: PaperSection[]
  totalMarks: number
  key: { n: number; answer: string }[]
}

/** The paper as printed: Set A keeps the teacher's order; Set B shuffles questions in each
 *  section and the MCQ options. The match column is shuffled in both sets. */
export function buildPaper(settings: Settings, sections: Section[], set: 'A' | 'B'): Paper {
  const book = bookBySlug(settings.bookSlug)!
  const language = languageOf(book.subject)
  const l = paperLabels(language)
  const random = seeded(
    `${settings.bookSlug}|${set}|${sections.flatMap((s) => s.questions.map((q) => q.id)).join()}`,
  )
  let n = 0
  const key: Paper['key'] = []
  const built = sections
    .filter((s) => s.questions.length)
    .map((section, i): PaperSection => {
      const questions = set === 'B' ? shuffled(section.questions, random) : section.questions
      const items = questions.map((question) => {
        n += 1
        const options = set === 'B' ? shuffled(question.options, random) : question.options
        const right = shuffled(
          question.pairs.map((p) => p.right),
          random,
        )
        key.push({ n, answer: answerFor(question, options, right, l) })
        return { n, question, options, right }
      })
      const marks = section.questions.reduce((sum, q) => sum + q.marks, 0)
      const each = section.questions[0]?.marks
      const same = section.questions.every((q) => q.marks === each)
      return {
        title: `${l.section} ${l.letters[i]}: ${l.sections[section.type]}`,
        subtitle: same ? `${section.questions.length} × ${each} = ${marks}` : l.marks(marks),
        marks,
        items,
      }
    })
  return {
    book,
    language,
    set,
    sections: built,
    totalMarks: built.reduce((sum, s) => sum + s.marks, 0),
    key,
  }
}

/** One answer-key line: the option letter for MCQs, the pairs for matching, else the answer. */
function answerFor(q: Question, options: string[], right: string[], l: (typeof labels)[Language]) {
  if (q.type === 'mcq') {
    const i = options.indexOf(q.answer)
    return i >= 0 ? `(${l.options[i]}) ${q.answer}` : q.answer
  }
  if (q.type === 'match')
    return q.pairs.map((p, i) => `${i + 1} → (${l.options[right.indexOf(p.right)]})`).join(', ')
  return q.answer
}

/** Total marks of the questions on the paper. */
export const sumMarks = (sections: Section[]) =>
  sections.reduce((sum, s) => sum + s.questions.reduce((t, q) => t + q.marks, 0), 0)
