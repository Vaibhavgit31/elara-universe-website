import { expect, test } from '@playwright/test'
import { series } from '../content/series'
import { expectNoHorizontalScroll, open } from './helpers'

const message =
  'Scanned a QR code from your book? Your learning corner is being set up. Check back soon!'

test('QR Corner shows the friendly placeholder and a way home', async ({ page }) => {
  await open(page, '/resources/')
  await expect(page.getByRole('heading', { level: 1, name: 'Your learning corner' })).toBeVisible()
  await expect(page.getByText(message)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to the home page' })).toHaveAttribute(
    'href',
    '/',
  )
  await expectNoHorizontalScroll(page)
})

test('book addresses show the series and class on the same placeholder', async ({ page }) => {
  await open(page, '/resources/technova/3/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/TechNova\s*Class 3/)
  await expect(page.getByText(message)).toBeVisible()
  await expect(page.getByRole('link', { name: 'See the TechNova books' })).toHaveAttribute(
    'href',
    '/catalog/?subject=computer',
  )
  // Report-card badges name the class and the subject.
  await expect(page.locator('dl').filter({ hasText: 'Class' })).toContainText('3')
  await expect(page.locator('dl').filter({ hasText: 'Subject' })).toContainText('Computer')
  await open(page, '/resources/hindi/1/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /Basic Hindi Reader\s*Class 1/,
  )
  await expect(page.getByText('बेसिक हिंदी रीडर')).toBeVisible()
})

test('all 24 QR addresses are built and unknown ones are 404', async ({ request }) => {
  for (const s of series)
    for (let cls = 1; cls <= 8; cls++) {
      const res = await request.get(`/resources/${s.id}/${cls}/`)
      expect(res.status(), `${s.id}/${cls}`).toBe(200)
    }
  expect((await request.get('/resources/maths/1/')).status()).toBe(404)
  expect((await request.get('/resources/hindi/9/')).status()).toBe(404)
})
