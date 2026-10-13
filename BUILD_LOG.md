# BUILD_LOG.md — Elara Universe Publishers website

One-go autonomous build following `PLAYBOOK.md`. One section per phase, appended in order.
Three running lists are kept at the top so nothing gets lost:

## For Vaibhav

Things PLAYBOOK.md asked me to ask, tell or show you. Each is answered with the agreed default.

- (Setup) PLAYBOOK.md says to keep `_source-assets/` out of git. Done from the first commit. The
  originals are untouched copies of the files you attached.
- (Setup) Playwright is pinned to 1.56.x because that is the version whose Chromium build is
  pre-installed in this environment. Upgrading later is a one-line change in `package.json`.

## Simplified

Features that still failed after 3 genuine fix attempts and were simplified (brand look kept).

- (none yet)

## Placeholders

Every `[PLACEHOLDER]` and `isPlaceholder` on the site, with where it lives.

- (none yet)

---

## Setup

- Read PLAYBOOK.md in full.
- Source files arranged into `_source-assets/` exactly as the "How to use this playbook" table says:
  - `_source-assets/logo/` — everything inside "Elara Universe - Official Logo" (SVG, PNG, PDF, EPS,
    JPG, READ ME) plus the original zip.
  - `_source-assets/books/computer/Computer_Book_Covers_2.pdf` — 8 pages, 1296×864 pt wraparound
    covers (back | spine | front), TechNova 1–8.
  - `_source-assets/books/hindi/Hindi_Book-1_2.pdf` (72 pages) and `Hindi_Book-3_2.pdf` (84 pages),
    612×792 pt. Page 1 = front cover, page 2 = back cover.
  - `_source-assets/books/drawing/` and `_source-assets/photos/` — empty (no files yet).
- `git init` done (branch `claude/elara-publishers-website-waf1o4`). One commit per phase.
- `CLAUDE.md` written with the full "Rules for Claude Code", the one-go overrides, design system,
  animation tables, content rules and folder layout. `BUILD_LOG.md` (this file) started.

---

## Phase 1 — Project setup and design tokens

**Built:** Next.js 16.4 (App Router, TypeScript, `output: 'export'`, `trailingSlash: true`,
`images.unoptimized`), Tailwind 4 with the Living Book tokens as `@theme` colours/CSS variables,
five Google fonts via `next/font` (Lora 600/700, Cormorant Garamond 500, Nunito 400/600/700,
Caveat, Noto Sans Devanagari), clamp() type scale (body 16px at 360px → 18px at 1024px+, line
height 1.6), paper-grain background (inline SVG noise tile, ≈0.5 KB), folders `/content`,
`/components`, `/public/brand`, `/public/books`, `/public/illustrations`, ESLint (flat config from
Next), Prettier (+ Tailwind plugin), Playwright (desktop 1440 / tablet 768 / mobile 360 / reduced
motion projects, tests run against the static `out/` build served by `serve`), npm scripts
`typecheck`, `lint`, `build`, `test`, `screenshots`, a smoke test, a `/styleguide` page, and shared
`Button` / `Tag` components plus `lib/cn.ts` and `content/site.ts` (company facts).

**Requirements**

- ✅ Colour tokens as Tailwind theme colours and CSS variables (`app/globals.css`)
- ✅ Fonts loaded with next/font; clamp() type scale, 18px desktop / 16px phone, line-height 1.6
- ✅ Paper-grain background under 10 KB
- ✅ Folders created; `_source-assets/` git-ignored
- ✅ ESLint, Prettier, Playwright, npm scripts, first smoke test
- ✅ `/styleguide` shows every colour, font, button and tag style
- ✅ Dev server: `npm run dev` → http://localhost:3000 (see "For Vaibhav")

**Checks:** `tsc --noEmit` ✅ · `eslint .` ✅ · `next build` ✅ (3 static routes) ·
Playwright 12/12 ✅ (4 projects) · Prettier ✅

**Screenshots:** `docs/screenshots/phase-01/` (home + styleguide at 360/768/1440 + reduced motion).
Reviewed: swatches, fonts, type scale, buttons and tags render on-brand; nothing scrolls sideways
at 360px.

**Placeholders added:** none (the temporary home page shows only the tagline from PLAYBOOK.md).

**For Vaibhav:** the dev server is not left running in this one-go build; `npm run dev` prints
the local and network URLs. Phone check over Wi-Fi: open the "Network" URL it prints.

---

## Phase 2 — Logo and book images

**Built:** `scripts/prepare-images.mjs` (sharp + pdftoppm, sources never modified) which makes:

- Logo: `public/brand/logo-full.svg` (verbatim copy), `logo-horizontal.svg` (mark left, ELARA
  UNIVERSE right, official colours only), `mark.svg`, icons 16/32/192/512 in `public/brand/` plus
  `app/favicon.ico`, `app/icon.png` (32) and `app/apple-icon.png` (180) on cream, and the
  1200×630 link preview `app/opengraph-image.png` (full logo centred on cream). Next.js emits the
  icon and `og:image` tags automatically (verified in `out/index.html`).
- TechNova: front covers `public/books/technova-1..8.webp` (1000 px tall) + `-thumb.webp`
  (400 px), cropped to the trimmed 8.5×11 in front cover of each wraparound page, and
  `technova-back.webp` (book 1 back cover).
- Basic Hindi Reader: `hindi-1.webp`, `hindi-3.webp` (+ thumbs) from page 1 of each PDF, and
  8 sample pages each in `public/books/samples/hindi-1/01–08.webp` and `hindi-3/01–08.webp`
  (1200 px tall; images only, no text extracted). Pages chosen: Class 1 → 6 (contents), 9
  (chapter 1 vowels), 17 (vowel song), 18 (chapter 2 consonants), 23 (rainbow poem), 28 (lazy
  monkey story), 34 (fair activity), 68 (days of the week); Class 3 → 8 (contents), 9 (my school
  poem), 10 (weather), 12 (yoga), 19 (maze), 27 (months game), 59 (clock activity), 76 (Birbal
  story opening).
- Art Journey: 8 illustrated placeholder SVG covers `public/books/art-journey-1..8.svg` (coral +
  cream, crayons, class number, labelled "PLACEHOLDER COVER · ARTWORK COMING SOON").
- Contact sheets: `docs/screenshots/phase-02/contact-sheet-{covers,samples,brand}.png`.
- Styleguide gained a "Brand" section showing the logos, icons and sample covers.

**Requirements**

- ✅ logo-full.svg copied · ✅ horizontal header version · ✅ favicon/app icons 16/32/180/192/512
  on cream · ✅ 1200×630 link preview
- ✅ TechNova 1–8 front covers 1000 px + 400 px thumbs · ✅ technova-back.webp
- ✅ hindi-1 / hindi-3 covers · ✅ 8 inside pages per book at 1200 px · ✅ no Hindi text extracted
- ✅ 8 Art Journey placeholder covers marked as placeholders
- ✅ Contact sheet (see "For Vaibhav")

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright 20/20 ✅ (new
`tests/images.spec.ts` checks the assets are served and the head carries the icon/OG tags)

**Screenshots:** `docs/screenshots/phase-02/` (styleguide with brand section at 360/768/1440 +
reduced motion, and the three contact sheets). Reviewed: covers are cropped cleanly without
spine or bleed; sample pages are the colourful ones; lockup and icons are legible down to 16 px.

**Placeholders added:** Art Journey covers 1–8 (`public/books/art-journey-*.svg`) until artwork
arrives.

**For Vaibhav:** the contact sheet is `docs/screenshots/phase-02/contact-sheet-covers.png`
(+ `-samples.png`, `-brand.png`). To re-run after adding PDFs: `node scripts/prepare-images.mjs`.
