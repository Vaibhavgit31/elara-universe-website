import 'server-only'

import { redirect } from 'next/navigation'
import { cache } from 'react'
import { PORTAL_HOME } from '@/lib/auth/config'
import { getStore } from '@/lib/data/store'
import type { Profile, Session } from '@/lib/data/types'

/** Who is signed in for this request (one lookup per request, cached). */
export const getSession = cache((): Promise<Session> => getStore().then((s) => s.currentProfile()))

/** The signed-in profile, or a redirect to the login page that comes back to `next`. */
export async function requireSession(next: string): Promise<Profile> {
  const session = await getSession()
  if (!session) redirect(`/login?next=${encodeURIComponent(next)}`)
  return session
}

/** An admin, or a redirect: visitors to the login page, teachers to their portal. */
export async function requireAdmin(next = '/admin'): Promise<Profile> {
  const session = await requireSession(next)
  if (session.role !== 'admin') redirect(PORTAL_HOME)
  return session
}
