import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

test('styleguide shows every token, font, surface, motif and the rules', async ({ page }) => {
  await open(page, '/styleguide/')
  await expect(page.getByRole('heading', { level: 1, name: 'The Acrylic Classroom' })).toBeVisible()
  for (const token of [
    'evergreen',
    'forest',
    'brass',
    'leaf-700',
    'leaf',
    'mint',
    'chalkboard',
    'mesh-sky',
  ])
    await expect(page.getByText(token, { exact: true })).toBeVisible()
  await expect(page.getByText('बेसिक हिंदी रीडर · अ आ क')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Peek inside' })).toBeVisible()
  await expect(page.getByText('Today: Hindi, Computer and Drawing')).toBeAttached()
  await expect(page.getByText('Ruled notebook page')).toBeVisible()
  await expect(page.getByText('Sticky note', { exact: true })).toBeVisible()
  await expect(page.getByRole('table', { name: 'A timetable layout' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'School bell' })).toBeVisible()
  await expect(
    page.getByText('One radius scale: 8 / 16 / 24 / pill. Nothing else compiles.'),
  ).toBeVisible()
  await expectNoHorizontalScroll(page)
})

test('the mesh background drifts, and stands still with reduced motion', async ({ page }, {
  project,
}) => {
  await open(page, '/styleguide/')
  const blob = page.getByTestId('mesh').locator('div').first()
  await expect(blob).toHaveCSS(
    'animation-name',
    project.name === 'reduced-motion' ? 'none' : 'drift',
  )
  await expect(blob).toHaveCSS('filter', /blur/)
})

test('glass spotlight, magnetic buttons, ripple and focus glow work and rest with reduced motion', async ({
  page,
}, { project }) => {
  test.skip(project.name === 'mobile' || project.name === 'tablet', 'mouse effects')
  await open(page, '/styleguide/')
  const reduced = project.name === 'reduced-motion'
  const card = page.getByTestId('glass-spot')
  const box = (await card.boundingBox())!
  await page.mouse.move(box.x + 40, box.y + 30)
  const mx = await card.evaluate((el) => el.style.getPropertyValue('--mx'))
  expect(mx === '').toBe(reduced)

  const button = page.getByRole('button', { name: 'Explore the books' })
  await button.hover({ position: { x: 10, y: 10 } })
  const wrapper = button.locator('..')
  await (reduced
    ? expect(wrapper).toHaveCSS('transform', 'none')
    : expect.poll(() => wrapper.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none'))
  await button.dispatchEvent('pointerdown', { clientX: box.x, clientY: box.y })
  await expect(button.locator('.ripple')).toHaveCount(1)
  await button.focus()
  await expect(button).toHaveClass(/focus-glow/)
})

test('body font size is 16px on phones and 18px on desktop', async ({ page }, { project }) => {
  await page.goto('/styleguide/')
  const size = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize))
  // 16px at 360px wide, 18px from 1024px up, and in between on tablets.
  expect(size).toBeGreaterThanOrEqual(16)
  expect(size).toBeLessThanOrEqual(18)
  if (project.name !== 'tablet') expect(size).toBeCloseTo(project.name === 'mobile' ? 16 : 18, 0)
})
