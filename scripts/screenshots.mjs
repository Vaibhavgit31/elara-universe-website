// Phase-gate screenshots: node scripts/screenshots.mjs <phase> <route> [route...]
// Saves docs/screenshots/<phase>/<route>-{360,768,1024,1440,reduced-motion}.png from http://localhost:3000.
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

const browser = await chromium.launch()
for (const route of routes) {
  const slug = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/[/?=&]/g, '-')
  for (const { name, ...options } of shots) {
    const page = await browser.newPage({ ...options, deviceScaleFactor: 1 })
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${dir}/${slug}-${name}.png`, fullPage: true })
    await page.close()
    console.log(`${dir}/${slug}-${name}.png`)
  }
}
await browser.close()
