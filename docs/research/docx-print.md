# Research: Word (.docx) test papers with Hindi, A4 print-to-PDF, Playwright PDF, drag-and-drop

Date: 2026-10-14. Scope: Phase 2 Step I (Test Maker: print/PDF and Word output).

**How these facts were confirmed.** The sandbox cannot reach docx.js.org, playwright.dev,
docs.dndkit.com / dndkit.com, learn.microsoft.com, support.apple.com, developer.mozilla.org or
nextjs.org (proxy 403 / DNS). Every API fact below was therefore taken from (a) the projects'
own documentation *source files* on raw.githubusercontent.com (the same Markdown the sites
render), (b) the installed packages' type definitions, and (c) real runs in a scratch folder
(outputs quoted). Anything that rests only on a search-engine snippet is marked **UNCONFIRMED**.

## 1. `docx` (npm) — generating .docx in Node and the browser

| Fact | Value | Source |
| --- | --- | --- |
| Latest version | **9.11.0** (published 2026-10-13), MIT, `engines.node >= 10` | `npm view docx` |
| Runs where | "Works for Node and on the Browser" | package README (tarball) |
| Install | `npm i docx@9.11.0` | quickstart.md |
| Exports needed | `Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, PageBreak, PageNumber, Header, Footer, LevelFormat, WidthType, AlignmentType, PageOrientation, BorderStyle, CharacterSet, convertMillimetersToTwip, convertInchesToTwip` | verified with `import * as d from "docx"` (all defined) |

### 1.1 Packer (export) — usage/packers.md + `dist/index.d.ts` `class Packer`

- `Packer.toBuffer(doc): Promise<Buffer>` — "This will return a NodeJS `Buffer`. If this is used in the browser, it will return a `UInt8Array` instead."
- `Packer.toBlob(doc): Promise<Blob>` — "useful if you want to send it as an downloadable in a browser environment."
- `Packer.toBase64String(doc)`, `Packer.toString(doc)`, `Packer.toArrayBuffer(doc)`, `Packer.toStream(doc)` (Node stream), `Packer.pack(doc, type)`.
- All take optional `(prettify?: boolean | PrettifyType, overrides?: {path, data}[])`. "As of version 4+, this library will not have options to export to PDF."
- Troubleshooting: always `await` the packer ("The file is corrupt" = wrote a Promise).

### 1.2 Core building blocks (usage/document.md, paragraph.md, text.md, tables.md, numbering.md, bullet-points.md, headers-and-footers.md, page-layout.md, sections.md)

- `new Document({ creator, title, description, styles, numbering, fonts, sections: [{ properties, headers, footers, children }] })`.
- `new Paragraph("text")` | `new Paragraph({ text | children: TextRun[], heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before, after, line, lineRule }, pageBreakBefore: true, bullet: { level: 0 }, numbering: { reference, level, instance? } })`.
- `HeadingLevel` = `HEADING_1..HEADING_6`, `TITLE` (values `"Heading1"`…).
- `new TextRun("text")` | `new TextRun({ text, bold, italics, underline: {type,color}, color: "3F5645", size, sizeComplexScript, font, break: 1, children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] })`.
  - `size` is in **half-points** (`size: 24` = 12 pt; d.ts: "Values can be specified as numbers (interpreted as half-points)").
  - `font: string | { name, hint } | { ascii, hAnsi, eastAsia, cs, hint } | { theme: "body" | "headings" }` (d.ts `IRunStylePropertiesOptions.font`).
- Page break: `new Paragraph({ children: [new PageBreak()] })` or `pageBreakBefore: true`.
- Tables: `new Table({ rows: TableRow[], width: { size: 100, type: WidthType.PERCENTAGE }, columnWidths?: number[], borders?, margins? })`; `new TableRow({ children: TableCell[] })`; `new TableCell({ children: (Paragraph|Table)[], width: { size, type: WidthType.DXA|PERCENTAGE|AUTO }, columnSpan, rowSpan, shading, margins, borders: { top: { style: BorderStyle.SINGLE, size, color } } })`.
- Bullets: `bullet: { level: 0..9 }` (uses docx's built-in bullet numbering).
- Numbered lists: declare `numbering.config[]` on the Document (`reference`, `levels[{ level, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]`), then `numbering: { reference, level }` on paragraphs; `instance: n` restarts a list.
- A4 + margins (page-layout.md): `properties.page.size = { width: convertMillimetersToTwip(210), height: convertMillimetersToTwip(297) }`, `properties.page.margin = { top, right, bottom, left, header, footer, gutter }` in twips (`convertMillimetersToTwip`/`convertInchesToTwip`). For landscape pass the *portrait* numbers plus `orientation: PageOrientation.LANDSCAPE` ("docx swaps them for you"). Optional printer `code: 9` = A4.
- Headers/footers: `headers: { default: new Header({ children: [Paragraph] }), first?, even? }`, same for `footers`/`Footer`; `first` needs `properties.titlePage: true`. Page numbers via `PageNumber.CURRENT`, `PageNumber.TOTAL_PAGES` inside a `TextRun({ children: [...] })`. "Word and LibreOffice work out the number of pages when they lay the document out."
- Document-wide default font/size: `styles: { default: { document: { run: { font, size } } } }` (fonts.md); or a `Normal` paragraph style (styling-with-js.md).

### 1.3 Devanagari font: use the complex-script (`cs`) slot

OOXML `w:rFonts` has four font slots: `ascii`, `hAnsi`, `eastAsia`, `cs` ("Font for complex script characters" — d.ts `IFontAttributesProperties`; XSD `CT_Fonts` quoted in d.ts). `createRunFonts` in `dist/index.mjs` shows exactly what is written:

- `font: "Mangal"` (string) → `w:ascii`, `w:cs`, `w:eastAsia`, `w:hAnsi` **all** = `Mangal`.
- `font: { ascii: "Nunito", hAnsi: "Nunito", cs: "Mangal" }` → only the given attributes.
- `font: { theme: "body" }` → theme fonts (`minorHAnsi` / `minorBidi`), i.e. whatever the reader's Word theme maps.
- `sizeComplexScript` → `w:szCs`; when omitted (or `true`) docx writes `w:szCs` = `size` (index.mjs: `options.sizeComplexScript === void 0 || === true ? options.size : options.sizeComplexScript`). Devanagari usually needs 1–2 pt more than Latin at the same nominal size, so set it explicitly. `boldComplexScript` / `italicsComplexScript` also exist.
- `hint` is written as `w:hint`. The spec's enumeration (`ST_Hint`) and the Unicode-range → slot table are in ECMA-376 §17.3.2.26; **UNCONFIRMED** verbatim here (no reachable mirror). Word is expected to pick `cs` for Devanagari; the generated file was verified structurally only (no Word available in the sandbox).

Verified run (scratch, docx 9.11.0, Node 22): `word/document.xml` contained
`<w:pgSz w:w="11905" w:h="16837" w:orient="portrait"/>`, `<w:pgMar w:top="1133" w:right="1020" w:bottom="1133" w:left="1020" …/>`,
`<w:rFonts w:ascii="Nunito" w:cs="Mangal" w:hAnsi="Nunito"/><w:sz w:val="24"/><w:szCs w:val="28"/>`, `<w:br w:type="page"/>`,
`<w:pStyle w:val="Heading1"/>`, the Hindi text as UTF-8, `numbering.xml` with `bullet` + `decimal`; `file` reports "Microsoft Word 2007+".
`Packer.toBuffer` → `Buffer` 11 781 bytes; `Packer.toBlob` → `Blob` 11 781 bytes (Node 22 has `Blob`).

### 1.4 Copy-ready: `lib/test-paper-docx.ts` (shared by route handler and browser)

```ts
import {
  AlignmentType, Document, Footer, Header, HeadingLevel, LevelFormat, PageBreak, PageNumber, Paragraph,
  Table, TableCell, TableRow, TextRun, WidthType, convertMillimetersToTwip as mm,
} from 'docx'

const FONT = { ascii: 'Nunito', hAnsi: 'Nunito', cs: 'Mangal' }          // Latin + Devanagari slots
const run = (text: string, extra = {}) => new TextRun({ text, font: FONT, size: 24, sizeComplexScript: 26, ...extra })

export const buildPaper = (title: string, questions: string[]) =>
  new Document({
    creator: 'Elara Universe Publishers Private Limited',
    title,
    styles: { default: { document: { run: { font: FONT, size: 24 } } } },
    numbering: {
      config: [{ reference: 'q', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
        alignment: AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }],
    },
    sections: [{
      properties: { page: { size: { width: mm(210), height: mm(297) }, margin: { top: mm(20), right: mm(18), bottom: mm(20), left: mm(18) } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run(title)] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ font: FONT, children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES] })] })] }) },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(title)] }),
        ...questions.map((q) => new Paragraph({ numbering: { reference: 'q', level: 0 }, children: [run(q)] })),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ children: [
          new TableCell({ children: [new Paragraph({ children: [run('नाम')] })] }),
          new TableCell({ children: [new Paragraph({ children: [run('Marks')] })] }),
        ] })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    }],
  })
```

Node route handler (Next.js App Router; `new Response(buffer)` verified to accept the Node `Buffer`):

```ts
// app/api/test-paper/route.ts
import { Packer } from 'docx'
import { buildPaper } from '@/lib/test-paper-docx'

export async function POST(request: Request) {
  const { title, questions } = await request.json()
  const buffer = await Packer.toBuffer(buildPaper(title, questions))
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.docx"`,
    },
  })
}
```

Browser (client component; no server needed, works with the current `output: 'export'`):

```ts
const blob = await Packer.toBlob(buildPaper(title, questions))
const url = URL.createObjectURL(blob)
Object.assign(document.createElement('a'), { href: url, download: `${title}.docx` }).click()
URL.revokeObjectURL(url)
```

Next.js static-export caveat (static-exports.mdx): with `output: 'export'`, Route Handlers "render a static response when running `next build`. Only the `GET` HTTP verb is supported … you must explicitly mark the handler as static by adding `export const dynamic = 'force-static'`"; "Route Handlers that rely on Request" are listed under Unsupported Features. So the POST route above only exists once Step F switches to server mode; until then use the browser path. Browser pitfall (troubleshooting.md): "browsers have no `Buffer`" — pass `ArrayBuffer`/`Uint8Array` for images/fonts, and use `toBlob`, not `toBuffer`.

## 2. Print-to-PDF in the browser keeps Devanagari shaping

Why the browser path is the safe one: `docx` writes text + font *names* only; the reader's Word/LibreOffice shapes it with whatever Devanagari font is installed. The browser prints with the page's own web font (next/font self-hosts Noto Sans Devanagari in this project: `app/layout.tsx` → `--font-devanagari`), so conjuncts and matras are shaped by Chromium/HarfBuzz exactly as on screen. Verified: the PDF below rendered क्षत्रिय, ज्ञान, कृष्ण, द्वितीय correctly (viewed as PNG) with `NotoSansDevanagari-Regular` embedded.

### 2.1 CSS (MDN `@page`, `@page/size`, `print-color-adjust`, Printing guide)

```css
@media print {                       /* MDN: "these styles will only be used for printed content" */
  .no-print, header, nav, footer { display: none !important; }
  .sheet { break-after: page; }      /* MDN example also keeps page-break-after: always */
}
@page { size: A4; margin: 15mm; }    /* size: A4 = "ISO dimensions: 210mm x 297mm"; also `A4 landscape` */
.band { print-color-adjust: exact; -webkit-print-color-adjust: exact; }   /* keep sage backgrounds */
```

- `window.print()` (MDN): "Opens the print dialog to print the current document… This method will block while the print dialog is open." Users choose "Save as PDF" there.
- `size` keyword support: MDN lists it as Baseline 2024; a browser-compat-data issue (#22946) reports Firefox/Safari may not honour the size in the *saved* PDF — **UNCONFIRMED** here; test in each browser.
- Wait for fonts before printing programmatically: `await document.fonts.ready` (used in the test below).

### 2.2 Playwright (pinned @playwright/test 1.56.1; facts from installed `playwright-core/types/types.d.ts` + docs/src/api/class-page.md)

- `page.pdf(options?): Promise<Buffer>` — "generates a pdf of the page with `print` css media. To generate a pdf with `screen` media, call `page.emulateMedia` before". Chromium headless only (types.d.ts note next to the `headless` link). Default colours are print-adjusted; use `-webkit-print-color-adjust`.
- Options (defaults): `path`, `format` (default `'Letter'`; `A4` = 8.27in x 11.7in; overrides width/height), `printBackground` (`false`), `preferCSSPageSize` (`false`; `true` gives CSS `@page` size priority), `margin: { top,right,bottom,left }` (all `0`; units px/in/cm/mm), `scale` (`1`, 0.1–2), `landscape` (`false`), `pageRanges` (`''` = all), `displayHeaderFooter` (`false`) + `headerTemplate`/`footerTemplate` (classes `date title url pageNumber totalPages`; scripts not run, page styles not visible), `tagged` (`false`, v1.42), `outline` (`false`, v1.42).
- `page.emulateMedia({ media: 'screen' | 'print' | null, colorScheme: 'light' | 'dark' | null, reducedMotion: 'reduce' | 'no-preference' | null, forcedColors: 'active' | 'none' | null, contrast: 'no-preference' | 'more' | null })`; `page.emulateMedia({})` resets. Checked with `matchMedia('print').matches`.

Verified run (chromium-1194 from `/opt/pw-browsers`, HTML + woff2 served through `page.route`):
`font loaded: true` · `print media: true | button hidden: true` · `pdfinfo`: `Pages: 2`, `Page size: 594.96 x 841.92 pts (A4)` · `pdffonts`: `NotoSansDevanagari-Regular … emb yes`.
Pitfall found: with `page.setContent()` the page is `about:blank`, so a `file://` `@font-face` is blocked (`font loaded: false`, fallback FreeSans). Serve the font over http(s) (the real app does; for isolated tests use `page.route` + `route.fulfill`).

```ts
// tests/test-maker-print.spec.ts (pattern; uses the served app, baseURL from playwright.config.ts)
import { test, expect } from '@playwright/test'

test('test paper prints to A4 with Devanagari font', async ({ page }, testInfo) => {
  await page.goto('/test-maker/print?paper=demo')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('16px "Noto Sans Devanagari"'))).toBe(true)
  await page.emulateMedia({ media: 'print' })                       // print CSS for a screenshot
  await expect(page.getByRole('button', { name: 'Print' })).toBeHidden()
  await page.screenshot({ path: testInfo.outputPath('print.png'), fullPage: true })
  const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: '15mm', bottom: '15mm' } })
  expect(pdf.byteLength).toBeGreaterThan(10_000)                    // Chromium headless only
})
```

## 3. Hindi pitfalls in .docx (and what to tell teachers)

1. **No fonts travel with a normal .docx.** The file names a font; the reader's machine must have it. If it is missing, Word substitutes, which can change line breaks but (with any Unicode Devanagari font) still shapes correctly. Never use legacy Kruti Dev encoding (CLAUDE.md rule) — only Unicode text.
2. **Choose a font that ships with the OS** (reference pages exist but could not be opened from the sandbox):
   - Windows: **Mangal** — Microsoft Learn "Mangal font family" lists it as "an OpenType font for the Indic script - Devanagari… designed for use as a UI font", supplied with Windows 11, 10, 8.1, 8, 7 (and Vista/XP) and Office (search snippet of https://learn.microsoft.com/en-us/typography/font-list/mangal — **UNCONFIRMED** verbatim). **Nirmala UI** (Semilight/Regular/Bold, Devanagari by John Hudson) supplied with Windows 8 → 11 per https://learn.microsoft.com/en-us/typography/font-list/nirmala-ui (snippet; the snippet also mentioned Windows 7 — **UNCONFIRMED**).
   - macOS: **Kohinoor Devanagari** (Bold/Light/Medium/Regular/Semibold listed on https://support.apple.com/en-kw/101179), **Devanagari MT**, **Devanagari Sangam MN** (listed on https://support.apple.com/en-ng/101178). Current lists: macOS Tahoe https://support.apple.com/en-us/122869, Sequoia https://support.apple.com/en-us/120414, Sonoma https://support.apple.com/en-us/108939 — "Most of these fonts are installed and enabled automatically. Others in this list can be downloaded using Font Book". Which of the three are default-installed on Tahoe is **UNCONFIRMED** (pages not reachable); Vaibhav/Sunil should open one of these pages and check.
   - Recommendation: `cs: 'Mangal'` (Windows default Devanagari font in Office) and tell macOS users Word will substitute (Kohinoor Devanagari/Devanagari MT). Keep Latin in `ascii`/`hAnsi` = Nunito **only if** Nunito is installed; otherwise use `Calibri`/`Arial` for Latin, because unknown Latin fonts also get substituted.
3. **Option: embed the font** (fonts.md): `fonts: [{ name: 'Noto Sans Devanagari', data: Buffer, bold?, characterSet?: CharacterSet }]` then `font: { cs: 'Noto Sans Devanagari' }`. "TTF is recommended"; in browsers `fetch` → `arrayBuffer` → `Buffer.from(...)` (needs a Buffer polyfill client-side — prefer embedding only in the Node route). Adds the TTF size to every file. Check the font's LICENSE file before embedding (Noto is published under SIL OFL — **UNCONFIRMED** here, verify in the download).
4. **Sizes**: set `sizeComplexScript` 1–2 half-points above `size`; `docDefaults` gets `w:szCs` = `size` automatically.
5. **Mixed Latin/Hindi runs** work in one `TextRun` because the four slots cover both; still, split runs where the Hindi text needs a different size/weight.
6. **Validate output**: unzip the .docx and grep `word/document.xml` for `w:cs=` and the UTF-8 text (as done above); open in LibreOffice/Word before shipping. Add a Playwright test only for the download (content-type + size), not for Word rendering.

## 4. Drag-and-drop reorder (React 19)

| Package | Version | Licence | Last publish | Unpacked | Notes |
| --- | --- | --- | --- | --- | --- |
| `@dnd-kit/core` | 6.3.1 | MIT | 2024-12-05 | 1.7 MB (installed) | peer `react >=16.8` |
| `@dnd-kit/sortable` | 10.0.0 | MIT | 2024-12-04 | 404 KB | peer `@dnd-kit/core ^6.3.0` |
| `@dnd-kit/utilities` | 3.2.2 | MIT | 2023-11-06 | 272 KB | `CSS.Transform.toString` |
| `@dnd-kit/react` (+ `@dnd-kit/helpers`, `@dnd-kit/dom`) | 0.5.0 (`beta` tag 0.5.1-beta-20260912) | MIT | 2026-09-12 | 296 KB + deps | successor, peer `react ^18 \|\| ^19`, still 0.x |
| `@atlaskit/pragmatic-drag-and-drop` | 4.0.0 | Apache-2.0 | 2026-09-24 | 486 KB | headless, no React preset |
| `@formkit/drag-and-drop` | 0.6.1 | MIT | 2026-06-15 | 909 KB | 0.x |
| `@hello-pangea/dnd` | 18.0.1 | Apache-2.0 | 2025-02-09 | 1.26 MB | react-beautiful-dnd fork |

README of dnd-kit: "the core of the library weighs around 10kb minified and has no external dependencies"; built-in pointer/touch/keyboard sensors and accessibility announcements; sortable preset "is a thin layer built on top of `@dnd-kit/core`".

**Recommendation:** `@dnd-kit/core@6.3.1` + `@dnd-kit/sortable@10.0.0` + `@dnd-kit/utilities@3.2.2` (stable 1.x+ API, MIT, keyboard-accessible — matters for the 44 px / a11y rules). **For Vaibhav:** its last publish is 22 months ago, which breaks the "updated in the last 12 months" rule; the maintained successor `@dnd-kit/react@0.5.0` is pre-1.0. Pick one: stable-but-old (recommended) or new-but-0.x. Both samples below type-check (`tsc --strict`, React 19.3 types) against the installed packages.

Legacy API (names verified in the packages' `.d.ts`; the official docs site was unreachable, so this is the standard pattern rather than a verbatim copy):

```tsx
'use client'
import { useState } from 'react'
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  return <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners}>{id}</li>
}

export function QuestionOrder({ initial }: { initial: string[] }) {
  const [items, setItems] = useState(initial)
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) setItems((list) => arrayMove(list, list.indexOf(String(active.id)), list.indexOf(String(over.id))))
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul>{items.map((id) => <SortableItem key={id} id={id} />)}</ul>
      </SortableContext>
    </DndContext>
  )
}
```

`arrayMove` source (packages/sortable/src/utilities/arrayMove.ts): returns a new array with the item moved. `SortableContext` `items` must be in render order.

New API (verbatim shape from apps/docs/react/hooks/use-sortable.mdx + quickstart.mdx on the `experimental` branch; `move` from `@dnd-kit/helpers` per the migration guide snippet):

```tsx
import { useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from '@dnd-kit/helpers'

function Item({ id, index }: { id: string; index: number }) {
  const { ref } = useSortable({ id, index })   // id + index required; also handleRef, isDragging, isDropping
  return <li ref={ref}>{id}</li>
}
export function QuestionOrder({ initial }: { initial: string[] }) {
  const [items, setItems] = useState(initial)
  return (
    <DragDropProvider onDragEnd={(event) => setItems((list) => move(list, event))}>
      <ul>{items.map((id, index) => <Item key={id} id={id} index={index} />)}</ul>
    </DragDropProvider>
  )
}
```

## 5. Open questions / UNCONFIRMED

- ECMA-376 §17.3.2.26 wording for `rFonts`/`hint` and the Unicode-range → font-slot table (Devanagari → complex script). Structural output verified; Word rendering not verified (no Word in sandbox).
- Exact Windows/macOS font-list wording (Mangal, Nirmala UI, Kohinoor Devanagari, Devanagari MT, Devanagari Sangam MN); which Apple fonts are default-installed vs Font Book downloads on macOS Tahoe/Sequoia.
- `@page { size: A4 }` honoured in Firefox/Safari *saved* PDFs (bcd issue #22946). Chromium verified.
- Noto Sans Devanagari licence text for embedding into .docx.
- dnd-kit legacy docs page (docs.dndkit.com/presets/sortable) could not be opened; sample validated by type-check only.

## Documentation URLs used

- docx: https://docx.js.org (unreachable; source files read instead) — https://github.com/dolanmiu/docx/blob/master/docs/quickstart.md · usage/packers.md · usage/document.md · usage/paragraph.md · usage/text.md · usage/tables.md · usage/numbering.md · usage/bullet-points.md · usage/headers-and-footers.md · usage/page-numbers.md · usage/page-layout.md · usage/sections.md · usage/fonts.md · usage/styling-with-js.md · troubleshooting.md; types: `node_modules/docx/dist/index.d.ts` (9.11.0), implementation `dist/index.mjs` (`createRunFonts`, `w:szCs`).
- Playwright: https://playwright.dev/docs/api/class-page#page-pdf and #page-emulate-media (unreachable; read https://github.com/microsoft/playwright/blob/main/docs/src/api/class-page.md and installed `playwright-core/types/types.d.ts` 1.56.1).
- MDN (source repo): https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/at-rules/@page/index.md · …/@page/size/index.md · …/reference/properties/print-color-adjust/index.md · …/web/css/guides/media_queries/printing/index.md · …/web/api/window/print/index.md (rendered at https://developer.mozilla.org/en-US/docs/Web/CSS/@page, /@page/size, /print-color-adjust, /Web/API/Window/print).
- Next.js: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/static-exports.mdx · …/03-api-reference/03-file-conventions/route.mdx (rendered at https://nextjs.org/docs/app/guides/static-exports, /docs/app/api-reference/file-conventions/route).
- dnd-kit: https://github.com/clauderic/dnd-kit (README, packages/sortable/README.md, packages/sortable/src/utilities/arrayMove.ts, stories/2 - Presets/Sortable/1-Vertical.story.tsx); new docs source https://github.com/clauderic/dnd-kit/blob/experimental/apps/docs/react/quickstart.mdx and …/react/hooks/use-sortable.mdx (rendered at https://dndkit.com and https://next.dndkit.com/react/guides/migration); legacy docs https://docs.dndkit.com/presets/sortable (unreachable).
- Fonts: https://learn.microsoft.com/en-us/typography/font-list/mangal · https://learn.microsoft.com/en-us/typography/font-list/nirmala-ui · https://support.apple.com/en-us/122869 (Tahoe) · https://support.apple.com/en-us/120414 (Sequoia) · https://support.apple.com/en-us/108939 (Sonoma) · https://support.apple.com/en-kw/101179 · https://support.apple.com/en-ng/101178 (all via search snippets only).
- OOXML rFonts: ECMA-376 Part 1 §17.3.2.26 (no reachable copy; https://webapp.docx4java.org/OnlineDemo/ecma376/WordML/rFonts.html is a mirror to check).
