import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

test('styleguide shows every token, font, button and tag', async ({ page }) => {
  await page.goto('/styleguide/')
  await expect(page.getByRole('heading', { level: 1, name: 'The Living Book' })).toBeVisible()
  for (const token of [
    'paper',
    'cream',
    'mist',
    'sage-100',
    'sage',
    'forest',
    'evergreen',
    'brass',
    'gold-ink',
    'hindi',
    'computer',
    'drawing',
  ]) {
    await expect(page.getByText(token, { exact: true })).toBeVisible()
  }
  await expect(page.getByText('बेसिक हिंदी रीडर · अ आ क')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Peek inside' })).toBeVisible()
  await expect(page.getByText('Hindi', { exact: true })).toBeVisible()
  await expectNoHorizontalScroll(page)
})

test('body font size is 16px on phones and 18px on desktop', async ({ page }, { project }) => {
  await page.goto('/styleguide/')
  const size = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize))
  // 16px at 360px wide, 18px from 1024px up, and in between on tablets.
  expect(size).toBeGreaterThanOrEqual(16)
  expect(size).toBeLessThanOrEqual(18)
  if (project.name !== 'tablet') expect(size).toBeCloseTo(project.name === 'mobile' ? 16 : 18, 0)
})
