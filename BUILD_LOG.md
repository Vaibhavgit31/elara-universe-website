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

---

## Phase 3 — The frame (menu, footer, page turns)

**Built:** `app/layout.tsx` now wraps every page in the shared frame:

- `components/frame/header.tsx` + `ribbon-nav.tsx`: desktop menu as bookmark ribbons hanging
  from the top edge (forest ribbons, the current page's ribbon is brass and hangs 18 px longer,
  V-notched bottoms, spring slide when the page changes, sway on hover). Header logo on the left
  (horizontal lockup; the mark alone at tablet width so the ribbons fit).
- `bottom-bar.tsx`: phone menu, fixed bottom bar of six bookmark tabs (icons + short labels,
  56 px tall, safe-area padding). Hides on scroll down and returns on scroll up (Motion
  `useScroll` + `useMotionValueEvent`).
- `footer.tsx`: back-cover style (cream board, double brass rule): full logo, Registered office
  (Noida) and Office (Ghaziabad), phone, email, page links, four social icons with empty links,
  "© 2026 Elara Universe Publishers Private Limited" (year from build time).
- `page-turn.tsx` + `components/ui/turn-link.tsx`: page-turn transition. Internal links use
  `TurnLink` (Next `Link` with `onNavigate`): the current page lifts and turns around its top edge
  (≈360 ms) before the router moves, then the new page settles in (≈300 ms, ≈600 ms in total).
  With reduced motion `MotionConfig reducedMotion="user"` drops the 3D transforms, leaving fades.
- `whatsapp-button.tsx`: floating button to wa.me/919625741192 with a pre-filled greeting,
  bottom right on desktop and above the bottom bar on phones.
- `app/not-found.tsx`: "This page is missing from the book" with a torn-out-page illustration
  (Elu arrives in Phase 12). Exported as `out/404.html`.
- Accessibility: "Skip to content" link (visible on focus), `<Main id="main">` landmark on every
  page, brass focus rings, `aria-current="page"` on the active menu item, labelled navs.
- `components/motion/motion-provider.tsx`: one `MotionConfig` for the site's easing and
  reduced-motion behaviour. Stub pages for Catalog, About, Events, Contact and QR Corner so the
  menu never 404s before their phases.

**Requirements**

- ✅ Desktop ribbon menu with longer active ribbon, hover sway, logo left
- ✅ Phone bottom bar ≥ 56 px, hides on scroll down / shows on scroll up
- ✅ Footer with logo, both addresses, phone, email, page links, social icons, © line
- ✅ Page-turn transition ≈ 600 ms; fade with reduced motion
- ✅ Floating WhatsApp button (desktop bottom right, above the phone bar)
- ✅ 404 page with illustration
- ✅ Visible focus rings + skip link

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ (11 routes) · Playwright 41
passed / 3 skipped (phone-only test on non-phone projects) ✅ — `tests/frame.spec.ts` covers the
menu, active state, page turn, bottom-bar hide/show, skip link, footer facts, WhatsApp link and
the 404 page.

**Screenshots:** `docs/screenshots/phase-03/` (home, catalog stub, 404 at 360/768/1440 + reduced
motion). Fixed after review: tablet header overlapped the ribbons (now mark-only at 768–1023 px)
and the footer email wrapped mid-word.

**Placeholders added:** social links are empty (`content/site.ts → socials`).

---

## Phase 4 — Flip-pad scroll

**Built:** `components/flip/flip-pad.tsx` (+ `flip-page.tsx`), the core "Living Book" idea, and
`/demo-flip` with five sample pages.

- `<FlipPad>` wraps `<FlipPage>` sections. A sticky full-height stage holds every page stacked
  (cream sheets, first on top); a ring binding board runs across the top. Scroll position drives
  everything through Motion values (`useScroll` → `useTransform`), so flips reverse when you
  scroll back and nothing re-renders per frame.
- Each page owns a scroll slot: content taller than the screen scrolls inside the page first
  (`translateY`), then the page rotates up around its top edge (`rotateX` 0 → −180°). The lifting
  page darkens as it curls and casts a moving shadow (gradient overlays whose opacity follows the
  flip) on the page beneath. The last page never flips: the pad simply releases into the footer.
- Page-stack progress on the right edge (page edges that thin out as pages are read) and a
  handwritten corner page number "Page 3 of 7" (`aria-live`).
- Only `transform` and `opacity` animate; `backface-visibility: hidden` hides pages past 90°.
- Reduced motion: no 3D. Pages stack in normal flow and fade in (`StackedPages`).
- All page content is server-rendered HTML text (verified in `out/demo-flip/index.html`).
- Lenis smooth scrolling added site-wide (`components/frame/smooth-scroll.tsx`): gentle on
  wheel, native on touch, disabled with reduced motion.

**Requirements**

- ✅ `<FlipPad>` / `<FlipPage>`, cream sheets bound at the top with a ring binding strip
- ✅ Scroll-driven rotateX 0 → −180° with moving shadow and curl, reversible
- ✅ Page-stack progress indicator + "Page x of y" corner number
- ✅ Tall sections scroll inside first, then flip
- ✅ Same vertical flip on phones (tested at 360 px)
- ✅ Reduced motion: no 3D, fade-stacked pages
- ✅ Real HTML text · ✅ `/demo-flip` with 5 pages

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright 52 passed /
8 skipped ✅ (`tests/flip-pad.spec.ts`: five pages + counter, 3D lift and counter advance,
reverse, inner scroll before flip, reduced-motion stack).

**Fixed during the gate:** (1) `FlipPage` was a client component, so across the server/client
boundary its elements arrived as lazy references and `FlipPad` saw no pages; `FlipPage` is now a
plain shared component. (2) The pad's position is derived from window scroll plus the measured
wrapper offset, and the current page is recomputed when the pages are measured, so a scroll that
happens before measurement is never lost.

**Screenshots:** `docs/screenshots/phase-04/` — demo at 360/768/1440, reduced motion (full page
and a viewport capture on page 3), and mid-flip captures at 35 %, 65 % and 2.4 screens for
desktop and phone. Reviewed: the page folds up over the rings with its shadow on the page below;
nothing scrolls sideways at 360 px.

**For Vaibhav:** to try it on your phone over Wi-Fi run `npm run dev`, note the "Network" URL
it prints (e.g. `http://192.168.x.x:3000`) and open `http://192.168.x.x:3000/demo-flip` on the
phone connected to the same Wi-Fi. On a Mac, allow incoming connections if macOS asks.

---

## Phase 5 — Home page

**Built:** `app/page.tsx` as a `<FlipPad>` of seven pages, plus the pieces it needs:

1. **Cover → first spread** (`components/home/opening-cover.tsx`): a closed cream book with
   the official logo, spine and brass frame. Opens on tap, on the first scroll/wheel/touch, or
   after 1.5 s (rotates around its left edge; fade with reduced motion). Underneath: eyebrow,
   headline "Books that grow curious minds." (`[PLACEHOLDER]`), the PLAYBOOK subline, "Explore
   the catalog" and "Request a sample copy".
2. **Three subjects on a shelf** (`subject-shelf.tsx`, `content/series.ts`): Basic Hindi Reader,
   TechNova and Art Journey standing on a brass-and-sage shelf. Hover lifts a book and opens a
   tiny two-page peek; a "Peek" button does the same on phones. Each cover links to
   `/catalog?subject=…`.
3. **Why schools choose Elara**: four sticky notes with washi tape (`components/ui/sticky-note`)
   — NEP 2020/NCF 2023, text-cum-workbook, digital support, teacher support with "Test
   generator: coming soon".
4. **Every book has a QR door**: inline SVG of a phone scanning a book's QR code, link to
   `/resources`.
5. **Peek inside**: `components/book/flipbook.tsx` (react-pageflip, browser-only import) with
   the eight Hindi Class 1 sample pages — two-page spread on wide screens, one page with swipe
   on phones, prev/next buttons, arrow keys, page counter.
6. **What's happening**: the next events from `content/events.ts` as pinned tickets
   (`components/events/event-ticket.tsx`), each with a "Sample" badge; "New events coming
   soon" when there are none.
7. **Back cover**: forest-green page, "Bring Elara to your school", sample-copy button and
   WhatsApp link.

Subject doodles (`components/illustrations/doodles.tsx`: अ आ क, cursor and pixels, crayons and
a splash) sit in the margins and drift with scroll. All copy I wrote is marked `[PLACEHOLDER]`
in code comments; no statistics anywhere.

**Requirements:** ✅ opening cover (tap / scroll / 1.5 s) · ✅ shelf with peeks and filtered
links · ✅ four sticky notes incl. "Coming soon" · ✅ QR door · ✅ Hindi Class 1 flipbook ·
✅ next events from `content/events.ts` · ✅ back-cover CTA with form link + WhatsApp ·
✅ facts only from PLAYBOOK.md · ✅ doodles drifting on scroll

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright 65 passed /
11 skipped ✅ (`tests/home.spec.ts`: auto-open, tap-open, seven pages and content, flipbook
turning). Fixed during the gate: `FlipPage`'s `bare` flag now travels as `data-bare` so the
cover fills the whole sheet; the Hindi doodle viewBox; ticket titles wrapping; the phone page
number moved to the top-right corner so it never sits on text.

**Screenshots:** `docs/screenshots/phase-05/` — cover closed and every page at 360/768/1440,
plus reduced motion. Reviewed and fixed as above.

**Placeholders added:** home headline and the copy marked in `app/page.tsx`; the three sample
events in `content/events.ts` (two upcoming, one past so the scrapbook can be previewed);
Art Journey blurb "to be confirmed".

**For Vaibhav:** events are sorted into upcoming/past when the site is built (static site), so
rebuild and redeploy after an event date passes, or when you add events.

---

## Phase 6 — Catalog page and book data

**Built:**

- `content/books.ts`: 24 books (Basic Hindi Reader 1–8, TechNova 1–8, Art Journey 1–8) with
  `slug, series, subject, class, title, titleHindi, cover, thumb, samples[], pages, size, isbn,
  mrp, edition, features[], support[], description, isPlaceholder`. Filled only from PLAYBOOK.md
  and the files: TechNova's twelve Salient Features and ISBN 978-93-93258-70-0 (book 1), Hindi
  Class 1 MRP ₹240 and 72 pages, Class 3 84 pages, Hindi/TechNova support lists, cover trim
  size 8.5 × 11 in measured from the PDFs. Everything else is `null` and hidden.
- `/catalog` (`components/catalog/catalog.tsx`): sticky-note filter tabs for Subject (All,
  Hindi, Computer, Drawing) and Class (All, 1–8), saved in the URL as `?subject=&class=`.
  Filters are read with `useSyncExternalStore` from `location.search`, so the full catalog is in
  the HTML (SEO) and the filter applies as soon as the page is interactive; a shared link such as
  `/catalog/?subject=hindi&class=3` restores the filter. Books slide to their new places when a
  filter changes (Motion layout animation); an illustrated empty shelf appears when nothing
  matches, with a "Show all books" button.
- One shelf per subject (`components/book/book-card.tsx`): each card carries its own piece of
  brass-and-sage shelf so neighbours join into a continuous shelf — eight books per row on
  desktop, four on tablets, **two per row on phones**. Hovering lifts a book off the shelf.
  Cards show cover (or a "cover coming soon" placeholder for Hindi 2, 4–8), series, class,
  subject tag, MRP if known (otherwise "Request a sample copy" → `/contact?book=<slug>`) and a
  "Peek inside" button.
- `/catalog/[slug]`: a minimal page for every book generated at build time (24 routes), so no
  card leads to a 404 before Phase 7 fleshes it out.
- `lib/use-reduced-motion.ts`: a hydration-safe `prefers-reduced-motion` hook (false while
  hydrating, then the real value) used wherever the choice changes markup (flip pad, Lenis,
  opening cover). Verified: no console or hydration errors in either motion mode.

**Requirements:** ✅ `content/books.ts` with 24 entries and only known facts · ✅ sticky-note
tabs saved in the URL · ✅ one shelf per subject, hover lift · ✅ two covers per shelf row on
phones · ✅ cover, series, class, tag, MRP/"Request a sample copy", "Peek inside" · ✅ empty state

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ (38 routes) · Playwright
82 passed / 14 skipped ✅ (`tests/catalog.spec.ts`: 24 books on three shelves, URL filters
round-trip, empty/invalid filters, two per row on phones, book pages and 404).

**Fixed during the gate:** placeholder covers stretched their shelf at eight columns (cover box
now fixed-ratio with `min-h-0`); a shared class constant imported from a client module into a
server page became a client reference — moved to a shared module.

**Screenshots:** `docs/screenshots/phase-06/` (catalog, filtered catalog, a book page at
360/768/1440 + reduced motion).

**Placeholders added:** Hindi Classes 2, 4–8 covers ("cover coming soon"), Art Journey 1–8
(placeholder covers), every `null` field above.
