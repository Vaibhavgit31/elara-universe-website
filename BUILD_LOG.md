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
