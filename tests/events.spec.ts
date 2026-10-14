import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

test('upcoming events are pinned tickets sorted by date, past ones a scrapbook', async ({
  page,
}) => {
  await open(page, '/events/')
  await expect(page.getByRole('heading', { level: 1, name: 'Events' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Upcoming' })).toBeVisible()
  const tickets = page.getByTestId('upcoming').getByRole('article')
  await expect(tickets).toHaveCount(2)
  await expect(tickets.first()).toContainText('Basic Hindi Reader launch')
  await expect(tickets.first().getByText('Book launch')).toBeVisible()
  const dates = await tickets
    .locator('time')
    .evaluateAll((els) => els.map((el) => el.getAttribute('datetime')))
  expect(dates).toEqual([...dates].sort())
  const register = tickets.nth(1).getByRole('link', { name: 'Register' })
  await expect(register).toHaveAttribute('href', /example\.com/)
  await expect(register).toHaveAttribute('target', '_blank')
  await expect(page.getByText('Sample', { exact: true })).toHaveCount(3)
  await expect(page.getByRole('region', { name: 'Page 2 of 2' })).toBeAttached()
  await expect(page.getByRole('heading', { level: 2, name: 'Past events' })).toBeAttached()
  await expect(page.getByRole('button', { name: /Open photo: Book fair stall/ })).toBeAttached()
  await expectNoHorizontalScroll(page)
})

test('the scrapbook lightbox opens and closes', async ({ page }, { project }) => {
  test.skip(project.name !== 'reduced-motion', 'pages are in normal flow only with reduced motion')
  await open(page, '/events/')
  await expect(page.getByRole('region', { name: 'Page 2 of 2' })).toHaveCSS('position', 'relative')
  // With reduced motion the tickets hang still on their pins.
  await expect(page.getByTestId('upcoming').getByRole('article').first()).toHaveCSS(
    'transform',
    'none',
  )
  const photo = page.getByRole('button', { name: /Open photo: Book fair stall/ })
  await photo.scrollIntoViewIfNeeded()
  await photo.click()
  const dialog = page.getByRole('dialog', { name: /Book fair stall/ })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/Delhi NCR/)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})
