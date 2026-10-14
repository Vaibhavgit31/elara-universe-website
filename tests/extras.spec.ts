import { expect, test, type Page } from '@playwright/test'
import { open } from './helpers'

/** The sticker-book button lives in the top bar on laptops and inside the phone menu sheet. */
const stickerButton = async (page: Page, name: RegExp) => {
  if ((page.viewportSize()?.width ?? 1440) < 768)
    await page.getByRole('button', { name: 'Open menu' }).click()
  return page.getByRole('button', { name })
}

test('visiting pages earns stickers and the sticker book shows them', async ({ page }) => {
  await open(page, '/')
  await expect(page.getByRole('status').filter({ hasText: 'leaf sticker' })).toBeVisible()
  await expect(await stickerButton(page, /Sticker book: 1 of 6/)).toBeVisible()
  await open(page, '/catalog/')
  await (await stickerButton(page, /Sticker book: 2 of 6/)).click()
  const book = page.getByRole('dialog', { name: 'Your sticker book' })
  await expect(book).toBeVisible()
  await expect(book.getByRole('img', { name: 'Book sticker' })).toBeVisible()
  await expect(book.getByRole('img', { name: 'Star sticker, not yet earned' })).toBeVisible()
  await book.getByRole('button', { name: 'Close' }).click()
  await expect(book).toBeHidden()
})

test('the site still works when browser storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked')
      },
    })
  })
  await open(page, '/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(await stickerButton(page, /Sticker book: 1 of 6/)).toBeVisible()
})

test('play corner activities load on demand and work', async ({ page }, { project }) => {
  test.skip(project.name !== 'reduced-motion', 'pages are in normal flow only with reduced motion')
  await open(page, '/')
  await expect(page.getByRole('region', { name: 'Page 7 of 8' })).toHaveCSS('position', 'relative')
  const binary = page.getByTestId('activity-binary')
  await binary.scrollIntoViewIfNeeded()
  await binary.getByRole('button', { name: 'Play' }).click()
  await binary.getByLabel('Your name').fill('A')
  await expect(binary.getByRole('listitem').first()).toHaveText(/A\s*0\s*1\s*0\s*0\s*0\s*0\s*0\s*1/)

  const colour = page.getByTestId('activity-colour')
  await colour.getByRole('button', { name: 'Play' }).click()
  await colour.getByRole('radio', { name: 'Crayon #4A90C2' }).click()
  await colour.getByRole('button', { name: 'Colour the body' }).click()
  await expect(colour.locator('[data-part="body"]')).toHaveAttribute('fill', '#4A90C2')

  const trace = page.getByTestId('activity-trace')
  await trace.getByRole('button', { name: 'Play' }).click()
  const canvas = trace.getByLabel(/Drawing area/)
  const box = (await canvas.boundingBox())!
  for (let i = 0; i < 3; i++) {
    await page.mouse.move(box.x + 40 + i * 20, box.y + 60)
    await page.mouse.down()
    await page.mouse.move(box.x + 120, box.y + 200, { steps: 6 })
    await page.mouse.up()
  }
  await expect(trace.getByText(/Well traced/)).toBeVisible()
})

test('the page-turn sound is off by default and the choice is remembered', async ({ page }) => {
  await open(page, '/demo-flip/')
  const toggle = page.getByRole('button', { name: 'Page-turn sound' }).first()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Page-turn sound' }).first()).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('evening desk lamp and festival decorations appear on their dates', async ({ page }, {
  project,
}) => {
  await page.clock.install({ time: new Date('2026-11-08T20:00:00') })
  await open(page, '/about/')
  await expect(page.getByRole('img', { name: 'Diwali decorations' })).toBeVisible()
  // The desk only shows behind the stacked sheets of the scroll layout, not the reduced-motion stack.
  if (project.name !== 'reduced-motion')
    await expect(page.getByTestId('desk-evening')).toBeAttached()
})
