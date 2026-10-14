import { createHmac, timingSafeEqual } from 'node:crypto'

// Mock-mode session cookie: "<user id>.<hmac>". Only used when Supabase is not configured, so
// the signing key may fall back to a fixed development string; set MOCK_SESSION_SECRET to
// change it. It never protects real accounts.
const secret = process.env.MOCK_SESSION_SECRET ?? 'elara-mock-session-not-a-secret'
const sign = (id: string) => createHmac('sha256', secret).update(id).digest('base64url')

export const sealMockSession = (id: string) => `${id}.${sign(id)}`

export function openMockSession(value: string | undefined): string | null {
  const [id, mac] = value?.split('.') ?? []
  if (!id || !mac) return null
  const expected = Buffer.from(sign(id))
  const given = Buffer.from(mac)
  return expected.length === given.length && timingSafeEqual(expected, given) ? id : null
}
