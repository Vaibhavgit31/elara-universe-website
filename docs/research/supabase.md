# Supabase for teacher accounts — Next.js 16 App Router

Research notes for Phase 2 Step F, written 2026-10-14. Every API fact carries a source tag (list at the end).
`supabase.com` is blocked by this session's egress proxy, so each guide was read from its **source file in the
open-source docs repo** (`github.com/supabase/supabase`, `apps/docs/...`, same path as the public URL), and every
signature was checked against the **installed type definitions** of the exact versions below (`npm pack`).
Anything not confirmable that way is marked **UNCONFIRMED**. Dashboard paths are quoted as the docs write them.

## 0. Versions (confirmed with `npm view <pkg> version`, 2026-10-14)

| Package | Version | Notes |
| --- | --- | --- |
| `@supabase/supabase-js` | **2.117.3** | re-exports all of `@supabase/auth-js` (incl. `type EmailOtpType`) [T1] |
| `@supabase/ssr` | **0.12.7** | peer `@supabase/supabase-js ^2.114.0`; only dep `cookie ^1.0.2` [T2] |
| `supabase` (CLI on npm) | **2.120.0** | `migration new`, `db push` |
| `next` (installed) | 16.4.0 | `proxy.ts` convention; `middleware.ts` deprecated in v16.0.0 [N1] |

Install: `npm install @supabase/supabase-js @supabase/ssr` [D1 "Install"].

Doc change: the old URL `/docs/guides/auth/server-side/nextjs` ("Setting up Server-Side Auth for Next.js") now
**redirects** to `/docs/guides/auth/server-side/creating-a-client?framework=nextjs`; all Next.js code below is that
guide [D1] plus its embedded samples `examples/auth/nextjs/*` [D1a] (whitespace compacted, code unchanged).

## 1. Clients, proxy (session refresh) and route protection

Env vars [D1, D5]:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...        # server only — never NEXT_PUBLIC_
```

`lib/supabase/client.ts` [D1a]:
```ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```
`createBrowserClient` is a singleton; the `cookies` option is normally not needed; `auth.storage` is ignored (session always in cookies) [T2].

`lib/supabase/server.ts` (Server Components, Server Actions, Route Handlers) [D1a]:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const cookieStore = await cookies()           // async in Next 15+/16
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // setAll was called from a Server Component. Ignore if a proxy refreshes sessions.
          }
        },
      },
    }
  )
}
```
Type: `createServerClient(url, key, { cookies: { getAll; setAll?(cookies, headers) }, cookieOptions?, cookieEncoding? })`.
`setAll`'s 2nd arg carries `Cache-Control: private, no-cache, no-store, must-revalidate, max-age=0`, `Expires: 0`,
`Pragma: no-cache`, which the proxy must copy onto the response (CDN session-leak protection) [T2, D1]. Create a new
server client per request — never at module scope (Vercel Fluid compute reuses instances) [D2].

`lib/supabase/proxy.ts` [D1a]:
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value))
        },
      },
    }
  )
  // Do not run code between createServerClient and getClaims(); removing getClaims() logs users out randomly.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims
  if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  // Return supabaseResponse as is. If you build another response: NextResponse.next({ request }), then
  // myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll()) + copy 'cache-control','expires','pragma'.
  return supabaseResponse
}
```

Root `proxy.ts` (Next 16) [D1a]:
```ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```
- Next 16: `proxy.ts` at project root (or `src/`), export named `proxy` or default; Node.js runtime only (`runtime`
  config throws); codemod `npx @next/codemod@canary middleware-to-proxy .` [N1]. On Next ≤15 `proxy.ts` is never
  called — there it is `middleware.ts` + `export async function middleware`; the Supabase code is identical [D1].
- Proxy duties: refresh via `getClaims()`, hand refreshed cookies to Server Components (`request.cookies.set`) and to the
  browser (`response.cookies.set`). Cookie name `sb-<project_ref>-auth-token` [D1].

Which call protects a route [D1, D2, D3]:
- **Never trust `getSession()` on the server** — it reads the cookie unverified; "anyone can forge the session cookie" [D1].
- **`getClaims()`** is the documented guard: verifies the JWT signature (locally via cached JWKS on asymmetric-key projects,
  the default for new projects; via the Auth server on symmetric-key projects) and refreshes when near expiry [D3, T3].
- **`getUser()`** does a network call and returns the server-confirmed user; it is the only way to notice a session revoked
  elsewhere (sign-out on another device, ban, deletion) — an unexpired JWT still passes `getClaims()` [D2, D3]. Use
  `getUser()` on sensitive pages/actions (admin portal), `getClaims()` in the proxy.
  `getUser(jwt?)` → `{ data: { user }, error: null } | { data: { user: null }, error: AuthError }` [T3].

```ts
// app/portal/page.tsx — composed from the documented APIs (the guide's page sample was not retrievable)
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic' // never ISR/cache authenticated pages [D2]
export default async function PortalPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  return <p>Hello {user.email}</p>
}
```

## 2. Email + password: sign-in, sign-out, reset, sign-ups off

Server Actions (composed from [D4, D6, T3]):
```ts
'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email')), password: String(formData.get('password')),
  })
  if (error) return { code: error.code }  // 'invalid_credentials' | 'email_not_confirmed' | 'user_banned' ...
  redirect('/portal')
}
export async function signOut() {
  await (await createClient()).auth.signOut({ scope: 'local' }) // default 'global' = every device [D6, T3]
  redirect('/login')
}
```
- `signInWithPassword(credentials): Promise<AuthTokenResponsePassword>` → `{ data: { user, session, weakPassword? }, error }` [T3].
- Branch on `error.code`, never on message text [D4, D7]. After sign-in, redirect to a page without `<Link>` prefetching
  (prefetched RSC requests can run before the cookies land) [D2].

Password reset — PKCE/SSR flow [D4 "Resetting a password", T3]:
1. Public page: `await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl}/account/update-password` })`.
   Signature `resetPasswordForEmail(email, options?: { redirectTo?; captchaToken? })` → `{ data: {}, error: null } | { data: null, error }`.
   It never reveals whether the account exists [D4]. `redirectTo` must be allow-listed in **Authentication → URL
   Configuration** (`/dashboard/project/_/auth/url-configuration`), where the production **Site URL** is set too [D8].
2. Edit the **Reset password** template at **Authentication → Email Templates** (`/dashboard/project/_/auth/templates`) [D4, D9]:
   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password">Reset password</a>
   ```
3. Token-exchange route — verbatim, Next.js tab [D4]:
   ```ts
   // app/auth/confirm/route.ts
   import { type EmailOtpType } from '@supabase/supabase-js'
   import { NextRequest, NextResponse } from 'next/server'
   import { createClient } from '@/lib/supabase/server'
   export async function GET(request: NextRequest) {
     const { searchParams } = new URL(request.url)
     const token_hash = searchParams.get('token_hash')
     const type = searchParams.get('type') as EmailOtpType | null
     const next = searchParams.get('next') ?? '/'
     const redirectTo = request.nextUrl.clone()
     redirectTo.pathname = next
     if (token_hash && type) {
       const supabase = await createClient()
       const { error } = await supabase.auth.verifyOtp({ type, token_hash })
       if (!error) return NextResponse.redirect(redirectTo)
     }
     redirectTo.pathname = '/auth/auth-code-error'
     return NextResponse.redirect(redirectTo)
   }
   ```
   `verifyOtp({ token_hash, type })`, `EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'` [T3].
   The same route serves invites (`type=invite`) and sign-up confirmations (`type=email`) [D4, D9].
4. `/account/update-password` (signed in after step 3): `await supabase.auth.updateUser({ password })` [D4, T3].
5. `exchangeCodeForSession(code)` is for redirects shaped `?code=...` (OAuth / magic-link PKCE): code valid 5 min, single
   use [D10]. For email links under SSR the docs use `token_hash` + `verifyOtp`. PKCE is **not** supported for `inviteUserByEmail` links [T4].

Turning public sign-ups OFF:
- Dashboard **Authentication → Sign In / Providers** (`/dashboard/project/_/auth/providers`) → **"Allow new users to sign
  up"** off: "If this config is disabled, only existing users can sign in." [D11]. Local/self-hosted `config.toml`:
  `[auth] enable_signup = false` (default `true`) [C1]. Management-API field name: **UNCONFIRMED**.
- `signUp()` then gets HTTP **422**, code **`signup_disabled`**, message `"Signups not allowed for this instance"`
  (Auth server source [G1]; code in the `ErrorCode` union [T5]) → `{ data: { user: null, session: null }, error: AuthApiError }` [T3].
- Admin endpoints keep working: `internal/api/admin.go` and `invite.go` contain no `DisableSignup` check [G1].

## 3. Admin API (secret key, server only) [T4, D5]

```ts
// lib/supabase/admin.ts — from [D5 "Use a secret key in backend code"] + [S1] server-side options
import 'server-only'
import { createClient } from '@supabase/supabase-js'
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })
}
```
`SupabaseClientOptions.auth` has those three fields [T1]. The legacy `service_role` JWT works identically; secret keys are
recommended [D5]. A secret key bypasses RLS **only when the request carries no user access token** — never pass a user JWT
to this client [D14 "Bypassing"].

Signatures from `GoTrueAdminApi.d.ts` (`supabase.auth.admin.*`) [T4]:

| Method | Options / return |
| --- | --- |
| `createUser(attributes: AdminUserAttributes): Promise<UserResponse>` | `{ email, password, email_confirm?: boolean, phone, phone_confirm?, user_metadata?, app_metadata?, ban_duration?, role?, password_hash?, id? }`; `email_confirm` defaults **false**; sends **no** email. |
| `inviteUserByEmail(email, options?: { data?: object; redirectTo?: string }): Promise<UserResponse>` | sends the Invite template; invitee sets a password; no PKCE. |
| `generateLink(params): Promise<GenerateLinkResponse>` | `type: 'signup'` (+`password`) `\| 'invite' \| 'magiclink' \| 'recovery' \| 'email_change_current' \| 'email_change_new'` (+`newEmail`), `email`, `options?: { data?, redirectTo? }` → `data.properties { action_link, email_otp, hashed_token, redirect_to, verification_type }` + `data.user`; creates the user for signup/invite/magiclink. |
| `updateUserById(uid, attributes: AdminUserAttributes): Promise<UserResponse>` | e.g. `{ password }`, `{ ban_duration: '876000h' }` (Go duration ns/us/ms/s/m/h; `'none'` lifts), `{ email_confirm: true }`, `{ app_metadata }`; applied directly; no client `onAuthStateChange`. |
| `deleteUser(id, shouldSoftDelete?: boolean): Promise<UserResponse>` | default hard delete: removes `auth.users` row, cascades to `auth.sessions`, refresh tokens die; issued JWTs stay valid until `exp` [D13]. |
| `listUsers(params?: { page?: number; perPage?: number })` | default 50/page → `{ data: { users, aud, nextPage, lastPage, total }, error: null } \| { data: { users: [] }, error }`. |

```ts
const admin = createAdminClient()
await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name } })
await admin.auth.admin.inviteUserByEmail(email, { redirectTo: `${siteUrl}/account/update-password` })
await admin.auth.admin.updateUserById(id, { ban_duration: 'none' })
const { data: { users } } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 })
```
A ban only blocks sign-in and does not revoke existing sessions; to remove access delete the user, keep JWT expiry short
(**Authentication → Sessions**) and `getUser()` on sensitive actions [D13].

## 4. Row Level Security [D14, D13]

```sql
-- supabase/migrations/<timestamp>_profiles.sql  (patterns verbatim from the guides)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,   -- reference only the PK [D13]
  full_name text,
  role text not null default 'teacher' check (role in ('teacher', 'admin')),
  primary key (id)
);
alter table public.profiles enable row level security;          -- 1. enable [D14]
revoke all on table public.profiles from anon, authenticated;    -- 2. policies never remove grants
grant select, update on table public.profiles to authenticated;  -- 3. only what the app needs; service_role bypasses RLS

-- one policy per operation; wrap helpers in (select ...) so Postgres caches them per statement [D14]
create policy "Users read own profile" on public.profiles for select
  to authenticated using ( (select auth.uid()) = id );
create policy "Users update own profile" on public.profiles for update
  to authenticated using ( (select auth.uid()) = id ) with check ( (select auth.uid()) = id );

-- profile row on sign-up / admin.createUser: trigger from the official guide [D13]
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();
-- "If the trigger fails, it could block signups, so test your code thoroughly." [D13]

-- admin check without recursive policies: security definer helper in a private schema [D14]
create schema if not exists private;
create function private.is_admin()
returns boolean language sql security definer set search_path = '' stable
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'); $$;
revoke execute on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
create policy "Admins read all profiles" on public.profiles for select
  to authenticated using ( (select private.is_admin()) );
```
- UPDATE needs a matching SELECT policy; INSERT uses `with check`; `auth.uid()` is null when signed out [D14].
- Always `set search_path = ''` on `security definer` functions and schema-qualify names; never create them in an exposed
  schema (`public`) — callable over the Data API with the owner's privileges [D14].
- Alternative admin flag: `auth.jwt() -> 'app_metadata'` (writable only with the secret key via `updateUserById`), **never**
  `user_metadata` (user-editable); JWT claims lag until refresh [D14]. The fuller pattern — `public.user_roles` table +
  `custom_access_token_hook` + `authorize()` security-definer function — is the RBAC guide [R1].
- Index every policy filter column; mutually-referencing policies raise `42P17` → use the helper above [D14].
- Policy tests: `supabase test new <name>.test` then `supabase test db` [D14].

## 5. Migrations, connection string, keys

Files and commands [D17, C2]:
- Folder `supabase/migrations/`, file pattern **`<timestamp>_<name>.sql`** [C2]. `supabase migration new add_profiles`
  creates e.g. `supabase/migrations/20230306095710_schema_test.sql` (14-digit `YYYYMMDDHHMMSS`, inferred from that output).
- Local: `supabase migration up` / `supabase db reset`. Deploy: `supabase login` → `supabase link` → `supabase db push`
  (tracked in `supabase_migrations.schema_migrations`; `--dry-run` previews) [D17, C2].
- Without linking: `supabase db push --db-url "$SUPABASE_DB_URL"` — the URL "must be percent-encoded" [C2].
- Plain psql (standard psql, not Supabase-specific): `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/<file>.sql`.
  Docs show `psql "sslmode=verify-full sslrootcert=/path/prod-supabase.cer host=... dbname=postgres user=postgres.[PROJECT_REF]"` [D18].
- `SUPABASE_DB_URL` is **our** name, not an official one; it is a superuser-level secret — CI/server only.
- Once on migrations, never change the remote schema in the SQL editor (breaks `db push` sync) [D17].

Connection string [D19]: Dashboard → project → **Connect** button at the top (`/dashboard/project/_?showConnect=true`)
→ choose method → copy, replace `[YOUR-PASSWORD]` (percent-encode reserved chars). Append `?sslmode=require` at minimum; copy the pooler host, it cannot be derived from the region.

| Method | String | Use |
| --- | --- | --- |
| Direct (IPv6, or IPv4 add-on) | `postgresql://postgres:[PW]@db.[REF].supabase.co:5432/postgres` | migrations, pg_dump |
| Session pooler (IPv4, every plan) | `postgresql://postgres.[REF]:[PW]@aws-[INDEX]-[REGION].pooler.supabase.com:5432/postgres` | migrations from IPv4-only networks (CI, laptops) |
| Transaction pooler | `...pooler.supabase.com:6543/postgres` | serverless app code only; no prepared statements |

Keys [D5]:

| Docs name | Format | Env var (docs) | Where |
| --- | --- | --- | --- |
| Project URL | `https://<ref>.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` | Connect dialog or Settings → API Keys |
| Publishable key (new; replaces `anon`) | `sb_publishable_...` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Settings → API Keys** (`/dashboard/project/_/settings/api-keys/`); "there is no separate Settings > API page" |
| Secret key (new; replaces `service_role`) | `sb_secret_...` | `SUPABASE_SECRET_KEY` | same page; one per backend component |
| Legacy `anon` / `service_role` | long JWT `eyJ...` | — | same page; valid until disabled there |

Secret keys are refused from browsers (401 on `User-Agent`), map to the `service_role` role (`BYPASSRLS`), and travel on
the `apikey` header, not `Authorization: Bearer` [D5]. CLI: `supabase projects api-keys --project-ref <ref>` [D5].

## 6. Rate limits and using the service role safely

Auth rate limits [D20] — set at **Authentication → Rate Limits** (`/dashboard/project/_/auth/rate-limits`) or Management
API `PATCH /v1/projects/{ref}/config/auth` (`rate_limit_email_sent`, `rate_limit_verify`, `rate_limit_token_refresh`, `rate_limit_otp`, ...):
- Token bucket per IP; most buckets burst to 30 then refill at the configured rate; over the limit → **429** [D20].
- Limited: sign-up/sign-in/recover/resend/user (per IP per 5 min), `/verify` (per IP), `/token` (per IP; password and
  refresh grants), password-reset and signup re-sends (per-user window), emails per hour on the built-in SMTP (low — use
  **Custom SMTP** in production) [D20]. Numeric defaults are rendered from config on the live site, **not in the source**.
- Server-side sign-in (Server Actions) is limited by the **server's** IP unless **IP Address Forwarding** is enabled on that
  page and `sb-forwarded-for` is sent from a **secret-key** client (publishable/legacy keys unsupported) [D20]:
  `createServerClient(url, process.env.SUPABASE_SECRET_KEY!, { global: { headers: { 'sb-forwarded-for': request.headers.get('x-forwarded-for') } } })`.
  Keep our own cooldown + honeypot on the login form; handle `over_request_rate_limit` / `over_email_send_rate_limit` [T5].

Secret-key rules [D5 "Handling secret keys safely", D14, D13]:
- Never in a browser (even localhost), source control, URLs, logs or chat; one key per backend component; delete a leaked key
  at once and rotate (create new → replace → verify → delete old).
- Use only in code that authorizes first (admin Server Actions: `getUser()` + `profiles.role = 'admin'` before `auth.admin.*`);
  never mix a user JWT into the secret-key client; run RLS tests; review the Security Advisor (`/dashboard/project/_/advisors/security`).

Useful `error.code` values [T5]: `invalid_credentials`, `email_not_confirmed`, `user_banned`, `signup_disabled`, `weak_password`, `same_password`,
`otp_expired`, `email_exists`, `user_already_exists`, `over_request_rate_limit`, `over_email_send_rate_limit`, `session_expired`, `not_admin`.

## Unknowns / UNCONFIRMED

- Management-API field name for "Allow new users to sign up" (CLI config key is `auth.enable_signup`).
- Numeric rate-limit defaults (rendered from config, not in source).
- Migration timestamp format `YYYYMMDDHHMMSS` is inferred from CLI example output, not stated as a rule.

## Sources (public URL → file read)

- [D1] https://supabase.com/docs/guides/auth/server-side/creating-a-client — `apps/docs/content/guides/auth/server-side/creating-a-client.mdx` (target of the `/server-side/nextjs` redirect in `apps/www/lib/redirects.js`); [D1a] its `$CodeSample`s `examples/auth/nextjs/lib/supabase/{client,server,proxy}.ts`, `examples/auth/nextjs/proxy.ts`
- [D2] https://supabase.com/docs/guides/auth/server-side/advanced-guide
- [D3] "Choosing an auth method" partial `apps/docs/content/_partials/auth_methods.mdx` (rendered inside D1)
- [D4] https://supabase.com/docs/guides/auth/passwords
- [D5] https://supabase.com/docs/guides/getting-started/api-keys (`/docs/guides/api/api-keys` redirects here)
- [D6] https://supabase.com/docs/guides/auth/signout
- [D7] https://supabase.com/docs/guides/auth/debugging/error-codes
- [D8] https://supabase.com/docs/guides/auth/redirect-urls
- [D9] https://supabase.com/docs/guides/auth/auth-email-templates
- [D10] https://supabase.com/docs/guides/auth/sessions/pkce-flow
- [D11] https://supabase.com/docs/guides/auth/general-configuration
- [D13] https://supabase.com/docs/guides/auth/managing-user-data (profiles table, `handle_new_user` trigger, deleting users)
- [D14] https://supabase.com/docs/guides/database/postgres/row-level-security (incl. "Use security definer functions", "Bypassing Row Level Security")
- [D17] https://supabase.com/docs/guides/deployment/database-migrations
- [D18] https://supabase.com/docs/guides/database/psql
- [D19] https://supabase.com/docs/guides/database/connecting-to-postgres
- [D20] https://supabase.com/docs/guides/auth/rate-limits (+ partial `auth_rate_limits.mdx`)
- [R1] https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac (old `/database/postgres/...rbac` URL redirects here)
- [C1] https://supabase.com/docs/guides/local-development/cli/config#auth.enable_signup (`apps/docs/spec/cli_v1_config.yaml`)
- [C2] https://supabase.com/docs/reference/cli/supabase-migration-new , https://supabase.com/docs/reference/cli/supabase-db-push (`apps/docs/spec/cli_v1_commands.yaml`)
- [T1] `@supabase/supabase-js@2.117.3` `dist/index.d.cts` (re-export of `@supabase/auth-js`; `SupabaseClientOptions.auth`)
- [T2] `@supabase/ssr@0.12.7` `dist/main/{createBrowserClient,createServerClient,types}.d.ts`
- [T3] `@supabase/auth-js@2.117.3` `dist/main/GoTrueClient.d.ts` + `lib/types.d.ts` (signUp, signInWithPassword, signOut, resetPasswordForEmail, verifyOtp, exchangeCodeForSession, getUser, getClaims, updateUser, response types)
- [T4] `@supabase/auth-js@2.117.3` `dist/main/GoTrueAdminApi.d.ts` + `lib/types.d.ts` (`AdminUserAttributes`, `GenerateLink*`, `PageParams`) — this TSDoc generates https://supabase.com/docs/reference/javascript/auth-admin-createuser , -inviteuserbyemail, -generatelink, -updateuserbyid, -deleteuser, -listusers (per `apps/docs/spec/supabase_js_v2.yml` `$ref`s)
- [T5] `@supabase/auth-js@2.117.3` `dist/main/lib/error-codes.d.ts`
- [G1] Supabase Auth server https://github.com/supabase/auth `internal/api/signup.go` (422 `signup_disabled`), `admin.go`, `invite.go`
- [N1] https://nextjs.org/docs/app/api-reference/file-conventions/proxy and https://nextjs.org/docs/app/guides/upgrading/version-16 (vercel/next.js `docs/` canary)
- [S1] `apps/docs/spec/supabase_js_v2.yml` "Create auth client (server-side)" example
