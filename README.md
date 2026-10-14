# Elara Universe Publishers — website

The website of Elara Universe Publishers Private Limited: Hindi, Computer and Drawing textbooks
for Classes 1–8. It is built as "The Living Book" (a storybook open on a desk, with pages that
lift and turn as you scroll) from the brief in `PLAYBOOK.md`. The build diary, open questions
and every remaining placeholder are in `BUILD_LOG.md`; deployment is in `DEPLOY.md`.

Stack: Next.js 16 (App Router, TypeScript), Tailwind CSS 4, Motion (`framer-motion`), Lenis,
react-pageflip, react-hook-form + zod, Supabase (teacher accounts), Playwright. Since Phase 2
the site is a Node.js server build that runs on Vercel (logins, the admin page, Web Support and
the chatbot need server routes); it is no longer a static `out/` folder. Without the keys in
`.env.example` those features run in a clearly labelled **mock mode**.

## Run it on your computer

```bash
npm install            # once (Node.js 20 or newer)
npm run dev            # http://localhost:3000 with live reload
npm run build          # production build into .next/
npm start              # runs the production server on http://localhost:3000
```

Checks (the same ones every change should pass):

```bash
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm test               # builds, then runs the Playwright suite against the production server
npm run test:only      # Playwright only (needs a build; reuses a server already on port 3000)
npm run db:test        # Row Level Security checks on a local PostgreSQL (scripts/db/README.md)
node scripts/lighthouse.mjs <label>   # Lighthouse (mobile) on 4 pages while `npm start` runs
npm run screenshots <folder> /route…  # screenshots at 360/768/1024/1440 + reduced motion
```

Playwright needs a Chromium build: on your own machine run `npx playwright install chromium`
once. The test suite covers every page at phone, tablet and desktop widths plus reduced
motion, and includes an accessibility audit (axe) and the SEO files.

## Where things live

| Folder | What is in it |
| --- | --- |
| `content/` | **Everything editable**: books, events, team, company facts, feature switches |
| `app/` | One folder per page (`catalog/`, `about/`, `events/`, `contact/`, `resources/`) |
| `components/` | The building blocks: frame (menu, footer), flip pad, book, mascot Elu, extras |
| `public/brand/`, `public/books/` | Logo files, icons, link-preview image; cover and sample images |
| `vercel.json` | Future QR Corner redirects (examples in `vercel.redirects.example.json`) |
| `lib/`, `proxy.ts`, `supabase/` | Accounts, data store (Supabase or mock), migrations with RLS |
| `scripts/` | Image preparation, screenshots, Lighthouse |
| `tests/` | Playwright tests, one file per page or feature |
| `docs/` | Phase screenshots, Lighthouse summaries, the list of QR addresses |
| `_source-assets/` | The original logo, PDFs and photos (not in Git, never modified) |

Pages never hard-code facts: company name, addresses, phone, email and social links come from
`content/site.ts`, book data from `content/books.ts`, events from `content/events.ts`, the
founders from `content/team.ts`. Text marked `[PLACEHOLDER]` is waiting for real content.

## How to add or change content

After any change: `npm test`, then redeploy (see "Redeploy" below).

### A book (`content/books.ts`)

The 24 books are produced by three small functions, one per series (`hindi`, `technova`,
`artJourney`), each called for Classes 1–8. Facts that differ per class are written as
`cls === 1 ? … : null`; when more classes have data, replace that with a small table, e.g.

```ts
const technovaIsbn: Record<number, string> = { 1: '978-93-93258-70-0', 2: '978-…' }
// in technova(): isbn: technovaIsbn[cls] ?? null
```

Fields: `pages`, `size`, `isbn`, `mrp` (rupees; shown as "MRP ₹240", otherwise the page says
"Request a sample copy"), `edition`, `features` ("What's inside"), `support` ("Comes with"),
`description`. Empty fields are hidden automatically.

Images go in `public/books/`:

- cover `<slug>.webp` (1000 px tall) and thumbnail `<slug>-thumb.webp` (400 px tall);
- sample pages for the flipbook: `public/books/samples/<slug>/01.webp … 08.webp`
  (US Letter ratio, about 1275 × 1650 px);
- then point `cover`, `thumb` and `samples` at them (for Hindi, add the class to `hasFiles`).

The quickest way to make these from a PDF is to drop the PDF into `_source-assets/books/` and
extend `scripts/prepare-images.mjs` (it uses `pdftoppm` from Poppler and `sharp`; run
`node scripts/prepare-images.mjs`). Art Journey still uses drawn placeholder covers
(`public/books/art-journey-<n>.svg`): when real covers arrive, save them as `.webp`, point
`cover`/`thumb` at them and set `isPlaceholder: false`.

A fourth series needs an entry in `content/series.ts` and a subject colour in
`app/globals.css` (today: hindi, computer, drawing).

### An event (`content/events.ts`)

Add an object to the `events` array:

```ts
{
  title: 'TechNova workshop at Springdale School',
  slug: 'technova-springdale-2026',          // unique, lowercase-with-dashes
  type: 'workshop',                          // launch | workshop | training | fair
  date: '2026-12-05',                        // YYYY-MM-DD
  city: 'Ghaziabad',
  venue: 'Springdale School, Raj Nagar',
  description: 'One paragraph.',
  image: '/events/springdale.jpg',           // saved in public/events/, or null
  registerUrl: 'https://…',                  // or null
  isPlaceholder: false,
}
```

Events dated today or later are "upcoming" (pinned tickets; the home page shows the next
three); older ones move to the scrapbook, as polaroids when they have a photo. Delete the
three sample events (`isPlaceholder: true`) once a real one exists.

### A team photo or bio (`content/team.ts`)

Save the photo as `public/team/<name>.jpg` (a square crop of at least 600 × 600 px looks best
in the polaroid), then set `photo: '/team/<name>.jpg'`, write the `bio` (60–80 words) and set
`isPlaceholder: false`.

### Company facts and switches

- `content/site.ts`: legal name, tagline, both addresses, phone, email, social links (an empty
  `url` leaves the footer icon pointing nowhere — fill the four URLs when the accounts exist).
- `content/site-config.ts`: switches for the sticker book, play corner, evening desk, festival
  touches (with the festival dates to check each year) and the page-turn sound.
- Copy on the pages (headline, sticky notes, About chapters) lives in `app/` next to the page
  and is marked `[PLACEHOLDER]` where it still needs approval.

## Contact form

The letter form posts to Web3Forms from the browser. Put the access key in `.env.local`
(`NEXT_PUBLIC_WEB3FORMS_KEY=…`, see `.env.example`) **before building**, or in the host's
environment variables when the host builds the site. Without a key the page shows the email
and WhatsApp buttons instead. Spam protection: a hidden honeypot field, a short cooldown
between sends, and Web3Forms' own filters.

## QR Corner

The QR codes printed in the books open `/resources/<series>/<class>/` (24 addresses, listed
in `docs/qr-addresses.md`). They show a friendly "coming soon" page until the learning
resources exist. To send one of them elsewhere later, add an entry to `vercel.json` (examples
in `vercel.redirects.example.json`). `public/_redirects` is the Netlify equivalent from Phase 1,
kept only in case the site ever moves back to a static host.

## Redeploy

`vercel --prod` from the project folder (or `git push` if Vercel is connected to the
repository). Full steps, environment variables, Supabase, domain and HTTPS: `DEPLOY.md`.

Two pages are for development only and are hidden from search engines: `/styleguide/`
(colours, fonts, components) and `/demo-flip/` (the flip pad on its own).
