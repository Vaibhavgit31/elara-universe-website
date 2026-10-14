import 'server-only'

import { randomUUID } from 'node:crypto'
import { NoObjectGeneratedError, Output, generateText } from 'ai'
import { z } from 'zod'
import type { Book } from '@/content/books'
import { aiConfigured, grok } from '@/lib/ai/xai'
import { languageOf, paperLabels, typeName } from '@/lib/test-maker/paper'
import { difficulties, type Question, type QuestionType } from '@/lib/test-maker/types'

// Drafts one section of a test paper (or one replacement question) with Grok, as structured JSON
// validated by zod: generateText + Output.object (AI SDK 7, "Generating structured data":
// https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data). Schema failures are not retried
// by the SDK, so the loop below asks again (up to three times). Without the xAI variables a
// clearly marked mock draft is returned instead.

export type DraftRequest = {
  book: Book
  chapters: string[]
  type: QuestionType
  count: number
  marks: number
  difficulty: { easy: number; medium: number; hard: number }
  /** Questions already on the paper, so a replacement is not a repeat. */
  avoid?: string[]
}

// Every field is required (empty arrays when unused): xAI's strict JSON schema mode wants that.
const draftSchema = z.object({
  questions: z.array(
    z.object({
      text: z.string().describe('The question exactly as printed'),
      options: z.array(z.string()).describe('MCQ: exactly four options; otherwise empty'),
      pairs: z
        .array(z.object({ left: z.string(), right: z.string() }))
        .describe('Match the following: four or five matching pairs; otherwise empty'),
      answer: z.string().describe('The correct answer or model answer for the answer key'),
      difficulty: z.enum(difficulties),
      chapter: z.string().describe('The chapter the question comes from, exactly as given'),
    }),
  ),
})
type Draft = z.infer<typeof draftSchema>['questions'][number]

const rules: Record<QuestionType, string> = {
  mcq: 'Each question has exactly four short options; "answer" repeats the correct option word for word.',
  fill: 'Each sentence has one blank written as ____ ; "answer" is the missing word or words.',
  truefalse:
    'Each item is one statement; "answer" is exactly the word for true or false given below.',
  match:
    'Each question has four or five pairs; "text" is a one-line instruction; "answer" may be empty.',
  oneword: 'Each question is answered in one word; "answer" is that word.',
  short: 'Each question needs two or three sentences; "answer" lists the key points.',
  long: 'Each question needs a paragraph; "answer" lists the points a full answer covers.',
  picture:
    'Each item is a drawing or colouring task suited to the class; "answer" says what to look for when marking.',
}

/** Does a draft follow the rules of its type? (zod checks the shape; this checks the meaning.) */
function fits(type: QuestionType, q: Draft, words: { true: string; false: string }) {
  if (!q.text.trim() && type !== 'match') return false
  if (type === 'mcq')
    return q.options.length === 4 && q.options.includes(q.answer) && new Set(q.options).size === 4
  if (type === 'match') return q.pairs.length >= 3 && q.pairs.length <= 6
  if (type === 'truefalse') return [words.true, words.false].includes(q.answer.trim())
  if (type === 'fill') return q.text.includes('__') && !!q.answer.trim()
  return !!q.answer.trim()
}

const toQuestion =
  (type: QuestionType, marks: number) =>
  (q: Draft): Question => ({
    id: randomUUID().slice(0, 12),
    type,
    text: q.text.trim(),
    options: type === 'mcq' ? q.options : [],
    pairs: type === 'match' ? q.pairs : [],
    answer: q.answer.trim(),
    marks,
    difficulty: q.difficulty,
    chapter: q.chapter,
    source: 'ai',
  })

export async function draftQuestions(request: DraftRequest): Promise<Question[]> {
  const { book, type, count, marks } = request
  const words = paperLabels(languageOf(book.subject))
  if (!aiConfigured) return mockDraft(request)
  const language =
    languageOf(book.subject) === 'hi'
      ? 'Write every question, option and answer in Hindi, in Unicode Devanagari script.'
      : 'Write in simple English.'
  const instructions = `You write school test questions for ${book.title}, a ${book.series} textbook (${book.subject}) by Elara Universe Publishers for Class ${book.class} in India.
Stay strictly within the chapters listed by the teacher; never use another book or class. Match the language and difficulty to a Class ${book.class} child.
Follow the NEP 2020 and NCF 2023 competency focus: mix recall with understanding, application and reasoning; keep questions fair, clear and free of bias.
${language}
Never put the answer inside the question. Return only the JSON asked for.`
  const prompt = [
    `Chapters: ${request.chapters.join('; ')}`,
    `Question type: ${typeName[type]}. ${rules[type]}`,
    type === 'truefalse' && `Use exactly "${words.true}" or "${words.false}" as the answer.`,
    `Write ${count} question${count > 1 ? 's' : ''}, each worth ${marks} mark${marks === 1 ? '' : 's'}.`,
    `Difficulty mix: about ${request.difficulty.easy}% easy, ${request.difficulty.medium}% medium, ${request.difficulty.hard}% hard.`,
    request.avoid?.length && `Do not repeat these questions: ${request.avoid.join(' | ')}`,
  ]
    .filter(Boolean)
    .join('\n')

  for (let attempt = 1; ; attempt++) {
    try {
      const { output } = await generateText({
        model: grok(),
        output: Output.object({
          name: 'TestSection',
          description: 'Questions for one section of a school test paper',
          schema: draftSchema,
        }),
        instructions,
        prompt,
        temperature: 0.5,
        maxOutputTokens: 4000,
        maxRetries: 2,
        timeout: 50_000,
        providerOptions: { xai: { store: false } },
      })
      const good = output.questions.filter((q) => fits(type, q, words)).slice(0, count)
      if (good.length === count) return good.map(toQuestion(type, marks))
      if (attempt >= 3) throw new Error('The drafts did not follow the rules three times.')
    } catch (error) {
      if (!NoObjectGeneratedError.isInstance(error) || attempt >= 3) throw error
    }
  }
}

/** Mock mode: placeholder questions in the paper's language, clearly marked as samples. */
function mockDraft({ book, chapters, type, count, marks, avoid = [] }: DraftRequest): Question[] {
  const hi = languageOf(book.subject) === 'hi'
  const l = paperLabels(hi ? 'hi' : 'en')
  return Array.from({ length: count }, (_, i) => {
    const chapter = chapters[i % chapters.length]
    // A replacement continues the numbering, so it differs from the question it replaces.
    const n = avoid.length + i + 1
    const text = hi
      ? {
          mcq: `(नमूना) “${chapter}” पाठ पर प्रश्न ${n}: सही उत्तर कौन-सा है?`,
          fill: `(नमूना) “${chapter}” पाठ का वाक्य ${n}: ____ भरिए।`,
          truefalse: `(नमूना) “${chapter}” पाठ का कथन ${n}।`,
          match: '(नमूना) शब्दों का सही मिलान कीजिए।',
          oneword: `(नमूना) “${chapter}” पाठ पर एक शब्द वाला प्रश्न ${n}?`,
          short: `(नमूना) “${chapter}” पाठ के बारे में दो-तीन वाक्य लिखिए।`,
          long: `(नमूना) “${chapter}” पाठ से आपने क्या सीखा? विस्तार से लिखिए।`,
          picture: `(नमूना) “${chapter}” पाठ से जुड़ा एक चित्र बनाइए।`,
        }[type]
      : {
          mcq: `(Sample) Question ${n} on "${chapter}": which answer is right?`,
          fill: `(Sample) Sentence ${n} from "${chapter}": fill in the ____.`,
          truefalse: `(Sample) Statement ${n} about "${chapter}".`,
          match: '(Sample) Match each word with its meaning.',
          oneword: `(Sample) One-word question ${n} on "${chapter}"?`,
          short: `(Sample) Write two or three sentences about "${chapter}".`,
          long: `(Sample) What did you learn in "${chapter}"? Explain in detail.`,
          picture: `(Sample) Draw a picture about "${chapter}".`,
        }[type]
    const options = hi
      ? ['पहला विकल्प', 'दूसरा विकल्प', 'तीसरा विकल्प', 'चौथा विकल्प']
      : ['First option', 'Second option', 'Third option', 'Fourth option']
    return {
      id: randomUUID().slice(0, 12),
      type,
      text,
      options: type === 'mcq' ? options : [],
      pairs:
        type === 'match'
          ? [1, 2, 3, 4].map((k) =>
              hi
                ? { left: `शब्द ${k}`, right: `अर्थ ${k}` }
                : { left: `Word ${k}`, right: `Meaning ${k}` },
            )
          : [],
      answer:
        type === 'mcq'
          ? options[n % 4]
          : type === 'truefalse'
            ? n % 2
              ? l.true
              : l.false
            : type === 'match'
              ? ''
              : hi
                ? '(नमूना उत्तर)'
                : '(Sample answer)',
      marks,
      difficulty: (['easy', 'medium', 'hard'] as const)[i % 3],
      chapter,
      source: 'ai' as const,
    }
  })
}
