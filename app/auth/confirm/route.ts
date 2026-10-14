import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { mockMode, safeNext } from '@/lib/auth/config'
import { PORTAL_HINT_COOKIE } from '@/lib/auth/cookie-names'
import { createClient } from '@/lib/supabase/server'

// The link in the reset-password and invite emails lands here with a token hash; the token is
// exchanged for a session and the person continues to `next` (the new-password page). Verbatim
// from https://supabase.com/docs/guides/auth/passwords ("Resetting a password", Next.js tab),
// with `next` limited to a path on this site.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = new URL(safeNext(searchParams.get('next'), '/account/update-password'), request.url)
  if (mockMode) {
    // No emails exist in mock mode; the page itself asks for a sign-in.
    return NextResponse.redirect(next)
  }
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      const response = NextResponse.redirect(next)
      response.cookies.set(PORTAL_HINT_COOKIE, '1', { path: '/', sameSite: 'lax', maxAge: 604800 })
      return response
    }
  }
  return NextResponse.redirect(new URL('/login/?expired=1', request.url))
}
