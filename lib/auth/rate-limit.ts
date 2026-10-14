import { headers } from 'next/headers'

// Sliding-window counters for sign-in attempts, kept in memory. On a single server this is the
// whole story; on Vercel each function instance keeps its own window, so Supabase's per-IP auth
// limits (Authentication → Rate Limits) stay the backstop. Nothing is logged.
const WINDOW_MS = 15 * 60_000
// Five tries per account; the IP limit is a backstop against scanning many accounts from one place.
const LIMITS = { account: 5, ip: 100 } as const
const hits = new Map<string, number[]>()

const prune = (key: string, now: number) => {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.set(key, recent)
  return recent
}

/** The caller's IP: Vercel's x-real-ip, else the first x-forwarded-for hop, else "local". */
export async function clientIp() {
  const h = await headers()
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
}

/** Records a sign-in attempt; false once the account or the IP is over its 15-minute limit. */
export function allowAttempt(ip: string, email: string) {
  const now = Date.now()
  const byAccount = prune(`a:${email.toLowerCase()}`, now)
  const byIp = prune(`i:${ip}`, now)
  if (byAccount.length >= LIMITS.account || byIp.length >= LIMITS.ip) return false
  byAccount.push(now)
  byIp.push(now)
  return true
}

/** Forgets the account's failed attempts after a successful sign-in. */
export const clearAttempts = (email: string) => hits.delete(`a:${email.toLowerCase()}`)
