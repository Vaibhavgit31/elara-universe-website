// Lighthouse (mobile) on the key pages: node scripts/lighthouse.mjs <label> [base]
// Writes docs/lighthouse/<label>/<page>.json (git-ignored, large) and summary.md with the scores.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const [label = 'run', base = 'http://localhost:3000'] = process.argv.slice(2)
const pages = { home: '/', catalog: '/catalog/', book: '/catalog/hindi-1/', contact: '/contact/' }
const dir = `docs/lighthouse/${label}`
mkdirSync(dir, { recursive: true })
const rows = []
for (const [name, path] of Object.entries(pages)) {
  const out = `${dir}/${name}.json`
  execFileSync(
    'npx',
    [
      'lighthouse',
      `${base}${path}`,
      '--output=json',
      `--output-path=${out}`,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      '--only-categories=performance,accessibility,best-practices,seo',
    ],
    { env: { ...process.env, CHROME_PATH: '/opt/pw-browsers/chromium' }, stdio: 'inherit' },
  )
  const { categories, audits } = JSON.parse(readFileSync(out, 'utf8'))
  const score = (c) => Math.round(categories[c].score * 100)
  rows.push({
    page: name,
    performance: score('performance'),
    accessibility: score('accessibility'),
    'best-practices': score('best-practices'),
    seo: score('seo'),
    LCP: audits['largest-contentful-paint'].displayValue,
    TBT: audits['total-blocking-time'].displayValue,
    CLS: audits['cumulative-layout-shift'].displayValue,
  })
}
console.table(rows)
const keys = Object.keys(rows[0])
const line = (cells) => `| ${cells.join(' | ')} |`
writeFileSync(
  `${dir}/summary.md`,
  [line(keys), line(keys.map(() => '---')), ...rows.map((r) => line(Object.values(r)))].join('\n') +
    '\n',
)
