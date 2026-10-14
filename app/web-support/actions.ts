'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { bookBySlug } from '@/content/books'
import { series } from '@/content/series'
import { safeNext } from '@/lib/auth/config'
import { allowForm, clientIp } from '@/lib/auth/rate-limit'
import { getSession, requireSession } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'
import { notifyTeam } from '@/lib/notify'

// Web Support Server Actions: the two public forms (request access, ask a doubt) and the
// signed-in teacher's own profile. Each validates its FormData with zod, the public ones carry a
// honeypot and a per-IP limit, and nothing is trusted from the browser beyond the typed fields
// (Next.js forms guide: https://nextjs.org/docs/app/guides/forms).

export type PublicFormState = { error?: string; done?: boolean; email?: string }
export type ProfileState = { error?: string; message?: string }

const text = (max: number, message: string) => z.string().trim().min(2, message).max(max)
const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s()-]{6,24}$/, 'Enter a phone number we can call, e.g. +91 98765 43210.')
const honeypot = z.string().optional() // real people never fill it in
const classNumber = z.coerce.number().pipe(z.literal([1, 2, 3, 4, 5, 6, 7, 8], 'Choose the class.'))

const accessRequest = z.object({
  name: text(120, 'Enter your name.'),
  school: text(160, 'Enter your school’s name.'),
  role: z.enum(['teacher', 'principal', 'coordinator'], 'Choose your role.'),
  email: z.email('Enter a valid email address.').max(254),
  phone,
  series: z.string().refine((id) => series.some((s) => s.id === id), 'Choose the book you use.'),
  class: classNumber,
  message: z.string().trim().max(1000, 'Keep the message under 1000 characters.').default(''),
  website: honeypot,
})

const doubt = z.object({
  name: text(120, 'Enter your name.'),
  email: z.email('Enter a valid email address so we can answer.').max(254),
  school: z.string().trim().max(160).default(''),
  question: z
    .string()
    .trim()
    .min(5, 'Write your question in a few words.')
    .max(1000, 'Keep the question under 1000 characters.'),
  page: z.string().max(200).default(''),
  website: honeypot,
})

const ownProfile = z.object({
  name: text(120, 'Enter your name.'),
  school: z.string().trim().max(160).default(''),
  phone: z.union([z.literal(''), phone]).default(''),
})

const tooMany = 'Thank you, we already have your message. Please try again in an hour.'
const failed = 'Sorry, that did not go through. Please try again, or write to us on WhatsApp.'

export async function requestAccess(
  _prev: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const parsed = accessRequest.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const { website, series: seriesId, class: cls, ...data } = parsed.data
  if (website) return { done: true, email: data.email } // a bot: look successful, save nothing
  if (!allowForm('request', await clientIp())) return { error: tooMany }
  const book = `${seriesId}-${cls}`
  try {
    await (await getStore()).createRequest({ ...data, book, class: cls })
  } catch {
    return { error: failed }
  }
  await notifyTeam('New Web Support access request', {
    ...data,
    book: bookBySlug(book)?.title ?? book,
  })
  revalidatePath('/admin')
  return { done: true, email: data.email }
}

export async function askDoubt(
  _prev: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const parsed = doubt.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const { website, page, ...data } = parsed.data
  if (website) return { done: true, email: data.email }
  if (!allowForm('doubt', await clientIp())) return { error: tooMany }
  const session = await getSession()
  // Only a path on this site is kept as "the page the doubt came from".
  const from = safeNext(page, '/web-support/help')
  try {
    await (await getStore()).createDoubt({ ...data, page: from, userId: session?.id ?? null })
  } catch {
    return { error: failed }
  }
  await notifyTeam('New doubt from Help & Doubts', { ...data, page: from })
  revalidatePath('/admin')
  return { done: true, email: data.email }
}

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  await requireSession('/web-support/profile')
  const parsed = ownProfile.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  try {
    await (await getStore()).updateOwnProfile(parsed.data)
  } catch {
    return { error: 'Your details could not be saved. Please sign in again and retry.' }
  }
  revalidatePath('/web-support', 'layout')
  return { message: 'Saved.' }
}
