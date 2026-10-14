import { site } from '@/content/site'

// Which backends are configured. Every missing key switches that feature to mock mode
// (CLAUDE.md, Phase 2 rules); the variables are listed in .env.example.
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
/** Accounts, requests, doubts and tests live in memory with demo users when Supabase is absent. */
export const mockMode = !supabaseConfigured

/** Admins are the emails in ADMIN_EMAILS (comma-separated); everyone else is a teacher. */
export const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
export const isAdminEmail = (email: string) => adminEmails.includes(email.trim().toLowerCase())

/** Where password-reset and invite links point (NEXT_PUBLIC_SITE_URL, else the production URL). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? site.url).replace(/\/$/, '')

/** Cookie names. The session hint is readable by the top bar ("My portal"); it carries no secret. */
export const PORTAL_HINT_COOKIE = 'elara_portal'
export const MOCK_SESSION_COOKIE = 'elara_mock_session'

/** Where everyone lands after signing in. */
export const PORTAL_HOME = '/web-support'
