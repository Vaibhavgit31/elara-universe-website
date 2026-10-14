# Prompt — everything that is left to do (paste this into a new session)

Continue PHASE 2 ("Classroom upgrade") of the Elara Universe Publishers website in ONE
uninterrupted run, exactly like the earlier steps: same `CLAUDE.md` rules (Phase 1 rules plus
"Phase 2 rules (Classroom upgrade)"), same phase gate after every step (requirement checklist,
`npx tsc --noEmit`, `npm run lint`, `npm run build`, ALL Playwright tests including the Phase 1
tests, screenshots at 360/768/1024/1440 and reduced motion that you actually look at, self-review
of the diff), auto-continue only when everything passes, log every step to `BUILD_LOG.md` in the
same format as the earlier reports, commit after every step and push to the branch
`claude/elara-publishers-website-waf1o4` of `Vaibhavgit31/elara-universe-website`. Do not stop to
ask me: write questions under "For Vaibhav" at the top of `BUILD_LOG.md` and use the defaults
below. Never invent facts. Never hard-code secrets. Never guess an API: read the official docs for
xAI, Supabase and Vercel (the notes in `docs/research/` were taken from them and from the installed
packages' own docs and type definitions; the sandbox proxy blocks docs.x.ai, supabase.com,
vercel.com, docx.js.org and playwright.dev, so use the packages' shipped docs under
`node_modules/<pkg>/docs` and `node_modules/next/dist/docs/`) and put the doc URL in a code
comment next to each use.

Start by reading `docs/handover/PROMPT-DONE.md` (what already exists), `CLAUDE.md`,
`PLAYBOOK.md` → "Phase 2: Classroom upgrade", the top of `BUILD_LOG.md`, and the files it names.
Everything up to Step E is finished and committed; Step F is half done and uncommitted.

## Environment facts

- Next.js 16.4 App Router, TypeScript strict, Tailwind 4, React 19, framer-motion (`m` inside
  `LazyMotion` strict — only `m.*`, imported from `'framer-motion'`), Lenis, react-pageflip,
  react-hook-form + zod 4, Playwright **1.56.1 pinned** (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`,
  never run `playwright install`), @axe-core/playwright, lighthouse 13.
- The site is now a Node server build: `npm run build` then `npm run start` (`next start -p 3000`);
  Playwright's `webServer` reuses a server already on port 3000. Run the server in the background
  with a long timeout and restart it after every build. Tests run in **mock mode** (no keys).
- No keys exist here: no Supabase, xAI, Vercel token, Web3Forms or ADMIN_EMAILS. Every feature
  must have a mock mode that the UI names clearly ("Mock mode"), and the final report lists which
  features run in mock mode. The demo accounts of the mock store are in
  `lib/data/memory-store.ts` (admin@example.com / elara-admin-demo, teacher@example.com /
  elara-teacher-demo, other@example.com / elara-other-demo).
- A local PostgreSQL 16 can be started for the RLS test (`initdb` as a non-root user, then
  `PGHOST=/tmp PGPORT=54329 PGUSER=postgres npm run db:test`); `psql` is installed, the
  `supabase` and `vercel` CLIs are not.
- Commit messages: imperative title, short body, never a model identifier; end with the
  attribution lines the session gives you. Push with `git push -u origin
  claude/elara-publishers-website-waf1o4`. Never create a pull request.

## Defaults agreed for Phase 2

- Env var names exactly as PLAYBOOK says (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` optional, `ADMIN_EMAILS`, `XAI_API_KEY`,
  `XAI_MODEL`, `NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_SITE_URL`, `VERCEL_TOKEN`); all listed in
  `.env.example`. The anon/service-role variables may hold either the legacy keys or the new
  publishable/secret keys.
- Emails to the team (access requests, doubts) go through Web3Forms server-side (`lib/notify.ts`)
  when `NEXT_PUBLIC_WEB3FORMS_KEY` exists; otherwise nothing is sent and the admin page is the
  record.
- xAI: Vercel AI SDK `ai@7` + `@ai-sdk/xai@5` (Responses API; `xai.chat()` no longer exists),
  per `docs/research/xai.md`; `XAI_MODEL` has no guessed default (document `grok-4.3` as the
  cheapest current chat model only as a suggestion in `.env.example`/`DEPLOY.md`); mock mode when
  the key is missing (`createXai({ fetch })` or `ai/test` MockLanguageModel + `simulateReadableStream`).
- Test Maker Word export with `docx@9.11` (`cs: 'Mangal'` font slot for Devanagari, A4 via
  `convertMillimetersToTwip`), PDF only through the browser's print-to-PDF with a print stylesheet;
  drag reorder with `@dnd-kit` (check its licence/activity before adding, one line why).
- Chapter data: Hindi Reader Class 1 and 3 chapters are already read from the PDFs in
  `docs/research/hindi-chapters.md` (mark "needs checking"); other classes and the TechNova /
  Art Journey lists are `[PLACEHOLDER]`.
- Lighthouse target in Step J: Home ≥ 85, other pages ≥ 90, a11y ≥ 95, SEO ≥ 95 (Phase 13 reached
  58–90 on performance; three rounds of fixes are logged — try the options listed under "For
  Vaibhav" in `BUILD_LOG.md` before simplifying, and log anything simplified).
- Zip the source as `elara-website-phase2-source.zip` (no node_modules, no .env, no
  `_source-assets`, no screenshots — they are in the repo).

## 1. Finish Step F (currently uncommitted)

The foundation is done and verified (see PROMPT-DONE.md). Still to do:

1. Verify the admin pages that a background agent wrote to the contract below:
   `app/admin/page.tsx`, `app/admin/actions.ts`, `app/admin/teachers/new/page.tsx`,
   `app/admin/teachers/[id]/page.tsx`, `components/admin/**`. Every page/action must start with
   `await requireAdmin()` (from `lib/auth/session.ts`), validate FormData with zod, use
   `getStore()` only, `revalidatePath('/admin')` after writes, `redirect()` outside try/catch.
   Run `npx tsc --noEmit`, `npm run lint`, `npx prettier --check .`, `npm run build`.
2. Verify `tests/auth.spec.ts` (written to the same contract, 12 tests: login page + mock note +
   wrong password; teacher sign-in → `/web-support/` "Hello, Demo Teacher" + "My portal"; sign
   out; logged-out redirects of `/admin/` and `/account/update-password/` to `/login/?next=…` and
   landing on the requested page after sign-in; teacher → `/admin/` → `/web-support/`; admin sees
   teachers/requests/doubts; create teacher with one-time password then sign in as them;
   deactivate → "deactivated" alert; answer a doubt; approve a request from `?request=mock-request-1`;
   rate limit after 6 wrong attempts; forgot-password message; update-password). Admin and
   rate-limit tests run on the desktop project only. Fix whatever fails (the memory store resets on
   server restart; tests must use unique emails).
3. Do the adversarial security review yourself (the agent's findings were lost): proxy matcher
   gaps, `?next=` open redirects, cookie flags, mock cookie only in mock mode, service-role client
   never in client bundles, RLS grants vs policies, admin promotion logic, rate limiter, error
   messages that leak account existence, caching of pages that read cookies, deactivated accounts,
   `handle_new_user` metadata shape (classes smallint[], subjects text[]), reset/invite flow through
   `/auth/confirm`. Fix findings, add tests where cheap.
4. Screenshots to `docs/screenshots/phase2-F/`: `/login/`, `/login/forgot/`, `/web-support/`
   (signed out and signed in), `/account/update-password/`, `/admin/`, `/admin/teachers/new/`,
   a teacher edit page, at 360/768/1024/1440 + reduced motion (sign in with Playwright for the
   protected ones). Refresh the width baselines if they changed. Full suite green.
5. Update `CLAUDE.md` "Defaults agreed for this run" (the static-export line is superseded by
   the Phase 2 rules), the Phase 1 `README.md`/`DEPLOY.md` notes that still say "static export"
   (Step K rewrites DEPLOY.md fully), and append the Step F report to `BUILD_LOG.md` (draft below),
   plus "For Vaibhav" entries: Supabase dashboard labels may have moved (SETUP-SUPABASE.md);
   `images.unoptimized` kept on purpose; rate limiter is per instance on Vercel; the demo
   accounts exist only in mock mode. Commit "Phase 2 Step F: server mode, Supabase, admin and login"
   and push.

### Admin UI contract (what the in-progress files implement; tests assume it)

- `/admin` (admins only; teachers are redirected to `/web-support`): h1 "Admin" (eyebrow "Staff
  room"), `<MockNote />`, Button "New teacher" → `/admin/teachers/new`; sections h2 "Teachers"
  (real `<table>`, rows `data-testid="teacher-row"`: name, email, school, role, classes "1, 2, 3",
  subjects, "Active"/"Deactivated", link "Edit <name>" → `/admin/teachers/<id>`), "Access requests"
  (`<ul>` of glass cards `data-testid="access-request"`: name, school, role, email, phone, book +
  class, message, status Tag new/approved/declined, for new ones Button "Create account" →
  `/admin/teachers/new?request=<id>` and form button "Decline"; empty "No requests yet."),
  "Doubts" (`<ul>` cards `data-testid="doubt"`: question, name · email · school, page, status
  open/answered; open ones have textarea "Answer" + Button "Send answer"; empty "No doubts yet.").
- `/admin/teachers/new`: h1 "New teacher account"; fields Name, Email, School, Phone; chip
  checkboxes Classes 1–8 (`name="classes"`) and Subjects Hindi/Computer/Drawing (`name="subjects"`,
  values hindi|computer|drawing); radio chips `name="mode"`: "Send an invite email" (invite,
  default) / "Show a one-time password" (password); Button "Create account". `?request=<id>`
  pre-fills from the access request and marks it approved on success. Success panel: h2
  "Account created", the email, `<code data-testid="temporary-password">` with "Copy it now: it
  is shown only once." in password mode; "An invite email has been sent to <email>." in invite
  mode (mock mode: "In mock mode no email is sent; the account can sign in with the one-time
  password instead.").
- `/admin/teachers/[id]`: h1 = teacher name (eyebrow "Teacher"), edit form (Name, School, Phone,
  Classes, Subjects) Button "Save changes"; "Account" panel with "Active"/"Deactivated",
  Button "Deactivate"/"Reactivate", "Email a reset link", "Show a one-time password" (shows the
  code). Unknown id → `notFound()`.

### Step F log draft (append to BUILD_LOG.md after filling the test counts)

Built: server mode (`next.config.ts` without `output: 'export'`, `next start`, `serve` removed,
`dynamicParams = false` on book pages, `proxy.ts` on `/web-support/*`, `/admin/*`, `/account/*`
with the public intro and help exempt; every protected page/action re-checks the session);
Supabase via `@supabase/ssr` 0.12 + `@supabase/supabase-js` 2.117 from the official guide
(`lib/supabase/*`), secret key only in `lib/supabase/admin.ts` (`server-only`); migration with
five tables, trigger, `private.is_admin()`, `bump_ai_usage()`, explicit grants + RLS, proved by
`npm run db:test` on local PostgreSQL (teacher sees only own tests, cannot forge/promote/read
requests; admin reads requests but no tests); accounts only from admins (sign-up off in the
dashboard, documented in `SETUP-SUPABASE.md`; admins = `ADMIN_EMAILS`, promoted on first sign-in);
one `DataStore` with Supabase and mock memory backends; `/login` glass card in front of the
classroom with zod + honeypot + rate limit (5/account, 100/IP per 15 min), `/login/forgot`,
`/auth/confirm` (verifyOtp), `/account/update-password`, landing in `/web-support`, "My portal"
hint cookie; `/admin` (teachers, new teacher with invite/one-time password, edit, deactivate,
reset; access requests with one-click create and decline; doubts with answers);
`components/ui/form.tsx` shared primitives; `.env.example` complete; scripts `db:migrate`,
`db:test`, `create-admin`. Tests: `tests/auth.spec.ts` (N), width routes + login/forgot/web-support.
Mock-mode features: accounts, requests, doubts, saved tests; no emails without keys.

## 2. Then Steps G → K, exactly as the brief says

(Verbatim from `PLAYBOOK.md` "Phase 2: Classroom upgrade"; Step F's bullets are repeated so the
gate checklist can tick them.)

STEP F — Server, database and teacher accounts
- Remove `output: 'export'`. The site now runs on Vercel with server routes.
- Supabase (follow the current official Next.js App Router + @supabase/ssr guide). Tables, all with Row Level Security: profiles (name, school, phone, role teacher|admin, classes[], subjects[], active), access_requests, doubts, tests (teacher_id, title, class, subject, book_slug, chapters[], settings json, questions json, timestamps), ai_usage (for rate limits). Put migrations in supabase/migrations. Apply them with SUPABASE_DB_URL if it is set; otherwise write SETUP-SUPABASE.md with copy-paste SQL and dashboard steps.
- Accounts are created ONLY by admins. Turn off public sign-up. Admins = the emails in ADMIN_EMAILS.
- /admin (admins only): create a teacher account with assigned classes and subjects (sends an invite email or shows a one-time temporary password), edit, deactivate, reset password. See access requests (create the account from a request in one click) and see doubts.
- /login (glass card on a classroom background), forgot password, and after login everyone lands in the Web Support portal (Step G). The top bar's "Teacher login" button becomes "My portal".
- The service role key is used only on the server. Teachers can only see their own tests. Rate-limit login attempts.

STEP G — Web Support portal (/web-support)
Copy the FLOW of a typical publisher web-support portal: log in → pick a subject → pick a series → see that series' books, one per class → open Learning Resources or Generate Test Paper. Copy ONLY the flow. Use our acrylic classroom design (no emoji, no dashed borders, no rainbow gradients).
- Logged out (/web-support): a public page with the 4 steps from the Hindi Reader back cover (visit website → Web Support → request access → get approval → use the content), a glass login card, and a "Request access" form (name, school, role teacher | principal | coordinator, email, phone, book, class). Requests are saved to access_requests and emailed to the admins, who create the account in one click (Step F).
- Logged in: a portal layout with a glass sidebar showing the school name and user name, and links to My books, My tests, Help & Doubts, Profile and Sign out. On phones it collapses to a top menu.
- "Select your title": Step 1 is a Subject dropdown (Hindi, Computer, Drawing). Step 2 is a Series dropdown filtered by subject (Basic Hindi Reader, TechNova, Art Journey). Both are saved in the URL (?subject=hindi&series=basic-hindi-reader), so links can be shared and the back button works. Show only the user's assigned classes; admins see all.
- Book grid: one glass card per class with the cover, "<Series> (Class n)", and two buttons. Teachers get both. "Learning Resources" opens the book's resources. "Generate Test Paper" opens Step I with class and book pre-filled. Cards lift on hover; covers swap with a page-flip when the series changes.
- Learning Resources (/web-support/books/[slug]): tabs for E-book (flipbook of the sample pages for now), Animated videos (embedded player), Worksheets (PDF view and download), Interactive quizzes, and Downloads. Content comes from content/resources.ts. Empty tabs show "Coming soon", and [PLACEHOLDER] entries are easy to swap for real links and files.
- Help & Doubts (/web-support/help): searchable FAQ grouped by topic (books, ordering, sample copies, digital access, login, QR codes, Test Maker), with each answer at its own #anchor. FAQ content lives in content/faq.ts, with my answers marked [PLACEHOLDER] until I send them. An "Ask a doubt" form saved to doubts and emailed to the admins. It accepts ?q= to pre-fill the question. This page is public, so the chatbot can link to it.
- Every portal page except the public intro and Help is protected on the server. Tests must confirm that a logged-out visitor is redirected to login and that a teacher cannot open /admin or another teacher's tests. Logins are for teachers and admins only: there are no student accounts.

Notes for Step G: the public intro should reuse `components/auth/login-form.tsx`; the request
form writes through `getStore().createRequest` + `lib/notify.ts`; `content/resources.ts` and
`content/faq.ts` already exist (home-page FAQ links point to `/web-support/help#<id>`); the
profile page uses `store.updateOwnProfile`; "My tests" lists `store.listTests(session.id)`;
`/web-support/tests/<id>` of another teacher must 404 (test it with other@example.com's
`mock-test-2`).

STEP H — Grok chatbot
- A glass chat bubble with Elu on every page, opening a chat panel with suggestion chips ("Which books are for Class 3?", "How do I get a sample copy?", "How does Web Support work?", "Upcoming events").
- A server route that streams answers from xAI Grok. Read docs.x.ai for the current SDK and model names. Use the Vercel AI SDK xAI provider if it exists, otherwise xAI's OpenAI-compatible API. Key in XAI_API_KEY, model in XAI_MODEL (no guessed default; document it).
- Scope: ONLY Elara's books and website. Build the system prompt from the site's own data (content/books.ts, events, faq, contact details, the page list). Never invent prices, dates or facts: if it's not in the data, say so and offer Contact or WhatsApp. Politely decline anything off-topic.
- It answers with link buttons to the right page, e.g. "Open this answer" → /web-support/help#sample-copies. If it can't answer, it offers "Ask our team" → /web-support/help?q=<question>#ask.
- Safety (children use this site): friendly simple language, never ask for personal details, input max 500 characters, rate limit per IP (e.g. 20 messages / 10 min), short answers, no chat logs stored (only anonymous counts), and a small note "AI answers can be wrong".
- Mock mode when XAI_API_KEY is missing, so the UI and tests work.

Notes for Step H: use `store.bumpUsage('chat', sha256(ip + daily salt), windowStart, 20)` for the
per-IP limit (memory in mock mode, `ai_usage` table otherwise); the chat panel must not hurt the
Lighthouse budget of the home page (load the panel on first open).

STEP I — Test Maker (/web-support/test-maker, teachers only; opened from a book card's "Generate Test Paper" with class and book pre-filled, or from My tests)
- Chapter data in content/chapters.ts for every book and class. Read the Hindi Reader contents pages (विषय-सूची) from the page images in the PDFs and type the chapter names in Unicode Hindi; mark them "needs checking". Leave TechNova and Art Journey chapters as [PLACEHOLDER] lists that are easy to fill in.
- Form: class (limited to the teacher's classes) → book → chapters (multi-select) → question types with count and marks each (MCQ, fill in the blanks, true/false, match the following, one word, short answer, long answer; picture/drawing tasks for Art Journey) → difficulty mix → total marks and time (warns if the totals don't add up) → exam name, school name, optional school logo, date, instructions. The Hindi paper is in Devanagari; Computer and Drawing papers are in English.
- Generation: Grok drafts one section at a time, with structured JSON output validated by zod, and retries on invalid output. The prompt includes the book, class level, chapter names and NEP 2020 / NCF 2023 competency focus, and stays within those chapters. Each question is labelled "AI draft — please check".
- Editor: edit, reorder (drag), delete, regenerate one question, add your own question, change marks; live totals.
- Output: A4 print preview with school header, sections, marks and a separate answer key; Set A / Set B (shuffled order and options). Download as PDF through the browser's print-to-PDF with a print stylesheet (Chrome shapes Devanagari correctly; do NOT use a PDF library that breaks Hindi conjuncts), and as Word (.docx, using the docx library) so teachers can edit it. Check that Hindi text renders correctly in both, using screenshots.
- Save, duplicate and delete tests; list them under My tests in the portal sidebar. Daily generation limit per teacher, set in config.
- Mock mode when XAI_API_KEY is missing.

Notes for Step I: saved tests go through `store.saveTest/listTests/getTest/deleteTest` (the
`tests` table shape is fixed: settings json + questions json); the daily limit uses
`store.bumpUsage('test', teacherId, startOfDay, limit, teacherId)`; read
`docs/research/docx-print.md` and `docs/research/hindi-chapters.md` first.

STEP J — Security, accessibility, speed and full regression
- Security: secrets only in env vars, .env.example lists every variable, RLS tested (one teacher cannot read another's tests), admin routes blocked for teachers, all inputs validated with zod, no XSS.
- Accessibility: WCAG AA contrast on glass, keyboard access for chat, Test Maker and admin, reduced motion everywhere.
- Lighthouse mobile: Home ≥ 85 Performance (glass + illustration allowance), every other page ≥ 90; Accessibility ≥ 95; SEO ≥ 95.
- Run every test from Phase 1 and Phase 2.

STEP K — Deploy prep and report
- Update DEPLOY.md: deploy to Vercel with the CLI and no GitHub (vercel login, vercel link, vercel --prod), every env var to add (XAI_API_KEY, XAI_MODEL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL optional, ADMIN_EMAILS, NEXT_PUBLIC_WEB3FORMS_KEY), Supabase setup, how to create the first admin and teachers, and connecting elarauniversepublications.com.
- If VERCEL_TOKEN is set, deploy a preview and test the live URL with Playwright. Otherwise skip deploying.
- Zip the source (no node_modules, no .env) as elara-website-phase2-source.zip.
- Final report: what changed, before/after screenshots of every page at 1440px and 360px, Lighthouse scores, test counts, everything under "Simplified" and "For Vaibhav", remaining [PLACEHOLDER]s, and which features are running in mock mode until keys are added.

Notes for Step K: the "before" screenshots are `docs/screenshots/phase-14/` (Phase 1 final) and
the "after" ones are the latest `phase2-*` folders; `docs/research/nextjs16-vercel.md` §6 has the
Vercel CLI commands verified from the CLI's own help and source; the Netlify `_redirects` file is
no longer the hosting path (QR redirects go in `vercel.json`).

### Content still needed from Vaibhav (ask in "For Vaibhav", do not block)

- Chapter lists for every book and class (TechNova and Art Journey entirely; Hindi 2, 4–8).
- Answers to the FAQ questions marked [PLACEHOLDER] in `content/faq.ts`.
- Links or files for videos, worksheets, quizzes and downloads per book (`content/resources.ts`).
- The first list of teachers to create (name, school, email, classes, subjects).
