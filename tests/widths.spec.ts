import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, open, padTop } from './helpers'

// Phase 2, Step A: one layout container on every page at every laptop size and zoom level.
// Laptop sizes and phones/tablets; zoom is emulated as a smaller CSS viewport at a higher DPR.
const sizes = [
  { w: 360, h: 740 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1280, h: 720 },
  { w: 1366, h: 768 },
  { w: 1440, h: 900 },
  { w: 1536, h: 864 },
  { w: 1920, h: 1080 },
  { w: 2560, h: 1440 },
  { w: 1600, h: 1000, dpr: 0.9, label: '1440×900 at 90%' },
  { w: 1309, h: 818, dpr: 1.1, label: '1440×900 at 110%' },
  { w: 1152, h: 720, dpr: 1.25, label: '1440×900 at 125%' },
  { w: 1093, h: 614, dpr: 1.25, label: '1366×768 at 125%' },
]
const routes = [
  '/',
  '/catalog/',
  '/catalog/technova-2/',
  '/about/',
  '/events/',
  '/contact/',
  '/resources/',
  '/resources/hindi/1/',
  '/styleguide/',
  '/missing-page/',
]

/** Visible, non-decorative elements that poke past the viewport, as "tag.class(left,right)". */
const outsideViewport = (page: Page) =>
  page.evaluate(() => {
    const out: string[] = []
    const scrolls = (el: HTMLElement) =>
      /auto|scroll/.test(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth
    for (const el of document.querySelectorAll<HTMLElement>('body *')) {
      if (el.closest('[aria-hidden="true"], dialog, [data-testid="flip-pad"] section')) continue
      // Content inside a horizontally scrollable wrapper (a wide table) is reachable, not cut off.
      let parent = el.parentElement
      while (parent && parent !== document.body && !scrolls(parent)) parent = parent.parentElement
      if (parent && parent !== document.body) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.left < -1 || r.right > innerWidth + 1)
        out.push(
          `${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 40)}(${Math.round(r.left)},${Math.round(r.right)})`,
        )
    }
    return out.slice(0, 5)
  })

/** Left text edge of the header vs the page's own container, and the gutters either side. */
const edges = (page: Page) =>
  page.evaluate(() => {
    const padded = (el: Element) =>
      el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)
    const header = document.querySelector('header > div')!
    const content = [...document.querySelectorAll('main .container-page')].find(
      (e) => e.getBoundingClientRect().width > 0,
    )!
    const h = header.getBoundingClientRect()
    return {
      headerEdge: padded(header),
      contentEdge: padded(content),
      leftGutter: h.left,
      rightGutter: innerWidth - h.right,
    }
  })

const checks = async (page: Page, label: string) => {
  await expectNoHorizontalScroll(page)
  expect(await outsideViewport(page), `${label}: outside the viewport`).toEqual([])
  const e = await edges(page)
  expect(
    Math.abs(e.headerEdge - e.contentEdge),
    `${label}: header vs content edge`,
  ).toBeLessThanOrEqual(2)
  expect(
    Math.abs(e.leftGutter - e.rightGutter),
    `${label}: left vs right margin`,
  ).toBeLessThanOrEqual(2)
}

for (const size of sizes) {
  const label = size.label ?? `${size.w}×${size.h}`
  test.describe(label, () => {
    test.use({ viewport: { width: size.w, height: size.h }, deviceScaleFactor: size.dpr ?? 1 })
    for (const route of routes)
      test(`${route} fits, aligns and keeps its margins`, async ({ page }, { project }) => {
        test.skip(project.name !== 'desktop', 'sizes are set per test')
        await open(page, route)
        await expect(page.getByRole('banner')).toBeVisible()
        await checks(page, `${route} ${label}`)
        // Flip pads: repeat at the rest position of every page.
        const pad = page.getByTestId('flip-pad')
        if (await pad.count()) {
          const top = await padTop(page)
          const starts = (await pad.getAttribute('data-starts'))!.split(',').map(Number)
          for (const [i, start] of starts.entries()) {
            await page.evaluate((y) => window.scrollTo(0, y), top + start)
            await expect(page.getByText(`Page ${i + 1} of ${starts.length}`)).toBeVisible()
            await checks(page, `${route} ${label} page ${i + 1}`)
          }
        }
      })
  })
}

test.describe('screenshot baselines', () => {
  for (const width of [1440, 360])
    for (const route of ['/', '/catalog/', '/catalog/hindi-1/', '/about/', '/events/', '/contact/'])
      test(`${route} at ${width}`, async ({ page }, { project }) => {
        test.skip(project.name !== 'reduced-motion', 'baselines are taken without motion')
        await page.setViewportSize({ width, height: width === 360 ? 740 : 900 })
        await open(page, route)
        if (route === '/') await page.getByRole('button', { name: 'Skip intro' }).click()
        await expect(page).toHaveScreenshot(
          `${route.replaceAll('/', '_') || 'home'}-${width}.png`,
          {
            maxDiffPixelRatio: 0.02,
            mask: [page.getByRole('status')],
          },
        )
      })
})
