import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, open, padTop } from './helpers'

test('about is a four-chapter book with the founders and placeholders marked', async ({ page }) => {
  await open(page, '/about/')
  await expect(page.getByRole('heading', { level: 1, name: 'About Us' })).toBeVisible()
  await expect(page.getByRole('region', { name: /Page \d of 4/ })).toHaveCount(4)
  for (const title of ['Our story', 'What we believe', 'Meet the founders', 'How a book is made'])
    await expect(page.getByRole('heading', { level: 2, name: title })).toBeAttached()
  for (const n of [1, 2, 3, 4])
    await expect(page.getByText(`Chapter ${n}`, { exact: true })).toBeAttached()
  await expect(page.getByTestId('step-drawing')).toHaveCount(4)
  for (const name of ['Sunil Sharma', 'Tausif Khan'])
    await expect(page.getByRole('heading', { level: 3, name })).toBeAttached()
  await expect(page.getByText('Co-founder', { exact: true })).toHaveCount(4)
  await expect(page.getByText(/\[PLACEHOLDER\] A short bio/)).toHaveCount(2)
  await expect(page.getByRole('img', { name: /illustrated avatar/ })).toHaveCount(2)
  await expect(page.getByText('Including students in non-Hindi-speaking regions.')).toBeAttached()
  await expectNoHorizontalScroll(page)
})

test('the four making-of steps draw themselves in when their page is read', async ({ page }, {
  project,
}) => {
  await open(page, '/about/')
  const firstStroke = page.getByTestId('step-drawing').first().locator('path').first()
  if (project.name === 'reduced-motion') {
    await expect(firstStroke).toHaveCSS('opacity', '1')
    return
  }
  await expect(firstStroke).toHaveCSS('opacity', '0')
  const top = await padTop(page)
  const padHeight = await page
    .getByTestId('flip-pad')
    .evaluate((el) => (el as HTMLElement).offsetHeight)
  await page.evaluate((y) => window.scrollTo(0, y), top + padHeight - page.viewportSize()!.height)
  await expect(page.getByText('Page 4 of 4')).toBeVisible()
  await expect(firstStroke).toHaveCSS('opacity', '1')
  await expect(page.getByRole('heading', { level: 3, name: 'Add digital support' })).toBeVisible()
})
