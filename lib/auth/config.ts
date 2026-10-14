import { site } from '@/content/site'

// Which backends are configured. Every missing key switches that feature to mock mode
// (CLAUDE.md, Phase 2 rules); the variables are listed in .env.example.
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
/** Accounts, requests, doubts and tests live in memory with demo users when Supabase is absent. */
export const mockMode = !supabaseConfigured
/** The demo sign-ins work in mock mode everywhere except a Vercel production deployment, so a
 *  live site without Supabase never lets anyone in with the published demo passwords. */
export const demoLogins = mockMode && process.env.VERCEL_ENV !== 'production'

/** Admins are the emails in ADMIN_EMAILS (comma-separated); everyone else is a teacher. */
export const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
export const isAdminEmail = (email: string) => adminEmails.includes(email.trim().toLowerCase())

/** Where password-reset and invite links point (NEXT_PUBLIC_SITE_URL, else the production URL). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? site.url).replace(/\/$/, '')

/** Where everyone lands after signing in. */
export const PORTAL_HOME = '/web-support'

/** A same-site path to continue to after signing in or following an email link. Anything that
 *  would leave the site (`//host`, `/\host`, `https://…`) falls back to the portal. */
export function safeNext(value: string | null | undefined, fallback = PORTAL_HOME) {
  const base = 'http://elara.invalid'
  if (!value?.startsWith('/')) return fallback
  try {
    const url = new URL(value, base)
    return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : fallback
  } catch {
    return fallback
  }
}
