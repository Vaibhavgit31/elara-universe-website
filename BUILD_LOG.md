# BUILD_LOG.md — Elara Universe Publishers website

One-go autonomous build following `PLAYBOOK.md`. One section per phase, appended in order.
Three running lists are kept at the top so nothing gets lost:

## For Vaibhav

Things PLAYBOOK.md asked me to ask, tell or show you. Each is answered with the agreed default.

- (Setup) PLAYBOOK.md says to keep `_source-assets/` out of git. Done from the first commit. The
  originals are untouched copies of the files you attached.
- (Setup) Playwright is pinned to 1.56.x because that is the version whose Chromium build is
  pre-installed in this environment. Upgrading later is a one-line change in `package.json`.
- (Phase 13) Lighthouse mobile Performance is 58 (Home), 66 (Catalog), 78 (book page) and 90
  (Contact) against the ≥ 90 target; Accessibility, Best practices and SEO are 100 everywhere.
  Three rounds of fixes are logged in the Phase 13 report. The remaining cost is the design's own
  JavaScript (React, Next.js, Motion, Lenis ≈ 240 KB gzip) and the signature animations running
  during the measurement window on a 4×-throttled phone. Options if you want the number higher,
  in order of effect: (1) show the intro and ink headline only after the first paint and make the
  sticker pops CSS-only (keeps the look, saves main-thread time); (2) drop Lenis smooth scrolling
  (the browser's own scrolling is fine on phones); (3) replace the scroll-linked flip pad on Home
  with the reduced-motion stacked pages for phones. Measure with PageSpeed Insights on the live
  site, not in this container, where identical runs vary by ±15 points.
- (Phase 13) The animation package is now `framer-motion` (what PLAYBOOK.md's "Motion
  (framer-motion)" row names) instead of the `motion` wrapper package: same library and version,
  but the wrapper's entry file defeats Next.js/Turbopack tree-shaking and shipped 44 KB of unused
  drag/layout code on every page.
- (Phase 14) Browsers: the site was tested in Chromium only (desktop, tablet and the Pixel 7
  phone profile in Playwright). Safari, Firefox and a real Android phone cannot be run in this
  build environment (no WebKit/Firefox builds, and installing browsers is not allowed here).
  Please open the live site once in Safari (iPhone) and Firefox; the flip pad, flipbook and
  contact form are the parts to watch.
- (Phase 14) The test enquiry through the contact form was not sent: there is no Web3Forms key
  in this environment, so the page shows the email and WhatsApp buttons (that state is tested).
  After deploying with `NEXT_PUBLIC_WEB3FORMS_KEY` set, send one enquiry and check the inbox.
- (Phase 14) The 24 QR Corner addresses were checked on the local build (all 200, unknown ones
  404). Check them on the live site after connecting the domain (`DEPLOY.md`, step 5).
- (Phase 14) `DEPLOY.md` walks through Netlify Drop and Vercel. The DNS record values shown
  there are the hosts' documented defaults; copy the exact values from the host's panel when
  you add the domain. Which registrar holds elarauniversepublications.com is a placeholder.
- (Phase 2, START) The sandbox cannot open docs.x.ai, supabase.com, vercel.com, docx.js.org or
  playwright.dev (proxy policy). Every API used in Phase 2 was read from the packages' own
  shipped documentation and type definitions, the documentation source repositories on GitHub
  and search snippets; the notes in `docs/research/` list each point that is UNCONFIRMED (xAI
  model names and prices, Supabase dashboard labels, Vercel plan limits). Please re-check those
  pages online before launch; the code comments carry the URLs.

## Simplified

Features that still failed after 3 genuine fix attempts and were simplified (brand look kept).

- (Phase 13) **Lighthouse Performance ≥ 90** is met on Contact only (Home 58, Catalog 66, book
  page 78 after three measured rounds of fixes: lazy Motion features + flipbook gating + lighter
  fonts; first paint without JavaScript + tree-shakeable Motion imports; per-section Suspense
  boundaries, which made things worse and were reverted). Nothing visible was simplified: the
  brand animations stay; the target itself is left open with the options listed under
  "For Vaibhav".

## Placeholders

Every `[PLACEHOLDER]` and `isPlaceholder` on the site, with where it lives (Phase 14 list).

- **Books** (`content/books.ts`): Basic Hindi Reader Classes 2 and 4–8 have no cover, sample
  pages, page count or MRP (`isPlaceholder: true`); Class 1 and 3 are real (cover, 8 sample
  pages, 72/84 pages, MRP ₹240 for Class 1). TechNova 1–8: covers real; ISBN only for Class 1;
  no MRP, page counts or edition. Art Journey 1–8: drawn placeholder covers, no facts
  (`isPlaceholder: true`); the series itself is `isPlaceholder: true` in `content/series.ts`.
- **Events** (`content/events.ts`): all three events are samples with `[PLACEHOLDER]` titles and
  venues and an example registration link; each shows a "Sample" badge.
- **Team** (`content/team.ts`): both co-founders have `[PLACEHOLDER]` bios and no photo (the
  polaroids show a drawn silhouette).
- **Company** (`content/site.ts`): the four social links are empty (footer icons point nowhere);
  the registrar of the domain is unknown (`DEPLOY.md`).
- **Festival dates** (`content/site-config.ts`): Diwali and Makar Sankranti windows for 2026–27
  are `[PLACEHOLDER]` to confirm each year.
- **Copy written for this build, open for approval** (marked `[PLACEHOLDER]` in the code): the
  hero headline "Books that grow curious minds." (`components/home/hero.tsx`); the three sticky
  notes, the Peek-inside caption and the back-cover line on Home (`app/page.tsx`); the About
  story paragraph (needs when and why Elara Universe started), the beliefs and the chapter
  copy (`app/about/page.tsx`); the "How a book is made" step descriptions
  (`components/about/making-steps.tsx`).

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

---

## Phase 7 — Book detail and flipbook

**Built:** `app/catalog/[slug]/page.tsx` for all 24 books (static params), with:

- `components/book/tilt-cover.tsx`: the cover tilts in 3D towards the mouse with a light shine
  that follows it (Motion springs on `rotateX/rotateY` and a translated radial highlight —
  transform only). On phones it follows device tilt where the browser allows it without a
  permission prompt (Android); on iOS, which needs a prompt, it stays still. Nothing moves with
  reduced motion.
- `components/book/flipbook.tsx` (react-pageflip, browser-only): two-page spread on wide
  screens, one page with swipe on phones, prev/next buttons, arrow keys, page counter, and a
  speaker toggle for the page-turn sound — off by default, remembered in `localStorage`
  (try/catch). The sound is a short paper swish synthesised with the Web Audio API
  (`lib/flip-sound.ts`), so no audio file or licence is needed. Books without samples show
  "Sample pages coming soon."
- "What's inside" from `features[]` (TechNova: the twelve Salient Features) and "Comes with"
  from `support[]`; a details table (class, pages, size, ISBN, MRP, edition, curriculum) that
  hides empty fields.
- "Request a sample copy" → `/contact?book=<slug>`; "Ask on WhatsApp" → wa.me/919625741192
  with a message naming the book.
- "More from this series" shelf (the other seven books).
- Page title and description per book, and schema.org `Book` JSON-LD (name, alternate Hindi
  name, ISBN, pages, image, language, publisher, and an Offer only where the MRP is known).

**Requirements:** ✅ 3D tilt (mouse; device tilt if allowed, otherwise none) · ✅ Flipbook with
spread/single page, sound toggle off by default, arrow keys, "Sample pages coming soon" ·
✅ What's inside + details table · ✅ sample-copy and WhatsApp buttons · ✅ series shelf ·
✅ SEO title/description + Book structured data

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright 99 passed /
17 skipped ✅ (`tests/book.spec.ts`: page content, TechNova features/ISBN/no samples, JSON-LD,
flipbook buttons/keys/sound toggle, mouse tilt). Fixed during the gate: flipbook controls are
disabled until react-pageflip has initialised (`data-ready`); two catalog tests were flaky
because they clicked or measured before hydration / during the page-turn entrance, so the
layout now marks `<body data-hydrated>` (`components/frame/hydration-marker.tsx`) and tests use
an `open()` helper that waits for hydration and for the entrance to settle.

**Screenshots:** `docs/screenshots/phase-07/` (hindi-1, technova-1, art-journey-2 at
360/768/1440 + reduced motion). Reviewed: spread on desktop, single page on phones, no empty
rows in the details table.

**Placeholders added:** none new (Art Journey pages show the placeholder covers and
"Sample pages coming soon").

---

## Phase 8 — About Us

**Built:** `/about` as a four-chapter `<FlipPad>` book (`app/about/page.tsx`):

1. **Our story** — `[PLACEHOLDER]` paragraph (Vaibhav's 3–4 sentences to come) plus the facts
   we do have (subjects, classes, NEP/NCF alignment, Noida and Ghaziabad).
2. **What we believe** — three sticky notes: joyful, activity-based learning; NEP-aligned books;
   books for every learner, including students in non-Hindi-speaking regions.
3. **Meet the founders** — polaroid cards held with washi tape for Sunil Sharma and Tausif Khan
   (both Co-founder) from `content/team.ts`, with illustrated initials avatars until photos
   land in `/public/team/`; bios are `[PLACEHOLDER]`.
4. **How a book is made** — write and edit, illustrate, print, add digital support: four line
   drawings (`components/about/making-steps.tsx`) that draw themselves in (Motion `pathLength`)
   when the chapter is read; instant with reduced motion.

Each chapter opens with a large brass chapter number and a drop cap (`dropcap` utility). To make
"draw in as you scroll" work inside the flip pad (where every stacked page is geometrically "in
view"), `FlipPad` now provides `useFlipPageActive()` — true only for the page being read — and
`WashiTape` was extracted into `components/ui/washi-tape.tsx` for notes and polaroids. No
history, dates or achievements were invented.

**Requirements:** ✅ chapter book with four chapters · ✅ large chapter number + drop cap ·
✅ polaroids with washi tape, team from `content/team.ts`, initials avatars, `[PLACEHOLDER]`
bios · ✅ four illustrated steps that draw in on scroll · ✅ nothing invented

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright 107 passed /
17 skipped ✅ (`tests/about.spec.ts`: chapters, founders, placeholders, drawing-in on reaching
chapter 4; reduced motion drawn at once). Fixed during the gate: the page needed an `h1`
("About Us"); a shared `padTop()` test helper.

**Screenshots:** `docs/screenshots/phase-08/` (chapter 1 at 360/768/1440 + reduced motion, and
chapters 2–4 at 1440 and 360).

**Placeholders added:** Our story paragraph; both founder bios and photos (`content/team.ts`);
the wording of the belief and step descriptions (marked in code).

---

## Phase 9 — Events

**Built:** `/events` as a scrapbook (`components/events/events-book.tsx`, a two-page flip pad):

- `content/events.ts` already carried the schema (title, slug, type launch | workshop |
  training | fair, date, city, venue, description, image, registerUrl, isPlaceholder) with
  three samples, all `isPlaceholder: true`: two upcoming (14 Nov and 5 Dec 2026) and one past
  (19 Sep 2026) so the scrapbook can be seen. One sample carries an example.com registration
  link so the "Register" button can be reviewed.
- **Upcoming**: pinned paper tickets (`components/events/event-ticket.tsx`) with a push-pin,
  notched sides, a torn bottom edge, a type sticker (colour by type), date block, title,
  city · venue, description, optional "Register" button, and a "Sample" badge on placeholders;
  sorted by date. Tickets swing gently on their pins (Motion loop, transform only; off with
  reduced motion).
- **Past**: a photo scrapbook (`components/events/scrapbook.tsx`): polaroids with washi tape
  and handwritten Caveat captions that drop onto the page when it is read; clicking a photo
  opens a native `<dialog>` lightbox (Escape, backdrop click or the close button closes it).
- Events move from upcoming to past **by date, live**: `lib/use-today.ts` hydrates with the
  build date and then switches to the visitor's date (no rebuild needed, no hydration
  mismatch). The home page's "What's happening" now uses the same `UpcomingEvents` component.
- Empty state: an empty pinboard illustration with "New events coming soon." (Elu joins it in
  Phase 12.)

**Requirements:** ✅ `content/events.ts` with the agreed fields and 3 samples ·
✅ pinned torn-edge tickets sorted by date with type sticker and optional Register ·
✅ photo scrapbook with Caveat captions and a lightbox · ✅ automatic upcoming/past by date ·
✅ "New events coming soon" empty state · ✅ "Sample" badge on placeholders

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright 112 passed /
20 skipped ✅ (`tests/events.spec.ts`: sorted tickets, stickers, Register link, Sample badges,
scrapbook page, lightbox open/close).

**Screenshots:** `docs/screenshots/phase-09/` (upcoming page at 360/768/1440 + reduced motion,
scrapbook page at 1440 and 360). Polished after review: on phones the flip-pad page number now
sits inside the ring binding instead of over the first line of text.

**Placeholders added:** none new (the three sample events and the example.com Register link).

---

## Phase 10 — Contact

**Built:** `/contact` (`app/contact/page.tsx`) with a letter and a postcard side by side:

- `components/contact/contact-form.tsx`: a letter on lined cream paper ("Dear Elara
  Universe, … Yours sincerely"). Fields: name, school name (optional), role (teacher, principal,
  parent, distributor, other), phone (Indian mobile check, spaces/dashes allowed, +91 optional),
  email, city, subjects (Hindi, Computer, Drawing chips), classes (1–8 chips), message.
  react-hook-form + zod 4 (`@hookform/resolvers`), clear error messages under each field,
  `aria-invalid`/`role=alert`, typed text kept if sending fails.
- `?book=<slug>` pre-fills the message with "Sample copy request: <Series> Class <n>" and
  ticks that subject and class.
- Sending: **Web3Forms** (recommended: free, no backend, works from a static site) with the key
  in `NEXT_PUBLIC_WEB3FORMS_KEY`. Hidden `botcheck` honeypot (bots that tick it get a polite
  "sent" and nothing is posted). Client-side cooldown: one letter per minute per browser
  (`localStorage`, try/catch). Nothing is stored on the site.
- On success the letter folds (scales/rotates), a paper plane fades in and flies off the
  screen (Motion `useAnimate` sequence, transform/opacity only), then a thank-you note appears
  and a small burst of leaves and stars fires (canvas-confetti, loaded on demand). With reduced
  motion only the note appears.
- Without a key (this build): after a valid submit the letter is handed over — "Your letter is
  written!" with **Send by email** (mailto with the whole letter in the body) and **Send on
  WhatsApp** (wa.me with the letter as text).
- `components/contact/postcard.tsx`: both addresses (Registered office: Noida; Office:
  Ghaziabad), phone, email, a WhatsApp button, and a Google Map (`lazy-map.tsx`) that is only
  inserted once it scrolls into view (Motion `useInView`).

**Requirements:** ✅ letter on lined paper with all fields and an Indian phone check ·
✅ `?book=` pre-fill · ✅ fold → paper plane → thank-you note; note only with reduced motion ·
✅ form service via env variable, honeypot, basic (client-side) rate limit, nothing stored ·
✅ clear errors, text kept on failure · ✅ postcard with addresses, phone, email, WhatsApp, lazy
map · ✅ env variables documented below

**Checks:** `tsc` ✅ · `eslint` ✅ (React Compiler rules satisfied) · Prettier ✅ ·
`next build` ✅ · Playwright **132 passed / 24 skipped** on two builds: one with
`NEXT_PUBLIC_WEB3FORMS_KEY=playwright-test` (mocked Web3Forms: failure keeps the text, success
shows the note) and the deliverable build without a key (email/WhatsApp hand-over). Also
covered: postcard facts, lazy map `src`, validation messages, `?book=` pre-fill, hidden honeypot.

**Screenshots:** `docs/screenshots/phase-10/` (contact and pre-filled contact at 360/768/1440 +
reduced motion, validation errors, fallback panel).

**Libraries added (checked):** react-hook-form 7.90 (MIT, updated Oct 2026), zod 4.6 (MIT,
Oct 2026), @hookform/resolvers 5.9 (MIT, Aug 2026), canvas-confetti 1.9.4 (ISC, Oct 2025,
~10 KB gzipped, loaded only after a successful send). Note: react-pageflip 2.0.3 (MIT) was last
published in May 2022 — older than 12 months, but it is the playbook's choice and works well.

**Placeholders added:** none.

**For Vaibhav — environment variables:**
1. Create a free account at web3forms.com, add `info@elarauniversepublications.com` (or the
   inbox you prefer) and copy the **Access Key**.
2. Set `NEXT_PUBLIC_WEB3FORMS_KEY=<that key>` before the site is built: in Netlify → Site
   configuration → Environment variables, or Vercel → Project → Settings → Environment
   Variables, or in a local `.env.local` file (copy `.env.example`) when you build on your Mac
   for a drag-and-drop deploy. The key is public by design (Web3Forms keys are meant for
   browsers).
3. Rebuild and deploy. Until then the form hands letters to email/WhatsApp.
4. I could not fetch the Web3Forms docs from this environment (blocked), so the field names
   follow its standard API (`access_key`, `botcheck`, JSON `success`). Please send one test
   letter after setting the key (Phase 14 step 3) — if it does not arrive, tell me the error
   text shown on the page.
5. The Google Map needs the live internet; it stays a blank green box in this sandbox.

---

## Phase 11 — QR Corner (placeholder)

**Built:**

- `/resources` (`components/resources/qr-corner.tsx`): the phone-scanning-a-book illustration,
  "Scanned a QR code from your book? Your learning corner is being set up. Check back soon!"
  and a button back home. No resources, logins or downloads.
- `/resources/[series]/[class]` for series `hindi | technova | art-journey` and classes 1–8:
  all 24 addresses are generated at build time (`generateStaticParams`, `dynamicParams =
  false`) and show the same placeholder with the series name (and Hindi title) and class, plus a
  link to that series in the catalog. Anything else under `/resources/` is a 404.
- Future redirects (task default, instead of next.config): commented examples in
  `public/_redirects` (Netlify, copied into `out/`) and `vercel.json` with an empty `redirects`
  array plus `vercel.redirects.example.json` to copy from (Vercel's JSON cannot hold comments).
- `docs/qr-addresses.md`: the 24 addresses on elarauniversepublications.com.

**Requirements:** ✅ one friendly placeholder page with illustration, text and home button ·
✅ 24 series/class addresses work now and never break · ✅ commented redirect examples
(`_redirects` + `vercel.json`, per the agreed default) · ✅ list of 24 addresses (below)

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ (62 routes) · Playwright
144 passed / 24 skipped ✅ (`tests/resources.spec.ts`: placeholder text and links, series/class
pages, all 24 addresses return 200, unknown ones 404). Note: the background static server hit its
two-hour limit during one run and was restarted; the rerun was green.

**Screenshots:** `docs/screenshots/phase-11/` (QR Corner and the TechNova Class 3 address at
360/768/1440 + reduced motion).

**Placeholders added:** none (the whole section is the agreed placeholder).

**For Vaibhav — the 24 QR Corner addresses** (also in `docs/qr-addresses.md`; the version
without the final slash works too):

- Basic Hindi Reader 1–8: `https://elarauniversepublications.com/resources/hindi/1/` … `/hindi/8/`
- TechNova 1–8: `https://elarauniversepublications.com/resources/technova/1/` … `/technova/8/`
- Art Journey 1–8: `https://elarauniversepublications.com/resources/art-journey/1/` … `/art-journey/8/`

---

## Phase 12 — Animations, mascot Elu and polish

**Built** (all Motion/CSS, `transform` and `opacity` only, every piece reduced-motion aware):

- **Reusable pieces** (`components/motion/`): `Reveal`, `StickerPop`, `Wobble` (`reveal.tsx`,
  sharing `useReveal()` which combines in-view detection with the flip pad's active page),
  `InkText` (letters write themselves in; plain text with reduced motion, full text kept for
  screen readers), `DriftingLeaves` (parallax leaves and paper dots), plus `MotionProvider`
  (`reducedMotion="user"`), `lib/use-reduced-motion.ts`, `lib/cover-store.ts` and
  `lib/use-crayon-trail.ts`. The paper plane lives in the contact form (Phase 10).
- **First-visit intro** (`components/home/opening-cover.tsx`): the logo's seven lotus leaves
  unfold one by one from their base, then the book pages and wordmark appear and the cover opens
  (≈1.5 s + the 0.9 s opening). Once per session (`sessionStorage`), with a **Skip intro**
  button; later visits show the logo at once. Reduced motion: a fade, then the cover opens.
  `scripts/prepare-images.mjs` now also emits `components/brand/mark-paths.ts` and
  `public/brand/wordmark.svg` from the official logo.
- **Hero** (`components/home/hero.tsx`): the headline writes itself in ink once the cover opens,
  the margin doodles draw themselves (pathLength; the Devanagari letters fade in), leaves and
  dots drift at different speeds, a crayon-dot trail follows the mouse (desktop only), and Elu
  waves.
- **Elu, the mascot** (`components/mascot/elu.tsx`): an original sage-green leaf sprite with a
  pencil, drawn as inline SVG with poses `wave`, `point`, `read`, `search`, `cheer`, `phone`
  and `peek` (plus `EluPeek` for page corners). Blinks, sways, waves, bounces when cheering
  (stars pop). Placed in the hero (wave), peeking over the shelf page, on the catalog's empty
  shelf (search), the events empty board (point), QR Corner (phone), the 404 page (search) and
  the contact thank-you note (cheer). Loops pause when the page is not the one being read.
- **Shelf**: books wobble on hover and hop when tapped. **Catalog**: class tabs and the "Class n"
  labels pop in like stickers. **Notes and polaroids** lift at a corner on hover.
- **Micro-interactions** (`app/globals.css`): buttons press like a rubber stamp with a soft
  brass ink ring on tap (`stamp`), text links carry a hand-drawn pencil-stroke underline
  (`link`), `lift-corner` cards, a crayon-dot trail, and a tiny flipping-book loader
  (`components/ui/book-loader.tsx`, used by `app/loading.tsx`).
- **Performance**: only transform/opacity animate; loops are gated by the flip pad's active
  page; confetti and react-pageflip load on demand. Home page JavaScript (from
  `scripts/js-size.mjs`): **before 810 KB raw / 259 KB gzip, after 821 KB raw / 262 KB gzip**
  (+3 KB gzip for the intro, Elu, ink text and leaves). Phase 13 looks at trimming the total.
- **Brand check**: every page re-read against the colour and font rules — cream/sage/brass
  pages, subject colours only on tags, stickers, pins and badges; Lora headings, Cormorant only
  on the hero line and wordmark, Nunito body, Caveat for handwritten notes, Noto Sans
  Devanagari for Hindi.

**Requirements:** ✅ reusable animation pieces · ✅ first-visit intro with Skip · ✅ original
mascot with six poses + peek, blink/wave/peek/cheer, used in hero, empty states, QR Corner, 404 ·
✅ stamp buttons, pencil-stroke links, corner-lift cards · ✅ transform/opacity only, off-screen
loops paused, JS size reported · ✅ reduced motion = fade or nothing (tested) · ✅ colour/font
check · ✅ GIFs recorded

**Checks:** `tsc` ✅ · `eslint` ✅ (React Compiler rules) · Prettier ✅ · `next build` ✅ ·
Playwright **157 passed / 27 skipped** ✅ (`tests/polish.spec.ts`: intro + skip + once per
session, Elu on hero/404/QR Corner, stamp/pencil/lift classes, reduced motion plain headline and
no transforms). Fixed during the gate: the cover's decorative frame intercepted taps (now
`pointer-events-none`, and the whole cover opens on tap); the Skip button sat below the fold.

**Screenshots:** `docs/screenshots/phase-12/` (intro frames at 350/450/500 ms, hero open, 404,
QR Corner, catalog, phone variants, plus home and a book page at 360/768/1440 + reduced motion).

**Videos:** `docs/videos/` — eight GIFs: `intro-cover-ink`, `flip-pad-scroll`,
`page-turn-ribbons`, `shelf-wobble-peek`, `catalog-filter-slide`, `book-tilt-flipbook`,
`events-tickets-scrapbook`, `buttons-stamp-elu` (recorded with Playwright frame captures and
assembled with ImageMagick; Playwright's ffmpeg has no GIF encoder). The contact paper plane
needs a build with a form key, so it is covered by the keyed test run rather than a GIF.

**Placeholders added:** none.

---

## Phase 12b — Fun extras for children

**Built** (every extra has a switch in `content/site-config.ts`; none blocks reading or
navigation; all work by touch at 360 px):

- **Sticker book** (`lib/stickers.ts`, `components/extras/sticker-book.tsx`): visiting each of
  the six pages earns a sticker (leaf, book, star, ticket, pencil, QR door). A header button
  shows the count ("1/6") and opens a native dialog with the stickers; all six earn the
  "Bookworm" badge with Elu cheering. A small note pops up when a sticker is found. Progress is
  saved only in the visitor's browser (`localStorage` with try/catch; if storage is blocked the
  site still works and stickers simply last for the visit).
- **Play corner** on Home (new page 7 of 8, `components/extras/play-corner.tsx`): three
  activities, each loaded only when its "Play" button is pressed (`next/dynamic`, so the home
  page does not grow): trace अ with a finger or mouse on a canvas with crayon colours
  (`trace-letter.tsx`), type your name and see it as 0s and 1s (`binary-name.tsx`), colour Elu
  with five crayons (`colour-elu.tsx`).
- **Time-of-day desk** (`desk-mood.tsx`): from 18:00 to 06:00 local time the desk behind the
  pages warms up and a small desk lamp appears at the edge of the binding.
- **Festival touches** (`festival-touches.tsx`): on the dates in `siteConfig.festivalDates`,
  diyas (Diwali) or kites (Makar Sankranti) hang from the header. Dates are `[PLACEHOLDER]` to
  confirm each year.
- **Page-turn sound** (`lib/flip-sound.ts`, `components/ui/sound-toggle.tsx`): one shared
  speaker toggle for the flip pad and every flipbook, off by default, choice remembered.

**Requirements:** ✅ sticker book with localStorage try/catch · ✅ three lazy-loaded play
activities · ✅ evening desk + lamp and festival dates · ✅ remembered sound toggle ·
✅ switches in `content/site-config.ts` · ✅ nothing blocks reading, touch at 360 px

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **174 passed /
30 skipped** ✅ (`tests/extras.spec.ts`: stickers earned and shown, blocked storage, the three
activities, sound toggle remembered, evening lamp + Diwali diyas via a faked clock). Home page JS
after this phase is printed above the report in the build log run (unchanged by the lazy
activities).

**Screenshots:** `docs/screenshots/phase-12b/` (play corner at 1440/360, sticker book at
1440/360, evening desk with Diwali diyas).

**Placeholders added:** festival dates in `content/site-config.ts`.

## Phase 13 — Accessibility, SEO and speed

**Audited and fixed:**

- **Accessibility.** New axe audit (`tests/a11y.spec.ts`, `@axe-core/playwright`, WCAG 2 A/AA,
  2.1 AA and best-practice rules) on nine routes plus the 404 page: zero violations. Fixes it
  found: the floating WhatsApp button now sits in an `<aside>` landmark; the "Sample" badge on
  event tickets was cream on coral (2.7:1) and is now evergreen on the drawing tint; the events
  page gained an "Upcoming" h2 so headings run h1 → h2 → h3; the flipbook keyboard box has
  `role="group"` for its label. Lighthouse Accessibility is 100 on all four audited pages.
- **SEO.** `app/sitemap.ts` (54 URLs: 6 pages, 24 books, 24 QR addresses), `app/robots.ts`
  (hides `/styleguide/` and `/demo-flip/`), `app/manifest.ts`, and Organization structured data
  (`components/frame/organization-jsonld.tsx`: legal name, both addresses, phone, email, logo,
  founders) in the head of every page, next to the Book data on book pages. Open Graph site name,
  theme colour. Titles and descriptions were already unique per page. `tests/seo.spec.ts` checks
  all of it.
- **Speed.**
  - *First paint no longer waits for JavaScript.* Two things hid every page until scripts ran:
    the page-turn wrapper started each page at opacity 0, and `app/loading.tsx` wrapped every
    page in a streaming boundary whose content stayed hidden until an inline script revealed it.
    The first page load now skips the entrance turn (later turns keep it), the route loader is
    gone (the tiny book now shows inside the flipbook box while sample pages load), and the ink
    headline and the opening cover render their visible state in the HTML. Verified with
    JavaScript switched off: Home and Catalog render fully.
  - *Animation library loaded where used.* Motion components are `m` + `LazyMotion` (features
    fetched on demand, `strict`). Imports moved from `motion/react` to `framer-motion` (the same
    library and version, 14.2.0): the `motion` wrapper re-exports `m` through a namespace object
    that Turbopack cannot tree-shake, which kept 44 KB (gzip) of drag and layout code in every
    first load. Home first-load JS: 269 → 239 KB gzip.
  - *Flipbooks on demand.* react-pageflip and the eight sample images (≈ 780 KB) load only when
    the reader scrolls near the book on the page being read; the box reserves its aspect ratio,
    so the book page no longer shifts (CLS 0.56 → 0). The home page no longer downloads sample
    pages it does not show.
  - *Fonts.* Noto Sans Devanagari: Devanagari subset only, two weights, not preloaded
    (−146 KB on every page's critical path); Caveat: one weight; Caveat and Cormorant are
    fetched when first used instead of preloaded. Only Nunito and Lora are preloaded.
  - Images were already WebP with explicit sizes (Phase 2); everything below the first screen is
    lazy-loaded by `next/image`.

**Lighthouse (mobile, `node scripts/lighthouse.mjs <label>`; summaries in `docs/lighthouse/`):**

Before (start of the phase):

| page | performance | accessibility | best-practices | seo | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| home | 48 | 100 | 100 | 100 | 6.3 s | 870 ms | 0 |
| catalog | 73 | 100 | 100 | 100 | 4.9 s | 370 ms | 0 |
| book | 48 | 100 | 100 | 100 | 5.8 s | 320 ms | 0.56 |
| contact | 75 | 100 | 100 | 100 | 4.7 s | 360 ms | 0 |

After:

| page | performance | accessibility | best-practices | seo | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| home | 58 | 100 | 100 | 100 | 5.4 s | 710 ms | 0.04 |
| catalog | 66 | 100 | 100 | 100 | 5.0 s | 460 ms | 0 |
| book | 78 | 100 | 100 | 100 | 5.0 s | 110 ms | 0 |
| contact | 90 | 100 | 100 | 100 | 3.1 s | 220 ms | 0 |

Accessibility, Best practices and SEO are 100 everywhere. Performance ≥ 90 was **not reached**
on Home, Catalog and the book page (see "For Vaibhav" and "Simplified"). Three rounds of fixes
were made and measured (lazy Motion + flipbook gating + fonts; first paint without JavaScript +
tree-shakeable Motion imports; per-section Suspense boundaries, which made blocking time and
layout stability worse and were reverted). What remains is the cost of the design itself on a
throttled phone: ≈ 240 KB of JavaScript (React, Next.js, Motion, Lenis, react-hook-form) that
must run before the signature animations can start, plus the intro, ink headline and flip pad
work during the measurement window. Scores also swing ±15 points between identical runs in this
container because the first paint races script start-up (the book page measured 47 and 77 on
the same build); PageSpeed Insights on the live site is the reliable check.

**Requirements:** ✅ heading order, alt text, labelled fields, focus rings, contrast, reduced
motion, keyboard (axe + Lighthouse 100) · ✅ unique titles/descriptions, link-preview image,
sitemap, robots, Organization data · ✅ WebP images with sizes, lazy loading, animation library
loaded on demand, home JS reduced · ✅ Lighthouse run on Home, Catalog, a book page and Contact ·
✅ Accessibility ≥ 95 · ✅ SEO ≥ 95 · ❌ Performance ≥ 90 on Home, Catalog and book page
(Contact reached 90; logged under Simplified / For Vaibhav)

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright
**188 passed / 72 skipped** ✅ (new: `tests/a11y.spec.ts`, `tests/seo.spec.ts`; `tests/book.spec.ts` now scrolls
to the flipbook before expecting it, as a reader would).

**Libraries added (dev only):** `lighthouse` 13.5 (Apache-2.0, updated 2026) to measure the
scores; `@axe-core/playwright` 4.13 (MPL-2.0, updated 2026) for the accessibility audit.
`framer-motion` replaces the `motion` package name (same code, MIT) for the tree-shaking reason
above; no second animation library.

**Screenshots:** `docs/screenshots/phase-13/` (Home, Catalog, book page, Contact, Events at
360/768/1440 and reduced motion).

**Placeholders added:** none.

## Phase 14 — Final check, README and DEPLOY.md

**Done:**

1. **Placeholders.** Every `[PLACEHOLDER]` and `isPlaceholder` is listed under "Placeholders" at
   the top of this log (books, events, team, social links, festival dates, and the copy written
   for this build that is open for approval).
2. **Widths and browsers.** New `tests/widths.spec.ts` opens seven pages at 360, 768, 1024 and
   1440 px and checks the header, the heading and that nothing scrolls sideways (360/768/1440
   were already Playwright projects; 1024 is new). The screenshot script now also captures
   1024 px. Chromium only: Safari, Firefox and a real Android phone cannot run in this
   environment (see "For Vaibhav").
3. **Test enquiry.** Not sent: no Web3Forms key here; the keyless state (email + WhatsApp
   buttons) is what the build shows and what the tests cover (see "For Vaibhav").
4. **Deployment.** `DEPLOY.md`: build on your computer, Netlify Drop (drag `out/`) and Netlify
   from Git, Vercel from Git, connecting elarauniversepublications.com step by step (both
   hosts, both DNS ways), checking HTTPS, launch checklist, troubleshooting. `vercel.json`
   gained `"trailingSlash": true` so the slashless QR form redirects on Vercel too.
5. **QR Corner addresses.** All 24 return 200 on the built site and unknown ones 404
   (`tests/resources.spec.ts`); the list is in `docs/qr-addresses.md`.
6. **README.md.** Running and checking the site, where things live, how to add or change a
   book, an event, a team photo, company facts and switches, the contact form key, QR
   redirects, and how to redeploy.

**Requirements:** ✅ placeholder list · ✅ 360/768/1024/1440 tested (Chromium) · ❌ Safari,
Firefox, Android (not available here; For Vaibhav) · ❌ test enquiry (no key; For Vaibhav) ·
✅ deployment walkthrough with DNS and HTTPS (`DEPLOY.md`; not deployed, as agreed) · ✅ 24 QR
addresses checked on the build (live check listed in DEPLOY.md) · ✅ README

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **192 passed / 84 skipped** ✅

**Screenshots:** `docs/screenshots/phase-14/` (Home, Catalog, book page, About, Events,
Contact, a QR address at 360/768/1024/1440 and reduced motion).

**Placeholders added:** none (the registrar of the domain is noted in `DEPLOY.md`).

---

# Phase 2 — Classroom upgrade

One-go run of the "Phase 2: Classroom upgrade" prompt in `PLAYBOOK.md`. Same gate after every
step; one section per step below. "For Vaibhav", "Simplified" and "Placeholders" at the top of
this file keep collecting entries, prefixed "(Phase 2, Step X)".

## Phase 2 — START and research

- `PLAYBOOK.md` replaced by the re-exported file (first 614 lines identical, Phase 2 section added).
  CLAUDE.md gained the "Phase 2 rules" section. The Phase 1 suite was run first on the untouched
  build: **192 passed**.
- No keys are set in this environment (`XAI_API_KEY`, Supabase, `VERCEL_TOKEN`, `ADMIN_EMAILS`,
  Web3Forms), so every server feature will be built with a mock mode and documented.
- Six research agents read the official sources and wrote `docs/research/`: `xai.md` (AI SDK 7 +
  `@ai-sdk/xai` 5, Responses API, model ids as listed), `supabase.md` (`@supabase/ssr` for the
  Next 16 `proxy.ts`, admin API, RLS, migrations), `nextjs16-vercel.md` (route handlers, proxy,
  server actions, what changes without `output: 'export'`, Vercel CLI), `docx-print.md` (`docx`
  9.11, A4 print CSS, Playwright PDF, `@dnd-kit`), `hindi-chapters.md` (both Hindi Reader
  contents pages transcribed by eye, every row marked "needs checking") and `layout-audit.md`
  (Step A findings with screenshots). The sandbox proxy blocks docs.x.ai, supabase.com,
  vercel.com, docx.js.org and playwright.dev, so facts came from the packages' own shipped docs
  and type definitions, the docs' source repositories on GitHub and search snippets; every
  unconfirmed point is listed as UNCONFIRMED in the notes and must be re-checked online before
  launch (see "For Vaibhav").

## Phase 2 — Step A: laptop alignment and blank sides

**Audit result** (`docs/research/layout-audit.md`, 12 routes × 14 viewport/zoom configs): no
horizontal scroll and no static element outside the viewport anywhere; no `100vh`, every image
sized. The real problems were four different page containers (1024/1152/1280 px with 16/24/32 px
paddings) so the text edge jumped between header, flip pages and plain pages by 72–128 px on
laptops; plain pages floated as an island with no full-width backgrounds; intro paragraphs ran to
81 characters; the footer email used `break-all`; decorations sat on the padding edge.

**Fixed:**

- One container: `container-page` in `app/globals.css` (`max-width: 80rem`, centred,
  `padding-inline: clamp(16px, 4vw, 48px)`) used by the header, footer, flip-pad pages, the hero
  and every plain page; `max-w-5xl/6xl/7xl` wrappers are gone and `components/frame/page-stub.tsx`
  (unused) was deleted.
- Full-width bands: new `components/ui/section.tsx` (`<Section tone>`: full-bleed background with
  the container inside). Catalog, book, contact, QR Corner, styleguide and 404 use it; `<Main>`
  no longer carries width or padding. Tones are paper for now; the acrylic background of Step C
  makes the bands visible.
- Reading measure: intro paragraphs `max-w-2xl` → `max-w-prose` (65ch) on catalog, book, contact,
  about, events, demo-flip, styleguide and the hero tagline. Body text is left-aligned everywhere;
  the 404 page is now a two-column editorial layout instead of centred text.
- Footer email `break-words`; the flip-pad page number sits in the gutter
  (`left: max(1.25rem, (100vw − 80rem)/2)`) so it never collides with content at 125 % zoom.
- Flip pads expose `data-starts` (the scroll position where each page lies flat), used by the
  tests and by the page dots in Step B.

**Tests:** `tests/widths.spec.ts` rewritten: 10 routes × 13 configs (360, 768, 1024, 1280, 1366,
1440, 1536, 1920, 2560, and 1440×900 at 90/110/125 % plus 1366×768 at 125 %, emulated as a
smaller CSS viewport at the zoom's device pixel ratio). Each checks: no horizontal scroll, no
visible non-decorative element outside the viewport, header text edge = page container edge
within 2 px, left gutter = right gutter within 2 px; on flip pads the checks repeat at the rest
position of every page. 12 screenshot baselines (6 routes × 1440/360, reduced motion) in
`tests/widths.spec.ts-snapshots/`, refreshed with `--update-snapshots` whenever a step changes
the look. `padTop()` now waits for the pad's measured height instead of guessing.

**Not changed (by design):** mid-flip the rotating sheet projects a little past the viewport
(clipped, cosmetic); the 2560 px layout is the 1280 px container centred on a full-width
background, as the brief asks.

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **330 passed / 498 skipped** ✅

**Screenshots:** `docs/screenshots/phase2-A/` (Home, Catalog, About, Contact at 1280, 1366, 1920
and 2560) and the baselines above.

## Phase 2 — Step B: menu always reachable

**Built:**

- **Glass top bar** (`components/frame/top-bar.tsx`, replaces `header.tsx`): fixed on every page,
  outside the page-turn and flip-pad containers, `z-index` 100 (above sheets, toasts and the
  WhatsApp button; native dialogs sit in the top layer). It shrinks from 64 to 52 px once the
  page has scrolled 24 px (ribbons and logo shorten with it). The `glass` utility in
  `app/globals.css` is the Step C acrylic recipe (white 55 %, blur 20 px + saturate 160 %, 1 px
  white/70 % border, top-edge highlight, green-tinted layered shadows, 3 % noise) with the
  near-solid cream fallback for browsers without `backdrop-filter` and for slow devices
  (`<html data-solid>` is set when the device has ≤ 2 cores or data saver on).
- **Links:** Home, Books, About, Events, Web Support, QR Corner, Contact as bookmark ribbons from
  768 px, plus **Teacher login** (icon-only until 1280 px); it reads **My portal** once a session
  exists (`lib/session.ts`, replaced by the real session in Step F). Two temporary pages back
  the new links until Steps F/G: `/web-support/` (public intro with "Request access" and
  "Teacher login") and `/login/` (glass card, no form yet, hidden from search engines).
- **Phones:** logo + menu button in the bar; the button opens a glass sheet (native `<dialog>`,
  `components/frame/menu-sheet.tsx`) with every link, Teacher login and the sticker book; the
  bottom bar keeps all seven tabs and **never hides** now.
- **Flip pads** (`components/flip/flip-pad.tsx`): the stage sits below the bar
  (`top: var(--topbar-h)`, height `100svh − bar`), so the binding and page numbers are never
  covered. **Page dots** on the right (`nav "Pages"`, one 44 px button per page, read pages
  thin out, current page marked) jump to any page through Lenis (instant with reduced motion);
  a **back-to-top** button joins the page number; **PageDown/PageUp and ←/→** turn pages while
  the pad is on screen (↑/↓ keep scrolling inside a page; keys are ignored inside form fields,
  dialogs and the flipbook). The reduced-motion stacked pages get the same dots, following the
  section in view.

**Tests:** `tests/menu.spec.ts` — on every page of `/`, `/about/`, `/events/` and `/demo-flip/`
(desktop, tablet, phone, reduced motion) the bar is in the viewport and the "Books" ribbon
(laptops) or the menu button (phones) is the element actually hit at its centre, i.e. visible
and clickable without scrolling; dots, back-to-top and the keys turn pages; typing in the
contact form never turns a page. `tests/frame.spec.ts`: 7 links, bar fixed and shrinking, phone
sheet opens and closes, bottom bar stays while scrolling. Sitemap now lists 55 URLs. Baselines
refreshed.

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **362 passed / 502 skipped (full run; the three tests updated for the new menu labels and the sticker button in the phone sheet were re-run green)** ✅

**Screenshots:** `docs/screenshots/phase2-B/` (Home, About, Catalog, Web Support, Login at
360/768/1024/1440 and reduced motion; the open phone menu sheet; the About pad scrolled to page
3/4 at 360 and 1440 with dots and back-to-top).

**Placeholders added:** `/web-support/` and `/login/` are temporary pages (replaced in Steps F
and G).
