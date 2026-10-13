import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

test('a book page shows cover, flipbook, lists, details, buttons and series shelf', async ({
  page,
}) => {
  await open(page, '/catalog/hindi-1/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Basic Hindi Reader Class 1')
  await expect(page.getByTestId('tilt-cover').getByRole('img', { name: /cover/ })).toBeVisible()
  await expect(page.getByTestId('flipbook').getByText('1 / 8')).toBeVisible()
  await expect(page.getByRole('row', { name: /MRP MRP ₹240/ })).toBeVisible()
  await expect(page.getByRole('row', { name: /Pages 72/ })).toBeVisible()
  await expect(page.getByRole('row', { name: /ISBN/ })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Request a sample copy' }).first()).toHaveAttribute(
    'href',
    '/contact/?book=hindi-1',
  )
  await expect(page.getByRole('link', { name: 'Ask on WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me\/919625741192\?text=.*Basic%20Hindi%20Reader%20Class%201/,
  )
  await expect(page.getByRole('heading', { name: 'More from this series' })).toBeVisible()
  await expect(page.getByTestId('book-card')).toHaveCount(7)
  await expectNoHorizontalScroll(page)
})

test('TechNova pages list the twelve features, the ISBN of book 1 and no samples yet', async ({
  page,
}) => {
  await open(page, '/catalog/technova-1/')
  await expect(page.getByRole('heading', { name: "What's inside" })).toBeVisible()
  await expect(page.getByText('Higher Ordered Thinking')).toBeVisible()
  await expect(page.getByRole('row', { name: /ISBN 978-93-93258-70-0/ })).toBeVisible()
  await expect(page.getByText('Sample pages coming soon.')).toBeVisible()
  await expect(page.getByRole('row', { name: /MRP/ })).toHaveCount(0)
})

test('Book structured data and page title are present', async ({ page }) => {
  await open(page, '/catalog/technova-3/')
  await expect(page).toHaveTitle(/TechNova Class 3/)
  const json = await page.locator('script[type="application/ld+json"]').textContent()
  expect(JSON.parse(json!)).toMatchObject({
    '@type': 'Book',
    name: 'TechNova Class 3',
    publisher: { name: 'Elara Universe Publishers Private Limited' },
  })
})

test('the flipbook turns with buttons and keys and the sound toggle is off by default', async ({
  page,
}) => {
  await open(page, '/catalog/hindi-3/')
  const flipbook = page.getByTestId('flipbook')
  await expect(flipbook).toHaveAttribute('data-ready', 'true')
  await expect(flipbook.getByText('1 / 8')).toBeVisible()
  await flipbook.getByRole('button', { name: 'Next page' }).click()
  await expect(flipbook.getByText(/^[23] \/ 8$/)).toBeVisible()
  await flipbook.getByRole('button', { name: 'Previous page' }).click()
  await expect(flipbook.getByText('1 / 8')).toBeVisible()
  await flipbook.getByLabel(/sample pages/).focus()
  await page.keyboard.press('ArrowRight')
  await expect(flipbook.getByText(/^[23] \/ 8$/)).toBeVisible()
  const sound = flipbook.getByRole('button', { name: 'Page-turn sound' })
  await expect(sound).toHaveAttribute('aria-pressed', 'false')
  await sound.click()
  await expect(sound).toHaveAttribute('aria-pressed', 'true')
})

test('the cover tilts towards the mouse on desktop', async ({ page }, { project }) => {
  test.skip(project.name !== 'desktop', 'mouse tilt is desktop only')
  await open(page, '/catalog/technova-5/')
  const cover = page.getByTestId('tilt-cover').locator('> div')
  const box = (await cover.boundingBox())!
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1)
  await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.05)
  await expect(cover).toHaveCSS('transform', /matrix3d/)
})
