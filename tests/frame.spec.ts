import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768

test('header, menu, footer and WhatsApp button are on every page', async ({ page }) => {
  await page.goto('/styleguide/')
  await expect(page.getByRole('link', { name: 'Elara Universe home' })).toBeVisible()
  const menu = page.getByRole('navigation', { name: 'Main' }).filter({ visible: true })
  await expect(menu.getByRole('link')).toHaveCount(6)
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
  await page.goto('/catalog/')
  const ribbons = page.locator('header nav')
  const bar = page.getByTestId('bottom-bar')
  await expect(isPhone(page) ? bar : ribbons).toBeVisible()
  await expect(isPhone(page) ? ribbons : bar).toBeHidden()
  await expect(page.locator('[aria-current="page"]').filter({ visible: true })).toHaveText(
    /Catalog/,
  )
})

test('clicking a menu item turns the page', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Main' })
    .filter({ visible: true })
    .getByRole('link', { name: /About/ })
    .click()
  await expect(page).toHaveURL(/\/about\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'About Us' })).toBeVisible()
})

test('phone bottom bar hides on scroll down and returns on scroll up', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only')
  await page.goto('/styleguide/')
  const bar = page.getByTestId('bottom-bar')
  await expect(bar).toBeInViewport()
  await page.mouse.wheel(0, 900)
  await expect(bar).not.toBeInViewport()
  await page.mouse.wheel(0, -300)
  await expect(bar).toBeInViewport()
})

test('skip link jumps to the main content', async ({ page }) => {
  await page.goto('/')
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
