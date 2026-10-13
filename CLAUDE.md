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

- Stack: Next.js (App Router, TypeScript) with `output: 'export'` (fully static, drag-and-drop
  deployable) and `images.unoptimized: true` (images are pre-optimised in Phase 2); Tailwind;
  Motion; Lenis; react-pageflip; react-hook-form + zod; Playwright.
- Contact form: sent client-side through Web3Forms with the key in `NEXT_PUBLIC_WEB3FORMS_KEY`.
  If the key is missing, the form shows a friendly message with the email and WhatsApp buttons
  instead. Honeypot field + a simple client-side submit cooldown (no server rate limit).
- QR Corner future redirects: commented examples in `public/_redirects` (Netlify) and `vercel.json`.
- Company name "Elara Universe Publishers Private Limited"; show both addresses as in the brief;
  prices only where PLAYBOOK.md gives them, otherwise "Request a sample copy"; Art Journey uses
  illustrated placeholder covers; all unknown text = `[PLACEHOLDER]`.
- Phase 14: do not deploy. Run the full checks, then write `DEPLOY.md` (Netlify Drop + Vercel +
  connecting elarauniversepublications.com).

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
