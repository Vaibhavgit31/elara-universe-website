'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { FormState } from '@/lib/auth/actions'
import { mockMode } from '@/lib/auth/config'
import { requireAdmin } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'
import type { Created } from '@/lib/data/types'

// Admin Server Actions. Each one confirms the admin session itself and validates its FormData
// with zod before touching the store (Next.js: "always verify authentication and authorization
// inside each Server Action", https://nextjs.org/docs/app/guides/forms). Every write ends with
// revalidatePath so the admin pages show the change at once:
// https://nextjs.org/docs/app/api-reference/functions/revalidatePath

export type CreateState = {
  error?: string
  created?: { id: string; email: string; temporaryPassword?: string; invited: boolean }
}
export type ResetState = FormState & { temporaryPassword?: string }

const id = z.string().min(1)
const teacherFields = {
  name: z.string().trim().min(2, 'Enter the teacher’s name.').max(120, 'Keep the name shorter.'),
  school: z.string().trim().max(160, 'Keep the school name shorter.').default(''),
  phone: z.string().trim().max(30, 'Keep the phone number shorter.').default(''),
  classes: z.array(z.coerce.number().pipe(z.literal([1, 2, 3, 4, 5, 6, 7, 8]))),
  subjects: z.array(z.enum(['hindi', 'computer', 'drawing'])),
}
const newTeacher = z.object({
  ...teacherFields,
  email: z.email('Enter a valid email address.').max(254),
  mode: z.enum(['invite', 'password']),
  request: z.string().optional(),
})
const teacherChanges = z.object({ ...teacherFields, id })
const activeChange = z.object({
  id,
  active: z.enum(['true', 'false']).transform((v) => v === 'true'),
})
const reset = z.object({ id, mode: z.enum(['email', 'password']) })
const decline = z.object({ id })
const answer = z.object({
  id,
  answer: z
    .string()
    .trim()
    .min(2, 'Write an answer first.')
    .max(4000, 'Keep it under 4000 characters.'),
})

/** FormData as an object, with the class and subject chips gathered into arrays. */
const fields = (formData: FormData) => ({
  ...Object.fromEntries(formData),
  classes: formData.getAll('classes'),
  subjects: formData.getAll('subjects'),
})
const firstIssue = (error: z.ZodError) => error.issues[0].message
const reason = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback)
const refresh = (teacherId?: string) => {
  revalidatePath('/admin')
  if (teacherId) revalidatePath(`/admin/teachers/${teacherId}`)
}

export async function createTeacher(_prev: CreateState, formData: FormData): Promise<CreateState> {
  const admin = await requireAdmin()
  const parsed = newTeacher.safeParse(fields(formData))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const { mode, request, ...data } = parsed.data
  const store = await getStore()
  let created: Created
  try {
    created = await store.createTeacher(data, mode)
  } catch (e) {
    return { error: reason(e, 'The account could not be created.') }
  }
  if (request) await store.setRequestStatus(request, 'approved', admin.id, created.profile.id)
  refresh()
  const { id, email } = created.profile
  // No email leaves the mock store, so an "invite" there is only a profile without a password shown.
  return {
    created: {
      id,
      email,
      temporaryPassword: created.temporaryPassword,
      invited: mode === 'invite' && !mockMode,
    },
  }
}

export async function updateTeacher(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const parsed = teacherChanges.safeParse(fields(formData))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const { id, ...changes } = parsed.data
  try {
    await (await getStore()).updateTeacher(id, changes)
  } catch (e) {
    return { error: reason(e, 'The changes could not be saved.') }
  }
  refresh(id)
  return { message: 'Saved.' }
}

export async function setTeacherActive(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin()
  const parsed = activeChange.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const { id, active } = parsed.data
  if (id === admin.id) return { error: 'You cannot deactivate your own account.' }
  try {
    await (await getStore()).updateTeacher(id, { active })
  } catch (e) {
    return { error: reason(e, 'The account could not be changed.') }
  }
  refresh(id)
  return {}
}

export async function resetTeacherPassword(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  await requireAdmin()
  const parsed = reset.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const { id, mode } = parsed.data
  let result: { temporaryPassword?: string }
  try {
    result = await (await getStore()).resetTeacherPassword(id, mode)
  } catch (e) {
    return { error: reason(e, 'The password could not be reset.') }
  }
  refresh(id)
  if (result.temporaryPassword) return { temporaryPassword: result.temporaryPassword }
  return {
    message: mockMode
      ? 'In mock mode no email is sent; use the one-time password instead.'
      : 'A reset link has been emailed to the teacher.',
  }
}

export async function declineRequest(formData: FormData) {
  const admin = await requireAdmin()
  const parsed = decline.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return
  await (await getStore()).setRequestStatus(parsed.data.id, 'declined', admin.id)
  refresh()
}

export async function answerDoubt(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin()
  const parsed = answer.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  await (await getStore()).answerDoubt(parsed.data.id, parsed.data.answer, admin.id)
  refresh()
  return {}
}
