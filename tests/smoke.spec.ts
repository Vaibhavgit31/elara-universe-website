import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

test('home page loads with the company name and no sideways scroll', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Elara Universe/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expectNoHorizontalScroll(page)
})
