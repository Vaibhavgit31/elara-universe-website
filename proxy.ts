import { NextResponse, type NextRequest } from 'next/server'
import { MOCK_SESSION_COOKIE, mockMode } from '@/lib/auth/config'
import { openMockSession } from '@/lib/auth/mock-cookie'
import { updateSession } from '@/lib/supabase/proxy'

// Next.js 16 Proxy (the file convention that replaced middleware):
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
// Runs only on the portal, admin and account paths (matcher below), refreshes the Supabase
// session and sends visitors without one to the login page. This is the optimistic check; every
// page and action verifies the session again (lib/auth/session.ts), as the Next.js auth guide
// recommends: https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional
const publicPortalPaths = /^\/web-support\/?$|^\/web-support\/help(\/|$)/

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const needsSession = !publicPortalPaths.test(pathname)
  const toLogin = () => {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?next=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }
  if (mockMode) {
    const signedIn = Boolean(openMockSession(request.cookies.get(MOCK_SESSION_COOKIE)?.value))
    return needsSession && !signedIn ? toLogin() : NextResponse.next()
  }
  const { response, signedIn } = await updateSession(request)
  return needsSession && !signedIn ? toLogin() : response
}

export const config = {
  matcher: ['/web-support/:path*', '/admin/:path*', '/account/:path*'],
}
