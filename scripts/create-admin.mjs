// Creates the first admin account with the secret key: node scripts/create-admin.mjs <email> <password>
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from the environment (or .env.local).
// The email must also be in ADMIN_EMAILS, which is what makes the account an admin on the site.
// API: https://supabase.com/docs/reference/javascript/auth-admin-createuser
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && !key.startsWith('#') && rest.length)
      process.env[key.trim()] ??= rest.join('=').trim()
  }
} catch {
  // no .env.local: the variables come from the shell
}

const [email, password] = process.argv.slice(2)
const {
  NEXT_PUBLIC_SUPABASE_URL: url,
  SUPABASE_SERVICE_ROLE_KEY: key,
  ADMIN_EMAILS: admins = '',
} = process.env
if (!email || !password) throw new Error('usage: node scripts/create-admin.mjs <email> <password>')
if (!url || !key)
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
if (
  !admins
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .includes(email.toLowerCase())
)
  console.warn(
    `Warning: ${email} is not in ADMIN_EMAILS; add it there or the account is a teacher.`,
  )

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { name: 'Admin', role: 'admin' },
})
if (error) throw error
console.log(
  `Created ${data.user.email} (${data.user.id}). Sign in at /login and change the password.`,
)
