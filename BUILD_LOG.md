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
