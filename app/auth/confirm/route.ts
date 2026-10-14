import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { PORTAL_HINT_COOKIE, mockMode } from '@/lib/auth/config'
import { createClient } from '@/lib/supabase/server'

// The link in the reset-password and invite emails lands here with a token hash; the token is
// exchanged for a session and the person continues to `next` (the new-password page). Verbatim
// from https://supabase.com/docs/guides/auth/passwords ("Resetting a password", Next.js tab).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/account/update-password'
  const redirectTo = request.nextUrl.clone()
  redirectTo.search = ''
  redirectTo.pathname = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  if (mockMode) {
    // No emails exist in mock mode; the page itself asks for a sign-in.
    return NextResponse.redirect(redirectTo)
  }
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      const response = NextResponse.redirect(redirectTo)
      response.cookies.set(PORTAL_HINT_COOKIE, '1', { path: '/', sameSite: 'lax', maxAge: 604800 })
      return response
    }
  }
  redirectTo.pathname = '/login'
  redirectTo.search = '?expired=1'
  return NextResponse.redirect(redirectTo)
}
