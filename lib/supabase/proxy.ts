import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Refreshes the Supabase session on every matched request and hands the refreshed cookies both to
// Server Components (request) and to the browser (response). Verbatim from the official guide:
// https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
        },
      },
    },
  )
  // Do not run code between createServerClient and getClaims(): the guide warns it can log users out.
  const { data } = await supabase.auth.getClaims()
  return { response, signedIn: Boolean(data?.claims) }
}
