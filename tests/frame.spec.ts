import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768

test('header, menu, footer and WhatsApp button are on every page', async ({ page }) => {
  await open(page, '/styleguide/')
  await expect(page.getByRole('link', { name: 'Elara Universe home' })).toBeVisible()
  const menu = page.getByRole('navigation', { name: 'Main' }).filter({ visible: true })
  await expect(menu.getByRole('link')).toHaveCount(7)
  await expect(page.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me\/919625741192/,
  )
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByText('Registered office')).toBeVisible()
  await expect(footer.getByText('Sector 3, Noida, Gautam Buddha Nagar')).toBeVisible()
  await expect(footer.getByText('Raj Nagar Extension, Ghaziabad')).toBeVisible()
  await expect(footer.getByRole('link', { name: '+91 96257 41192' })).toBeVisible()
  await expect(
    footer.getByRole('link', { name: 'info@elarauniversepublications.com' }),
  ).toBeVisible()
  await expect(footer.getByText(/© \d{4} Elara Universe Publishers Private Limited/)).toBeVisible()
  await expectNoHorizontalScroll(page)
})

test('the current page is marked in the menu and ribbons swap with the bottom bar on phones', async ({
  page,
}) => {
  await open(page, '/catalog/')
  const ribbons = page.getByTestId('ribbons')
  const bar = page.getByTestId('bottom-bar')
  await expect(isPhone(page) ? bar : ribbons).toBeVisible()
  await expect(isPhone(page) ? ribbons : bar).toBeHidden()
  await expect(page.locator('[aria-current="page"]').filter({ visible: true })).toHaveText(/Books/)
})

test('clicking a menu item turns the page', async ({ page }) => {
  await open(page, '/')
  await page
    .getByRole('navigation', { name: 'Main' })
    .filter({ visible: true })
    .getByRole('link', { name: /About/ })
    .click()
  await expect(page).toHaveURL(/\/about\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'About Us' })).toBeVisible()
})

test('phone bottom bar stays put while scrolling', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only')
  await open(page, '/styleguide/')
  const bar = page.getByTestId('bottom-bar')
  await expect(bar).toBeInViewport()
  await page.mouse.wheel(0, 900)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300)
  await expect(bar).toBeInViewport()
})

test('the glass top bar is fixed, stays visible and shrinks after scrolling', async ({ page }) => {
  await open(page, '/styleguide/')
  const bar = page.getByRole('banner')
  await expect(bar).toHaveCSS('position', 'fixed')
  await expect(bar).toHaveAttribute('data-scrolled', 'false')
  const tall = (await bar.boundingBox())!.height
  await page.mouse.wheel(0, 1200)
  await expect(bar).toHaveAttribute('data-scrolled', 'true')
  await expect(bar).toBeInViewport()
  await expect.poll(async () => (await bar.boundingBox())!.height).toBeLessThan(tall)
  await expect(page.getByRole('link', { name: 'Elara Universe home' })).toBeInViewport()
})

test('the phone menu button opens a glass sheet with every link and the teacher login', async ({
  page,
}) => {
  test.skip(!isPhone(page), 'phone only')
  await open(page, '/catalog/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const sheet = page.getByRole('dialog', { name: 'Menu' })
  await expect(sheet.getByRole('link')).toHaveCount(8)
  await expect(sheet.getByRole('link', { name: 'Teacher login' })).toBeVisible()
  await sheet.getByRole('link', { name: 'Events' }).click()
  await expect(page).toHaveURL(/\/events\/$/)
  await expect(sheet).toBeHidden()
})

test('"Teacher login" sits in the top bar on laptops', async ({ page }) => {
  test.skip(isPhone(page), 'laptop only')
  await open(page, '/')
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'Teacher login' }).first(),
  ).toBeVisible()
})

test('skip link jumps to the main content', async ({ page }) => {
  await open(page, '/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await skip.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('missing pages show the 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/')
  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { name: 'This page is missing from the book' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to the cover' })).toBeVisible()
})
