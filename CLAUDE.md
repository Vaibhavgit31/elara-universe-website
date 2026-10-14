# CLAUDE.md — Elara Universe Publishers website

This file is read by Claude Code on every task in this project. The full brief is `PLAYBOOK.md`
(same folder). Facts about the company, books, pages and design come **only** from PLAYBOOK.md,
from the files in `_source-assets/`, or from Vaibhav. Anything else is `[PLACEHOLDER]`.

## One-go build mode (overrides gate step 8)

This project is being built in one autonomous run. Gate step 8 ("Stop and wait") is replaced by:
*if every check passes, commit and continue to the next phase automatically.* Never start the next
phase with a failing check, a build error or an unfinished requirement. If a check still fails after
3 genuine fix attempts, simplify that feature so it works (keep the brand look), log exactly what was
simplified under "Simplified" in `BUILD_LOG.md`, and continue. Wherever PLAYBOOK.md says "ask me",
"tell me", "show me" or "wait", write it in `BUILD_LOG.md` under "For Vaibhav" and carry on.

Defaults agreed for this run:

- Stack: Next.js (App Router, TypeScript) and `images.unoptimized: true` (images are
  pre-optimised in Phase 2); Tailwind; Motion; Lenis; react-pageflip; react-hook-form + zod;
  Playwright. *Superseded in Phase 2 Step F:* the `output: 'export'` static build is gone; the
  site is a Node.js server build for Vercel (`next build` + `next start`), see the Phase 2 rules.
- Contact form: sent client-side through Web3Forms with the key in `NEXT_PUBLIC_WEB3FORMS_KEY`.
  If the key is missing, the form shows a friendly message with the email and WhatsApp buttons
  instead. Honeypot field + a simple client-side submit cooldown (no server rate limit).
- QR Corner future redirects: commented examples in `public/_redirects` (Netlify) and `vercel.json`
  (Phase 2: Vercel hosting, so `vercel.json` is the one that counts).
- Company name "Elara Universe Publishers Private Limited"; show both addresses as in the brief;
  prices only where PLAYBOOK.md gives them, otherwise "Request a sample copy"; Art Journey uses
  illustrated placeholder covers; all unknown text = `[PLACEHOLDER]`.
- Phase 14: do not deploy. Run the full checks, then write `DEPLOY.md` (Netlify Drop + Vercel +
  connecting elarauniversepublications.com). *Superseded in Phase 2:* `DEPLOY.md` covers the
  Vercel CLI deployment with server routes (Step K).

## Rules for Claude Code

These rules go into `CLAUDE.md` (Prompt 0 does this) and apply to every prompt. Claude Code must not start the next phase until the current one passes the phase gate below and you have approved it.

### 1. Write short, clean code

- If one line does the job clearly, use one line. Don't write five. Use modern JavaScript and TypeScript shortcuts (optional chaining `?.`, `??`, destructuring, `.map()`, `.filter()`) and Tailwind classes instead of custom CSS.
- Don't repeat yourself. The second time something repeats, turn it into a shared component, hook or helper.
- Short must still be readable. No clever one-liners that are hard to understand, and clear names for everything.
- Delete dead code, unused imports and `console.log` before finishing each phase.

### 2. Use libraries instead of writing from scratch

- Prefer a well-known library over hand-written code: Motion, react-pageflip, Lenis, canvas-confetti, react-hook-form + zod (forms and validation), clsx + tailwind-merge (class names), lucide-react (icons), sharp (images), Playwright (testing).
- Before adding any new library, check that it was updated in the last 12 months, that its licence allows commercial use, and how much it adds to page size. Then tell me in one line why it's needed.
- Don't add two libraries that do the same job.

### 3. Never hallucinate

- Use only facts from PLAYBOOK.md, from the files in `_source-assets/`, or from me. If a fact is missing, write `[PLACEHOLDER]` and add it to the open-questions list. Never invent names, numbers, dates, prices, testimonials or achievements.
- Never guess how a library works. Check the installed version's documentation or type definitions before using a function or prop. If something can't be confirmed, say so.
- Never say "done", "works" or "fixed" without running it and showing the result.
- If something in the brief is unclear or contradicts itself, stop and ask. Don't pick an answer silently.

### 4. Phase gate: recheck before moving on

Each prompt is one phase. At the end of every phase, Claude Code must:

1. **Re-read the prompt** and list every requirement as ✅ done or ❌ not done. Finish every ❌ before reporting.
2. **Run the checks:** `npx tsc --noEmit` (types), `npm run lint`, `npm run build`, and the Playwright tests. All must pass with zero errors.
3. **Add tests** for what was built in this phase: at least one Playwright test per page or component (it loads, key text is visible, buttons and links work, and the phone layout has no sideways scroll).
4. **Look at it:** take Playwright screenshots at 360px, 768px and 1440px, plus one with reduced motion turned on. Look at the screenshots and fix anything broken or off-brand.
5. **Check earlier phases still work.** Run the full test suite, not just the new tests.
6. **Review its own changes:** remove repetition, dead code and unused libraries, and make sure the rules in sections 1–3 were followed.
7. **Report** in this format: what was built, the ✅/❌ checklist, check results, screenshots, any `[PLACEHOLDER]` added, and open questions.
8. **Stop and wait** for me to reply "Approved, next". Never continue with a known error or failing test.

If Claude Code skips the gate, paste this:

```text
Stop. Run the full phase gate from PLAYBOOK.md "Rules for Claude Code" on the phase you just finished: re-check every requirement, run tsc, lint, build and all Playwright tests, take screenshots at 360/768/1440 and reduced motion, review your diff, and report in the agreed format. Do not start the next phase.
```

## Phase 2 rules (Classroom upgrade) — these win over Phase 1 where they conflict

Phase 2 is the "Phase 2: Classroom upgrade" section of `PLAYBOOK.md`, run in one autonomous go
like Phase 1: same gate after every step (requirement checklist, `tsc`, lint, build, ALL
Playwright tests including Phase 1 tests, screenshots that are actually looked at, self-review),
auto-continue only when everything passes, report per step in `BUILD_LOG.md`, commit after every
step. Questions go under "For Vaibhav" in `BUILD_LOG.md`; never stop to ask.

- **Phase 2 wins** over Phase 1 on the theme (acrylic classroom replaces plain cream), the home
  page ("A day at Elara School" replaces the flip-pad home) and hosting (Vercel with server
  routes replaces the static export). Everything else from Phase 1 still applies.
- **Never invent facts. Never hard-code secrets.** Keys only in environment variables listed in
  `.env.example`. **Never guess an API:** read the official docs for xAI, Supabase and Vercel
  (and the installed Next.js docs in `node_modules/next/dist/docs/`) before using them and put
  the doc URL in a code comment next to the use. Notes from that reading live in
  `docs/research/`.
- **Mock mode** wherever a key is missing (xAI, Supabase, Web3Forms, Vercel token), so the UI,
  tests and screenshots work without secrets; say clearly in the UI and the report which
  features run in mock mode.

### Layout (Step A)

One layout container: `max-width: 1280px`, centred, side padding `clamp(16px, 4vw, 48px)`
(`<Container>`). Section backgrounds run full width; no side is ever blank. No `100vh`
(use `svh`/`dvh`), no fixed pixel widths for layout, no absolutely positioned page content that
can escape the viewport, every image with width/height or `aspect-ratio`, no empty grid columns,
text always wraps. Body text left-aligned, at most 70 characters per line, consistent heading
spacing. Every page is tested at 1280×720, 1366×768, 1440×900, 1536×864, 1920×1080, 2560×1440,
zoom 90/110/125 %, and 360/768: no horizontal scroll, nothing outside the viewport, left and right
margins equal within 2 px, screenshot baselines.

### Menu (Step B)

A glass top bar fixed on every page, outside any flip container, highest z-index, always visible,
shrinking slightly after scrolling: Home, Books, About, Events, Web Support, QR Corner, Contact,
plus "Teacher login" (shows "My portal" when logged in). Phones: top bar with logo and a glass
menu sheet, plus a bottom bar that never hides. Every flip-page section has page dots
("Page 3 of 6") to jump to any page, a back-to-top button, and arrow / PageUp / PageDown keys.

### Acrylic classroom design system (Step C)

- Background: a slowly moving mesh gradient of mint `#DFF5E6`, sage `#CFE3C8`, lime-cream
  `#F3F8DC` and a hint of sky `#DCEFF5`, large blurred blobs, faint paper/chalk-dust texture.
- Glass ("acrylic"): white at 55 % opacity, `backdrop-filter: blur(20px) saturate(160%)`, 1 px
  white/70 % border, a thin highlight along the top edge, soft green-tinted layered shadows, 3 %
  noise. Fallback: solid cream at 92 % where `backdrop-filter` is unsupported or the device is
  slow.
- Colours: keep the logo colours (evergreen text, forest, sage, brass). Add leaf `#34A56F`
  (decorative), leaf-700 `#23794B` (primary buttons, white text), mint `#E3F6EA`, chalkboard
  `#2C4A3B`. Every text/background pair passes WCAG AA.
- Interactions: cursor spotlight glow on glass cards, gentle 3D tilt, primary buttons that pull
  slightly toward the cursor, a ripple on tap, an animated gradient border on focus; all off with
  reduced motion.
- Classroom motifs: chalkboard panels with chalk-written headings (Caveat, chalk texture), ruled
  notebook lines, sticky notes, pencils, a school bell, crayon underlines, report-card badges, a
  notice board, timetable layouts.
- **Not-vibe-coded rules:** one radius scale (8/16/24/999), an 8 px spacing grid, one icon set
  (lucide), no emoji in the UI, no purple or AI-style gradients, no generic stock illustrations,
  no centring everything (editorial, asymmetric layouts), real content only, consistent shadows,
  every element on the grid. Only the shared `<Glass>`, `<Chalkboard>`, `<StickyNote>`,
  `<NotebookCard>` and `<SectionHeading>` components are used for those surfaces. `/styleguide`
  shows all of it.

### Landing page (Step D)

Home is "A day at Elara School" and holds every key detail: (1) an interactive original SVG
classroom hero (chalkboard headline written in chalk, teacher's desk, student desks with diverse
children reading, bookshelf, globe, computer, art easel, notice board, real-time wall clock, sunny
window with a swaying tree; objects glow on hover and link: bookshelf → books, computer →
TechNova, easel → Art Journey, notice board → events, globe → about, chalkboard → Web Support,
teacher's desk → Teacher login; gentle mouse parallax; phones get a simplified scene plus a
hotspot list), (2) three book rooms with a Class 1–8 picker, key features, "Peek inside" flipbook
modal and "Request a sample copy", (3) why schools choose Elara, (4) digital support and QR,
(5) for teachers, (6) events notice board, (7) staff room with polaroids, (8) top 6 FAQ,
(9) school-gate postbox contact. Rooms are lazy-loaded; the hero stays under 150 KB of JS.

### Server, accounts, portal, chatbot, Test Maker (Steps F–I)

- Vercel with server routes; `output: 'export'` is gone. Supabase via `@supabase/ssr` following
  the official Next.js App Router guide; tables `profiles`, `access_requests`, `doubts`, `tests`,
  `ai_usage`, all with Row Level Security; migrations in `supabase/migrations`.
- Accounts are created only by admins (`ADMIN_EMAILS`); public sign-up is off; there are no
  student accounts. The service role key is used only on the server. Teachers see only their own
  tests. Login attempts are rate-limited. Every portal page except the public intro and Help is
  protected on the server, with tests for the redirect and for teacher/admin separation.
- Web Support copies only the FLOW of a publisher portal (subject → series → books by class →
  Learning Resources / Generate Test Paper), in our design: no emoji, no dashed borders, no rainbow
  gradients. Subject and series live in the URL. Resources come from `content/resources.ts`, FAQ
  from `content/faq.ts` (answers `[PLACEHOLDER]` until Vaibhav sends them).
- Chatbot: xAI Grok through the Vercel AI SDK provider if it exists, else the OpenAI-compatible
  API; key `XAI_API_KEY`, model `XAI_MODEL` (no guessed default). Scope is only Elara's books and
  website, built from the site's own data; it never invents prices, dates or facts; link buttons
  to the right page; "Ask our team" fallback; friendly simple language, never asks for personal
  details, 500-character input, per-IP rate limit, short answers, no chat logs stored (anonymous
  counts only), "AI answers can be wrong" note.
- Test Maker: chapters in `content/chapters.ts` (Hindi typed from the PDFs and marked "needs
  checking"; TechNova and Art Journey `[PLACEHOLDER]`), section-by-section generation with zod-
  validated JSON and retries, every question labelled "AI draft — please check", editor with drag
  reorder, A4 print preview with answer key and Set A/B, PDF through the browser's print
  (never a PDF library that breaks Devanagari), Word through the `docx` library, daily limit per
  teacher in config.

### Targets (Step J) and delivery (Step K)

Lighthouse mobile: Home ≥ 85 Performance, every other page ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
`DEPLOY.md` covers Vercel CLI without GitHub, every env var, Supabase setup, first admin and
teachers, and the domain. Deploy a preview only if `VERCEL_TOKEN` is set. Deliver
`elara-website-phase2-source.zip` (no node_modules, no .env) and the final report.

## Project rules added for this build

- **All editable content lives in `/content`** (`books.ts`, `events.ts`, `team.ts`, `site.ts`,
  `site-config.ts`). Pages never hard-code company facts, book data or events.
- **English-only interface.** Hindi appears only where Hindi books are shown (e.g. बेसिक हिंदी रीडर),
  always in Noto Sans Devanagari. Never extract Hindi text from the PDFs (Kruti Dev encoding);
  use images only.
- **Company facts** (from PLAYBOOK.md): legal name Elara Universe Publishers Private Limited;
  co-founders Sunil Sharma and Tausif Khan; website elarauniversepublications.com;
  email info@elarauniversepublications.com; phone/WhatsApp +91 96257 41192;
  registered office D-9, Ground Floor, Block D, Vyapar Marg, Sector 3, Noida, Gautam Buddha Nagar,
  Uttar Pradesh 201301; office T1-1405, MCC Signature Heights, Raj Nagar Extension, Ghaziabad,
  Uttar Pradesh 201017; curriculum aligned to NEP 2020 and NCF 2023. No invented statistics.
- **Phase gate screenshots** go in `docs/screenshots/<phase>/` and the phase report is appended to
  `BUILD_LOG.md`. Commit after every passing phase.
- **Playwright** is pinned to the version matching the pre-installed browsers
  (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, Chromium 1194 = Playwright 1.56.x). Never run
  `playwright install`.

## Folder layout

```
app/                 Next.js App Router pages (one folder per route) + layout, globals.css, not-found
components/          Shared UI: frame/ (header, footer, nav), book/ (shelf, flipbook, cover),
                     flip/ (FlipPad, FlipPage), motion/ (Reveal, StickerPop, InkText, …), mascot/ (Elu),
                     ui/ (Button, Tag, StickyNote, …)
content/             All editable data (books, events, team, site facts, site-config)
lib/                 Small helpers and hooks (cn, whatsapp link, reduced-motion config)
public/brand/        Logo files, favicons, link-preview image
public/books/        Cover images (webp) + samples/<slug>/01..08.webp
public/illustrations Inline-SVG sources / decorative art
scripts/             Image preparation scripts (sharp + pdftoppm)
tests/               Playwright tests (one file per page/component)
docs/screenshots/    Phase-gate screenshots
_source-assets/      Original logo, PDFs, photos. Git-ignored. Never modified.
```

## Design system: "The Living Book"

The whole site looks like a storybook lying open on a sunny desk. It uses cream paper, soft sage greens taken from the logo, a few touches of brass-gold, and pages that lift and turn as you scroll.

### Colours

The colours are built on the official logo's palette, with lighter greens added for backgrounds.

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | #FBF9F4 | Main page background |
| `cream` | #F5F0E8 | Book pages and cards (the logo's own background) |
| `mist` | #EEF3EA | Light green section backgrounds |
| `sage-100` | #DCE5D2 | Borders, hover tints, shelf boards |
| `sage` | #8A9A74 | Icons and secondary elements (logo colour) |
| `forest` | #3F5645 | Buttons and links (logo colour) |
| `evergreen` | #1B241D | Body text and headings (logo colour) |
| `brass` | #B68235 | Bookmark ribbons and highlights (logo colour) |
| `gold-ink` | #8A6122 | Small uppercase labels (logo colour, readable on cream) |
| `hindi` | #E8A53A, tint #FCEFD6 | Hindi tags, shelf label and ribbon |
| `computer` | #4A90C2, tint #E1EEF7 | Computer tags, shelf label and ribbon |
| `drawing` | #E07A5F, tint #FBE4DD | Drawing tags, shelf label and ribbon |

Use subject colours only on small things: tags, ribbons and shelf labels. The page itself stays cream and green. TechNova's eight cover colours appear only on the covers.

### Fonts

All fonts are free Google Fonts. Load them with `next/font` so the page doesn't jump while they load.

- **Lora** (600/700) for headings. It is also used in the logo, so the site matches the brand.
- **Cormorant Garamond** (500) only for large hero lines and the wordmark. It is the logo's main font.
- **Nunito** (400/600/700) for body text, buttons and forms. It is rounded, friendly and very easy to read for both children and teachers.
- **Caveat** for handwritten margin notes and sticky-note labels, at most twice per screen.
- **Noto Sans Devanagari** for any Hindi words.

Body text is 18px on desktop and at least 16px on phones, with a line height of 1.6.

### Signature ideas (what makes it different)

1. **Flip-pad scroll.** This is the core idea. Each section is a page bound at the top edge, like a flip notepad. When you scroll or swipe up, the current page lifts and folds over the top binding with a soft shadow, revealing the next page. Pages move up and down, so it works naturally on phones.
2. **Opening-cover hero.** The home page starts as a closed book with the logo on it. It opens on tap, on scroll, or after 1.5 seconds.
3. **Bookmark-ribbon navigation.** Menu items are fabric ribbons hanging from the top edge of the book, and the current page's ribbon hangs longer. On phones, the menu is a bottom bar of bookmark tabs.
4. **Page-stack progress.** A thin stack of page edges on the right side gets thinner as you read. A corner page number shows "Page 3 of 7".
5. **Bookshelf catalog.** Books stand on shelves. Tap one and it slides out, turns to show its cover, and opens into a flipbook.
6. **An original mascot, "Elu".** A small sage-green leaf sprite inspired by the logo's leaves, holding a pencil. Elu peeks from page corners, waves, and points at buttons. Never use existing cartoon characters.
7. **Subject doodles in the margins.** Line drawings of Devanagari letters (अ आ क), a mouse cursor and pixels, and crayons and paint splashes. They float gently as you scroll.
8. **Paper details.** Faint paper grain, sticky notes, washi tape, polaroid photos, and pencil-stroke underlines on links. Buttons press down like a rubber stamp.
9. **Page-flip sound.** Off by default, with a small speaker toggle.

### Motion rules

- Animate only `transform` and `opacity`, so motion stays smooth on a mid-range Android phone.
- Most animations take 400–700 ms. A page flip takes 600–800 ms, easing out.
- Text must be readable within 1 second of landing on a page. Animation never hides the menu or blocks reading.
- If the visitor's device asks for reduced motion, there are no 3D flips, only gentle fades.
- On phones, flips follow vertical scroll and swipe only. Flipbook previews show one page at a time. Every button or link is at least 44 px tall.
- Page content must be real HTML text, not images, so Google and screen readers can read it.

### Illustration style

Use soft, flat, rounded illustrations in the cream and sage palette, with the subject colours as accents. Avoid stock-photo clichés and copyrighted characters. Simple illustrations can be inline SVGs that Claude Code draws itself. Free Lottie animations are fine if their licence allows commercial use.

Size the layout for screens 360, 768, 1024 and 1440 px wide.

## Animations and extra appeal

Every page gets one main animation and a few small ones, so the site feels alive without becoming slow or distracting. All of them follow the motion rules above. With reduced motion turned on, each one becomes a simple fade or no animation.

| Where | Animation | Library |
| --- | --- | --- |
| First visit | A 1.5-second intro: the lotus leaves in the logo unfold one by one, then the book cover opens. Shown once per visit, with a Skip button. | Motion |
| Hero | The headline writes itself in, letter by letter, like ink. Doodles (अ, a mouse cursor, a crayon) draw themselves with a line-drawing effect. | Motion |
| Every section | Flip-pad page lift with a moving shadow (the core idea). | Motion (scroll-linked) |
| Whole site | Smooth, gentle scrolling that still feels natural on phones. | Lenis |
| Background | Leaves and paper dots drift slowly at different speeds as you scroll, giving a sense of depth. | Motion |
| Menu | Ribbons sway when hovered. When you change page, the active ribbon slides down. | Motion |
| Subject shelf | Books wobble on hover, and one book hops off the shelf when tapped. | Motion |
| Catalog filters | When you switch a filter, books slide smoothly to their new places instead of jumping. | Motion (layout) |
| Book cover | A 3D tilt with a light shine that follows the cursor. | Motion |
| Flipbook | Realistic page turns that follow your finger or mouse. | react-pageflip |
| Numbers and labels | Class numbers 1–8 pop in like stickers being pressed on. | Motion |
| Mascot Elu | Blinks, waves, peeks out from page corners, and cheers when a form is sent. | Motion (SVG) or Lottie |
| Contact form | The letter folds into a paper plane and flies off the screen, followed by a small burst of leaves and stars. | Motion + canvas-confetti |
| Events | Tickets swing slightly on their pins. Photos drop in like polaroids being placed. | Motion |
| Buttons | Rubber-stamp press, with a soft ink ring on tap. | Motion |
| Desktop cursor | A short, fading crayon-dot trail, only inside the hero. | Small custom hook |
| Loading | A tiny book with flipping pages instead of a spinner. | CSS |

### Fun extras for children

These are optional. They make the site memorable and give children a reason to come back.

- **Sticker book:** visiting each page earns a sticker (a leaf, book, star or pencil). Collect all 6 for a "Bookworm" badge. Progress is saved only in the visitor's own browser.
- **Play corner on Home:** three 30-second mini activities, one per subject. Trace the Hindi letter अ with your finger, type your name and see it in binary (0s and 1s), and colour Elu with a few crayons.
- **Time-of-day desk:** the desk scene behind the book gets slightly warmer in the evening and shows a small desk lamp.
- **Festival touches:** on dates set in a config file, add small decorations (diyas for Diwali, kites for Makar Sankranti). Easy to turn on or off.
- **Page-turn sound:** off by default, with a speaker toggle that is remembered.

### Animation libraries

| Library | Used for | Why |
| --- | --- | --- |
| Motion (framer-motion) | Almost all animation, including scroll-linked effects | One library for most animations, with reduced-motion support built in |
| react-pageflip | Flipbook previews | Ready-made, realistic page turns that work by touch |
| Lenis | Smooth scrolling | Small and widely used |
| canvas-confetti | Celebration bursts | Very small, with custom shapes |
| dotLottie (optional) | Mascot animations, if a designer makes them | Small files with smooth playback |

Don't add GSAP or another animation library unless Motion can't do a specific effect. Claude Code must explain why before adding one.
