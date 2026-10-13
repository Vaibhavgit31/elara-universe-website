// Prepares every image in public/ from the originals in _source-assets/ (which are never modified).
// Usage: IMG_TMP=<scratch dir> node scripts/prepare-images.mjs
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import sharp from 'sharp'

const SRC = '_source-assets'
const TMP = process.env.IMG_TMP ?? `${tmpdir()}/elara-images`
const CREAM = '#F5F0E8'
const DPI = 150
const inch = (n) => Math.round(n * DPI)

for (const dir of [
  'public/brand',
  'public/books/samples/hindi-1',
  'public/books/samples/hindi-3',
  TMP,
])
  await mkdir(dir, { recursive: true })

/** Rasterises one PDF page with pdftoppm (cached in TMP) and returns the PNG path. */
function pdfPage(pdf, page, dpi = DPI) {
  const out = `${TMP}/${pdf.split('/').pop()}-${page}-${dpi}`
  if (!existsSync(`${out}.png`))
    execFileSync('pdftoppm', [
      '-r',
      `${dpi}`,
      '-f',
      `${page}`,
      '-l',
      `${page}`,
      '-png',
      '-singlefile',
      pdf,
      out,
    ])
  return `${out}.png`
}

/** Saves <name>.webp (1000 px tall) and <name>-thumb.webp (400 px tall), optionally cropping first. */
async function cover(input, name, extract) {
  const base = extract ? sharp(input).extract(extract) : sharp(input)
  await base
    .clone()
    .resize({ height: 1000 })
    .webp({ quality: 82 })
    .toFile(`public/books/${name}.webp`)
  await base
    .clone()
    .resize({ height: 400 })
    .webp({ quality: 80 })
    .toFile(`public/books/${name}-thumb.webp`)
}

// ---- TechNova: 8 wraparound pages, 18×12 in each: back cover | spine | front cover.
// Measured on 100 dpi renders: artwork is centred, each cover is 8.75×11.25 in including a 0.125 in
// bleed, the spine sits at the centre. The trimmed 8.5×11 in front cover starts 9.175 in from the left.
const technova = `${SRC}/books/computer/Computer_Book_Covers_2.pdf`
const coverBox = (left) => ({
  left: inch(left),
  top: inch(0.495),
  width: inch(8.5),
  height: inch(11),
})
for (let n = 1; n <= 8; n++) await cover(pdfPage(technova, n), `technova-${n}`, coverBox(9.175))
await cover(pdfPage(technova, 1), 'technova-back', coverBox(0.325))

// ---- Basic Hindi Reader: page 1 = front cover; chosen colourful inside pages become flipbook samples.
const hindiSamples = { 1: [6, 9, 17, 18, 23, 28, 34, 68], 3: [8, 9, 10, 12, 19, 27, 59, 76] }
for (const [cls, pages] of Object.entries(hindiSamples)) {
  const pdf = `${SRC}/books/hindi/Hindi_Book-${cls}_2.pdf`
  await cover(pdfPage(pdf, 1), `hindi-${cls}`)
  for (const [i, p] of pages.entries())
    await sharp(pdfPage(pdf, p, 110))
      .resize({ height: 1200 })
      .webp({ quality: 78 })
      .toFile(`public/books/samples/hindi-${cls}/${String(i + 1).padStart(2, '0')}.webp`)
}

// ---- Logo: paths 0–8 of the official SVG draw the lotus-and-book mark (x 439–763, y 118–338),
// paths 9–22 the "ELARA UNIVERSE" wordmark (x 104–1100, y 391–454).
const logoFile = `${SRC}/logo/elara-universe-logo-transparent.svg`
await copyFile(logoFile, 'public/brand/logo-full.svg')
const paths = [
  ...(await readFile(logoFile, 'utf8')).matchAll(/<path d="([^"]*)" fill="([^"]+)"/g),
].map(([, d, fill]) => (d ? `<path d="${d}" fill="${fill}"/>` : ''))
const svg = (attrs, body) => `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${body}</svg>`
const mark = paths.slice(0, 9).join('')
const wordmark = paths.slice(9, 23).join('')
await writeFile('public/brand/mark.svg', svg('viewBox="439 118 324 220"', mark))
await writeFile(
  'public/brand/logo-horizontal.svg',
  svg(
    'viewBox="0 0 1874 220"',
    `<g transform="translate(-439 -118)">${mark}</g><g transform="translate(380 63) scale(1.5) translate(-104 -391)">${wordmark}</g>`,
  ),
)

// Favicon and app icons: the mark only, on cream.
const markOnCream = Buffer.from(
  svg(
    'width="512" height="512" viewBox="419 46 364 364"',
    `<rect x="419" y="46" width="364" height="364" fill="${CREAM}"/>${mark}`,
  ),
)
const icons = [
  [16, 'public/brand/icon-16.png'],
  [32, 'public/brand/icon-32.png'],
  [32, 'app/icon.png'],
  [180, 'app/apple-icon.png'],
  [192, 'public/brand/icon-192.png'],
  [512, 'public/brand/icon-512.png'],
]
for (const [size, file] of icons) await sharp(markOnCream).resize(size, size).png().toFile(file)
execFileSync('convert', ['public/brand/icon-16.png', 'public/brand/icon-32.png', 'app/favicon.ico'])

// 1200×630 link preview: the full logo centred on cream.
const logoPng = await sharp(await readFile(logoFile))
  .resize({ width: 860 })
  .png()
  .toBuffer()
await sharp({ create: { width: 1200, height: 630, channels: 3, background: CREAM } })
  .composite([{ input: logoPng }])
  .png()
  .toFile('app/opengraph-image.png')

// ---- Art Journey: no files yet, so 8 illustrated placeholder covers (coral + cream).
const accents = [
  '#8A9A74',
  '#4A90C2',
  '#B68235',
  '#E8A53A',
  '#3F5645',
  '#8A6122',
  '#8A9A74',
  '#4A90C2',
]
const crayon = (x, y, rot, fill) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-22" y="-120" width="44" height="240" rx="12" fill="${fill}"/><path d="M-22 -120 L0 -165 L22 -120Z" fill="${fill}"/><rect x="-22" y="-40" width="44" height="26" fill="${CREAM}" opacity=".55"/></g>`
const artCover = (n) =>
  svg(
    'viewBox="0 0 850 1100"',
    `<rect width="850" height="1100" fill="${CREAM}"/>` +
      `<path d="M120 190c40-90 150-130 260-100 70 20 110-40 190-30 110 15 160 120 120 210-30 70 30 130-20 200-60 85-200 60-280 40-90-22-170 40-240-10-80-60-70-220-30-310z" fill="#E07A5F" opacity=".92"/>` +
      `<circle cx="640" cy="560" r="150" fill="${accents[n - 1]}" opacity=".35"/>` +
      crayon(250, 660, -28, '#E07A5F') +
      crayon(360, 700, -10, accents[n - 1]) +
      crayon(470, 690, 12, '#8A9A74') +
      crayon(575, 650, 30, '#B68235') +
      `<text x="425" y="210" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="700" fill="${CREAM}">Art Journey</text>` +
      `<text x="425" y="270" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="30" letter-spacing="6" fill="${CREAM}">DRAWING</text>` +
      `<circle cx="425" cy="900" r="86" fill="#1B241D"/>` +
      `<text x="425" y="930" text-anchor="middle" font-family="Georgia, serif" font-size="90" font-weight="700" fill="${CREAM}">${n}</text>` +
      `<text x="425" y="1020" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="30" fill="#3F5645">Class ${n}</text>` +
      `<text x="425" y="1070" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="20" fill="#8A6122">PLACEHOLDER COVER · ARTWORK COMING SOON</text>`,
  )
for (let n = 1; n <= 8; n++) await writeFile(`public/books/art-journey-${n}.svg`, artCover(n))

console.log('images ready')
