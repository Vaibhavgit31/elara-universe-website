import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server client for Server Components, Server Actions and Route Handlers: one per request, the
// session read from and written to cookies. Official guide (Next.js App Router):
// https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component: the proxy refreshes sessions, so this is safe to ignore.
          }
        },
      },
    },
  )
}
