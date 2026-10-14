'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { PORTAL_HINT_COOKIE, PORTAL_HOME } from '@/lib/auth/config'
import { allowAttempt, clearAttempts, clientIp } from '@/lib/auth/rate-limit'
import { getSession } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'

// Server Actions for signing in and out and for passwords. Each one validates its input with zod
// and checks the session itself (Next.js: "always verify authentication and authorization inside
// each Server Action", https://nextjs.org/docs/app/guides/forms). Errors come back as state for
// useActionState; redirect() is called outside try/catch because it throws.

export type FormState = { error?: string; message?: string }

const credentials = z.object({
  email: z.email('Enter the email address of your account.'),
  password: z.string().min(1, 'Enter your password.'),
  next: z.string().optional(),
  website: z.string().max(0).optional(), // honeypot: real people never fill it in
})
const newPassword = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(72, 'Keep it under 72 characters.')

/** Only same-site paths may follow a sign-in; anything else lands in the portal. */
const safeNext = (value?: string) =>
  value?.startsWith('/') && !value.startsWith('//') ? value : PORTAL_HOME

const hint = async (on: boolean) => {
  const jar = await cookies()
  if (on) jar.set(PORTAL_HINT_COOKIE, '1', { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
  else jar.delete(PORTAL_HINT_COOKIE)
}

const messages = {
  invalid_credentials: 'That email and password do not match. Please try again.',
  inactive: 'This account has been deactivated. Please write to us if that is a mistake.',
  error: 'We could not sign you in just now. Please try again in a moment.',
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const { email, password, next, website } = parsed.data
  if (website) return { error: messages.invalid_credentials }
  if (!allowAttempt(await clientIp(), email))
    return { error: 'Too many attempts. Please wait 15 minutes and try again.' }
  const result = await (await getStore()).signIn(email, password)
  if (!result.ok) return { error: messages[result.code] }
  clearAttempts(email)
  await hint(true)
  redirect(safeNext(next))
}

export async function signOut() {
  await (await getStore()).signOut()
  await hint(false)
  redirect('/')
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = z
    .email('Enter the email address of your account.')
    .safeParse(formData.get('email'))
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  if (formData.get('website')) return { message: 'If that account exists, an email is on its way.' }
  if (!allowAttempt(await clientIp(), parsed.data))
    return { error: 'Too many attempts. Please wait 15 minutes and try again.' }
  await (await getStore()).requestPasswordReset(parsed.data)
  // The same answer whether or not the account exists (never reveal which emails have accounts).
  return { message: 'If that account exists, an email with a reset link is on its way.' }
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await getSession())) redirect('/login?next=/account/update-password')
  const parsed = z
    .object({ password: newPassword, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: 'The two passwords differ.' })
    .safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const result = await (await getStore()).updatePassword(parsed.data.password)
  if (!result.ok) return { error: result.message ?? 'The password could not be changed.' }
  await hint(true)
  redirect(PORTAL_HOME)
}
