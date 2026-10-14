# Supabase setup — teacher accounts, requests, doubts and saved tests

Phase 2 (Step F) keeps teacher and admin accounts in Supabase. This file is the copy-paste
version of the setup: about 15 minutes, no command line needed except where marked optional.
Dashboard paths are quoted as the Supabase docs write them (checked 2026-10-14; labels can move,
the setting names stay the same). Every step is also summarised in `DEPLOY.md`.

> Without the Supabase variables the site runs in **mock mode**: the login, admin and portal
> pages work with two seeded demo accounts kept in memory, nothing is saved, and a "Mock mode"
> note is shown. That is how the Playwright tests run. Real accounts need the steps below.

## 1. Create the project

1. https://supabase.com/dashboard → **New project**. Name `elara-universe`, region closest to
   India (Mumbai if offered), a strong database password (keep it; it is the only way to the
   `SUPABASE_DB_URL` connection string).
2. Wait until the project shows "Active".

## 2. Copy the keys into the site's environment

**Project Settings → API Keys** (`/dashboard/project/_/settings/api-keys/`):

| Variable | Value | Where it may live |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, `https://<ref>.supabase.co` | browser and server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the **publishable** key (`sb_publishable_…`) or the legacy `anon` key | browser and server |
| `SUPABASE_SERVICE_ROLE_KEY` | the **secret** key (`sb_secret_…`) or the legacy `service_role` key | **server only** |
| `ADMIN_EMAILS` | comma-separated emails of the people who may open `/admin` | server only |
| `NEXT_PUBLIC_SITE_URL` | `https://elarauniversepublications.com` (or the preview URL) | browser and server |

Put them in `.env.local` for development and in Vercel (`vercel env add …`, see `DEPLOY.md`).
The secret key bypasses Row Level Security: it is read only by server code
(`lib/supabase/admin.ts`, marked `server-only`) and must never get a `NEXT_PUBLIC_` prefix.

## 3. Apply the database schema (tables + Row Level Security)

The schema is `supabase/migrations/20261014120000_phase2_schema.sql`: tables `profiles`,
`access_requests`, `doubts`, `tests` and `ai_usage`, the `handle_new_user` trigger that creates a
profile for every account, and the RLS policies (teachers only ever see their own tests; admins
see requests, doubts and profiles; the public form tables are written by the server only).

Either way works:

- **Dashboard (no tools):** **SQL Editor** → **New query** → paste the whole file → **Run**.
  It must finish without errors; run it only once.
- **Command line (optional):** with the connection string from the **Connect** button at the top
  of the project (choose *Session pooler*, replace `[YOUR-PASSWORD]`) in `SUPABASE_DB_URL`:
  ```bash
  npm run db:migrate            # psql "$SUPABASE_DB_URL" -f supabase/migrations/*.sql
  ```
  or with the Supabase CLI: `supabase link` → `supabase db push`.

Afterwards **Table Editor** lists the five tables, each with the RLS shield on. Every new account
gets a profile row from the trigger, but it starts *inactive, with no classes or subjects*: only
the site's `/admin` page (with the secret key) switches a teacher on and assigns their classes,
so an account made any other way cannot sign in. The policies
themselves are proven by `npm run db:test` against any local PostgreSQL (see `scripts/db/README.md`).

## 4. Switch public sign-up OFF and set the URLs

1. **Authentication → Sign In / Providers** (`/dashboard/project/_/auth/providers`) → **Email**:
   keep *Enable Email provider* on, switch **"Allow new users to sign up"** OFF. Only accounts
   created by an admin can sign in; the site never calls sign-up.
2. **Authentication → URL Configuration** (`/dashboard/project/_/auth/url-configuration`):
   **Site URL** = `https://elarauniversepublications.com`; **Redirect URLs** add
   `https://elarauniversepublications.com/**`, the Vercel preview pattern
   `https://*-<team>.vercel.app/**` and `http://localhost:3000/**` for development.
3. **Authentication → Email Templates** (`/dashboard/project/_/auth/templates`): in
   **Reset password** and **Invite user** replace the link with
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password`
   (for *Invite user* use `type=invite`). The site's `/auth/confirm` route exchanges the token
   and sends the person to the "set a new password" page.
4. Production email: **Project Settings → Authentication → SMTP** — the built-in sender is
   limited to a few emails per hour; connect the school's SMTP (or a provider) before launch.
5. **Authentication → Rate Limits**: leave the defaults (per-IP limits on sign-in and password
   reset). The site adds its own cooldown on the login form as well.

## 5. Create the first admin

Admins are the emails in `ADMIN_EMAILS`. The account itself is created once, by hand:

- **Dashboard:** **Authentication → Users → Add user → Create new user**, email = one of the
  `ADMIN_EMAILS`, a temporary password, *Auto Confirm User* on. Sign in at `/login`: the site sees
  the email in `ADMIN_EMAILS` and turns the profile into an active admin. Then change the password
  under **Profile**.
- **Or from the command line** (needs `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`):
  ```bash
  npm run create-admin -- admin@elarauniversepublications.com 'temporary-password'
  ```

Taking an email out of `ADMIN_EMAILS` (and redeploying) makes that account a teacher again at its
next page load. From then on everything happens in the site's own `/admin`: create teacher accounts with their
classes and subjects (invite email or one-time password), edit, deactivate, reset passwords,
approve access requests in one click and answer doubts.

## 6. Check

1. `/login` with the admin account → lands in `/web-support` with "My portal" in the top bar.
2. `/admin` opens for the admin; a teacher who types the URL is sent back to the portal.
3. Create a test teacher, sign in as them in a private window: they see only their own classes,
   can save a test and cannot open `/admin`.
4. **Database → Policies** shows the policies from the migration on every table.

## Keeping it safe

- Rotate the secret key at once if it ever appears in a browser, a log or a chat
  (**API Keys → Create new secret key**, replace in Vercel, delete the old one).
- Never change the schema in the SQL editor afterwards; add a new file to
  `supabase/migrations/` so the database and the repository stay in step.
- Review **Advisors → Security Advisor** after launch.
- Keep **"Allow new users to sign up"** off. Even if it were switched on, a self-made account
  starts inactive and cannot sign in, but there is no reason to collect such accounts.
