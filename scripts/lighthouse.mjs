// Lighthouse (mobile) on the key pages: node scripts/lighthouse.mjs <label> [base] [page,page…]
// Writes docs/lighthouse/<label>/<page>.json (git-ignored, large) and summary.md with the scores.
// Phase 2 targets: Home ≥ 85 performance, every other page ≥ 90; accessibility and SEO ≥ 95.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const [label = 'run', base = 'http://localhost:3000', only] = process.argv.slice(2)
const all = {
  home: '/',
  catalog: '/catalog/',
  book: '/catalog/hindi-1/',
  about: '/about/',
  events: '/events/',
  contact: '/contact/',
  'qr-corner': '/resources/hindi/1/',
  'web-support': '/web-support/',
  help: '/web-support/help/',
  login: '/login/',
}
const pages = only
  ? Object.fromEntries(Object.entries(all).filter(([name]) => only.split(',').includes(name)))
  : all
const dir = `docs/lighthouse/${label}`
mkdirSync(dir, { recursive: true })
const rows = []
// Warm the server first: the first request to a dynamic route after a restart loads its code,
// which is a property of the server process, not of the page being measured.
for (const path of Object.values(pages)) await fetch(`${base}${path}`).catch(() => {})
// Lab scores move between identical runs, so each page is measured RUNS times and the run with
// the median performance score is reported (with every run's score alongside).
const RUNS = Number(process.env.RUNS ?? 3)
for (const [name, path] of Object.entries(pages)) {
  const runs = []
  for (let i = 1; i <= RUNS; i++) {
    const out = `${dir}/${name}${RUNS > 1 ? `-${i}` : ''}.json`
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
    runs.push(JSON.parse(readFileSync(out, 'utf8')))
  }
  const perf = (r) => r.categories.performance.score
  const { categories, audits } = [...runs].sort((a, b) => perf(a) - perf(b))[Math.floor(RUNS / 2)]
  const score = (c) => Math.round(categories[c].score * 100)
  rows.push({
    page: name,
    performance: score('performance'),
    runs: runs.map((r) => Math.round(perf(r) * 100)).join(' / '),
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
