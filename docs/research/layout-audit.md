# Step A: layout audit of the Phase 1 site

Audited 2026-10-14 against the static export served at `http://localhost:3000` (commit `27047c6`).
Script: `/tmp/claude-0/-home-user-elara-universe-website/c7c6e4c3-8f11-53de-9161-8f44dcdf7ece/scratchpad/audit/audit.mjs`
(raw data `results.json` + `results2.json`, digest `analysis.txt`, same folder). Screenshots: `docs/research/layout-audit/`.

## 1. Method

- 12 routes: `/`, `/catalog/`, `/catalog/hindi-1/`, `/catalog/art-journey-2/`, `/about/`, `/events/`, `/contact/`,
  `/resources/`, `/resources/hindi/1/`, `/styleguide/`, `/demo-flip/`, `/this-page-does-not-exist/`.
- 14 viewport configs: 1280x720, 1366x768, 1440x900, 1536x864, 1920x1080, 2560x1440, 360x740 (mobile+touch),
  768x1024, plus browser zoom 90/110/125 % for 1440x900 and 1366x768, emulated as
  `viewport = size / zoom`, `deviceScaleFactor = zoom` (125 % of 1440x900 = 1152x720 @ DPR 1.25,
  90 % = 1600x1000 @ 0.9, 110 % = 1309x818 @ 1.1; 1366x768 -> 1518x853 / 1242x698 / 1093x614).
  Playwright `browser.newContext({ viewport, deviceScaleFactor, isMobile, hasTouch })`: option names confirmed in
  `node_modules/playwright-core/types/types.d.ts:9809` (`deviceScaleFactor?: number`) and `:9880` (`isMobile`).
  `playwright` 1.56.1 installed (latest on npm 1.64.0, but the project pins 1.56.x to the pre-installed browsers).
- Per page: wait for `body[data-hydrated]`; on `/` click "Skip intro" and wait for `[data-cover="open"]`; then measure
  (a) `documentElement.scrollWidth` vs `innerWidth`, (b) every visible element whose rect is `< -1` or `> innerWidth+1`,
  (c) every `max-w-*` container inside `<main>` plus header/footer wrappers (left gap, right gap, asymmetry),
  (d) every `main > *`, `section`, `article` (background box vs viewport), (e) longest paragraph line
  (`textContent.length / round(height / lineHeight)`). On `/`, `/about/`, `/events/` steps (a)-(c) were repeated at every
  viewport-height scroll step through the flip pad; a second scan (`diag.mjs`) stepped `/about/` at 360 px every 100 px.
- 168 route x size runs, 0 errors.

Measurement snippet (copy into a Playwright test):

```ts
const edges = await page.evaluate(() => {
  const main = document.querySelector('main')!
  const header = document.querySelector('header > div')!
  const first = [...main.querySelectorAll('h1,h2,p')].find((e) => e.getBoundingClientRect().width > 0)!
  return {
    scrollOverflow: document.documentElement.scrollWidth - innerWidth,
    headerEdge: header.getBoundingClientRect().left + parseFloat(getComputedStyle(header).paddingLeft),
    contentEdge: first.getBoundingClientRect().left,
  }
})
expect(edges.scrollOverflow).toBeLessThanOrEqual(0)
expect(Math.abs(edges.headerEdge - edges.contentEdge)).toBeLessThanOrEqual(2)
```

## 2. Results at a glance

| Check | Result |
| --- | --- |
| (a) Horizontal document scroll | **None** on any of the 168 route x size runs, including every scroll step of the flip pads. `scrollWidth === innerWidth` everywhere. Caveat: `components/frame/page-turn.tsx:41` wraps every page in `overflow-x-clip`, so the document can never scroll sideways even when something does overflow; the real test is (b). |
| (b) Elements past the viewport edge | Only three kinds, all clipped and all decorative or transient: (1) the rotating flip sheet mid-flip (perspective projection widens the lifting page, up to 124 px past each edge at 360 px, 91 px at 1366@125 %, 81 px at 1366@125 % on `/`); (2) `tilt-cover.tsx:80` glow `-inset-1/2` (aria-hidden, intentional, -58..+698 px); (3) margin doodles at `right-0` / `right-2` on home pages 2-3 project 6-52 px past the right edge only while the sheet rotates (768, 1440@125 %, 1366@125 %). No static element overflows at rest. |
| (c) Container alignment | **The real problem.** Four different containers are in use, so the left text edge jumps between header and page and between pages: 104 -> 176/182 -> 232 px at 1440; 67 -> 139 px at 1366; 24 -> 96 -> 152 px at 1280. Header vs flip-page content is 72-78 px off on laptops. All containers are centred (asymmetry 0 px); the misalignment is between containers, not within one. |
| (d) Section backgrounds | Every block that paints a background reaches both viewport edges (flip sheets are `absolute inset-0`; footer/header are full-bleed). Non-flip pages (`/catalog/`, `/contact/`, `/resources/`, `/styleguide/`, 404) have no section backgrounds at all: the content island floats on body paper, leaving 640 px of blank paper each side at 2560 and 232 px at 1440 on `/resources/`. |
| (e) Line length | Max 81-82 chars (`/catalog/`, `/events/`, `/styleguide/` intro paragraphs in `max-w-2xl` = 672 px at 18 px Nunito) and 90 chars on `/demo-flip/` at 768. Everything else 29-69 chars. Tailwind ships `--max-width-prose: 65ch` (`node_modules/tailwindcss/theme.css:509`), unused in the project. |
| Zoom 90/110/125 % | 90 % and 110 %: identical to the equivalent CSS width, no new issues. 125 % on 1440x900 (1152 CSS px): the flip-page container `max-w-6xl` is exactly 1152 px, so the sheet content touches both viewport edges (`L0 R0`) and only `px-8` keeps the text off the glass; header is at 24 px, content at 38 px. On 1366@125 % (1093 px) the same container is viewport-wide with 32 px padding while the header uses 24 px. |

## 3. Findings per route x size (only sizes with a problem)

| Route | Size(s) | Finding | Screenshot |
| --- | --- | --- | --- |
| `/` (flip pad, 8 pages) | 1280-2560, all zooms | Header text edge (max-w-7xl + px-6) vs flip-page content (max-w-6xl + px-8): 24 vs 96 @1280, 67 vs 139 @1366, 104 vs 182 @1440, 152 vs 224 @1536, 344 vs 416 @1920, 664 vs 740 @2560 | `01-home-1440-header-vs-page.png`, `09-home-2560-page-content-island.png` |
| `/` | 1440@125 %, 1366@125 % | Content container = viewport width; text starts 14 px right of the header text; "Page x of 8" pill and sound toggle crowd the bottom-left corner | `05-home-1440-zoom125-edge-to-edge.png` |
| `/` | 768, 1440@125 %, 1366@125 % | Computer/drawing doodles (`app/page.tsx:67,76`, `right-0`/`right-2`) sit on the padding edge and are clipped by the sheet's `overflow-hidden` while the page lifts | `07-home-768-doodle-clipped.png` |
| `/` page 5 (Peek inside) | 1280, 360, zooms | Flipbook sheet projects 17-81 px past the edges mid-flip (clipped, cosmetic) | - |
| `/about/` | 1280-2560, zooms | Same header vs page misalignment as `/` (72 px at 1366 and 1440) | `02-about-1366-header-vs-page.png` |
| `/about/` | 360 | Mid-flip the lifting sheet's content box is 93-124 px wider than the phone; the stage clips it, but on a 360 px phone the lifted page visibly shows text cut at both sides for ~700 px of scroll | `06-about-360-midflip-overflow.png` |
| `/events/` | 1280-2560, zooms; 360 | Same misalignment; 60 px mid-flip projection at 360, 91 px at 1366@125 % | - |
| `/demo-flip/` | 1280-2560 | Same misalignment (header 104 vs content 176 at 1440); paragraph line length 90 chars at 768 | - |
| `/catalog/` | 1440 (and all desktop) | Aligned with header (both max-w-7xl) but 72 px left of `/about/` content; intro paragraph 81 chars/line; class grid `lg:grid-cols-8` gives 154 px cards at 1440 (`catalog.tsx:166`) | `03-catalog-1440-edge-104.png`, `10-catalog-1280-line-length.png` |
| `/catalog/` | 2560 | 1280 px island, 640 px blank paper each side, no section backgrounds | `08-catalog-2560-blank-sides.png` |
| `/catalog/hindi-1/`, `/catalog/art-journey-2/` | 1280-2560 | Aligned with header; `lg:grid-cols-7` "other classes" row = 176 px cards; tilt-cover glow (aria-hidden) extends 700 px past the right edge (clipped) | - |
| `/resources/`, `/resources/hindi/1/` | 1280-2560 | `max-w-5xl` + px-6: content at 232 px vs header 104 px at 1440 (128 px off), 152 vs 24 at 1280 | `04-resources-1440-edge-232.png` |
| `/styleguide/` | 1280-2560 | `max-w-5xl`: 232 vs 104 at 1440; body-copy sample 81 chars/line (976 px wide) | - |
| `/contact/` | 1280-2560 | Aligned with header (max-w-7xl) but 72 px left of flip pages | - |
| `/this-page-does-not-exist/` | all | `max-w-3xl` centred text; fine on its own, third distinct width | - |
| footer (every route) | 360 | Email link uses `break-all` (`footer.tsx:48`); fits at 360 but will split mid-word under 330 px or at larger text | `11-footer-360-break-all-email.png` |

## 4. Root causes (file:line)

1. **Four container widths and three paddings.**
   - `components/frame/header.tsx:12` `max-w-7xl px-4 sm:px-6` (1280 px, 16/24 px)
   - `components/frame/footer.tsx:18,56` `max-w-7xl px-4 sm:px-6`
   - `app/catalog/page.tsx:13`, `app/catalog/[slug]/page.tsx:69`, `app/contact/page.tsx:14` `max-w-7xl px-4 sm:px-6`
   - `components/flip/flip-pad.tsx:31` `contentClass`: `max-w-6xl px-4 sm:px-8` (1152 px, 16/32 px) used by `/`, `/about/`, `/events/`, `/demo-flip/`
   - `components/home/hero.tsx:24,32` `px-4 sm:px-8` + `max-w-6xl` (hero duplicates the pad padding)
   - `components/resources/qr-corner.tsx:11`, `components/frame/page-stub.tsx:5`, `app/styleguide/page.tsx:45` `max-w-5xl px-4 sm:px-6` (1024 px)
   - `app/not-found.tsx:60` `max-w-3xl`
   Tailwind values confirmed in `node_modules/tailwindcss/theme.css:340-345` (`--container-5xl: 64rem`, `6xl: 72rem`, `7xl: 80rem`) and in the built CSS `out/_next/static/chunks/0v4tlaow_6ao6.css` (`.max-w-6xl{max-width:var(--container-6xl)}`, `.px-6{padding-inline:calc(var(--spacing) * 6)}`, `--spacing: 0.25rem` at `theme.css:325`).
2. **Flip pages are absolutely positioned sheets** (`flip-pad.tsx:125` `absolute inset-0 origin-top overflow-hidden`) inside a `sticky top-0 h-svh overflow-hidden` stage (`flip-pad.tsx:208`). The sheet is the only full-bleed background on those routes, so any container change must happen in `contentClass` (line 31), not per page. The 3D rotation with `perspective: 1400px` (line 209) is what projects the sheet past the viewport mid-flip; `overflow-hidden` on the stage is required and correct.
3. **`overflow-x-clip` on the page wrapper** (`components/frame/page-turn.tsx:41`) hides every horizontal overflow from `scrollWidth`. Keep it (it is needed for the page-turn `rotateX`), but width tests must assert element rects, not only `scrollWidth` (`tests/helpers.ts:5-10` currently checks `scrollWidth` only).
4. **Viewport-height units:** all correct already (`svh`): `app/layout.tsx:61`, `flip-pad.tsx:203,208,248`, `hero.tsx:24`, `app/page.tsx:158`. No `100vh`, `h-screen` or `min-h-screen` anywhere (grep of `app/` and `components/`). Built CSS confirms `.h-svh{height:100svh}`.
5. **Fixed pixel widths:** only small, intentional ones: `ribbon-nav.tsx:26` `h-[64px] w-[78px]`, `subject-shelf.tsx:43` `max-w-[200px]`, `trace-letter.tsx:55` `max-w-[300px]`, dialogs `w-[min(92vw,26rem)]` / `w-[min(92vw,56rem)]` (`sticker-book.tsx:108`, `scrapbook.tsx:77`). None cause overflow.
6. **Decorations on the padding edge:** `app/page.tsx:67` `Doodle ... right-0`, `:76` `right-2`, `EluPeek right-4` (`:71`), `hero.tsx:48` Elu `right-0 -bottom-16`. They are positioned relative to the content box, so with a wider gutter they stay inside; with a narrow one they are clipped by the sheet.
7. **Text that cannot wrap:** `footer.tsx:48` `break-all` on the email (should be `break-words`/`wrap-anywhere` as `postcard.tsx:43` already does); `sticker-book.tsx:71` `whitespace-nowrap` toast (fits at 360).
8. **Images:** every `<Image>` has `width`/`height` (`book-card.tsx:29`, `tilt-cover.tsx:67`, `flipbook.tsx:108`, `header.tsx:15,23`, `footer.tsx:20`, `polaroid.tsx:42`, `scrapbook.tsx:53,90`, `subject-shelf.tsx:23,57`, `opening-cover.tsx:115`); cover boxes use `aspect-[309/400]` (`cover-placeholder.tsx:11`), map `aspect-[4/3]`, polaroid `aspect-square`. No CLS source found.
9. **Grids at wide sizes:** no empty columns; counts match item counts (8 classes -> `lg:grid-cols-8`, 7 other classes -> `lg:grid-cols-7`, 4 notes -> `lg:grid-cols-4`, 3 beliefs -> `sm:grid-cols-3`, footer 4 columns). The only wide-screen smell is that everything caps at 1152/1280 px, so 2560 px shows a narrow island.
10. **Line length:** `max-w-2xl` (672 px) at 18 px Nunito = 81 chars (`app/catalog/page.tsx`, `events-book.tsx:18`, `contact/page.tsx`, `demo-flip`), above the 45-75 guideline; `max-w-prose` (65ch) is available but unused.

## 5. Fix plan (prioritised)

### P1. One layout container (fixes 1, 2, 6 and the zoom cases)

Add a single utility in `app/globals.css` and use it everywhere a `max-w-{5,6,7}xl px-4 sm:px-{6,8}` wrapper exists today.
`@utility` + `@apply` is already used in this file (`globals.css:89-91` `eyebrow`) and builds, so the syntax is confirmed locally.

```css
/* app/globals.css: one container for header, footer, flip pages and plain pages. */
@theme {
  --container-page: 80rem; /* 1280px; adds max-w-page */
}
@utility container-page {
  width: 100%;
  max-width: var(--container-page);
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 48px);
}
```

Resulting text edge (left = (viewport - 1280) / 2 + padding): 360 -> 16 px, 768 -> 31 px, 1024 -> 41 px, 1152 (1440@125 %) -> 46 px,
1280 -> 48 px, 1366 -> 91 px, 1440 -> 128 px, 1920 -> 368 px, 2560 -> 688 px, identical for header, footer and every page.
If the brief wants 1280 px of *content* rather than 1280 px including gutters, use
`max-width: calc(var(--container-page) + 2 * clamp(16px, 4vw, 48px))` instead; keep one of the two, not both.

Replace, in this order:

| File:line | Today | Change to |
| --- | --- | --- |
| `components/flip/flip-pad.tsx:31` | `'relative mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-8'` | `'relative container-page pt-16 pb-14'` |
| `components/home/hero.tsx:24` | `... overflow-hidden px-4 pt-16 pb-24 sm:px-8` | drop `px-4 sm:px-8` |
| `components/home/hero.tsx:32` | `relative mx-auto w-full max-w-6xl` | `relative container-page` |
| `components/frame/header.tsx:12` | `mx-auto flex max-w-7xl ... px-4 sm:px-6` | `container-page flex ...` |
| `components/frame/footer.tsx:18,56` | `mx-auto grid max-w-7xl ... px-4 sm:px-6` | `container-page grid ...` |
| `app/catalog/page.tsx:13`, `app/catalog/[slug]/page.tsx:69`, `app/contact/page.tsx:14` | `mx-auto w-full max-w-7xl px-4 py-12 sm:px-6` | `container-page py-12` |
| `components/resources/qr-corner.tsx:11`, `components/frame/page-stub.tsx:5`, `app/styleguide/page.tsx:45` | `mx-auto w-full max-w-5xl ...` | `container-page ...` (styleguide may keep an inner `max-w-5xl` for reading, but its outer edge must be the container) |
| `app/not-found.tsx:60` | `mx-auto w-full max-w-3xl ... text-center` | `container-page ... text-center` + inner `max-w-3xl mx-auto` |

Then move the `Main` padding into the component so pages cannot drift again: `components/frame/main.tsx` gets a
`container?: boolean` prop that applies `container-page`, and `FlipPad` sheets are the only place that applies it themselves.

### P2. Full-width section backgrounds with the container inside

Pattern for every section on non-flip pages (`/catalog/`, `/contact/`, `/resources/`, `/styleguide/`, 404) and for the
footer: the background element is full-bleed, the container is its child.

```tsx
// components/ui/section.tsx
export const Section = ({ tone = 'paper', className, children }: SectionProps) => (
  <section className={cn('w-full', { paper: 'bg-paper', cream: 'bg-cream', mist: 'bg-mist' }[tone])}>
    <div className={cn('container-page py-12 md:py-16', className)}>{children}</div>
  </section>
)
```

The flip sheets already do this (`m.section absolute inset-0 bg-cream` -> `contentClass`), so only `contentClass` changes.
`Main` must then stop carrying `max-w-*`/`px-*` (today `app/catalog/page.tsx:13` etc. put the container on `<main>`
itself, which is why those pages have no full-width backgrounds).

### P3. Keep decorations inside the gutter

With `container-page` the gutter is 16-48 px; doodles at `right-0` (`app/page.tsx:67`) still sit on the content edge and get
clipped while the sheet lifts. Place them relative to the sheet, not the content: render `<Doodle>` as a sibling of the content
`m.div` inside `Sheet` (or give them `-right-[clamp(8px,2vw,24px)]` only on `md:` and up). Same for `EluPeek` (`:71`) and the hero
Elu (`hero.tsx:48`).

### P4. Reading measure

Change intro paragraphs from `max-w-2xl` to `max-w-prose` (65ch, `theme.css:509`): `app/catalog/page.tsx`, `app/contact/page.tsx`,
`components/events/events-book.tsx:18`, `app/demo-flip/page.tsx`, `app/about/page.tsx` (`max-w-2xl` x4), `app/styleguide/page.tsx`
body sample. Keep `max-w-md`/`max-w-xl` where the paragraph sits beside an illustration.

### P5. Small text fixes

- `components/frame/footer.tsx:48` `break-all` -> `break-words` (as `postcard.tsx:43`).
- `components/flip/flip-pad.tsx:56-57` `PageNumber` at `md:left-5` collides with the container at 1152 px (125 % zoom); use
  `md:left-[max(1.25rem,calc((100vw-var(--container-page))/2))]` so it sits in the gutter, or keep it in the corner but hide the sound
  toggle below `lg:`.

### P6. Width tests (extend `tests/widths.spec.ts`)

```ts
const widths = [360, 768, 1024, 1280, 1366, 1440, 1536, 1920, 2560]
const zoomed = [{ w: 1152, h: 720, dpr: 1.25 }, { w: 1093, h: 614, dpr: 1.25 }] // 1440/1366 @125 %
// per route: expectNoHorizontalScroll (keep) + no visible element rect beyond [−1, innerWidth+1] at rest
//            + |headerEdge − contentEdge| ≤ 2 px  + for flip pads: repeat at padTop + n·innerHeight
```

`deviceScaleFactor` is a context option, so the zoom cases need `test.use({ viewport, deviceScaleFactor })` in a describe block or a
`browser.newContext(...)` inside the test (`playwright-core/types/types.d.ts:9809`).

## 6. Confirmed facts and versions

| Fact | Source (verified locally) |
| --- | --- |
| `max-w-5xl/6xl/7xl` = 64/72/80 rem = 1024/1152/1280 px; `max-w-2xl` = 42 rem = 672 px; `--spacing` = 0.25 rem | `node_modules/tailwindcss/theme.css:325,340-345`; built CSS `out/_next/static/chunks/0v4tlaow_6ao6.css` |
| `max-w-prose` = 65ch | `node_modules/tailwindcss/theme.css:509` (`--max-width-prose: 65ch`) |
| `h-svh` -> `height:100svh`, `min-h-svh` -> `min-height:100svh`, `overflow-x-clip` -> `overflow-x:clip` | built CSS, same file |
| `@utility name { @apply ... }` and `@theme { --token }` compile with this Tailwind | `app/globals.css:4-37,89-91` (already in use; `npm run build` passes) |
| Playwright `newContext` options `viewport`, `deviceScaleFactor`, `isMobile`, `hasTouch` | `node_modules/playwright-core/types/types.d.ts:9809,9880` |
| `tailwindcss` 4.3.3 (installed = latest), `next` 16.4.0 (= latest), `framer-motion` 14.2.0 (= latest), `playwright`/`@playwright/test` 1.56.1 (latest 1.64.0; project pins 1.56.x for Chromium 1194) | `npm view <pkg> version`, `node -p require('<pkg>/package.json').version` |

## 7. UNCONFIRMED

- The official doc pages could not be fetched from this session: the egress proxy answered 403 (policy denial) for
  `tailwindcss.com`, `playwright.dev` and `developer.mozilla.org`. Every API fact above was instead verified from the installed
  packages and the built CSS listed in section 6. The URLs below are the pages that should be checked when the network allows;
  treat them as UNCONFIRMED references, not quotations.
- Whether `clamp()` with a `vw` preferred value is acceptable to the design owner (Vaibhav) as the single gutter rule, and whether
  "max-width 1280px" means the content box or the padding box (two variants given in P1).
- The 2560 px "island" is a design choice to confirm, not a bug: the brief sizes the layout for 360-1440 only.

## 8. Doc URLs (not fetched, see section 7)

- https://tailwindcss.com/docs/max-width (max-w-* scale, `--container-*` namespace)
- https://tailwindcss.com/docs/theme (overriding `@theme` variables)
- https://tailwindcss.com/docs/adding-custom-styles (`@utility`, arbitrary values)
- https://tailwindcss.com/docs/height (`h-svh`, `h-dvh`)
- https://tailwindcss.com/docs/overflow (`overflow-x-clip`)
- https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
- https://playwright.dev/docs/api/class-browser#browser-new-context (`deviceScaleFactor`, `viewport`, `isMobile`)
- https://playwright.dev/docs/emulation#devices
