'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { bookBySlug } from '@/content/books'
import { requireSession } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'
import type { ClassNumber } from '@/lib/data/types'
import { canSeeBook } from '@/lib/portal'
import { sectionSchema, settingsSchema } from '@/lib/test-maker/types'

// Saving, duplicating and deleting Test Maker papers. Each action checks the session itself and
// validates the paper with the Test Maker's zod schemas; the store scopes every paper to its
// owner, so another teacher's id simply finds nothing (and RLS does the same in Supabase).

const paper = z.object({
  id: z.string().max(60).optional(),
  title: z.string().trim().min(1, 'Give the paper a name.').max(160),
  settings: settingsSchema,
  sections: z.array(sectionSchema).max(8),
})
export type SaveResult = { id?: string; error?: string }

export async function saveTest(input: unknown): Promise<SaveResult> {
  const session = await requireSession('/web-support/test-maker')
  const parsed = paper.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const { id, title, settings, sections } = parsed.data
  const book = bookBySlug(settings.bookSlug)
  if (!book || !canSeeBook(session, book)) return { error: 'This book is not one of your classes.' }
  try {
    const saved = await (
      await getStore()
    ).saveTest({
      id,
      teacherId: session.id,
      title,
      class: book.class as ClassNumber,
      subject: book.subject,
      bookSlug: book.slug,
      chapters: settings.chapters,
      settings,
      questions: sections,
    })
    // No revalidatePath here: the portal pages are dynamic (never cached), and a refresh would
    // re-render the editor the teacher is still working in.
    return { id: saved.id }
  } catch {
    return { error: 'The paper could not be saved. Please try again.' }
  }
}

const idOnly = z.object({ id: z.string().min(1).max(60) })

export async function duplicateTest(formData: FormData) {
  const session = await requireSession('/web-support/tests')
  const parsed = idOnly.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return
  const store = await getStore()
  const original = await store.getTest(parsed.data.id, session.id)
  if (!original) return
  const { teacherId, class: cls, subject, bookSlug, chapters, settings, questions } = original
  const saved = await store.saveTest({
    teacherId,
    class: cls,
    subject,
    bookSlug,
    chapters,
    settings,
    questions,
    title: `${original.title} (copy)`.slice(0, 160),
  })
  revalidatePath('/web-support/tests')
  redirect(`/web-support/tests/${saved.id}`)
}

export async function deleteTest(formData: FormData) {
  const session = await requireSession('/web-support/tests')
  const parsed = idOnly.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return
  await (await getStore()).deleteTest(parsed.data.id, session.id)
  revalidatePath('/web-support/tests')
  redirect('/web-support/tests')
}
