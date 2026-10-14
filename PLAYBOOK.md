# Elara Universe Website — Claude Code Playbook

Oct 13, 2026 · @Vaibhav SHarma

## How to use this playbook

Give Claude Code this playbook once. Then paste the prompts in **Copy-paste prompts** one at a time, and check the site on a laptop and a phone after each one.

1. Create an empty folder called `elara-universe-website` and open Claude Code in it.
2. Export this doc as Markdown and save it in that folder as `PLAYBOOK.md`.
3. Create a folder `_source-assets/` inside it and add the files from the table below.
4. Paste **Prompt 0**. Answer any questions Claude Code asks, then paste Prompts 1–14 in order (12b is optional).
5. After each prompt, run `npm run dev`. Check the page on your laptop and phone (same Wi-Fi, using the Network URL it prints). Reply "Approved, next" only when Claude Code's phase report shows every check passing and the page looks right to you.
6. Anything shown as `[PLACEHOLDER]` on the site is sample content. **Content still needed** lists what to send in place of each one.

| Put this | In this folder | Used for |
| --- | --- | --- |
| Everything inside "Elara Universe - Official Logo" (SVG, PNG, PDF, READ ME) | `_source-assets/logo/` | Header, footer, favicon, link-preview image |
| `Computer_Book_Covers_2.pdf` (TechNova 1–8) | `_source-assets/books/computer/` | Catalog covers |
| `Hindi_Book-1_2.pdf`, `Hindi_Book-3_2.pdf` and other classes when ready | `_source-assets/books/hindi/` | Covers and flipbook sample pages |
| Art Journey (Drawing) covers and pages, when ready | `_source-assets/books/drawing/` | Catalog covers and samples |
| Founder photos, event photos | `_source-assets/photos/` | About and Events pages |

The Hindi PDFs are 37–58 MB. Keep `_source-assets/` out of git (Prompt 1 sets this up). Only the optimised images Claude Code makes from them go into the website.

## One-go build (no approvals, no GitHub)

This is the fastest way to use the playbook. Paste one prompt and Claude Code builds the whole site by itself. It runs every phase and tests it, and moves on only when the tests pass. You check the result at the end.

1. Export this doc as Markdown and rename the file `PLAYBOOK.md`.
2. Open Claude Code. If claude.ai/code won't start without a repository, use Claude Code on your Mac instead, in the desktop app or the terminal, with an empty folder. A plain folder doesn't need GitHub.
3. Give it the files. In the web version, attach them with **+**. On your Mac, copy them into the folder. The files are: `PLAYBOOK.md`, the logo zip, `Computer_Book_Covers_2.pdf`, `Hindi_Book-1_2.pdf` and `Hindi_Book-3_2.pdf`.
4. Set the mode to **Auto** so it doesn't ask permission for every file and command. On the web this is the "Auto" setting under the message box. In the terminal, press Shift+Tab until it shows auto-accept.
5. Paste the prompt below and leave it running. It may take a few hours.

```text
Build the complete Elara Universe Publishers website described in PLAYBOOK.md, in ONE uninterrupted run. I will not be approving steps: work autonomously from start to finish.

SETUP
1. Read PLAYBOOK.md in full before doing anything.
2. Find the source files I gave you (attached or in this folder): the logo zip, Computer_Book_Covers_2.pdf, Hindi_Book-1_2.pdf, Hindi_Book-3_2.pdf. Unzip the logo and arrange everything into _source-assets/ exactly as the "How to use this playbook" table says. Never modify the originals.
3. Run `git init` and commit after every phase (local only, no remote needed), so any phase can be rolled back.
4. Create CLAUDE.md (as Prompt 0 describes, including the full "Rules for Claude Code") and BUILD_LOG.md. Create a task list with one item per phase.

PHASES
Run Prompts 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12b, 13, 14 from PLAYBOOK.md in that order, one phase per prompt.

After EVERY phase, run the phase gate from "Rules for Claude Code" steps 1–7 (requirement checklist, tsc, lint, build, Playwright tests incl. all earlier tests, screenshots at 360/768/1440 + reduced motion that you actually look at, self-review of the diff). Append the phase report to BUILD_LOG.md and save screenshots in docs/screenshots/<phase>/.
Replace gate step 8 with: if every check passes, commit and continue to the next phase automatically. NEVER start the next phase with a failing check, a build error or an unfinished requirement. If a check still fails after 3 genuine fix attempts, simplify that feature so it works (keep the brand look), log exactly what you simplified under "Simplified" in BUILD_LOG.md, and continue.

DO NOT STOP TO ASK
Wherever PLAYBOOK.md says "ask me", "tell me", "show me" or "wait", write it in BUILD_LOG.md under "For Vaibhav" and carry on with these defaults:
- Stack: Next.js (App Router, TypeScript) with `output: 'export'` so the site is fully static and can be deployed by drag-and-drop; Tailwind; Motion; Lenis; react-pageflip; react-hook-form + zod; Playwright. Use `images.unoptimized: true` (images are pre-optimised in Prompt 2).
- Contact form: send client-side through Web3Forms with the key in NEXT_PUBLIC_WEB3FORMS_KEY. If the key is missing, the form shows a friendly message with the email and WhatsApp buttons instead. Honeypot field + a simple client-side submit cooldown (no server rate limit, since the site is static).
- QR Corner future redirects: put commented examples in public/_redirects (Netlify) and vercel.json instead of next.config.
- Company name "Elara Universe Publishers Private Limited"; show both addresses as in the brief; prices only where PLAYBOOK.md gives them, otherwise "Request a sample copy"; Art Journey uses illustrated placeholder covers; all unknown text = [PLACEHOLDER].
- Phase 14: do not deploy (it needs my accounts). Instead run the full checks, then write DEPLOY.md with step-by-step instructions for (a) Netlify Drop drag-and-drop of the `out/` folder and (b) Vercel, plus connecting elarauniversepublications.com.

NON-NEGOTIABLE
- Follow every rule in "Rules for Claude Code": shortest clear code, libraries before hand-written code, no repetition, never invent facts, never guess a library API (check the installed version's types or docs), never claim something works without running it.
- Keep the design system, animations and mobile/reduced-motion rules exactly as written in PLAYBOOK.md.

FINISH
When all phases pass:
1. Run `npm run build`, serve the `out/` folder locally, and run the whole Playwright suite plus Lighthouse (mobile) on Home, Catalog, one book page and Contact.
2. Zip `out/` as elara-website-build.zip and the source code (without node_modules and _source-assets) as elara-website-source.zip.
3. Give me one final report: what was built, page-by-page screenshots, Lighthouse scores, everything under "Simplified" and "For Vaibhav", every remaining [PLACEHOLDER], and the 24 QR Corner addresses.
```

If it stops partway, for example because the session timed out, paste: "Read CLAUDE.md and BUILD\_LOG.md, then continue the one-go build from the next unfinished phase, same rules."

## Project brief

Elara Universe Publishers Private Limited is launching textbooks for Classes 1–8 in three subjects: Hindi, Computer and Drawing. The website should feel like opening one of its books. It should be playful enough for children who scan a book's QR code and clear enough for the principals and teachers who choose books.

**Who visits**

- **Schools** (principals, coordinators, teachers) come to browse books, request sample copies and get in touch. They are the buyers.
- **Students in Classes 1–8** arrive by scanning the QR codes in their books. They need the site to be friendly, easy and fun.
- **Parents** come to check a book or find resources.

The site is English only. Hindi appears only where Hindi books are shown, for example the title बेसिक हिंदी रीडर.

**Company facts (from the logo pack and book covers)**

| Item | Value | Where it came from |
| --- | --- | --- |
| Legal name | Elara Universe Publishers Private Limited | Official logo, TechNova back cover |
| Co-founders | Sunil Sharma, Tausif Khan | You |
| Website | elarauniversepublications.com | Hindi Reader back cover |
| Email | info@elarauniversepublications.com | Hindi Reader back cover |
| Phone / WhatsApp | +91 96257 41192 | Both series' covers |
| Registered office | D-9, Ground Floor, Block D, Vyapar Marg, Sector 3, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301 | TechNova back cover |
| Second address | T1-1405, MCC Signature Heights, Raj Nagar Extension, Ghaziabad, Uttar Pradesh 201017 | Hindi Reader back cover |
| Curriculum | Aligned to NEP 2020 and NCF 2023 | Both series' covers |

**Books at launch**

| Subject | Series | Classes | Files you have | Details for the site |
| --- | --- | --- | --- | --- |
| Hindi | Basic Hindi Reader (बेसिक हिंदी रीडर) | 1–8 | Class 1 (72 pages), Class 3 (84 pages) | Text-cum-workbook, also suited to students in non-Hindi-speaking regions. Tagline "Read • Learn • Grow". Web support: animated videos, worksheets, interactive quizzes, downloadable resources. Class 1 MRP ₹240. |
| Computer | TechNova: Computer Education for a Smarter World | 1–8 | One cover PDF with all 8 wraparound covers | Windows 11 with Office 2024 (works with Office 2019/21). Each class has its own cover colour. Extras: web support, test generator, e-book, animated videos, worksheet booklet, AI worksheet. ISBN for book 1: 978-93-93258-70-0. |
| Drawing | Art Journey | 1–8 (please confirm) | None yet | Show illustrated placeholder covers until the files arrive. |

**Pages:** Home, Catalog, About Us, Events, Contact, and QR Corner (the page the QR codes in the books point to, left empty for now).

**Not in this build:** the Test Maker for teachers (it shows as "Coming soon"), online buying or a cart, and logins.

**Settle these before launch.** They also affect printed books.

- The Hindi Reader covers use a different logo (a blue open book) and the name "Elara Universe **Publications** Pvt. Ltd." The official logo and the TechNova covers say "Elara Universe **Publishers** Private Limited". The website uses the official logo and name.
- The two series list different addresses: Noida and Ghaziabad. Until you confirm, the site shows both, labelled "Registered office" and "Office".
- The TechNova back cover says "Landline: ???". Fix this before printing.

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

## Site map and page specs

The site has six pages, plus a book detail page for each title. Every page shares the same frame: ribbon menu, footer, a floating WhatsApp button, and a 404 page that reads "This page is missing from the book" with Elu searching.

| Page | URL | Main job |
| --- | --- | --- |
| Home | `/` | Make a memorable first impression and send schools to the catalog or the sample request form |
| Catalog | `/catalog` | Let visitors find a book by subject and class |
| Book detail | `/catalog/[slug]`, e.g. `/catalog/technova-3` | Show the cover, a flipbook preview and key details; take a sample request |
| About Us | `/about` | Tell the company story and introduce the founders |
| Events | `/events` | Show upcoming and past launches, workshops and fairs |
| Contact | `/contact` | Take enquiries and sample requests |
| QR Corner | `/resources` and `/resources/[series]/[class]` | Where the QR codes in the books lead. Placeholder for now |

### Home

The home page is a flip-pad of 7 pages.

1. **Cover:** a closed book with the official logo opens to the first spread. Headline \[PLACEHOLDER\]: "Books that grow curious minds." Subline: "Hindi, Computer and Drawing textbooks for Classes 1–8, aligned to NEP 2020 and NCF 2023." Buttons: "Explore the catalog" and "Request a sample copy".
2. **Three subjects:** Basic Hindi Reader, TechNova and Art Journey stand on a shelf. Hovering or tapping one opens a tiny two-page peek. Each links to the catalog filtered by that subject.
3. **Why schools choose Elara:** four sticky notes. (1) Aligned to NEP 2020 and NCF 2023. (2) Text-cum-workbook design. (3) Digital support: animated videos, worksheets, quizzes, e-book. (4) Teacher support: worksheet booklets, and a test generator marked "Coming soon".
4. **Every book has a QR door:** a phone scanning a book's QR code, with a link to QR Corner.
5. **Peek inside:** a flipbook of Basic Hindi Reader Class 1 sample pages.
6. **What's happening:** the next 3 events, drawn from the events data.
7. **Back cover:** "Bring Elara to your school", with a short form link and a WhatsApp button.

No made-up numbers such as "10,000+ schools". Show statistics only when the team provides real ones.

### Catalog

- Filters are sticky-note tabs: Subject (All, Hindi, Computer, Drawing) and Class (1–8). They are saved in the URL (e.g. `?subject=hindi&class=3`), so a teacher can share a filtered link.
- Books stand on shelves, one shelf per subject. On phones, covers sit two per shelf row.
- Each book shows its cover, series name, class, subject tag, a "Peek inside" button, and MRP if known. Otherwise it shows "Request a sample copy".
- Book data lives in one file, `content/books.ts`: 24 entries (3 series × 8 classes). Fields with no value are left empty and the page hides them.

### Book detail

- The cover tilts in 3D when you move the mouse over it (on phones, when you tilt the device). Next to it is a flipbook of 6–10 sample pages: a two-page spread on desktop, one page with swipe on phones.
- A "What's inside" list. For TechNova, use the Salient Features from the back cover: Learning Objectives, Do You Know?, Fact File, Quick Backup, Check Your Learning, Exercise, Application Based Questions, Fun Zone, Lab Session, Higher Ordered Thinking, Project Work, Step by Step Approach.
- A details table: class, pages, size, ISBN, MRP, edition, NEP/NCF alignment.
- Buttons: "Request a sample copy" (opens Contact with the book already filled in) and "Ask on WhatsApp" (pre-filled message).
- A "More from this series" shelf.

### About Us

The page is laid out as a chapter book.

- **Chapter 1, Our story** \[PLACEHOLDER\]
- **Chapter 2, What we believe:** joyful, activity-based learning; NEP-aligned books; books for every learner, including students in non-Hindi-speaking regions (from the Hindi Reader preface).
- **Chapter 3, Meet the founders:** polaroid cards held with washi tape for Sunil Sharma and Tausif Khan, both Co-founders. Bios are \[PLACEHOLDER\]. Illustrated avatars stand in until photos arrive.
- **Chapter 4, How a book is made:** write and edit, illustrate, print, then add digital support.

### Events

- Upcoming events are pinned tickets showing date, city, venue, type and an optional "Register" link.
- Past events are a scrapbook of photos with handwritten captions.
- Event types: book launch, school workshop, teacher training, book fair.
- Event data lives in `content/events.ts`. Ship 3 sample events marked \[PLACEHOLDER\]. If there are no events, the page shows "New events coming soon" with Elu.

### Contact

- The form looks like a letter on lined paper. Fields: name, school name, role (teacher, principal, parent, distributor, other), phone, email, city, subjects of interest, classes, message.
- On submit, the letter folds into a paper plane and flies off, then a thank-you note appears.
- The form is sent by email through a form service set with an environment variable. It uses a hidden honeypot field to block spam bots and does not store data on the site.
- `?book=technova-3` pre-fills the message with "Sample copy request: TechNova Class 3".
- A postcard beside the form shows both addresses, the phone number, the email, a WhatsApp click-to-chat button, and a Google Map that loads only when scrolled into view.

### QR Corner

- Keep it empty. Show one friendly page: Elu holding a phone, with the text "Scanned a QR code from your book? Your learning corner is being set up. Check back soon!" and a link back home.
- Make `/resources/technova/3`, `/resources/hindi/1` and the other series/class addresses work now, all showing the same placeholder. QR codes printed in books can't change after printing, so their addresses must never break. Later, each address can point to the other website with one line in the redirects config.

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

## Copy-paste prompts

Paste these into Claude Code in order, one per message. Each prompt builds on the one before it. Check the result on a laptop and a phone before moving on.

### Prompt 0: Read the brief and plan

```text
Read PLAYBOOK.md in full. It is the brief for the Elara Universe Publishers website. Do not write any code yet.

1. Create CLAUDE.md with the rules you must follow on every task in this project. Copy in the full "Rules for Claude Code" section exactly (short code, libraries first, never hallucinate, the 8-step phase gate). Then add: the colour tokens and fonts, the "Living Book" ideas, the animation table and library list, the motion, reduced-motion and phone rules, "all editable content lives in /content", the English-only interface, and the folder layout.
2. List every file in _source-assets/ and say what you will use each one for.
3. Choose the tech stack. My default is Next.js (latest stable, App Router, TypeScript), Tailwind CSS, Motion (framer-motion) for animation, Lenis for smooth scroll, react-pageflip for book previews, react-hook-form + zod for forms, Playwright for tests, and Vercel hosting. Keep it unless you have a strong reason to change; if you change anything, explain why in two lines.
4. Write a short build plan that follows Prompts 1–14 (and the optional 12b) in PLAYBOOK.md, one phase per prompt.
5. List anything in PLAYBOOK.md that is unclear or contradicts itself, and ask me your questions before we start.

From now on, finish every phase with the phase gate and wait for my "Approved, next".
```

### Prompt 1: Set up the project and design tokens

```text
Set up the project using the stack we agreed.

- Add the colour tokens from PLAYBOOK.md (paper, cream, mist, sage-100, sage, forest, evergreen, brass, gold-ink, and the hindi/computer/drawing accents with their tints) as Tailwind theme colours and CSS variables.
- Load Lora, Cormorant Garamond, Nunito, Caveat and Noto Sans Devanagari with next/font. Set the type scale with clamp(): body 18px desktop / 16px phone, line-height 1.6.
- Add a subtle paper-grain background (a tiny tiled SVG or CSS noise, under 10 KB).
- Create folders: /content (data), /components, /public/brand, /public/books, /public/illustrations.
- Add _source-assets/ to .gitignore. Set up ESLint, Prettier and Playwright, with npm scripts for typecheck, lint, build and test, plus a first smoke test.
- Make a /styleguide page that shows every colour, font, button and tag style, so I can check the look.
Run the dev server and tell me the URL.
```

### Prompt 2: Prepare the logo and book images

```text
Prepare all images from _source-assets/. Use command-line tools (pdftoppm, sharp or similar). Never edit the source files.

Logo (_source-assets/logo/):
- Copy elara-universe-logo-transparent.svg to /public/brand/logo-full.svg.
- Make a horizontal header version: the lotus-and-book mark on the left, "ELARA UNIVERSE" on the right. Keep the official colours: Evergreen #1B241D, Forest #3F5645, Sage #8A9A74, Brass #B68235, Gold #8A6122.
- Make the favicon and app icons (16, 32, 180, 192, 512 px) from the lotus-and-book mark only, on cream #F5F0E8.
- Make a 1200×630 link-preview image: the full logo centred on cream.

TechNova (_source-assets/books/computer/Computer_Book_Covers_2.pdf):
- The PDF has 8 pages, one per class, in order 1 to 8. Each page is a wraparound cover: back cover on the left, spine in the middle, front cover on the right.
- Crop the front cover from each page and save /public/books/technova-1.webp … technova-8.webp (1000 px tall, plus a 400 px thumbnail).
- Crop the back cover of book 1 as /public/books/technova-back.webp.

Basic Hindi Reader (_source-assets/books/hindi/):
- Page 1 is the front cover and page 2 is the back cover. Save covers as hindi-1.webp and hindi-3.webp, the same sizes as above.
- Choose 8 colourful inside pages from each book (the contents page, one chapter opening, activity pages) and save them as /public/books/samples/hindi-1/01.webp … 08.webp, 1200 px tall.
- Note: the Hindi text in these PDFs uses an old Kruti Dev font encoding, so copied text comes out as gibberish. Use images only; never extract Hindi text from the PDFs.

Drawing (Art Journey): no files yet. Draw 8 simple illustrated placeholder covers (SVG, coral and cream, "Art Journey" with the class number) marked as placeholders.

Show me a contact sheet of everything you made.
```

### Prompt 3: Build the frame (menu, footer, page turns)

```text
Build the shared frame used on every page.

- Desktop menu: "bookmark ribbons" hanging from the top edge of the page: Home, Catalog, About Us, Events, Contact, QR Corner. The current page's ribbon hangs longer. Each ribbon sways gently on hover. The header logo is on the left.
- Phone menu: a bottom bar of bookmark tabs with icons and short labels, fixed to the bottom and at least 56px tall. It hides when scrolling down and shows again when scrolling up.
- Footer, styled as the book's back cover: the full logo, both addresses (Registered office: Noida; Office: Ghaziabad), phone, email, page links, social icons (empty links for now), and "© 2026 Elara Universe Publishers Private Limited".
- Page-turn transition between pages: the old page lifts and turns away while the new one is revealed (about 600ms). With reduced motion, use a simple fade.
- A floating WhatsApp button (+91 96257 41192), bottom right on desktop and above the bottom bar on phones.
- A 404 page: "This page is missing from the book" with a simple illustration.
- Keyboard and screen-reader friendly: visible focus rings and a "skip to content" link.
```

### Prompt 4: Build the flip-pad scroll

```text
Build the reusable flip-pad scroll component described in PLAYBOOK.md ("Flip-pad scroll"). It is the core of the design.

- <FlipPad> wraps a list of <FlipPage> sections. Each page is a cream sheet bound at the TOP edge, with a binding strip (rings or stitched spine) across the top.
- As the user scrolls or swipes, the current page rotates up around its top edge (rotateX 0 → -180deg), with a moving shadow and a slight curl, revealing the next page underneath. Scroll position drives the motion, so it can be reversed by scrolling back.
- A page-stack progress indicator on the right edge (thin page edges that thin out as you read) and a corner page number, "Page 3 of 7".
- Sections taller than the screen scroll inside the page first, then flip.
- On phones: the same vertical flip, tuned for touch and 60fps. Test at 360px width.
- With reduced motion: no 3D, pages stack with a fade.
- All content stays real HTML text for SEO.
- Add a /demo-flip page with 5 sample pages so I can test it on my phone.
Tell me how to open it on my phone over Wi-Fi.
```

### Prompt 5: Home page

```text
Build the Home page as a <FlipPad> with the 7 pages listed in PLAYBOOK.md under "Home":
1) opening-cover hero (closed book with the logo on cream; it opens on tap, on scroll, or after 1.5s), 2) three subjects on a shelf, 3) four "why schools choose Elara" sticky notes, 4) "Every book has a QR door", 5) a "Peek inside" flipbook with the Hindi Class 1 samples, 6) the next 3 events from content/events.ts, 7) a back-cover CTA.

Use only the facts in PLAYBOOK.md. Mark any copy you write yourself with [PLACEHOLDER] in a code comment so I can review it. No invented statistics. Add subject doodles (अ आ क letters, cursor and pixels, crayons) as light line drawings in the margins that drift slightly on scroll.
```

### Prompt 6: Catalog page and book data

```text
Create content/books.ts with 24 books: Basic Hindi Reader 1–8, TechNova 1–8, Art Journey 1–8.
Fields: slug, series, subject, class, title, titleHindi (Hindi only), cover, samples[], pages, size, isbn, mrp, edition, features[], description, isPlaceholder.
Fill in only what PLAYBOOK.md gives: TechNova features and ISBN for book 1, Hindi Class 1 MRP ₹240 and 72 pages, Hindi Class 3 84 pages. Leave the rest null; the UI must hide empty fields.

Build /catalog:
- Sticky-note filter tabs for Subject (All, Hindi, Computer, Drawing) and Class (1–8), saved in the URL (?subject=&class=).
- One wooden-and-sage shelf per subject, with books standing on it. Hovering lifts a book slightly, like pulling it off the shelf.
- On phones, two covers per shelf row.
- Each card shows the cover, series, class, a subject tag, MRP if set (otherwise "Request a sample copy"), and a "Peek inside" button.
- An empty state with a simple illustration when a filter finds nothing.
```

### Prompt 7: Book detail and flipbook

```text
Build /catalog/[slug] for every book, generated at build time.

- A cover with a 3D tilt that follows the mouse (on phones, device tilt if allowed, otherwise none).
- A <Flipbook> using react-pageflip: two-page spread on desktop, single page with swipe on phones, page-turn sound off by default with a speaker toggle, and keyboard arrow keys. If a book has no samples, show "Sample pages coming soon".
- "What's inside" from features[], and a details table from the book's fields.
- "Request a sample copy" links to /contact?book=<slug>. "Ask on WhatsApp" opens wa.me/919625741192 with a pre-filled message naming the book.
- A "More from this series" shelf.
- Page title and description for SEO, plus Book structured data (schema.org).
```

### Prompt 8: About Us

```text
Build /about as a chapter book, following PLAYBOOK.md under "About Us": Chapter 1 Our story, Chapter 2 What we believe, Chapter 3 Meet the founders, Chapter 4 How a book is made.

- Each chapter opens with a large chapter number and a drop cap.
- Founders appear as polaroid cards held with washi tape: Sunil Sharma (Co-founder) and Tausif Khan (Co-founder). Read their details from content/team.ts. Use illustrated initials-avatars until I add photos to /public/team/. Mark bios as [PLACEHOLDER].
- Chapter 4 is four illustrated steps that draw in as you scroll.
Don't invent history, dates or achievements.
```

### Prompt 9: Events

```text
Create content/events.ts (title, slug, type: launch | workshop | training | fair, date, city, venue, description, image, registerUrl, isPlaceholder) with 3 sample events, all marked isPlaceholder: true.

Build /events as a scrapbook:
- Upcoming events are pinned paper tickets with a torn edge, sorted by date, with a type sticker and an optional "Register" button.
- Past events are a photo scrapbook with handwritten captions (Caveat) and a lightbox for photos.
- Events move from upcoming to past automatically by date.
- When there are no events, show "New events coming soon" with an illustration.
- Placeholder events show a small "Sample" badge so nobody mistakes them for real ones.
```

### Prompt 10: Contact

```text
Build /contact.

- A form styled as a letter on lined cream paper. Fields: name, school name, role (teacher, principal, parent, distributor, other), phone (Indian format check), email, city, subjects (Hindi, Computer, Drawing), classes, message.
- ?book=<slug> pre-fills the message with "Sample copy request: <Series> Class <n>".
- On submit, the letter folds into a paper plane and flies off, then a thank-you note appears. With reduced motion, show the note only.
- Send the form by email through a form service (Resend, Web3Forms or Formspree — recommend one) configured with environment variables. Add a hidden honeypot field and a basic rate limit. Don't store submissions on the site.
- Include clear error messages and keep what the user typed if sending fails.
- A postcard beside the form shows both addresses, phone, info@elarauniversepublications.com, a WhatsApp button, and a Google Map that loads only when scrolled into view.
Tell me exactly which environment variables to set and where.
```

### Prompt 11: QR Corner (placeholder only)

```text
Build the QR Corner. Keep it a placeholder: no resources, logins or downloads yet.

- /resources shows one friendly page: an illustration of a phone scanning a book, the text "Scanned a QR code from your book? Your learning corner is being set up. Check back soon!" and a button back home.
- /resources/[series]/[class] (series: hindi, technova, art-journey; class: 1–8) shows the same page, with the book name and class shown if the address is valid.
- Add a commented-out example in next.config showing how to redirect one of these addresses to another website later.
- Give me a list of all 24 QR addresses, using the domain from PLAYBOOK.md, so I can make the QR codes for printing.
```

### Prompt 12: Animations, mascot and polish

```text
Add the animations from PLAYBOOK.md "Animations and extra appeal" (the table), using the libraries in its "Animation libraries" table.

- Build them as a small set of reusable pieces (e.g. <Reveal>, <StickerPop>, <InkText>, <Wobble>, <PaperPlane>, a useReducedMotion-aware config) instead of repeating animation code on every page.
- First-visit intro: the logo's lotus leaves unfold one by one, then the cover opens (about 1.5 seconds, once per visit, with a Skip button).
- Draw an original mascot, "Elu": a small sage-green leaf sprite inspired by the logo's leaves, holding a pencil. Make it an SVG with poses (peek, wave, point, read, search, cheer), each animated: blink, wave, a peek from page corners, and a cheer when a form is sent. Use it in the hero, on empty states, in QR Corner and on the 404 page. It must not look like any existing character.
- Micro-interactions: buttons press like a rubber stamp, links get a pencil-stroke underline, cards lift at the corner on hover.
- Performance: animate only transform/opacity, pause anything off-screen, keep 60fps on a mid-range Android phone, and keep the home page's first load fast (report the JS size before and after).
- With reduced motion, every animation becomes a fade or nothing. Test this.
- Check every page against the colour and font rules and fix anything off-brand.
Record a short screen video or a GIF of each main animation so I can review the motion.
```

### Prompt 12b (optional): Fun extras for children

```text
Add the "Fun extras for children" from PLAYBOOK.md, each one easy to turn on or off in content/site-config.ts:
- Sticker book: earn a sticker for visiting each page, and a "Bookworm" badge for all 6. Save progress in localStorage with try/catch, so the site still works if storage is blocked.
- Play corner on Home: trace अ with a finger or mouse, type your name and see it in binary, and colour Elu with a few crayons. Each activity is lazy-loaded, so it doesn't slow the first page load.
- Time-of-day desk (warmer in the evening, with a desk lamp) and festival decorations from a list of dates.
- Page-turn sound toggle, off by default, with the choice remembered.
None of these may block reading or navigation, and all must work by touch on a 360px phone.
```

### Prompt 13: Accessibility, SEO and speed

```text
Audit and fix the whole site.

- Accessibility: proper heading order, alt text for every image, labelled form fields, focus rings, colour contrast (WCAG AA), reduced motion respected everywhere, everything usable by keyboard.
- SEO: unique title and description on each page, the link-preview image, sitemap.xml, robots.txt, Organization structured data with the company name, address, phone and logo.
- Speed: images as WebP/AVIF with set sizes, lazy-load everything below the first screen, load animation libraries only where they are used, total JS on the home page as small as practical.
Run Lighthouse (mobile) on Home, Catalog, a book page and Contact. Target: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. Show me the scores and what you fixed.
```

### Prompt 14: Final check and go live

```text
Get the site ready to launch.

1. Search the code for [PLACEHOLDER] and isPlaceholder and list every one still left.
2. Test at 360, 768, 1024 and 1440px widths, in Chrome, Safari and Firefox, and on an Android phone. Fix anything broken.
3. Send one test enquiry through the contact form and confirm it arrives.
4. Walk me through deploying to Vercel and connecting elarauniversepublications.com (DNS records step by step), then check that HTTPS works.
5. Check that all 24 QR Corner addresses open on the live site.
6. Write a short README: how to add a book, an event or a team photo, and how to redeploy.
```

### When something looks wrong

Use these short follow-ups at any point.

```text
The page flip is jerky on my phone (<phone model>). Profile it, animate only transform/opacity, reduce shadow cost, and make it smooth at 60fps. Keep the look.
```

```text
This part doesn't feel like a book yet: <describe>. Suggest 3 different ways to make it feel more like paper and pages, show me the best one, and keep it kid-friendly.
```

```text
Here is a screenshot of <page>. Compare it to the PLAYBOOK.md design rules and list everything that is off-brand, then fix it.
```

## Content still needed

The site can be built and shown with placeholders. Send these to Claude Code as you get them, and tick each one off.

- [ ] Final company name on the site: "Publishers Private Limited" or "Publications Pvt. Ltd."
- [ ] Which address is the main one (Noida or Ghaziabad), and the landline number
- [ ] Short bios (60–80 words each) and photos of Sunil Sharma and Tausif Khan
- [ ] "Our story" for About Us: when and why Elara Universe started, in 3–4 sentences
- [ ] Home page headline and one-line mission (or approve the suggested placeholder)
- [ ] Basic Hindi Reader PDFs for Classes 2 and 4–8
- [ ] Art Journey (Drawing) covers and 8 sample pages per class
- [ ] TechNova sample inside pages (8 per class) for the flipbooks
- [ ] MRP, page count, size and ISBN for each book, or confirm "Request a sample copy" instead of prices
- [ ] Real events (date, city, venue, photos) to replace the 3 samples
- [ ] Email address that should receive contact form messages
- [ ] Social media links (Instagram, Facebook, YouTube, LinkedIn)
- [ ] Whether the domain elarauniversepublications.com is already bought, and where (GoDaddy, Hostinger, etc.)
- [ ] Which website the QR codes will finally lead to

## Launch checklist

The site is ready to go live when every item below is ticked.

- [ ] Lighthouse (mobile) scores on Home, Catalog, a book page and Contact: Performance 90+, Accessibility 95+, SEO 95+
- [ ] Page flips stay smooth on a mid-range Android phone. Nothing scrolls sideways at 360px width.
- [ ] With reduced motion turned on in phone settings, the site uses fades only and nothing is broken.
- [ ] Every page works by keyboard alone, and text contrast passes WCAG AA. All Playwright tests, type checks and the production build pass with zero errors.
- [ ] A test enquiry from the contact form reaches the inbox, and the WhatsApp button opens a chat with the right message.
- [ ] No `[PLACEHOLDER]` text or "Sample" event left on the live site, unless you chose to keep it.
- [ ] Company name, address and phone match the printed books exactly.
- [ ] All 24 QR Corner addresses open on the live domain. Scan at least one printed proof with an Android phone and an iPhone before the print run.
- [ ] The domain works with HTTPS, with and without "www".
- [ ] The site is submitted to Google Search Console, with the sitemap added.
- [ ] Link previews show the logo when the site is shared on WhatsApp.

## Phase 2: Classroom upgrade

Phase 2 changes the look from plain cream to a bright frosted-glass classroom and rebuilds the home page as one complete landing page. It also fixes the menu and the laptop alignment, and adds Web Support, a Grok chatbot, teacher logins and an AI Test Maker. Run it with the single prompt at the end of this section.

### What changes

| Your request | What Claude Code will build |
| --- | --- |
| Theme looks dull and "vibe coded" | A bright, frosted-glass ("acrylic") look: see-through panels over a soft, moving green background, plus cursor glow, 3D tilt and buttons that pull toward the cursor. A strict list of "not vibe-coded" rules keeps it looking professionally designed. |
| Classroom theme | Chalkboard-green panels with chalk-style headings, ruled notebook lines, sticky notes, a school bell, a notice board and timetable-style layouts. The home page is a walk through a school day. |
| Menu disappears on page 3 of 6 | The glass menu stays fixed at the top of every page, outside the flipping pages. On phones, the bottom bar never hides. Each flip section gets page dots to jump to any page. |
| Landing page should have everything and be unique | Home becomes "A day at Elara School". It starts in an interactive classroom where each object leads somewhere, then moves through rooms that cover books, support, teachers, events, about, FAQ and contact. Visitors don't need to open other pages. |
| Web Support page | A login portal like the publisher portal you showed: a sidebar, then pick subject → series → that series' books by class. Each book card has "Learning Resources" (e-book, videos, worksheets, quizzes, downloads) and "Generate Test Paper". Logins are for teachers only. Logged-out visitors see how it works and a request-access form. Help & Doubts (searchable FAQ and "ask a doubt") is public, so the chatbot can link to exact answers. |
| Grok AI chatbot | A glass chat bubble with Elu on every page. It answers only about Elara's books and website, using the site's own data. When it can't answer, it opens the matching Web Support answer or the doubt form. |
| Teacher login | Only you create teacher accounts, from a private admin page. Teachers can't sign themselves up. Access requests from Web Support appear on the admin page, and you create the account with one click. |
| Test Maker | A logged-in teacher picks class, book, chapters, question types and marks. Grok drafts the questions, the teacher edits them, then prints or downloads the paper as PDF or Word, with an answer key and Sets A and B. |
| Laptop alignment and blank sides | One shared layout container, with backgrounds that run edge to edge. Every page is checked at 6 laptop sizes and 3 zoom levels, with automatic tests for blank sides and sideways scrolling. |

### Important change to hosting

The chatbot, logins and Test Maker need a server. So the site can no longer be dragged onto Netlify as plain files. It will run on **Vercel**, which is free to start. Claude Code can deploy it from the command line, so GitHub is still not needed.

### Set these up before you paste the prompt

You can paste the prompt before all of these are ready. Claude Code builds everything with a safe test mode wherever a key is missing, and you add the real keys later in Vercel's settings.

- [ ] **xAI API key** for Grok, from console.x.ai
- [ ] **Supabase** free project, from supabase.com: Project URL, publishable (anon) key and secret (service role) key. It stores teacher accounts, saved tests and doubts.
- [ ] **Vercel** free account, from vercel.com
- [ ] **Web3Forms key**, if not already set, for the contact form
- [ ] **Admin emails:** the email addresses allowed to open the admin page and create teacher accounts (for example yours and the co-founders')

Keep your keys out of the chat message. If Claude Code's environment settings (the "Default" button) or a `.env.local` file let you add them, put them there, and add them in Vercel → Project → Settings → Environment Variables for the live site. If a key ever ends up in a chat, regenerate it before launch.

### How to run it

1. Continue in the same Claude Code session as Phase 1 if it's still open. If not, start a new one and attach `elara-website-source.zip` from Phase 1 together with `PLAYBOOK.md`, re-exported so it includes this section.
2. Keep the mode on **Auto**.
3. Paste the Phase 2 prompt below and leave it running.

### Phase 2 prompt

```text
PHASE 2 of the Elara Universe website. Work in ONE uninterrupted run, exactly like Phase 1: same CLAUDE.md rules, same phase gate after every step (requirement checklist, tsc, lint, build, ALL Playwright tests incl. Phase 1 tests, screenshots you actually look at, self-review), auto-continue only when everything passes, log to BUILD_LOG.md, commit after every step. Do not stop to ask me: write questions under "For Vaibhav" in BUILD_LOG.md and use the defaults below.

START
1. If the Phase 1 project is not in this folder, unzip elara-website-source.zip first and run the full Phase 1 test suite to confirm it is green before changing anything.
2. Read PLAYBOOK.md, especially "Phase 2: Classroom upgrade". Add a "Phase 2 rules" section to CLAUDE.md with everything below. Where Phase 2 conflicts with Phase 1 (theme, home page, hosting), Phase 2 wins.
3. Never invent facts. Never hard-code secrets. Never guess an API: read the official docs for xAI, Supabase and Vercel before using them and note the doc URL in a code comment.

STEP A — Laptop alignment and blank sides (fix first)
- Audit every page at 1280x720, 1366x768, 1440x900, 1536x864, 1920x1080 and 2560x1440, and at browser zoom 90%, 110% and 125%. Also check 360px and 768px.
- Find and fix the causes: 100vh (use svh/dvh), fixed widths, absolutely positioned flip pages, missing max-width, overflow clipping, images without aspect-ratio, empty grid columns, text that doesn't wrap.
- Use ONE layout container (max-width 1280px, centred, side padding clamp(16px, 4vw, 48px)). Section backgrounds run full width, so no side is ever blank. Body text left-aligned, max 70 characters per line, consistent heading spacing.
- Add Playwright tests for every page and size: no horizontal scroll, no element outside the viewport, left and right margins equal within 2px, plus screenshot baselines.

STEP B — Menu always reachable
- A glass top bar fixed on EVERY page, always visible, outside any flip container, highest z-index. It shrinks slightly after scrolling. Links: Home, Books, About, Events, Web Support, QR Corner, Contact, plus a "Teacher login" button (shows "My portal" when logged in).
- Phones: top bar with logo and menu button (glass sheet), plus the bottom bar, which never hides now.
- Every flip-page section gets clickable page dots ("Page 3 of 6") to jump to any page, and a back-to-top button. Arrow keys and PageUp/PageDown work.
- Test: on every flip page of every page, the menu is visible and clickable without scrolling.

STEP C — Acrylic classroom design system
- Background: a soft, slowly moving mesh gradient of mint #DFF5E6, sage #CFE3C8, lime-cream #F3F8DC and a hint of sky #DCEFF5, with large blurred blobs and a faint paper/chalk-dust texture.
- Glass surfaces ("acrylic"): white at 55% opacity, backdrop-filter blur(20px) saturate(160%), a 1px white/70% border, a thin highlight along the top edge, soft green-tinted layered shadows, 3% noise. Fallback to solid cream at 92% where backdrop-filter is unsupported or the device is slow.
- Colours: keep the logo colours (evergreen text, forest, sage, brass). Add leaf #34A56F (decorative), leaf-700 #23794B (primary buttons, white text), mint #E3F6EA, chalkboard #2C4A3B. Check every text/background pair passes WCAG AA.
- Interactions: cursor spotlight glow on glass cards, gentle 3D tilt, primary buttons that pull slightly toward the cursor, a ripple on tap, an animated gradient border on focus. All turned off with reduced motion.
- Classroom motifs: chalkboard panels with chalk-written headings (Caveat, chalk texture), ruled notebook lines, sticky notes, pencils, a school bell, crayon underlines, report-card badges, a notice board, timetable layouts.
- NOT-VIBE-CODED RULES: one radius scale (8/16/24/999), an 8px spacing grid, one icon set (lucide), no emoji in the UI, no purple or AI-style gradients, no generic stock illustrations, no centring everything (use editorial, asymmetric layouts), real content only, consistent shadows, every element aligned to the grid. Build reusable <Glass>, <Chalkboard>, <StickyNote>, <NotebookCard>, <SectionHeading> components and use only them.
- Update /styleguide to show all of it.

STEP D — New landing page: "A day at Elara School"
Home must hold EVERY key detail, so visitors never need another page, and must look unlike every other page. Sections:
1. Interactive classroom hero: an original illustrated classroom (SVG). It has a green chalkboard where the headline writes itself in chalk, a teacher's desk, student desks with children reading, a bookshelf, a globe, a computer, an art easel, a notice board, a wall clock showing the real time, and a sunny window with a swaying tree. Objects glow on hover and work as links: bookshelf → books, computer → TechNova, easel → Art Journey, notice board → events, globe → about, chalkboard → Web Support, teacher's desk → Teacher login. Gentle mouse parallax. On phones, a simplified scene plus a list of hotspots. All children are diverse, original and respectful.
2. Our books: three rooms (Hindi class, Computer lab, Art room). Each has the series card, a Class 1–8 picker that swaps the cover with a page-flip, key features, a "Peek inside" flipbook modal and "Request a sample copy".
3. Why schools choose Elara: notebook stickers on glass.
4. Digital support and QR: an animated phone scanning a book and opening resources, linking to Web Support and QR Corner.
5. For teachers: an animated preview of a test paper being built, plus the login button.
6. Events: a notice board with pinned notices.
7. About and founders: a staff room with polaroids.
8. FAQ: the top 6 questions, linking to Web Support.
9. Contact: a school-gate postbox with a short form, WhatsApp, phone, email and map.
Smooth transitions between rooms (a page turn or a door opening). Keep it fast: lazy-load each room, and keep the hero under 150 KB of JS.

STEP E — Restyle every other page to the new system so the whole site matches, then repeat Step A's checks.

STEP F — Server, database and teacher accounts
- Remove `output: 'export'`. The site now runs on Vercel with server routes.
- Supabase (follow the current official Next.js App Router + @supabase/ssr guide). Tables, all with Row Level Security: profiles (name, school, phone, role teacher|admin, classes[], subjects[], active), access_requests, doubts, tests (teacher_id, title, class, subject, book_slug, chapters[], settings json, questions json, timestamps), ai_usage (for rate limits). Put migrations in supabase/migrations. Apply them with SUPABASE_DB_URL if it is set; otherwise write SETUP-SUPABASE.md with copy-paste SQL and dashboard steps.
- Accounts are created ONLY by admins. Turn off public sign-up. Admins = the emails in ADMIN_EMAILS.
- /admin (admins only): create a teacher account with assigned classes and subjects (sends an invite email or shows a one-time temporary password), edit, deactivate, reset password. See access requests (create the account from a request in one click) and see doubts.
- /login (glass card on a classroom background), forgot password, and after login everyone lands in the Web Support portal (Step G). The top bar's "Teacher login" button becomes "My portal".
- The service role key is used only on the server. Teachers can only see their own tests. Rate-limit login attempts.

STEP G — Web Support portal (/web-support)
Copy the FLOW of a typical publisher web-support portal: log in → pick a subject → pick a series → see that series' books, one per class → open Learning Resources or Generate Test Paper. Copy ONLY the flow. Use our acrylic classroom design (no emoji, no dashed borders, no rainbow gradients).
- Logged out (/web-support): a public page with the 4 steps from the Hindi Reader back cover (visit website → Web Support → request access → get approval → use the content), a glass login card, and a "Request access" form (name, school, role teacher | principal | coordinator, email, phone, book, class). Requests are saved to access_requests and emailed to the admins, who create the account in one click (Step F).
- Logged in: a portal layout with a glass sidebar showing the school name and user name, and links to My books, My tests, Help & Doubts, Profile and Sign out. On phones it collapses to a top menu.
- "Select your title": Step 1 is a Subject dropdown (Hindi, Computer, Drawing). Step 2 is a Series dropdown filtered by subject (Basic Hindi Reader, TechNova, Art Journey). Both are saved in the URL (?subject=hindi&series=basic-hindi-reader), so links can be shared and the back button works. Show only the user's assigned classes; admins see all.
- Book grid: one glass card per class with the cover, "<Series> (Class n)", and two buttons. Teachers get both. "Learning Resources" opens the book's resources. "Generate Test Paper" opens Step I with class and book pre-filled. Cards lift on hover; covers swap with a page-flip when the series changes.
- Learning Resources (/web-support/books/[slug]): tabs for E-book (flipbook of the sample pages for now), Animated videos (embedded player), Worksheets (PDF view and download), Interactive quizzes, and Downloads. Content comes from content/resources.ts. Empty tabs show "Coming soon", and [PLACEHOLDER] entries are easy to swap for real links and files.
- Help & Doubts (/web-support/help): searchable FAQ grouped by topic (books, ordering, sample copies, digital access, login, QR codes, Test Maker), with each answer at its own #anchor. FAQ content lives in content/faq.ts, with my answers marked [PLACEHOLDER] until I send them. An "Ask a doubt" form saved to doubts and emailed to the admins. It accepts ?q= to pre-fill the question. This page is public, so the chatbot can link to it.
- Every portal page except the public intro and Help is protected on the server. Tests must confirm that a logged-out visitor is redirected to login and that a teacher cannot open /admin or another teacher's tests. Logins are for teachers and admins only: there are no student accounts.

STEP H — Grok chatbot
- A glass chat bubble with Elu on every page, opening a chat panel with suggestion chips ("Which books are for Class 3?", "How do I get a sample copy?", "How does Web Support work?", "Upcoming events").
- A server route that streams answers from xAI Grok. Read docs.x.ai for the current SDK and model names. Use the Vercel AI SDK xAI provider if it exists, otherwise xAI's OpenAI-compatible API. Key in XAI_API_KEY, model in XAI_MODEL (no guessed default; document it).
- Scope: ONLY Elara's books and website. Build the system prompt from the site's own data (content/books.ts, events, faq, contact details, the page list). Never invent prices, dates or facts: if it's not in the data, say so and offer Contact or WhatsApp. Politely decline anything off-topic.
- It answers with link buttons to the right page, e.g. "Open this answer" → /web-support/help#sample-copies. If it can't answer, it offers "Ask our team" → /web-support/help?q=<question>#ask.
- Safety (children use this site): friendly simple language, never ask for personal details, input max 500 characters, rate limit per IP (e.g. 20 messages / 10 min), short answers, no chat logs stored (only anonymous counts), and a small note "AI answers can be wrong".
- Mock mode when XAI_API_KEY is missing, so the UI and tests work.

STEP I — Test Maker (/web-support/test-maker, teachers only; opened from a book card's "Generate Test Paper" with class and book pre-filled, or from My tests)
- Chapter data in content/chapters.ts for every book and class. Read the Hindi Reader contents pages (विषय-सूची) from the page images in the PDFs and type the chapter names in Unicode Hindi; mark them "needs checking". Leave TechNova and Art Journey chapters as [PLACEHOLDER] lists that are easy to fill in.
- Form: class (limited to the teacher's classes) → book → chapters (multi-select) → question types with count and marks each (MCQ, fill in the blanks, true/false, match the following, one word, short answer, long answer; picture/drawing tasks for Art Journey) → difficulty mix → total marks and time (warns if the totals don't add up) → exam name, school name, optional school logo, date, instructions. The Hindi paper is in Devanagari; Computer and Drawing papers are in English.
- Generation: Grok drafts one section at a time, with structured JSON output validated by zod, and retries on invalid output. The prompt includes the book, class level, chapter names and NEP 2020 / NCF 2023 competency focus, and stays within those chapters. Each question is labelled "AI draft — please check".
- Editor: edit, reorder (drag), delete, regenerate one question, add your own question, change marks; live totals.
- Output: A4 print preview with school header, sections, marks and a separate answer key; Set A / Set B (shuffled order and options). Download as PDF through the browser's print-to-PDF with a print stylesheet (Chrome shapes Devanagari correctly; do NOT use a PDF library that breaks Hindi conjuncts), and as Word (.docx, using the docx library) so teachers can edit it. Check that Hindi text renders correctly in both, using screenshots.
- Save, duplicate and delete tests; list them under My tests in the portal sidebar. Daily generation limit per teacher, set in config.
- Mock mode when XAI_API_KEY is missing.

STEP J — Security, accessibility, speed and full regression
- Security: secrets only in env vars, .env.example lists every variable, RLS tested (one teacher cannot read another's tests), admin routes blocked for teachers, all inputs validated with zod, no XSS.
- Accessibility: WCAG AA contrast on glass, keyboard access for chat, Test Maker and admin, reduced motion everywhere.
- Lighthouse mobile: Home ≥ 85 Performance (glass + illustration allowance), every other page ≥ 90; Accessibility ≥ 95; SEO ≥ 95.
- Run every test from Phase 1 and Phase 2.

STEP K — Deploy prep and report
- Update DEPLOY.md: deploy to Vercel with the CLI and no GitHub (vercel login, vercel link, vercel --prod), every env var to add (XAI_API_KEY, XAI_MODEL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL optional, ADMIN_EMAILS, NEXT_PUBLIC_WEB3FORMS_KEY), Supabase setup, how to create the first admin and teachers, and connecting elarauniversepublications.com.
- If VERCEL_TOKEN is set, deploy a preview and test the live URL with Playwright. Otherwise skip deploying.
- Zip the source (no node_modules, no .env) as elara-website-phase2-source.zip.
- Final report: what changed, before/after screenshots of every page at 1440px and 360px, Lighthouse scores, test counts, everything under "Simplified" and "For Vaibhav", remaining [PLACEHOLDER]s, and which features are running in mock mode until keys are added.
```

### Content needed for Phase 2

- [ ] Chapter list for each book and class. Claude Code will read the Hindi Reader contents pages from the page images, but someone must check them. TechNova and Art Journey chapters are needed from your team.
- [ ] Answers to the 15–20 questions schools ask most (ordering, sample copies, delivery, digital access, login, QR codes)
- [ ] Links or files for digital resources (animated videos, worksheets, quizzes, downloads) for each book
- [ ] The first list of teachers to create (name, school, email, classes, subjects)
