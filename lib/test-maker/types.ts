import { z } from 'zod'

// The Test Maker's own shapes: the settings chosen in the form and the paper's sections. Both are
// stored as JSON in the `tests` table (settings, questions), so they are validated with zod
// whenever they come back from the browser or the database.

export const questionTypes = [
  'mcq',
  'fill',
  'truefalse',
  'match',
  'oneword',
  'short',
  'long',
  'picture',
] as const
export type QuestionType = (typeof questionTypes)[number]

export const difficulties = ['easy', 'medium', 'hard'] as const

export const questionSchema = z.object({
  id: z.string().min(1).max(40),
  type: z.enum(questionTypes),
  text: z.string().max(2000),
  /** MCQ: four options; the answer is one of them. */
  options: z.array(z.string().max(300)).max(6).default([]),
  /** Match the following: left column ↔ right column (the right side is shuffled on paper). */
  pairs: z
    .array(z.object({ left: z.string().max(200), right: z.string().max(200) }))
    .max(8)
    .default([]),
  answer: z.string().max(2000),
  marks: z.number().min(0).max(100),
  difficulty: z.enum(difficulties).default('medium'),
  chapter: z.string().max(200).default(''),
  /** 'ai' questions carry the "AI draft — please check" label until the teacher edits them. */
  source: z.enum(['ai', 'teacher']),
})
export type Question = z.infer<typeof questionSchema>

export const sectionSchema = z.object({
  type: z.enum(questionTypes),
  questions: z.array(questionSchema).max(60),
})
export type Section = z.infer<typeof sectionSchema>

export const sectionPlanSchema = z.object({
  type: z.enum(questionTypes),
  count: z.number().int().min(1).max(30),
  marks: z.number().min(0.5).max(20),
})
export type SectionPlan = z.infer<typeof sectionPlanSchema>

export const settingsSchema = z.object({
  bookSlug: z.string().min(1).max(40),
  chapters: z.array(z.string().min(1).max(200)).min(1, 'Pick at least one chapter.').max(40),
  plan: z.array(sectionPlanSchema).min(1, 'Choose at least one question type.').max(8),
  difficulty: z.object({
    easy: z.number().int().min(0).max(100),
    medium: z.number().int().min(0).max(100),
    hard: z.number().int().min(0).max(100),
  }),
  totalMarks: z.number().int().min(1).max(200),
  minutes: z.number().int().min(5).max(240),
  examName: z.string().trim().max(120),
  schoolName: z.string().trim().max(160),
  /** A small data: URL image, kept with the paper. */
  logo: z
    .string()
    .max(250_000)
    .refine(
      (v) => v === '' || /^data:image\/(png|jpeg|webp);base64,/.test(v),
      'Logo must be a PNG, JPEG or WebP image.',
    )
    .default(''),
  date: z.string().max(40).default(''),
  instructions: z.string().max(1500).default(''),
})
export type Settings = z.infer<typeof settingsSchema>
