import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

const scrollTo = (page: Page, y: number) => page.evaluate((v) => window.scrollTo(0, v), y)
/** Waits until the pad has measured its pages (it grows beyond one screen), then returns its top. */
async function padTop(page: Page) {
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="flip-pad"]') as HTMLElement
    return el.offsetHeight > window.innerHeight * 2
  })
  return page.evaluate(() => {
    const el = document.querySelector('[data-testid="flip-pad"]') as HTMLElement
    return el.getBoundingClientRect().top + window.scrollY
  })
}

test('demo pad shows five pages and a page counter', async ({ page }) => {
  await page.goto('/demo-flip/')
  await expect(page.getByRole('heading', { level: 1, name: 'The flip-pad scroll' })).toBeVisible()
  await expect(page.getByText('Page 1 of 5').first()).toBeVisible()
  await expect(page.getByRole('region', { name: /Page \d of 5/ })).toHaveCount(5)
  await expectNoHorizontalScroll(page)
})

test('scrolling lifts the first page in 3D and advances the counter', async ({ page }, {
  project,
}) => {
  test.skip(project.name === 'reduced-motion', 'no 3D with reduced motion')
  await page.goto('/demo-flip/')
  const first = page.getByRole('region', { name: 'Page 1 of 5' })
  await expect(first).toHaveCSS('transform', 'none')
  const top = await padTop(page)
  const height = page.viewportSize()!.height
  await scrollTo(page, top + height * 0.4)
  await expect(first).toHaveCSS('transform', /matrix3d/)
  await expect(page.getByText('Page 1 of 5')).toBeVisible()
  await scrollTo(page, top + height * 0.8)
  await expect(page.getByText('Page 2 of 5')).toBeVisible()
  await scrollTo(page, top + height * 1.05)
  await expect(first).toBeHidden()
  await scrollTo(page, top + height * 0.4)
  await expect(page.getByText('Page 1 of 5')).toBeVisible()
  await expect(first).toBeVisible()
})

test('the long page scrolls inside before it flips', async ({ page }, { project }) => {
  test.skip(project.name === 'reduced-motion', 'no 3D with reduced motion')
  await page.goto('/demo-flip/')
  const second = page.getByRole('region', { name: 'Page 2 of 5' })
  const top = await padTop(page)
  const height = page.viewportSize()!.height
  // Page 1 is short, so page 2 starts one screen in; scroll halfway through its inner scroll.
  const inner = await second
    .locator('> div')
    .first()
    .evaluate((el) => (el as HTMLElement).offsetHeight - window.innerHeight)
  expect(inner).toBeGreaterThan(200)
  await scrollTo(page, top + height + inner / 2)
  await expect(page.getByText('Page 2 of 5')).toBeVisible()
  await expect(second).toHaveCSS('transform', 'none')
  await expect(second.getByText('…and only now does it flip.')).not.toBeInViewport()
  const padHeight = await page.evaluate(
    () => (document.querySelector('[data-testid="flip-pad"]') as HTMLElement).offsetHeight,
  )
  await scrollTo(page, top + padHeight - height)
  await expect(page.getByText('Page 5 of 5')).toBeVisible()
})

test('reduced motion stacks the pages without 3D', async ({ page }, { project }) => {
  test.skip(project.name !== 'reduced-motion', 'reduced motion only')
  await page.goto('/demo-flip/')
  for (const region of await page.getByRole('region', { name: /Page \d of 5/ }).all())
    await expect(region).toHaveCSS('transform', 'none')
  const stacked = await page.evaluate(
    () => document.documentElement.scrollHeight > window.innerHeight * 4,
  )
  expect(stacked).toBe(true)
})
