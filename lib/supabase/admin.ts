import 'server-only'

import { createClient } from '@supabase/supabase-js'

// Secret-key client: bypasses Row Level Security, so it is created only on the server and only
// after our own authorisation checks (lib/auth/session.ts). Never pass a user token to it.
// https://supabase.com/docs/guides/getting-started/api-keys ("Use a secret key in backend code")
export const createAdminClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })
