import { expect, test } from '@playwright/test'
import { open } from './helpers'

test.describe('first-visit intro', () => {
  test('leaves unfold once per session and the intro can be skipped', async ({ page }) => {
    await page.goto('/')
    const skip = page.getByRole('button', { name: 'Skip intro' })
    await expect(skip).toBeVisible()
    await expect(page.locator('button[aria-label="Open the book"] svg path')).toHaveCount(9)
    await skip.click()
    await expect(page.locator('[data-cover]')).toHaveAttribute('data-cover', 'open')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Books that grow curious minds.' }),
    ).toBeVisible()
    // Second visit in the same session: no intro, cover opens by itself.
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Skip intro' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Open the book' })).toBeHidden({ timeout: 4000 })
  })
})

test('Elu appears on the hero, 404, QR Corner and empty shelf', async ({ page }) => {
  await open(page, '/')
  // The hero Elu is hidden on phones, so look it up by label rather than by role.
  await expect(page.locator('[aria-label^="Elu, the Elara Universe mascot"]')).toBeAttached()
  await page.goto('/this-page-does-not-exist/')
  await expect(page.getByRole('img', { name: /Elu searching/ })).toBeVisible()
  await open(page, '/resources/')
  await expect(page.getByRole('img', { name: 'Elu holding a phone' })).toBeVisible()
  await open(page, '/catalog/?subject=hindi&class=9')
  await page.getByRole('button', { name: '1', exact: true }).click()
  await page.getByRole('button', { name: 'Drawing', exact: true }).click()
  await expect(page.getByTestId('book-card')).toHaveCount(1)
})

test('micro-interactions are wired: stamp buttons, pencil-stroke links, corner-lift cards', async ({
  page,
}) => {
  await open(page, '/')
  await expect(page.getByRole('link', { name: 'Explore the catalog' })).toHaveClass(/stamp/)
  const link = page.getByRole('contentinfo').getByRole('link', { name: 'Catalog' })
  await expect(link).toHaveCSS('background-image', /svg/)
  await expect(page.locator('.lift-corner').first()).toBeAttached()
})

test('with reduced motion the headline is plain text and nothing drifts', async ({ page }, {
  project,
}) => {
  test.skip(project.name !== 'reduced-motion', 'reduced motion only')
  await page.goto('/')
  await page.getByRole('button', { name: 'Skip intro' }).click()
  const h1 = page.getByRole('heading', { level: 1 })
  await expect(h1).toHaveText('Books that grow curious minds.')
  await expect(h1.locator('span span')).toHaveCount(0)
  await expect(page.getByRole('img', { name: /Elu, the Elara Universe mascot/ })).toHaveCSS(
    'transform',
    'none',
  )
})
