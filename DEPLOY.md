# Deploying the Elara Universe website (Vercel, from your computer)

Since Phase 2 the site has a server part: teacher logins, the admin page, Web Support, the Elu
chatbot and the Test Maker run as server routes. It is deployed to **Vercel** straight from the
project folder with the Vercel command-line tool, so **GitHub is not needed**. Phase 1's Netlify
Drop route (`out/` folder) no longer applies.

Plan for about an hour the first time:

1. [What you need](#1-what-you-need) — accounts and keys
2. [Supabase](#2-supabase-teacher-accounts-and-saved-tests) — the database for accounts and papers
3. [Deploy with the Vercel CLI](#3-deploy-with-the-vercel-cli-no-github) — preview, then production
4. [Every environment variable](#4-every-environment-variable)
5. [The first admin and the teachers](#5-the-first-admin-and-the-teachers)
6. [Connect elarauniversepublications.com](#6-connect-elarauniversepublicationscom)
7. [Launch checklist](#7-launch-checklist) and [updating later](#8-updating-the-site-later)

> **Mock mode.** Every feature that needs a key has a safe stand-in, so the site also runs with
> no keys at all: accounts, requests, doubts and saved papers live in the server's memory with
> three demo accounts, the chatbot answers from the site's own content, and the Test Maker
> drafts sample questions. The pages say "Mock mode" wherever that is the case. On a Vercel
> **production** deployment without Supabase, the demo sign-ins are switched off.

## 1. What you need

| What | Where | Used for |
| --- | --- | --- |
| Node.js 22 (LTS) | https://nodejs.org | building and the CLI (`ai@7` needs Node 22 or newer) |
| Vercel account (free to start) | https://vercel.com | hosting |
| Supabase project (free to start) | https://supabase.com/dashboard | teacher and admin accounts, access requests, doubts, saved papers |
| xAI API key | https://console.x.ai | the Elu chatbot and the Test Maker (Grok) |
| Web3Forms access key | https://web3forms.com | the contact letter, and emails about new access requests and doubts |
| The admin emails | you decide | who may open `/admin` (for example yours and the co-founders') |

Keep keys out of chats and email. If a key is ever shared by mistake, make a new one in that
service and replace it in Vercel (§3.4).

## 2. Supabase (teacher accounts and saved tests)

Follow **`SETUP-SUPABASE.md`** — it is the full, copy-paste version. In short:

1. Create the project (region near India), copy the **Project URL**, the **publishable (anon)
   key** and the **secret (service role) key** from *Project Settings → API Keys*.
2. Apply the schema `supabase/migrations/20261014120000_phase2_schema.sql`: paste it into the
   **SQL Editor** and run it once, or set `SUPABASE_DB_URL` and run `npm run db:migrate`.
3. *Authentication → Sign In / Providers → Email*: switch **"Allow new users to sign up" off**.
4. *Authentication → URL Configuration*: Site URL `https://elarauniversepublications.com`;
   redirect URLs for the live domain, `https://*-<team>.vercel.app/**` (previews) and
   `http://localhost:3000/**`.
5. *Authentication → Email Templates*: point **Reset password** and **Invite user** at
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password`
   (`type=invite` for the invite template).
6. Before launch, connect real SMTP (*Project Settings → Authentication → SMTP*): the built-in
   sender only allows a few emails an hour.

The Row Level Security rules can be checked on any PostgreSQL with `npm run db:test`
(`scripts/db/README.md`).

## 3. Deploy with the Vercel CLI (no GitHub)

Commands below were checked against the Vercel CLI's own help (`vercel@64`); notes in
`docs/research/nextjs16-vercel.md` §6.

### 3.1 Install and log in (once)

```bash
npm install -g vercel
vercel --version
vercel login          # opens the browser; choose the email or team
vercel whoami
```

### 3.2 Link the project folder (once)

In the project folder (the one with `package.json`):

```bash
vercel link           # answer the questions: your team, "create a new project", name it e.g. elara-universe
```

This writes `.vercel/project.json` (already ignored by git). Vercel detects Next.js by itself
(build command `next build`). In the project settings on vercel.com choose the Node.js version
**22.x** (also set in `package.json` `"engines"`).

### 3.3 Add the environment variables

Add each variable for **Production** and **Preview** (the CLI asks for the value; paste it and
press Enter). `NEXT_PUBLIC_…` values are built into the pages, so add them **before** deploying
and redeploy after changing one.

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production,preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production,preview
vercel env add SUPABASE_SERVICE_ROLE_KEY production,preview --sensitive
vercel env add ADMIN_EMAILS production,preview
vercel env add NEXT_PUBLIC_SITE_URL production         # https://elarauniversepublications.com
vercel env add XAI_API_KEY production,preview --sensitive
vercel env add XAI_MODEL production,preview            # e.g. grok-4.3 (check docs.x.ai/developers/models)
vercel env add NEXT_PUBLIC_WEB3FORMS_KEY production,preview
vercel env ls                                          # check the list
```

`SUPABASE_DB_URL` is **not** needed on Vercel (it is only for `npm run db:migrate` on your
computer). To work locally with the same values: `vercel env pull` writes `.env.local`.

### 3.4 Preview, check, then production

```bash
vercel                # builds in the cloud and prints a Preview URL (https://elara-universe-xxxx.vercel.app)
```

Open the preview URL and run the launch checklist (§7) on it. When everything is right:

```bash
vercel --prod         # the production deployment (and the domain, once connected)
```

To change a key later: `vercel env rm XAI_API_KEY production` then `vercel env add …` again,
and run `vercel --prod` so the new value is used.

## 4. Every environment variable

| Variable | Needed for | Where it comes from | Browser or server |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | accounts, portal, admin | Supabase → Project Settings → API Keys (Project URL) | both |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same | Supabase → API Keys: publishable key (or legacy `anon`) | both (RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | creating accounts, writing requests, doubts, AI counters | Supabase → API Keys: secret key (or legacy `service_role`) | **server only** |
| `SUPABASE_DB_URL` | optional, `npm run db:migrate` on your computer | Supabase → Connect → Session pooler | your computer only |
| `ADMIN_EMAILS` | who is an admin (comma-separated) | you | server only |
| `NEXT_PUBLIC_SITE_URL` | links in reset and invite emails | `https://elarauniversepublications.com` | both |
| `XAI_API_KEY` | chatbot and Test Maker | https://console.x.ai | **server only** |
| `XAI_MODEL` | which Grok model (no default in the code) | https://docs.x.ai/developers/models — suggestion `grok-4.3` | server only |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | contact letter; emails about requests and doubts | https://web3forms.com | both |
| `MOCK_SESSION_SECRET` | optional, mock mode only | any long random text | server only |
| `VERCEL_TOKEN` | optional, deploying from a script instead of `vercel login` | Vercel → Account → Settings → Tokens | your computer only |

Without the Supabase pair the site runs in mock mode (§ top); without `XAI_API_KEY` **and**
`XAI_MODEL` the chatbot and Test Maker run in mock mode; without the Web3Forms key the contact
page shows the email and WhatsApp buttons and no emails go to the team (the admin page still
lists every request and doubt).

## 5. The first admin and the teachers

1. Put your email (and the co-founders') in `ADMIN_EMAILS` and redeploy.
2. Create the account once: Supabase → *Authentication → Users → Add user → Create new user*
   with that email, a temporary password and *Auto Confirm User* on — or on your computer
   `npm run create-admin -- you@example.com 'temporary-password'` (needs the Supabase keys in
   `.env.local`).
3. Sign in at `/login/`. The site sees the email in `ADMIN_EMAILS` and makes the account an
   active admin. Change the password under *Profile → Change password*.
4. Teachers: open `/admin/` → **New teacher**: name, email, school, phone, classes and subjects,
   then **Send an invite email** (they set their own password) or **Show a one-time password**
   (hand it over in person). Requests from the public form on `/web-support/` appear on the same
   page with a one-click **Create account**.
5. A teacher sees only their classes and subjects, their own saved papers and never `/admin`.
   Deactivating an account on its admin page stops it signing in at once.

## 6. Connect elarauniversepublications.com

You need access to the domain's registrar (where its DNS records are managed) —
[PLACEHOLDER] which registrar that is.

```bash
vercel domains add elarauniversepublications.com
vercel domains add www.elarauniversepublications.com
vercel domains inspect elarauniversepublications.com     # says exactly which records are missing
```

`vercel domains inspect` offers two ways (from the CLI's own output): **a)** at the registrar,
an `A` record for `@` pointing to `76.76.21.21` (recommended), or **b)** switching the domain's
nameservers to the ones it lists. For `www`, copy the `CNAME` value that Vercel shows in
*Project → Settings → Domains* (the exact host name could not be confirmed from here). Then:

1. At the registrar, open **DNS records**, remove an old `A` record for `@` (often a parking
   page) and an old `CNAME` for `www`, add the records Vercel showed, and leave `MX` (email)
   records alone.
2. Wait a few minutes (sometimes hours). Vercel verifies the domain and emails you; HTTPS
   certificates are issued automatically.
3. In *Project → Settings → Domains*, make one of the two the primary domain; the other one
   redirects to it.
4. Update Supabase's *Site URL* and `NEXT_PUBLIC_SITE_URL` if you chose `www` as primary, and
   run `vercel --prod`.

Checks: https://elarauniversepublications.com shows the padlock; `http://` redirects to
`https://`; `curl -I https://elarauniversepublications.com/` answers `HTTP/2 200`.

## 7. Launch checklist

- `/login/` with the admin account → lands in Web Support with "My portal" in the top bar;
  `/admin/` opens. Create a test teacher, sign in as them in a private window: only their
  classes, no `/admin/`, a paper can be drafted, saved, printed (Save as PDF, A4) and downloaded
  for Word. Deactivate the test teacher afterwards.
- Send one request from `/web-support/` and one doubt from `/web-support/help/`: they appear on
  `/admin/` and (with the Web3Forms key) arrive by email.
- Ask Elu a question about a class and an off-topic one: the right buttons appear, and the
  off-topic one offers "Ask our team". The panel no longer says "Mock mode".
- Send a test letter from `/contact/` and check the inbox of the Web3Forms account.
- Open the 24 QR addresses in `docs/qr-addresses.md` (all must work, with or without the
  trailing slash). To send one elsewhere later, add it to `redirects` in `vercel.json`
  (examples in `vercel.redirects.example.json`) and redeploy.
- https://pagespeed.web.dev on the home page (mobile) — lab scores in this build environment
  are in `BUILD_LOG.md`, Step J.
- Submit `https://elarauniversepublications.com/sitemap.xml` in Google Search Console.
- Supabase → *Advisors → Security Advisor*: no warnings.

## 8. Updating the site later

Edit the content (see `README.md`), run the checks (`npm run typecheck`, `npm run lint`,
`npm test`), then `vercel --prod` from the project folder. New database changes go into a new
file in `supabase/migrations/` (never edit the schema by hand in the dashboard).

## Troubleshooting

- **"Mock mode" still shows after adding keys:** the variables were added after the last
  deployment, or only for Preview. Check `vercel env ls` and run `vercel --prod` again.
- **Reset or invite links say "expired":** the email template still points at the default link;
  use the `/auth/confirm` link from §2.5, and check that the Site URL matches the domain.
- **A teacher cannot sign in:** the account may be deactivated (admin page), or the email is
  not confirmed — re-send the invite or show a one-time password from its admin page.
- **Elu answers "could not answer just now":** check `XAI_API_KEY` and `XAI_MODEL` (the model
  name must exist on https://docs.x.ai/developers/models) and the xAI account's credit.
- **A page shows the old version after an update:** hard-refresh (Ctrl/Cmd + Shift + R).
