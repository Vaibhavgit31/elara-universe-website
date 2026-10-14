# Prompt — what has already been built (paste this as context into a new session)

You are continuing the Elara Universe Publishers website. Everything below already exists in the
repository `Vaibhavgit31/elara-universe-website`, branch `claude/elara-publishers-website-waf1o4`
(and in `elara-website-phase2-source.zip`). Do not rebuild any of it; read the files named here
before touching anything. `CLAUDE.md`, `PLAYBOOK.md` and `BUILD_LOG.md` in the repo root are the
authority: rules in `CLAUDE.md` (Phase 1 rules + "Phase 2 rules (Classroom upgrade)"), the full
brief in `PLAYBOOK.md`, the per-phase reports and the three running lists ("For Vaibhav",
"Simplified", "Placeholders") at the top of `BUILD_LOG.md`.

## Phase 1 — complete (commits up to `fd132c1`)

Prompts 0–14 of `PLAYBOOK.md` were delivered in one autonomous run: Next.js 16 App Router +
TypeScript + Tailwind 4 + framer-motion (`m` components inside `LazyMotion` strict, imported from
`'framer-motion'`) + Lenis + react-pageflip + react-hook-form/zod + Playwright 1.56.1 (pinned to the
pre-installed Chromium; never run `playwright install`). Pages: Home, Catalog (`/catalog`, URL
filters `?subject=&class=`), 24 book pages (`/catalog/<slug>`, flipbook of sample pages for Hindi
Reader 1 and 3, JSON-LD), About (four-page flip pad), Events (flip pad: tickets + scrapbook),
Contact (react-hook-form letter, Web3Forms when `NEXT_PUBLIC_WEB3FORMS_KEY` is set, otherwise
email/WhatsApp fallback, honeypot, cooldown), QR Corner (`/resources` + the 24 printed addresses
`/resources/<hindi|technova|art-journey>/<1–8>`, must never break), 404, `/styleguide`,
`/demo-flip`. Extras: mascot Elu (`components/mascot/elu.tsx`), sticker book, play corner,
festival touches, page-turn sound, polaroids, washi tape. All editable content lives in
`content/` (`books.ts`, `series.ts`, `events.ts`, `team.ts`, `site.ts`, `site-config.ts`,
`faq.ts`, `hero.ts`, `home.ts`, `resources.ts`). Company facts are only the ones in `CLAUDE.md`;
unknown text is `[PLACEHOLDER]`. Images are pre-optimised WebP under `public/books/`
(`scripts/prepare-images.mjs`). Tests: one Playwright spec per page/component plus a11y (axe),
SEO, images, smoke, contrast; screenshots per phase under `docs/screenshots/<phase>/`
(`node scripts/screenshots.mjs <phase> <routes…>`); Lighthouse runner
`node scripts/lighthouse.mjs <label>` → `docs/lighthouse/<label>/summary.md`. `README.md` and
`DEPLOY.md` (Netlify Drop + Vercel, now partly outdated: Phase 2 moves to Vercel server mode).

## Phase 2 "Classroom upgrade" — Steps START, A, B, C, D, E complete and pushed

- **START** (`27047c6`): `PLAYBOOK.md` re-exported with the Phase 2 section; "Phase 2 rules" added
  to `CLAUDE.md`; research notes from the official docs in `docs/research/` (`xai.md`,
  `supabase.md`, `nextjs16-vercel.md`, `docx-print.md`, `hindi-chapters.md`, `layout-audit.md`).
  The sandbox proxy blocks docs.x.ai, supabase.com, vercel.com, docx.js.org and playwright.dev,
  so the notes were read from the packages' shipped docs/types and the docs' GitHub sources;
  every unconfirmed point is marked UNCONFIRMED in those files.
- **Step A** (`f853cc2`): one layout container (`container-page`: 1280 px, `clamp(16px,4vw,48px)`
  padding), full-width `<Section tone>` bands, `tests/widths.spec.ts` (13 laptop/phone/zoom
  sizes × every route: no horizontal scroll, nothing outside the viewport, header/content edge
  within 2 px, equal margins, screenshot baselines on the reduced-motion project).
- **Step B** (`93ffdaf`): fixed glass top bar on every page (`components/frame/top-bar.tsx`,
  shrinks after scrolling, `data-scrolled`), ribbon nav, phone menu sheet (`menu-sheet.tsx`),
  bottom bar that never hides, `TeacherButton` ("Teacher login" → "My portal"), flip-pad page
  dots, "Page N of M", back-to-top, arrow/PageUp/PageDown keys (`components/flip/flip-pad.tsx`).
- **Step C** (`b8fac7e`, `9b7af8e`): the acrylic classroom design system — moving mesh
  background (`components/ui/mesh-background.tsx`, `mesh`/`mesh-blob` utilities), `<Glass>`
  (white 55 % + blur, spotlight, tilt), tokens leaf/leaf-700/mint/chalkboard/mesh-*, radius scale
  fixed to 8/16/24/999, `focus-glow`, `stamp`, ripple buttons, `crayon` underline, `ruled`
  notebook lines; classroom motifs in `components/classroom/` (Chalkboard + ChalkText(+`start`
  prop) + ChalkLine, NotebookCard(`titleAs`), NoticeBoard + Pinned(`bare`), ReportBadge,
  Timetable, Pencil, SchoolBell, WoodFrame); `SectionHeading` (eyebrow/title/accent/lead);
  `/styleguide` shows everything; `tests/contrast.spec.ts` checks WCAG AA pairs from the built
  tokens; `tests/styleguide.spec.ts`.
- **Step D** (`ec67485`): the landing page "A day at Elara School" (`app/page.tsx`, eleven
  `<Room>`s in `components/home/`): original SVG classroom hero with chalk-written headline,
  live clock, seven hotspot links and parallax; three book rooms with a Class 1–8 picker and a
  flipbook dialog; why-stickers; QR phone; test-paper preview; notice board; staff room; FAQ
  room (`content/faq.ts`, anchors `/web-support/help#<id>`); school-gate postbox (compact
  contact form); play corner. `tests/home.spec.ts`.
- **Step E** (`dbaf39e`): every other page restyled to the system (Catalog with glass filter
  chips and shelf bands, book page, About chapter chalkboards, Events on the notice board,
  Contact on glass, QR Corner, 404, footer, login/web-support stubs); shared `lib/accent.ts`,
  `components/ui/date-leaf.tsx`; `lib/cn.ts` knows the shadow scale. Width checks repeated,
  baselines refreshed, screenshots in `docs/screenshots/phase2-E/`.

Gate state at the end of Step E: `tsc`, `eslint`, Prettier, `next build` clean; full Playwright
suite **369 passed / 507 skipped-by-project** (four projects: desktop 1440, tablet 768, mobile
360 Pixel 7, reduced-motion); every report in `BUILD_LOG.md`.

## Step F — in progress (uncommitted in the working tree / zip)

Done and verified by me (tsc, eslint, Prettier, `next build`; the full existing suite passes on
the server build; `npm run db:test` passes on a local PostgreSQL 16):

- Server mode: `next.config.ts` without `output: 'export'` (`trailingSlash` kept,
  `images.unoptimized` kept on purpose), `npm run start` = `next start -p 3000`, Playwright's
  `webServer` uses it, `serve` removed; `dynamicParams = false` on `/catalog/[slug]`;
  `.gitignore` has `.vercel`.
- `proxy.ts` (Next 16 proxy; matcher `/web-support/*`, `/admin/*`, `/account/*`; public
  `/web-support` and `/web-support/help`; redirects to `/login?next=`), `lib/supabase/{client,
  server,admin,proxy}.ts` from the official `@supabase/ssr` Next.js guide (URLs in comments),
  `lib/auth/{config,session,actions,rate-limit,mock-cookie}.ts`, `lib/data/{types,store,
  memory-store,supabase-store}.ts` (the `DataStore` interface: sessions, profiles, teachers,
  requests, doubts, tests, usage counters; mock memory store with demo accounts
  admin@example.com / elara-admin-demo, teacher@example.com / elara-teacher-demo,
  other@example.com / elara-other-demo; `updateOwnProfile` for the portal profile page),
  `lib/notify.ts` (Web3Forms email to the team when the key exists), `lib/session.ts`
  (`useSignedInHint` from the `elara_portal` hint cookie → "My portal" in the top bar).
- `supabase/migrations/20261014120000_phase2_schema.sql`: `profiles`, `access_requests`,
  `doubts`, `tests`, `ai_usage`, `handle_new_user` trigger, `private.is_admin()`,
  `bump_ai_usage()`, explicit grants + RLS; `scripts/db/{supabase-stub.sql,rls-test.sql,
  rls-test.sh,migrate.sh}` (`npm run db:test`, `npm run db:migrate`), `scripts/create-admin.mjs`
  (`npm run create-admin`), `SETUP-SUPABASE.md`, full `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `ADMIN_EMAILS`,
  `NEXT_PUBLIC_SITE_URL`, `XAI_API_KEY`, `XAI_MODEL`, `NEXT_PUBLIC_WEB3FORMS_KEY`, `VERCEL_TOKEN`).
- Pages: `/login` (glass card in front of the classroom, `components/auth/login-form.tsx`,
  honeypot, rate limit 5/account + 100/IP per 15 min, `?next=` safe-listed), `/login/forgot`,
  `/account/update-password`, `/auth/confirm` route (verifyOtp), `/web-support` signed-in state
  with sign-out, `components/auth/mock-note.tsx` ("Mock mode" banner), `components/ui/form.tsx`
  (Field, inputClass, chipClass, Notice — extracted from the contact form), `content/resources.ts`
  (placeholder learning resources per book for Step G). Width routes now include `/login/`,
  `/login/forgot/`, `/web-support/`.

Written by background agents and **not yet verified** (the run was interrupted): `app/admin/**`
(`page.tsx`, `actions.ts`, `teachers/new/page.tsx`, `teachers/[id]/page.tsx`) and
`components/admin/**` built to the contract in `docs/handover/PROMPT-REMAINING.md`;
`tests/auth.spec.ts` (12 auth/admin tests written to that contract); a security review of the
auth layer whose findings were never received. A draft of the Step F report is in
`docs/handover/PROMPT-REMAINING.md` ("Step F log draft").
