import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

test('catalog shows 24 books on three shelves', async ({ page }) => {
  await open(page, '/catalog/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Find a book by subject and class',
  )
  await expect(page.getByTestId('book-card')).toHaveCount(24)
  await expect(page.getByText('24 of 24 books')).toBeVisible()
  for (const shelf of ['Basic Hindi Reader', 'TechNova', 'Art Journey'])
    await expect(page.getByRole('heading', { level: 2, name: new RegExp(shelf) })).toBeVisible()
  await expect(page.getByText('MRP ₹240')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Request a sample copy' }).first()).toHaveAttribute(
    'href',
    /\/contact\/\?book=/,
  )
  await expectNoHorizontalScroll(page)
})

test('filters are saved in the URL and restored from it', async ({ page }) => {
  await open(page, '/catalog/')
  await page.getByRole('button', { name: 'Hindi', exact: true }).click()
  await expect(page).toHaveURL(/\?subject=hindi$/)
  await expect(page.getByTestId('book-card')).toHaveCount(8)
  await page.getByRole('button', { name: '3', exact: true }).click()
  await expect(page).toHaveURL(/\?subject=hindi&class=3$/)
  await expect(page.getByTestId('book-card')).toHaveCount(1)
  await expect(page.getByText('1 of 24 books')).toBeVisible()

  await open(page, '/catalog/?subject=computer&class=5')
  await expect(page.getByTestId('book-card')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'TechNova Class 5: peek inside' })).toHaveAttribute(
    'href',
    '/catalog/technova-5/',
  )
  await expect(page.getByRole('button', { name: 'Computer' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('an impossible filter shows the empty shelf', async ({ page }) => {
  await open(page, '/catalog/?subject=drawing&class=3')
  await expect(page.getByTestId('book-card')).toHaveCount(1)
  await open(page, '/catalog/?class=9')
  await expect(page.getByTestId('book-card')).toHaveCount(24)
})

test('phones show two covers per shelf row', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'phone only')
  await open(page, '/catalog/')
  const cards = page.getByTestId('book-card')
  const [a, b, c] = await Promise.all([0, 1, 2].map((i) => cards.nth(i).boundingBox()))
  expect(a!.y).toBe(b!.y)
  expect(c!.y).toBeGreaterThan(a!.y)
})

test('book pages exist for every slug', async ({ page }) => {
  await open(page, '/catalog/hindi-1/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Basic Hindi Reader Class 1')
  await open(page, '/catalog/art-journey-8/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Art Journey Class 8')
  const missing = await page.goto('/catalog/nope/')
  expect(missing?.status()).toBe(404)
})
