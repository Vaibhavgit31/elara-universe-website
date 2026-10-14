import { z } from 'zod'
import { bookBySlug } from '@/content/books'
import { chaptersFor } from '@/content/chapters'
import { siteConfig } from '@/content/site-config'
import { getSession } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'
import { canSeeBook } from '@/lib/portal'
import { draftQuestions } from '@/lib/test-maker/generate'
import { questionTypes, settingsSchema } from '@/lib/test-maker/types'

// Drafts one section (or one replacement question) for the Test Maker. Teachers and admins only,
// for books they teach, within the daily limit in content/site-config.ts. Nothing about the
// paper is stored here; saving is a separate, explicit step (app/web-support/test-maker/actions).
export const maxDuration = 60

const body = z.object({
  bookSlug: z.string().max(40),
  chapters: settingsSchema.shape.chapters,
  type: z.enum(questionTypes),
  count: z.number().int().min(1).max(30),
  marks: z.number().min(0.5).max(20),
  difficulty: settingsSchema.shape.difficulty,
  avoid: z.array(z.string().max(2000)).max(60).optional(),
})

const json = (status: number, data: object) => Response.json(data, { status })

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return json(401, { error: 'Please sign in again.' })
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== request.headers.get('host'))
    return json(403, { error: 'Not allowed.' })
  const parsed = body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return json(400, { error: parsed.error.issues[0].message })
  const { bookSlug, chapters, ...rest } = parsed.data
  const book = bookBySlug(bookSlug)
  if (!book || !canSeeBook(session, book))
    return json(403, { error: 'This book is not one of your classes.' })
  if (rest.type === 'picture' && book.subject !== 'drawing')
    return json(400, { error: 'Drawing tasks are for Art Journey papers.' })
  // Real chapter lists are a closed choice; placeholder lists let the teacher type topics.
  const list = chaptersFor(book.slug)
  if (!list.isPlaceholder && chapters.some((c) => !list.chapters.some((k) => k.title === c)))
    return json(400, { error: 'Pick chapters from the list.' })

  const today = new Date(new Date().toISOString().slice(0, 10))
  const usage = await (
    await getStore()
  ).bumpUsage('test', session.id, today, siteConfig.testDraftsPerDay, session.id)
  if (!usage.allowed)
    return json(429, {
      error: `You have used today's ${siteConfig.testDraftsPerDay} drafts. Please try again tomorrow.`,
    })
  try {
    return json(200, { questions: await draftQuestions({ book, chapters, ...rest }) })
  } catch {
    return json(502, { error: 'The draft did not come back right. Please try this section again.' })
  }
}
