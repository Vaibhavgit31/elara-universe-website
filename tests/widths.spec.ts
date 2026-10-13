import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

// PLAYBOOK launch checklist: the four layout widths. 360, 768 and 1440 are also Playwright projects;
// 1024 is covered only here.
const widths = [360, 768, 1024, 1440]
const routes = [
  '/',
  '/catalog/',
  '/catalog/technova-2/',
  '/about/',
  '/events/',
  '/contact/',
  '/resources/',
]

test.beforeEach(({}, { project }) => {
  test.skip(project.name !== 'desktop', 'widths are set per test')
})

for (const width of widths)
  test(`every page fits ${width}px wide without sideways scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of routes) {
      await open(page, route)
      await expect(page.getByRole('banner')).toBeVisible()
      await expect(page.locator('h1').first()).toBeVisible()
      await expectNoHorizontalScroll(page)
    }
  })
