import { expect, test } from '@playwright/test'
import { open } from './helpers'

test('Elu appears on the 404 page, QR Corner and the empty shelf', async ({ page }) => {
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
  await open(page, '/resources/')
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Back to the home page' }),
  ).toHaveClass(/stamp/)
  await open(page, '/about/')
  const link = page.getByRole('contentinfo').getByRole('link', { name: 'Books' })
  await expect(link).toHaveCSS('background-image', /svg/)
  await expect(page.locator('.lift-corner').first()).toBeAttached()
})

test('with reduced motion the headline is plain text and nothing drifts', async ({ page }, {
  project,
}) => {
  test.skip(project.name !== 'reduced-motion', 'reduced motion only')
  await open(page, '/')
  const h1 = page.getByRole('heading', { level: 1 })
  await expect(h1).toHaveText('Books that grow curious minds.')
  // The chalk headline is plain text, not one span per letter.
  await expect(h1.locator('span span')).toHaveCount(0)
  await expect(page.getByTestId('mesh').locator('div').first()).toHaveCSS('animation-name', 'none')
})
