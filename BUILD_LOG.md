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
- (Phase 2, Step D) The home page is now "A day at Elara School". The wording on it was written
  for this build and is marked `[PLACEHOLDER]` in the code: the chalkboard headline "Books that
  grow curious minds." and the "Hover over the classroom to explore" hint (`content/hero.ts`), the seven
  hotspot labels, the room leads ("Why schools choose Elara", "Scan the book, open the lesson",
  "A test paper in minutes", "Drop a letter in the postbox") and the four "why" notes
  (`content/home.ts`). Please read them once and change anything that does not sound like you.
- (Phase 2, Step D) The FAQ room shows six questions from `content/faq.ts` (12 in the file). The
  answers about ordering, prices, sample copies and QR codes that are not working are
  `[PLACEHOLDER]` because PLAYBOOK.md does not say how schools order, how pricing works or what
  to do when a code fails. Each answer links to `/web-support/help#<anchor>`; that page is built
  in Step G.
- (Phase 2, Step D) Each book room shows two report badges, "NEP 2020 · Aligned" and
  "Classes · 1–8". PLAYBOOK.md marks the Art Journey class range and curriculum alignment as
  "please confirm", so the Art room's badges are shown from the series data with
  `isPlaceholder` still true. If Art Journey covers a different range, change it in
  `content/series.ts` and the badges follow.
- (Phase 2, Step E) Every page now wears the acrylic classroom look. A few short labels were
  written for it and are marked `[PLACEHOLDER]` in the code: the shelf eyebrows on the Catalog
  ("Hindi shelf" …), the "Sample pages" / "Report card" eyebrows and the "Turn the pages" note on
  a book page, the "Your school" note on the events board and the two badge labels on QR Corner.
  Change any of them freely; no facts are stated in them.
- (Phase 2, Step F) Supabase is set up by hand once (`SETUP-SUPABASE.md`). The dashboard
  labels in that file were taken from Supabase's documentation sources, because this build
  environment cannot open supabase.com; if a label has moved, the setting names stay the same.
- (Phase 2, Step F) `images.unoptimized` is kept on purpose: covers and sample pages are already
  WebP files at their display sizes, so Vercel's image optimiser (and its monthly quota) is not
  needed.
- (Phase 2, Step F) The sign-in limit (5 tries per account, 100 per IP in 15 minutes) is kept
  in the server's memory. On Vercel every function instance keeps its own count, so Supabase's
  own per-IP limits (Authentication → Rate Limits) stay switched on as the backstop.
- (Phase 2, Step F) The demo accounts (admin@example.com, teacher@example.com,
  other@example.com) exist only in mock mode, i.e. while the Supabase keys are missing, and the
  login page lists them so the portal can be tried. On a Vercel *production* deployment without
  Supabase, demo sign-in is switched off, so the published demo passwords never open a live site.
- (Phase 2, Step F) This session pushes to the branch it was given,
  `claude/stoic-clarke-ihq1sb`, instead of `claude/elara-publishers-website-waf1o4` named in the
  handover prompt. Both start from the same history; merge or rename whichever you prefer.
- (Phase 2, Step I) The Hindi wording printed on test papers was written for this build:
  section titles (सही उत्तर चुनिए, रिक्त स्थान भरिए, सही या गलत लिखिए, सही मिलान कीजिए, एक शब्द में
  उत्तर दीजिए, संक्षेप में उत्तर दीजिए, विस्तार से उत्तर दीजिए), header labels (नाम, कक्षा, अनुक्रमांक,
  समय, पूर्णांक, दिनांक, सामान्य निर्देश, उत्तर कुंजी, सेट, खंड) and the default instruction
  "सभी प्रश्न अनिवार्य हैं।". Please have a Hindi teacher read them once (`lib/test-maker/paper.ts`).
- (Phase 2, Step I) Chapter lists are needed for Basic Hindi Reader Classes 2 and 4–8 and for
  every TechNova and Art Journey book (`content/chapters.ts`); until then teachers type the
  chapters or topics. The Class 1 and 3 Hindi lists were read from the PDFs and need checking
  (the open points are in `docs/research/hindi-chapters.md`).
- (Phase 2, Step I) Each teacher may draft 40 sections or single questions a day
  (`testDraftsPerDay` in `content/site-config.ts`; about 8–10 papers). Change it as you like
  once you see the xAI bill.
- (Phase 2, Step I) The Word file uses Mangal for Hindi, which ships with Windows and Office; on a
  Mac, Word substitutes a Devanagari font (Kohinoor Devanagari or Devanagari MT), so line breaks
  can move slightly. The PDF from the browser's print always looks exactly like the preview.
- (Phase 2, Step I) Drag-and-drop in the editor uses Motion's `Reorder` (already part of the
  site) instead of `@dnd-kit/core`, whose last release is 22 months old (the "updated in the last
  12 months" rule). Keyboard users have Move up / Move down.

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
  hero headline "Books that grow curious minds.", the hint and hotspot labels (`content/hero.ts`,
  Phase 2); the room leads and "why" notes on Home (`content/home.ts`, Phase 2); the About
  story paragraph (needs when and why Elara Universe started), the beliefs and the chapter
  copy (`app/about/page.tsx`); the "How a book is made" step descriptions
  (`components/about/making-steps.tsx`).
- **Phase 2 additions** (all marked in the code):
  - Learning resources (`content/resources.ts`): every video, worksheet, quiz and download is a
    `[PLACEHOLDER]` entry with an empty link, so each tab says "Coming soon" and lists what is
    expected; the e-book tab shows the sample pages until the full e-book exists.
  - FAQ answers (`content/faq.ts`): ordering, prices and sample copies are partly
    `[PLACEHOLDER]` (also answered that way by Elu: "not known yet").
  - Chapter lists (`content/chapters.ts`): Basic Hindi Reader 2 and 4–8, all TechNova and all Art
    Journey books are six `[PLACEHOLDER]` chapters; Hindi 1 and 3 are typed and need checking.
  - Test paper wording in Hindi (`lib/test-maker/paper.ts`, `defaults.ts`): section titles,
    header labels and the default instruction, to be read once by a Hindi teacher.
  - Copy written for Phase 2 pages: the four step notes on the Web Support chalkboard
    (`components/portal/access-steps.tsx`), the lead lines on Web Support, Help, Login and Admin,
    the e-book note on the resources page, the home-page leads listed under Step D.
  - `DEPLOY.md`: which registrar holds elarauniversepublications.com.

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

## Phase 2 — Step C: acrylic classroom design system

**Built** (all shown on `/styleguide`):

- **Background:** `components/ui/mesh-background.tsx` + the `mesh`/`mesh-blob` utilities: a
  lime-cream base with mint, sky and sage radial washes and four large blurred blobs that drift
  on a 46-second cycle (transform only), plus a faint chalk-dust noise layer. Still with reduced
  motion and on slow devices (`<html data-solid>`). It sits fixed behind every page; section
  bands (`<Section tone>`) are now translucent (`none`, `paper`, `cream`, `mint`, `chalk`) so the
  classroom shows through.
- **Glass:** `components/ui/glass.tsx` wraps the `glass` utility (Step B recipe: white 55 %,
  blur 20 px + saturate 160 %, 1 px white/70 % border, top-edge highlight, green-tinted layered
  shadows, 3 % noise; near-solid cream fallback). Props: radius (`sm`/`md`/`lg`), `spotlight`
  (cursor glow through `--mx/--my`), `tilt` (gentle 6° 3D lean through the shared `useTilt`
  hook, which `TiltCover` now uses too).
- **Colours:** leaf `#34A56F`, leaf-700 `#23794B`, mint `#E3F6EA`, chalkboard `#2C4A3B` and the
  four mesh colours added to the tokens; the logo colours stay. `tests/contrast.spec.ts` reads
  the built tokens and checks 16 text/background pairs against WCAG AA (glass measured over the
  lightest mesh colour): all pass.
- **Interactions:** buttons (`components/ui/button.tsx`, primary now leaf-700 with white text)
  pull up to 8 px toward the cursor on a spring, ripple from the tap point, press like a stamp,
  and every focusable control gets the `focus-glow` animated conic-gradient border on keyboard
  focus (`@property --focus-angle`). The Phase 1 ink ring was replaced by the ripple. Everything
  stops with reduced motion (hooks check `useReducedMotion`; CSS uses `prefers-reduced-motion`).
- **Classroom motifs** (`components/classroom/`): `Chalkboard` (chalkboard panel in a brass
  frame with chalk dust and a chalk tray) with `ChalkText` (Caveat chalk headings that write
  themselves in when scrolled into view; plain text with reduced motion) and `ChalkLine`;
  `NotebookCard` (32 px ruled lines, red margin, punched holes); `StickyNote` (kept from
  Phase 1); `Pencil` and `SchoolBell` (original inline SVGs; the bell rings on hover/tap);
  `ReportBadge` (report-card label/value with a stamped tick); `NoticeBoard` + `Pinned` (cork
  board in a wooden frame with push-pinned notes); `Timetable` (a real `<table>` with caption
  and scoped headers styled as a school timetable); `SectionHeading` (eyebrow, heading with a
  crayon-underlined accent word via the `crayon` utility, lead).
- **Not-vibe-coded rules, enforced where possible:** the Tailwind radius scale is overridden to
  exactly 8/16/24/pill (`--radius-*: initial`), so no other `rounded-*` class compiles; every
  earlier use was migrated. One icon set (lucide), no emoji, no purple or AI gradients, tokens
  only, two shadows plus the glass recipe, left-aligned editorial layouts. The rules are printed
  on `/styleguide`.

**Tests:** `tests/styleguide.spec.ts` (tokens, fonts, every motif, mesh animation on/off with
reduced motion, spotlight variable, magnetic transform, ripple node, focus glow),
`tests/contrast.spec.ts`, axe on `/styleguide` (zero violations). Baselines refreshed.

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **367 passed / 507 skipped (full run; one width test fixed for scrollable tables and one tablet flake under load re-run 3×3 green)** ✅

**Review:** two independent review agents (rules lens; accessibility and code-quality lens)
checked the new files. Fixed from their findings (commit "Step C review fixes"):
two must-fix accessibility bugs (the `stamp` utility's `overflow: hidden` clipped the new focus
ring outside every button; on glass buttons the focus ring shared its pseudo-element with the
3 % noise overlay and rendered at 3 % opacity), the phone menu `<dialog>` losing its fixed
position to the `glass` utility, the cursor spotlight painting over card text (now behind the
content), focus-ring colours that failed 3:1 on glass (now leaf-700 / brass / forest, added to
the contrast test), `ChalkText` relying on `aria-label` on a `<p>` (now a visually hidden copy
of the text), the ruled-notebook gradient duplicated with a raw colour (now a `ruled` utility),
the wooden frame duplicated between chalkboard and notice board (now `WoodFrame`), notice
board items as a list, the ripple skipped under reduced motion, write-in speed capped so long
headings finish within a second, spacing off the 8 px grid in the top bar, menu sheet and
styleguide, a 4 px focus radius, dead paper-grain CSS, a raw hex in the evening desk, and the
Teacher login rendered twice. The `ruled` utility is used by the contact letter in Step D (the
form file was being edited by the landing-page build at the time).

**Screenshots:** `docs/screenshots/phase2-C/` (styleguide, Home, Catalog, Contact at
360/768/1024/1440 and reduced motion; foundation shots at 1440/360).

**Placeholders added:** none.


## Phase 2 — Step D: the new landing page, "A day at Elara School"

**Built** (`app/page.tsx` assembles eleven `<Room>` bands; every key detail is in the server
HTML, interactive parts are small client components):

1. **Classroom hero** (`components/home/classroom-hero.tsx`, `classroom-scene.tsx`,
   `content/hero.ts`): an original inline-SVG classroom (about 20 KB of markup) with a green
   chalkboard on which the headline writes itself in chalk (`ChalkText`, real `<h1>` text), a
   teacher's desk, six children of different skin tones and hair reading at their desks, a
   bookshelf, a globe, a computer, an art easel, a cork notice board, a wall clock whose hands
   follow the visitor's real time (server renders 10:10, the browser rotates the hands every
   second), and a sunny window with a swaying tree. Every object is a real link laid over the
   drawing with a glass label on hover/focus and a soft leaf glow on the object: bookshelf →
   Catalog, computer → TechNova, easel → Art Journey, notice board → Events, globe → About,
   chalkboard → Web Support, teacher's desk → Teacher login. Two-layer mouse parallax (a few px,
   mouse only). Phones get a crop of the board end of the room and the seven links as glass
   chips. Home-only JavaScript: 77 KB gzip / 232 KB raw across four chunks (the hero and the
   rooms together), under the 150 KB hero budget.
2. **Three book rooms** (`book-room.tsx`, `class-picker.tsx`): Hindi class, Computer lab and Art
   room, each with the series name (crayon-underlined), Hindi name, tagline, blurb, "What's
   inside" and "Comes with" from `content/books.ts`, NEP 2020 and Classes 1–8 report badges, a
   Class 1–8 picker that swaps the cover with a page-flip (rotateY, instant with reduced motion)
   on a tilting glass card with the price when known, "Peek inside" (a native dialog holding the
   sample flipbook, or "Sample pages coming soon.") and "Request a sample copy".
3. **Why schools choose Elara** (`why-stickers.tsx`, notes moved to `content/home.ts`): four
   die-cut notebook stickers popping onto a glass panel.
4. **Digital support and QR** (`qr-phone.tsx`): an animated phone scanning the QR in a book and
   opening its resources (looping, still with reduced motion), with Web Support and QR Corner
   buttons.
5. **For teachers** (`test-paper-preview.tsx`): a test paper being drafted section by section
   with the "AI draft — please check" chip, plus Teacher login.
6. **Events** (`notices.tsx`): the next three events pinned to the cork notice board.
7. **About and founders** (`staff-room.tsx`): the staff room with the founders' polaroids and the
   company facts.
8. **FAQ** (`faq-room.tsx`, `content/faq.ts` — 12 questions by topic, six marked top; answers
   waiting for Vaibhav are `[PLACEHOLDER]`): six questions on notebook pages, each linking to its
   `/web-support/help#anchor` (Step G builds that page).
9. **Contact** (`postbox.tsx`): a school-gate postbox drawing, a short letter form (the Phase 1
   `ContactForm` gained a `compact` prop: name, email, phone, message; same key check, honeypot,
   cooldown and paper-plane send), WhatsApp, phone, email and the map.
10. **Play corner** (kept from Phase 1 as the last room, still switchable in
    `content/site-config.ts`).

**Rooms** (`components/home/room.tsx`): full-width translucent bands over the mesh; two "doors"
slide apart when a room scrolls into view (transform only, 0.7 s). Doors exist only after
hydration and never with reduced motion, so the server HTML and the first paint show every
room open. `LazyMount` is available for client-only widgets.

**Phase 1 pieces retired** (Phase 2 wins on the home page): the opening-cover intro, the ink
headline, drifting leaves, margin doodles, the crayon cursor trail, the subject shelf and the
flip-pad home. Their files are deleted (`hero.tsx`, `opening-cover.tsx`, `subject-shelf.tsx`,
`doodles.tsx`, `drifting-leaves.tsx`, `ink-text.tsx`, `use-crayon-trail.ts`, `cover-store.ts`,
`mark-paths.ts` and its generator step). Flip pads stay on About, Events and demo-flip.

**Tests:** `tests/home.spec.ts` rewritten (hero headline and the seven hotspot links with their
targets, live clock, every room opens, every room's heading and the founders and address are
on the page, class picker flips and opens the flipbook dialog, sample-copy links, FAQ anchors,
contact links, phone hotspot list); polish, extras, a11y, menu and width tests updated for the
new home; baselines refreshed.

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **365 passed / 507 skipped by project** ✅ (the first full run had three
failures: two page-dot jumps on About under full load and a catalog baseline captured before its
filter stickers had revealed; `open()` now waits for `document.fonts.ready` and a `settled()`
helper waits for every first-screen reveal before a baseline, after which the full suite passed)

**Screenshots:** `docs/screenshots/phase2-D/` (Home at 360/768/1024/1440 and reduced motion;
laptop sizes 1280/1366/1920/2560; hero close-ups with a hotspot hovered at 1440/1366 and the
phone crop at 360/768).

**For Vaibhav:** see the entries added at the top (hero and FAQ copy, Art Journey badges).

**Placeholders added:** the hero headline/hint and hotspot hints (`content/hero.ts`), the room
leads and section labels marked in the components, FAQ answers for ordering, prices and sample
copies (`content/faq.ts`).

## Phase 2 — Step E: every other page in the acrylic classroom

**Built** (five page clusters restyled in parallel to the Step C system; the home page was the
reference):

- **Catalog** (`app/catalog/page.tsx`, `components/catalog/catalog.tsx`,
  `components/book/book-card.tsx`): heading band with a crayon accent; the sticky-note tabs are
  now a glass filter panel with the class-picker pill chips (44 px, `aria-pressed`, leaf-700 when
  pressed) and the live "N of 24 books" count; one full-width shelf band per series alternating
  paper and mint, each with the series heading, the Devanagari name, the hand-written tagline
  and the blurb; books on small glass cards that lift on hover above a brass rail (`BookCard` is
  shared with the book page); the empty shelf is a glass panel with Elu. Filters still live in
  the URL. Shelves show 4 covers per row from 640 px and 8 from 1280 px.
- **Book page** (`app/catalog/[slug]/page.tsx`): the tilting cover on a glass panel with the
  price and the two buttons; subject tag, h1 with "Class N" crayon-underlined in the subject
  colour, Devanagari title and report badges (Class, NEP 2020); "Peek inside" on glass beside a
  sticky note with the flipbook hints (or a notebook page with Elu reading when samples are still
  to come); "What's inside" and "Comes with" as ruled notebook pages (`NotebookCard` gained a
  `titleAs` prop); "Details" as a report card in a wooden frame; "More from this series" on a
  mint band. JSON-LD unchanged.
- **About** (`app/about/page.tsx`, new `components/about/chapter-board.tsx`,
  `making-steps.tsx`, `polaroid.tsx`): still a four-page flip pad; each chapter opens on a
  brass-framed chalkboard where "Chapter N" and the title are chalk (the title writes itself in
  when its page is read: `ChalkText` gained a `start` prop); the story on a ruled notebook page
  with the drop cap and Elu reading; beliefs as sticky notes on glass; founders' polaroids
  (token colours, Lora initials) beside notebook pages with name, role and bio; the four
  making-of steps pinned to the cork notice board in a 2 + 1 / 1 + 2 layout with their
  self-drawing line art.
- **Events** (`components/events/*`, `components/illustrations/empty-board.tsx`): page 1 is
  the notice board with the upcoming tickets pinned to it (torn edge, punched sides, date leaf,
  type tag, Sample sticker, brass Register; they swing only once their page is read, never with
  reduced motion) plus a pinned "Your school" note; page 2 is the scrapbook: polaroids dropping
  onto a glass panel, lightbox on glass. `Pinned` gained a `bare` variant; the date leaf is now
  one shared `components/ui/date-leaf.tsx` used by the home notice board too.
- **Contact** (`app/contact/page.tsx`, `components/contact/postcard.tsx`): the full letter on a
  glass panel, the postcard as glass with a brass POST stamp and postmark, labelled phone/email
  rows and the map. The form itself is unchanged.
- **QR Corner** (`components/resources/qr-corner.tsx`, `qr-door.tsx` in token colours): heading
  with the series name and "Class N" accent, the Devanagari name, report badges for class and
  subject, the two buttons, and the scanning phone with Elu on a glass panel (same on all 24
  book addresses).
- **404, Web Support and login stubs** (`app/not-found.tsx`, `app/web-support/page.tsx`,
  `app/login/page.tsx`): glass panels, a small chalk "404" slate, the heading system; the stubs
  keep their copy until Steps F and G replace them.
- **Footer** (`components/frame/footer.tsx`): a full-width glass band with a brass rule, the
  logo, the tagline hand-written beside a pencil, eyebrow address columns, 44 px contact rows,
  the pencil-stroke footer nav and round social targets.
- **Shared:** `lib/accent.ts` (`splitAccent`, the "last word gets the crayon" rule used by the
  home rooms and the catalog shelves); `lib/cn.ts` now tells tailwind-merge about `shadow-page`
  and `shadow-lift`, so `shadow-none` really overrides them (that was the one defect the
  screenshots showed: a ghost paper card behind the first event ticket).

**Step A checks repeated:** `tests/widths.spec.ts` (13 laptop/phone/zoom sizes × 10 routes:
no horizontal scroll, nothing outside the viewport, header and content edges within 2 px,
equal margins) passes on every restyled page; the twelve screenshot baselines were refreshed.

**Tests:** every page spec gained assertions for the new pieces (chips, Devanagari names,
badges, chalk chapter labels, step count, ticket order and target, footer nav count); nothing
was weakened. Full suite: **369 passed / 507 skipped by project**; after the shelf-column
adjustment the catalog, book, width and polish specs were re-run (189 passed) and the baselines
refreshed.

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright ✅ (above).

**Screenshots:** `docs/screenshots/phase2-E/` — catalog, book (hindi-1, technova-3), about,
events, contact, QR Corner (bare and hindi/1), 404, web-support, login at 360/768/1024/1440 and
reduced motion. Looked at: the flip-pad pages read as classroom scenes, the phone layouts keep
two covers per row and nothing clips; one defect found and fixed (ticket ghost card), one
adjustment (8-column shelves wrapped the "Peek inside" label at 1024 px → 4 columns until
1280 px).

**Simplified:** nothing.

**Placeholders added:** small labels written for this step, all marked in the code: the shelf
eyebrows ("Hindi shelf" …, `catalog.tsx`), the "Sample pages" eyebrow and the "Turn the pages"
sticky note and the "Report card" eyebrow (`app/catalog/[slug]/page.tsx`), the "Your school"
note on the events board (`upcoming-events.tsx`), the QR Corner badge labels
(`qr-corner.tsx`).

## Phase 2 — Step F: server, database and teacher accounts

**Built:**

- **Server mode:** `next.config.ts` without `output: 'export'` (`trailingSlash` kept,
  `images.unoptimized` kept on purpose), `npm run start` = `next start -p 3000`, Playwright's
  `webServer` uses it, `serve` removed; `dynamicParams = false` on book pages. `proxy.ts` (the
  Next 16 proxy) covers `/web-support/*`, `/admin/*` and `/account/*` with the public intro and
  Help exempt; every protected page and Server Action checks the session again
  (`lib/auth/session.ts`).
- **Supabase** via `@supabase/ssr` 0.12 + `@supabase/supabase-js` 2.117 from the official
  Next.js guide (`lib/supabase/*`, doc URLs in comments); the secret key only in
  `lib/supabase/admin.ts` (`server-only`). Migration
  `supabase/migrations/20261014120000_phase2_schema.sql`: `profiles`, `access_requests`,
  `doubts`, `tests`, `ai_usage`, the `handle_new_user` trigger, `private.is_admin()`,
  `bump_ai_usage()`, explicit grants + RLS on every table. `npm run db:test` proves the rules on a
  local PostgreSQL 16 with 24 assertions (see below); `npm run db:migrate` applies the
  migration with `SUPABASE_DB_URL`; `SETUP-SUPABASE.md` has the copy-paste route.
- **Accounts only from admins:** sign-up off in the dashboard (documented), admins = the emails
  in `ADMIN_EMAILS`, synced on every sign-in (added → active admin, removed → teacher again).
  `npm run create-admin` for the first admin.
- **One `DataStore`** (`lib/data/store.ts`) with a Supabase backend and a mock memory backend
  with demo accounts; pages never touch a database client.
- **Pages:** `/login` (glass card in front of the faded classroom, honeypot, 5 tries per account
  and 100 per IP in 15 minutes, `?next=` limited to this site, "link expired" note),
  `/login/forgot` (same answer for every email), `/auth/confirm` (token hash → session),
  `/account/update-password`, everyone lands in `/web-support`; the top bar shows "My portal"
  from the `elara_portal` hint cookie. `/admin`: teachers table, new teacher (invite email or
  one-time password, classes and subjects as chips, pre-filled from an access request which is
  then marked approved), edit, deactivate/reactivate, email a reset link or show a one-time
  password; access requests with one-click "Create account" and "Decline"; doubts with answers.
- Shared `components/ui/form.tsx` (Field, inputClass, Chips, Notice); `.env.example` complete;
  `lib/notify.ts` (Web3Forms email to the team when the key exists).

**Security review (done by hand on the whole auth layer; findings fixed):**

1. **Open redirect** — `?next=/\evil.example` passed the old `startsWith('/')` check and
   browsers read `/\` as `//`. New `safeNext()` in `lib/auth/config.ts` resolves the value
   against a dummy origin and keeps it only if it stays on that origin; used by sign-in,
   `/auth/confirm` and the doubt form. Test added.
2. **Profiles trusted user metadata** — the trigger copied `role`, `classes` and `subjects`
   from `raw_user_meta_data`, which whoever signs up controls; with sign-up switched on by
   mistake anyone could have made themselves an admin. The trigger now copies only name, school
   and phone and creates an **inactive** teacher with no classes; the server sets classes,
   subjects and `active` with the secret key after an admin creates the account. Proved in the
   RLS test.
3. **`bump_ai_usage` not executable by the server** — the migration revoked it from `public`
   without granting it back to `service_role`, so the AI rate limits would have failed in
   production. Explicit grant added; the RLS test now calls it as the service role.
4. **Demo passwords on a live site** — mock mode on a Vercel production deployment would have
   let anyone in as the demo admin (and see real access requests). Demo sign-in is now off when
   `VERCEL_ENV=production`; the login page says so.
5. **Admin role never revoked** — removing an email from `ADMIN_EMAILS` left the account an
   admin; the role is now synced both ways on every lookup.
6. **Mock session cookie** — now `Secure` in production as well as `httpOnly`/`SameSite=Lax`
   (test checks the flags); signed with HMAC and accepted only in mock mode.
7. **Client bundle** — the browser bundle carried the server config module (variable names
   only, no values). Cookie names moved to `lib/auth/cookie-names.ts`; a grep of `.next/static`
   finds no `ADMIN_EMAILS`, `SUPABASE_SERVICE_ROLE_KEY` or demo password.
8. **Rate limiter** — with no proxy in front every visitor shared one "local" IP bucket (100
   sign-ins for everyone); unknown IPs now skip the IP window (the account window remains), and
   the map is swept so it cannot grow without bound. Admins can no longer deactivate their own
   account through the action (the button was already hidden). Honeypots now answer like a
   success instead of returning a validation error.

Checked and fine: proxy matcher and the public-path pattern (`/web-support/help-x` is
protected); pages that read cookies are dynamic (`ƒ` in the build output) so nothing personal
is cached; deactivated accounts are refused by both stores (Supabase also bans the user);
errors never reveal whether an email has an account; reset and invite links go through
`/auth/confirm` (templates in `SETUP-SUPABASE.md`); admin inputs have length limits.

**RLS test (`npm run db:test`, local PostgreSQL 16):** 24 checks pass — trigger makes inactive
teachers whatever the metadata says; teacher A sees only their own test and profile and cannot
insert a test for B; B cannot read, change or delete A's test, cannot read requests, doubts or
usage counters, cannot call the counter, cannot promote themselves or change their classes,
can change only their own phone; visitors read nothing; the server counts usage; the admin
reads every profile and request but no tests.

**Also fixed:** the About page dots sometimes landed one page short under heavy load (pages
still growing while Lenis scrolled); `jump()` now re-reads the layout when the scroll ends and
corrects the position. Reproduced with a 4-worker stress run (1 failure in 135) and gone after
the fix (135/135).

**Tests:** `tests/auth.spec.ts` — 15 tests (login page + mock note + wrong password; teacher
sign-in → portal → "My portal" → sign out, also on the phone; protected pages redirect and come
back; open-redirect and cookie flags; teacher → `/admin` → portal; admin creates a teacher with
a one-time password who then signs in; deactivate → "deactivated"; rate limit after five
attempts; forgot password; set a new password; admin lists teachers/requests/doubts; answers a
doubt; approves a request with one click).

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · `npm run db:test` ✅ ·
Playwright **423 passed / 661 skipped by project**, 0 failed ✅ (the earlier run had one About page-dots failure under load; fixed as described above, then the full suite passed)

**Screenshots:** `docs/screenshots/phase2-F/` — `/login/`, `/login/forgot/`, `/web-support/`
(signed out and signed in), `/account/update-password/`, `/admin/`, `/admin/teachers/new/`, a
teacher edit page, at 360/768/1024/1440 and reduced motion. Looked at: the admin table, request and doubt cards, the new-teacher form with its chips and the account panel read cleanly at every width; the login card and the mock-mode note fit the phone (the long demo passwords wrap inside the note). No defects found.

**Mock-mode features:** accounts, access requests, doubts and saved tests live in memory with
the three demo accounts; no emails are sent (no Web3Forms key, no Supabase SMTP).

**Simplified:** nothing.

**Placeholders added:** the lead lines on the admin pages (marked in the code).

## Phase 2 — Step G: Web Support portal

**Built** (only the *flow* of a publisher portal, in the acrylic classroom design):

- **Signed out, `/web-support`** (`components/portal/public-intro.tsx`): the four steps from the
  Hindi Reader back cover on a chalkboard (visit the website → request access → get approval →
  use the content; the one-line notes under each step are `[PLACEHOLDER]` wording), the
  **Request access** form on glass (name, school, role teacher | principal | coordinator,
  email, phone, book series, class, optional note; honeypot; five per IP per hour) and a glass
  login card reusing `LoginForm`. Requests go through `store.createRequest` and
  `notifyTeam()` (Web3Forms email to the team when the key exists) and appear on `/admin`,
  where "Create account" pre-fills the new-teacher form.
- **Signed in, the portal layout** (`PortalShell`, `PortalNav`): a sticky glass sidebar with
  the school and the person's name and the links My books, My tests, Test Maker, Help & Doubts,
  Profile (plus Admin for admins) and Sign out; on phones it folds into a "Portal menu" bar.
- **My books** (`/web-support`): "Select your title" with Step 1 Subject and Step 2 Series
  dropdowns, kept in the URL (`?subject=hindi&series=basic-hindi-reader`, shareable, Back
  works, a subject the account does not teach falls back to its first one). Teachers see only
  their assigned subjects and classes, admins everything (`lib/portal.ts`). One glass card per
  class with the cover, "<Series> (Class n)", **Learning Resources** and **Generate Test
  Paper**; cards lift on hover and the covers turn in like a page when the series changes
  (never on the first paint, never with reduced motion). The grid sizes itself by the column it
  sits in (container queries): one row per book with the cover beside it on phones, three
  cards on a laptop. Accounts without classes see a "write to us" note.
- **Learning resources** (`/web-support/books/[slug]`, only for books the account teaches,
  others 404): cover, subject tag, title, Generate Test Paper, back to My books, and WAI-ARIA
  tabs (arrow keys) for E-book (the sample flipbook for now), Animated videos (embedded
  player), Worksheets (PDF view + download), Interactive quizzes and Downloads, all from
  `content/resources.ts`. Empty tabs say "Coming soon" with the titles that are expected.
- **Help & Doubts** (`/web-support/help`, public, inside the portal layout when signed in):
  every question from `content/faq.ts` grouped by its seven topics, each at its own `#anchor`
  (highlighted when targeted), a search box that narrows them as you type, and **Ask a doubt**
  (`#ask`): saved to `doubts`, emailed to the team when Web3Forms is set, `?q=` pre-fills the
  question (the chatbot's "Ask our team" uses it), signed-in teachers get their details filled.
- **My tests** (`/web-support/tests`, the teacher's own papers only) and the saved test page
  (`/web-support/tests/[id]`, another teacher's id is a 404); **Profile** (name, school, phone
  through `store.updateOwnProfile`; classes and subjects read-only; change password).
  `/web-support/test-maker` is a protected placeholder until Step I.
- Shared: `Chips` moved into `components/ui/form.tsx`; `CoverPlaceholder` lettering now scales
  with the cover (container units), so the "cover coming soon" covers read at 80 px and 300 px.

**Requirements**

- ✅ Public page: four steps, glass login card, Request access form → `access_requests` + email
- ✅ Portal layout with glass sidebar (school, name, My books, My tests, Help & Doubts, Profile,
  Sign out); top menu on phones
- ✅ Subject → Series dropdowns in the URL, Back works; assigned classes only, admins all
- ✅ Book grid: cover, "<Series> (Class n)", Learning Resources + Generate Test Paper, hover lift,
  page-flip covers when the series changes
- ✅ Learning Resources tabs (E-book flipbook, videos, worksheets with PDF view + download,
  quizzes, downloads) from `content/resources.ts`; "Coming soon" when empty
- ✅ Help & Doubts: searchable FAQ by topic with anchors, Ask a doubt → `doubts` + email, `?q=`
- ✅ Every portal page except the intro and Help is protected on the server; tests for the
  redirect, teacher vs admin (Step F) and another teacher's test (404)

**Tests:** `tests/portal.spec.ts` — 10 tests (public page on all four projects; the five
protected addresses redirect to login with `next`; a request reaches the admin page; sidebar,
subjects and the three assigned classes, also on the phone; URL choice and Back; admin sees 3
subjects and 8 classes; Learning Resources tabs with the arrow key, Generate Test Paper link and
a 404 for an unassigned class; My tests vs another teacher's paper; Profile save; Help search,
anchors and the empty search; `?q=` doubt reaching the admin). `tests/helpers.ts` gained
`signInAs()` (signs in once per worker and reuses the cookies). The axe audit now covers
`/login/`, `/web-support/`, `/web-support/help/` and six signed-in pages; the width checks cover
`/web-support/help/`; the sitemap lists Help.

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **469 passed / 746 skipped by project** ✅ — one Step F test failed in that run because Sign out now sits inside the phone "Portal menu"; the test opens the menu first and passes on every project (re-run)

**Screenshots:** `docs/screenshots/phase2-G/` — `/web-support/` signed out and signed in,
`/web-support/books/hindi-1/`, `/web-support/tests/`, `/web-support/profile/`,
`/web-support/help/` (signed out and in), `/catalog/` (placeholder covers), at
360/768/1024/1440 and reduced motion. Looked at, three defects found and fixed: the book
cards' button labels wrapped onto two lines in the narrow portal column (→ container-query
grid), the "cover coming soon" lettering clipped on small covers (→ scales with the cover), and
on phones one long QR address in a Help answer widened the cards past the screen (→ answers
wrap anywhere).

**Simplified:** nothing.

**Placeholders added:** the step notes on the chalkboard, the lead lines on Web Support and
Help, the e-book note ("The sample pages for now…"), all marked in the code.

## Phase 2 — Step H: Grok chatbot (Elu)

**Built:**

- **Bubble and panel** (`components/chat/chat-bubble.tsx`, `chat-panel.tsx`): a glass bubble
  with Elu on every page (above the WhatsApp button; it hides behind the open sheet on phones).
  The panel loads only on the first open (`next/dynamic`), so the AI SDK client never weighs on a
  page that does not use it. Header "Ask Elu", "AI answers can be wrong.", a **Mock mode** tag
  while no key is set, the four suggestion chips from the brief, a 500-character box with a
  counter (Enter sends, Shift+Enter breaks a line), answers streaming in, link buttons under
  each answer, "Ask our team" (→ `/web-support/help/?q=<question>#ask`), a retry note on
  errors, Escape closes and returns focus to the bubble. On phones it is a near-full-height
  sheet above the bottom bar; on laptops a 24rem panel.
- **Route** (`app/api/chat/route.ts`): Vercel AI SDK 7 (`ai@7.0.140`) with the official xAI
  provider (`@ai-sdk/xai@5.0.21`, Responses API; `xai.chat()` no longer exists), streamed as a
  UI message stream (`createUIMessageStream` + `toUIMessageStream`); doc URLs in the comments,
  notes in `docs/research/xai.md`. Key `XAI_API_KEY`, model `XAI_MODEL`, no guessed default
  (both needed, `lib/ai/xai.ts`). Only text parts of the last eight turns are passed on; only
  this site's pages may call it (Origin check); questions over 500 characters are refused;
  `maxOutputTokens` 350, temperature 0.3, `store: false` at xAI.
- **Scope and facts** (`lib/chat/knowledge.ts`): the instructions are built from the site's
  own content only — the three series with their facts, the known prices/pages/ISBN, events
  (sample events are labelled "not confirmed"), every FAQ answer, contact details, addresses and
  the page list; `[PLACEHOLDER]` parts become "not known yet". Elu answers only about Elara and
  this website, says exactly "I don't know that yet." when the answer is not in the data and
  points to Contact or WhatsApp, declines anything else in one sentence, writes 1–3 simple
  sentences, never asks for personal details and never repeats them.
- **Link buttons** (`lib/chat/links.ts`): chosen on the server by keyword rules, never written
  by the model, so every link is a real page: "Open this answer" → `/web-support/help/#<id>`
  for the best-matching FAQ, "Books for Class N", subject shelves, Events, sample copy →
  Contact, Web Support, QR Corner, Test Maker help, About; "Ask our team" whenever nothing fits
  or Elu did not know.
- **Limits and privacy:** 20 questions per visitor per 10 minutes (`content/site-config.ts`),
  counted with `store.bumpUsage('chat', …)` under a keyed hash of the IP and the date (memory in
  mock mode, `ai_usage` in Supabase); nothing said in the chat is stored or logged.
- **Mock mode:** without the xAI variables the same route answers from the same content with
  the same rules (books for a class, the next event, the matching FAQ answer, or "I don't know
  that yet."), streamed word by word like a real reply.

**Verified by hand:** `curl` against the built server for the four suggestions and an
off-topic question; 20 allowed then 429 for one IP; 403 for a foreign Origin; 400 over 500
characters. The non-mock composition (Grok's stream merged, then the links, then `finish`) was
run once with the AI SDK's own `MockLanguageModelV4` in a scratch script: text deltas, then the
`data-links` part, then `finish`, in that order. The generated instructions were printed and
read: every fact in them comes from `content/`.

**Requirements**

- ✅ Glass chat bubble with Elu on every page, panel with the four suggestion chips
- ✅ Server route streaming from xAI Grok through the Vercel AI SDK xAI provider; `XAI_API_KEY`,
  `XAI_MODEL`, no guessed default (suggestion documented in `.env.example`)
- ✅ Scope only Elara's books and website, prompt built from the site's data, no invented
  prices/dates/facts, off-topic declined
- ✅ Link buttons to the right page; "Ask our team" → `/web-support/help/?q=…#ask`
- ✅ Friendly simple language, no personal details asked, 500-character input, 20 per IP per
  10 minutes, short answers, no chat logs (anonymous counts only), "AI answers can be wrong"
- ✅ Mock mode without the key

**Tests:** `tests/chat.spec.ts` — 9 tests (bubble opens the panel with note, mock tag, the four
chips and focus in the box, no sideways scroll, on all projects; a chip streams an answer whose
button opens `/catalog/?class=3` and closes the panel; an off-topic question gets "I don't know
that yet." and "Ask our team" with the question in the address; the FAQ answer button; keyboard
open/Escape/focus return; 500-character cap; axe on the open panel; the endpoint's 20-per-10-
minutes limit, the 501-character refusal and the foreign-Origin refusal).

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **488 passed /
764 skipped by project**, 0 failed ✅

**Screenshots:** `docs/screenshots/phase2-H/` — the catalog with the chat closed, open (chips)
and with two answers (the sample-copy FAQ and an off-topic question) at 360/768/1024/1440 and
reduced motion. Looked at, two fixes: the header note wrapped into three lines beside the Mock
mode tag (→ tag moved next to the title) and on phones the translucent sheet let page text show
through (→ the sheet is 95 % paper).

**Libraries added** (all checked on npm on 2026-10-14: updated this week, Apache-2.0/MIT):
`ai@7.0.140` (streaming, structured output; server, and the chat client inside the lazily loaded
panel), `@ai-sdk/xai@5.0.21` (the official xAI provider), `@ai-sdk/react@4.0.143` (`useChat`
for the panel), `docx@9.11.0` (Word download in Step I, loaded only when clicked).

**Mock-mode features:** the chatbot (answers from the site's content, no AI).

**Simplified:** nothing.

**Placeholders added:** none (the panel's two sentences of copy are plain instructions).

## Phase 2 — Step I: Test Maker

**Built** (`/web-support/test-maker`, teachers and admins; opened from a book card's "Generate
Test Paper" with the class and book chosen, from the sidebar, or from My tests):

- **Chapters** (`content/chapters.ts`): Basic Hindi Reader Class 1 (26 entries) and Class 3 (17
  entries) typed in Unicode Devanagari from the contents pages read earlier
  (`docs/research/hindi-chapters.md`), marked `needsChecking` and shown with "Chapter names were
  typed from the book's contents page and still need checking"; the printed test papers are
  left out. Every other book (Hindi 2 and 4–8, all TechNova, all Art Journey) has a
  `[PLACEHOLDER]` list of six chapters that is easy to replace; for those the form asks the
  teacher to type the chapters or topics instead.
- **Form** (`components/test-maker/setup-form.tsx`): class (only the teacher's) → book (only
  their subjects) → chapters (chips, select all / clear) → question types with count and marks
  each (multiple choice, fill in the blanks, true/false, match the following, one word, short
  answer, long answer; picture / drawing tasks for Art Journey only) → difficulty mix → total
  marks and time, with a warning when the questions or the mix do not add up → exam name,
  school name (from the profile), optional logo (PNG/JPEG under 150 KB), date, instructions
  (in the paper's language). Hindi papers are in Devanagari; Computer and Drawing in English.
- **Generation** (`app/api/test-maker/draft/route.ts`, `lib/test-maker/generate.ts`): one
  request per section, drafted by Grok through `generateText` + `Output.object` with a zod
  schema (strict JSON), then checked again by type (four distinct options with the answer
  among them, a blank in fill-ins, the exact true/false word, 3–6 match pairs…); invalid output
  is asked again up to three times. The prompt names the book, series, subject and class,
  lists the chosen chapters and says to stay within them, applies the NEP 2020 / NCF 2023
  competency focus and the difficulty mix, and asks for Devanagari for Hindi. The route checks
  the session, that the book is one the teacher teaches, that chapters come from the real list,
  the Origin, and the **daily limit per teacher** (`testDraftsPerDay: 40` in
  `content/site-config.ts`, counted per drafted section or question with
  `store.bumpUsage('test', …)`). Every drafted question is labelled **"AI draft — please
  check"** until the teacher edits it or presses "Mark checked".
- **Editor** (`components/test-maker/editor.tsx`): edit the question, the four options with the
  correct one, match pairs, true/false or the answer for the key; reorder by dragging the
  handle (Motion's `Reorder`) or with Move up / Move down from the keyboard; delete; regenerate
  one question (the new draft avoids the questions already there); add your own question;
  change marks; the live total ("30 of 30 marks · 60 minutes") follows every change.
- **Output** (`components/test-maker/paper-sheet.tsx`, `lib/test-maker/paper.ts`): an A4 sheet
  with the school header (logo, school, exam, class, book, subject, set, time, maximum marks,
  date, name and roll number lines, instructions), sections with their marks
  ("खंड क: सही उत्तर चुनिए (5 × 1 = 5)"), numbered questions with marks, options, match tables,
  answer lines or a drawing box, and the answer key on its own page. **Set B** shuffles the
  questions in each section and the options (seeded, so it is the same every time; the match
  column is shuffled in both sets). **PDF** through the browser's print (`@page { size: A4 }`;
  printing a page with a paper prints only the paper), **Word** through `docx@9.11.0` in the
  browser (`lib/test-maker/docx.ts`, loaded on click): A4, Calibri for Latin and Mangal in the
  complex-script slot for Devanagari, the same header, sections and key.
- **Save, duplicate, delete** (`app/web-support/test-maker/actions.ts`): papers are saved with
  their settings and sections (zod-checked) to `tests`, listed under My tests with Duplicate and
  Delete (two-step) buttons, and open straight in the editor at `/web-support/tests/<id>`.
- **Mock mode:** without the xAI variables the same route returns sample questions in the
  paper's language, marked "(नमूना)" / "(Sample)", and the Test Maker shows "Mock mode: sample
  questions, no AI".

**Hindi rendering checked in both outputs:** the browser's PDF (Chromium print, A4, three pages:
paper, rest of paper, answer key) embeds Noto Sans Devanagari and shapes the conjuncts
(प्रश्न, स्वस्थ, विकल्प) correctly — `docs/screenshots/phase2-I/print-to-pdf-pages.png`; the
Word file opened in LibreOffice (with Noto Sans Devanagari installed in the sandbox as a stand-in
for Windows' Mangal) renders the same text correctly on A4 —
`docs/screenshots/phase2-I/word-file-in-libreoffice.png`. Two print defects found and fixed: a
section heading could be left alone at the foot of a page (→ `break-after: avoid`), and the
tall vowel signs of a heading that starts a new page showed as specks at the foot of the
previous one (→ normal line height and a little top padding on the paper's headings).

**Requirements**

- ✅ `content/chapters.ts` for every book and class; Hindi typed from the contents pages and
  marked "needs checking"; TechNova and Art Journey `[PLACEHOLDER]` lists
- ✅ Form: class (teacher's classes) → book → chapters → types with count and marks (picture tasks
  for Art Journey) → difficulty mix → total marks and time with a warning → exam, school, logo,
  date, instructions; Hindi in Devanagari, Computer and Drawing in English
- ✅ Grok drafts one section at a time, zod-validated structured JSON, retries; book, class,
  chapters, NEP 2020 / NCF 2023 focus; "AI draft — please check" on every question
- ✅ Editor: edit, drag reorder, delete, regenerate one, add your own, change marks, live totals
- ✅ A4 print preview with header, sections, marks and a separate answer key; Set A / Set B; PDF
  through print with a print stylesheet; Word through `docx`; Hindi checked in both
- ✅ Save, duplicate, delete; My tests in the sidebar; daily limit per teacher in config
- ✅ Mock mode without the key

**Tests:** `tests/test-maker.spec.ts` — 10 tests: "Generate Test Paper" pre-fills class and
book and limits the class list (desktop and phone); totals and mix warnings, no drawing tasks
for TechNova, placeholder chapters must be typed; a Hindi paper drafted section by section, then
edited (label goes on edit, move, delete, add, marks, regenerate) with the live total (desktop
and phone); the A4 preview (Devanagari header and section titles, 16 questions, answer key, Set B
order differs, key can be left out); printing shows only the paper and the PDF is A4 with Noto
Sans Devanagari embedded (`pdffonts`); the Word download unzips to A4 with `w:cs="Mangal"` and
the Hindi text; save, open from My tests, duplicate, delete; the draft endpoint needs a session,
an assigned book and real chapters; the daily limit (40, then 429); axe on all three steps.

**Checks:** `tsc` ✅ · `eslint` ✅ · Prettier ✅ · `next build` ✅ · Playwright **500 passed / 792 skipped by project**, 0 failed ✅

**Screenshots:** `docs/screenshots/phase2-I/` — set up, edit and print preview at
360/768/1024/1440 and reduced motion, the print view (print media) at 1440, My tests, the
three PDF pages and the Word file rendered by LibreOffice. Looked at: the form, editor and paper
fit the phone without sideways scrolling; the paper is legible down to 360 px.

**Decisions** (logged for Vaibhav): drag-to-reorder uses Motion's `Reorder` (already installed)
instead of `@dnd-kit/core`, whose last release is 22 months old (the 12-month rule); keyboard
users get Move up / Move down. The save keeps the address unchanged and offers "Open it from My
tests", because changing the address in place makes Next.js remount the editor.

**Mock-mode features:** Test Maker drafts (sample questions in the paper's language).

**Simplified:** nothing.

**Placeholders added:** the TechNova, Art Journey and remaining Hindi chapter lists
(`content/chapters.ts`); the Hindi exam wording on the paper (section titles, header labels and
the default instruction "सभी प्रश्न अनिवार्य हैं।", `lib/test-maker/paper.ts` and
`defaults.ts`) is standard wording written for this build and needs a check.
