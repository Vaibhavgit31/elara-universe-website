// Phase-gate screenshots: node scripts/screenshots.mjs <phase> <route> [route...]
// Saves docs/screenshots/<phase>/<route>-{360,768,1024,1440,reduced-motion}.png from http://localhost:3000.
// SIZES="360,1440" takes only those widths.
// Signed-in pages: LOGIN="email:password" signs in once through /login first (mock-mode demo
// accounts, see lib/data/memory-store.ts); SUFFIX="-signed-in" is added to the file names.
import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const [phase, ...routes] = process.argv.slice(2)
if (!phase || routes.length === 0) throw new Error('usage: screenshots.mjs <phase> <route...>')
const base = process.env.BASE_URL ?? 'http://localhost:3000'
const dir = `docs/screenshots/${phase}`
await mkdir(dir, { recursive: true })

const shots = [
  { name: '360', viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true },
  { name: '768', viewport: { width: 768, height: 1024 }, hasTouch: true },
  { name: '1024', viewport: { width: 1024, height: 768 } },
  { name: '1440', viewport: { width: 1440, height: 900 } },
  { name: 'reduced-motion', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
]

// SIZES="360,1440" limits the run to those shots (the final before/after set uses two).
const wanted = process.env.SIZES?.split(',')
const sizes = wanted ? shots.filter((s) => wanted.includes(s.name)) : shots
const browser = await chromium.launch()
const suffix = process.env.SUFFIX ?? ''
let storageState
if (process.env.LOGIN) {
  const [email, ...rest] = process.env.LOGIN.split(':')
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${base}/login/`)
  const form = page.getByRole('form', { name: 'Sign in' })
  await form.getByLabel('Email').fill(email)
  await form.getByLabel('Password').fill(rest.join(':'))
  await form.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(/\/web-support\//)
  storageState = await context.storageState()
  await context.close()
}
for (const route of routes) {
  const slug = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/[/?=&]/g, '-')
  for (const { name, ...options } of sizes) {
    const page = await browser.newPage({ ...options, deviceScaleFactor: 1, storageState })
    await page.goto(base + route, { waitUntil: 'networkidle' })
    // Walk down the page so rooms open and lazy parts load, then back to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) {
        scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      scrollTo(0, 0)
    })
    // A full-page capture does not scroll, so sections with `content-visibility: auto` (home
    // rooms, footer) would stay unpainted below the first screen; visitors never see that.
    await page.addStyleTag({ content: '* { content-visibility: visible !important; }' })
    await page.waitForTimeout(1200)
    const file = `${dir}/${slug}${suffix}-${name}.png`
    await page.screenshot({ path: file, fullPage: true })
    await page.close()
    console.log(file)
  }
}
await browser.close()
