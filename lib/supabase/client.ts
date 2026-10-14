'use client'

import { createBrowserClient } from '@supabase/ssr'

// Browser client (singleton inside the library). Official guide:
// https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
