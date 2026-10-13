import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

test('the cover opens by itself and shows the hero', async ({ page }) => {
  await page.goto('/')
  const cover = page.getByRole('button', { name: 'Open the book' })
  await expect(cover).toBeVisible()
  await expect(cover).toBeHidden({ timeout: 4000 })
  await expect(
    page.getByRole('heading', { level: 1, name: 'Books that grow curious minds.' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Explore the catalog' })).toHaveAttribute(
    'href',
    '/catalog/',
  )
  await expect(page.getByRole('link', { name: 'Request a sample copy' }).first()).toHaveAttribute(
    'href',
    '/contact/',
  )
  await expectNoHorizontalScroll(page)
})

test('tapping the cover opens it at once', async ({ page }, { project }) => {
  await page.goto('/')
  // With reduced motion the pad re-mounts as a stacked layout right after hydration.
  if (project.name === 'reduced-motion')
    await expect(page.getByRole('region', { name: 'Page 1 of 7' })).toHaveCSS(
      'position',
      'relative',
    )
  await page.getByRole('button', { name: 'Open the book' }).click()
  await expect(page.locator('[data-cover]')).toHaveAttribute('data-cover', 'open', { timeout: 800 })
  await expect(page.getByRole('button', { name: 'Open the book' })).toBeHidden()
})

test('home is a flip-pad of seven pages with the agreed content', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('region', { name: /Page \d of 7/ })).toHaveCount(7)
  for (const text of [
    'Basic Hindi Reader',
    'TechNova',
    'Art Journey',
    'Why schools choose Elara',
    'Every book has a QR door',
    'Bring Elara to your school',
  ])
    await expect(page.getByText(text).first()).toBeAttached()
  await expect(page.getByText('Test generator: coming soon')).toBeAttached()
  await expect(page.getByRole('link', { name: 'Visit QR Corner' })).toHaveAttribute(
    'href',
    '/resources/',
  )
  await expect(
    page.getByRole('link', { name: 'Basic Hindi Reader: see the books' }),
  ).toHaveAttribute('href', '/catalog/?subject=hindi')
  await expect(page.getByText('Sample', { exact: true })).toHaveCount(2)
  const backCover = page.getByRole('region', { name: 'Page 7 of 7' })
  await expect(backCover.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me\/919625741192/,
  )
})

test('the peek-inside flipbook turns pages (reduced motion layout)', async ({ page }, {
  project,
}) => {
  test.skip(project.name !== 'reduced-motion', 'pages are in normal flow only with reduced motion')
  await page.goto('/')
  // Wait for the reduced-motion layout (pages in normal flow) before touching the flipbook.
  await expect(page.getByRole('region', { name: 'Page 5 of 7' })).toHaveCSS('position', 'relative')
  const flipbook = page.getByTestId('flipbook')
  await flipbook.scrollIntoViewIfNeeded()
  await expect(flipbook.getByText('1 / 8')).toBeVisible()
  await flipbook.getByRole('button', { name: 'Next page' }).click()
  await expect(flipbook.getByText(/^[23] \/ 8$/)).toBeVisible()
})
