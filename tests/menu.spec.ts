import { expect, test, type Page } from '@playwright/test'
import { open, padTop } from './helpers'

// Phase 2, Step B: the menu is reachable on every page of every flip pad without scrolling,
// page dots jump to any page, back-to-top returns, and PageDown/PageUp turn pages.
const padRoutes = ['/about/', '/events/', '/demo-flip/']
const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768

/** The element the visitor would hit when tapping the middle of `locator`. */
const hit = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const r = document.querySelector(sel)!.getBoundingClientRect()
    return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('header')
      ? 'header'
      : 'covered'
  }, selector)

for (const route of padRoutes)
  test(`the menu stays visible and clickable on every page of ${route}`, async ({ page }) => {
    await open(page, route)
    const top = await padTop(page)
    const starts = (await page.getByTestId('flip-pad').getAttribute('data-starts'))!
      .split(',')
      .map(Number)
    const control = isPhone(page)
      ? page.getByRole('button', { name: 'Open menu' })
      : page.getByRole('banner').getByRole('link', { name: 'Books' })
    const selector = isPhone(page)
      ? 'button[aria-label="Open menu"]'
      : '[data-testid="ribbons"] a[href="/catalog/"]'
    for (const [i, start] of starts.entries()) {
      await page.evaluate((y) => window.scrollTo(0, y), top + start)
      await expect(page.getByText(`Page ${i + 1} of ${starts.length}`)).toBeVisible({
        timeout: 10_000,
      })
      await expect(page.getByRole('banner')).toBeInViewport()
      await expect(control).toBeInViewport()
      expect(await hit(page, selector), `page ${i + 1}`).toBe('header')
    }
  })

test('page dots jump to any page, back-to-top returns, and the keys turn pages', async ({
  page,
}) => {
  await open(page, '/about/')
  await padTop(page)
  const dots = page.getByTestId('page-dots')
  await expect(dots.getByRole('button')).toHaveCount(4)
  await dots.getByRole('button', { name: 'Page 3 of 4' }).click()
  await expect(page.getByText('Page 3 of 4')).toBeVisible({ timeout: 10_000 })
  await expect(dots.getByRole('button', { name: 'Page 3 of 4' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await page.getByRole('button', { name: 'Back to top' }).first().click()
  await expect(page.getByText('Page 1 of 4')).toBeVisible({ timeout: 10_000 })
  await page.keyboard.press('PageDown')
  await expect(page.getByText('Page 2 of 4')).toBeVisible({ timeout: 10_000 })
  await page.keyboard.press('ArrowRight')
  await expect(page.getByText('Page 3 of 4')).toBeVisible({ timeout: 10_000 })
  await page.keyboard.press('PageUp')
  await expect(page.getByText('Page 2 of 4')).toBeVisible({ timeout: 10_000 })
})

test('typing in the contact form never turns a page', async ({ page }) => {
  await open(page, '/contact/')
  const name = page.getByLabel('Your name')
  await name.fill('A')
  await name.press('ArrowRight')
  await expect(page).toHaveURL(/\/contact\/$/)
  await expect(name).toBeFocused()
})
