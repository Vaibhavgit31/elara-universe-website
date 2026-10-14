import { headers } from 'next/headers'

// Sliding-window counters for sign-in attempts and the public forms, kept in memory. On a single
// server this is the whole story; on Vercel each function instance keeps its own window, so
// Supabase's per-IP auth limits (Authentication → Rate Limits) stay the backstop. Nothing is
// logged, and only counts are kept.
const WINDOW_MS = 15 * 60_000
const FORM_WINDOW_MS = 60 * 60_000
// Five tries per account; the IP limit is a backstop against scanning many accounts from one place.
const LIMITS = { account: 5, ip: 100 } as const
const hits = new Map<string, number[]>()
// Past this many keys, windows that have run out are swept so memory stays bounded.
const SWEEP_AT = 5_000

/** The hits for `key` still inside the window (after pruning older ones). */
function recent(key: string, now: number, windowMs: number) {
  if (hits.size > SWEEP_AT)
    for (const [k, times] of hits) if (!times.some((t) => now - t < FORM_WINDOW_MS)) hits.delete(k)
  const times = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  hits.set(key, times)
  return times
}

/** The caller's IP: Vercel's x-real-ip, else the first x-forwarded-for hop, else null (a local
 *  server with no proxy in front, where every visitor would share one address). */
export async function clientIp() {
  const h = await headers()
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
}

/** Records a sign-in attempt; false once the account or the IP is over its 15-minute limit. The
 *  IP window applies only when the address is known. */
export function allowAttempt(ip: string | null, email: string) {
  const now = Date.now()
  const byAccount = recent(`a:${email.toLowerCase()}`, now, WINDOW_MS)
  const byIp = ip ? recent(`i:${ip}`, now, WINDOW_MS) : []
  if (byAccount.length >= LIMITS.account || byIp.length >= LIMITS.ip) return false
  byAccount.push(now)
  byIp.push(now)
  return true
}

/** Forgets the account's failed attempts after a successful sign-in. */
export const clearAttempts = (email: string) => hits.delete(`a:${email.toLowerCase()}`)

/** One submission of a public form (access request, doubt) from this IP: false after five in an
 *  hour. Unknown addresses are not limited (see clientIp). */
export function allowForm(form: string, ip: string | null, limit = 5) {
  if (!ip) return true
  const now = Date.now()
  const times = recent(`f:${form}:${ip}`, now, FORM_WINDOW_MS)
  if (times.length >= limit) return false
  times.push(now)
  return true
}
