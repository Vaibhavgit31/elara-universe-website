import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

// Phase 2, Step D: "A day at Elara School". Every key detail lives on the home page.
const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768
const rooms = [
  'classroom',
  'hindi-class',
  'computer-lab',
  'art-room',
  'why',
  'digital',
  'teachers',
  'events',
  'staff-room',
  'faq',
  'contact',
]

test('the classroom hero chalks the headline and every object is a link', async ({ page }) => {
  await open(page, '/')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Books that grow curious minds.' }),
  ).toBeVisible()
  const hero = page.locator('[data-room="classroom"]')
  const links: [string, string][] = [
    ['Catalog', '/catalog/'],
    ['TechNova', '/catalog/?subject=computer'],
    ['Art Journey', '/catalog/?subject=drawing'],
    ['Events', '/events/'],
    ['About us', '/about/'],
    ['Web support', '/web-support/'],
    ['Teacher login', '/login/'],
  ]
  for (const [name, href] of links)
    await expect(
      hero.getByRole('link', { name }).filter({ visible: true }).first(),
    ).toHaveAttribute('href', href)
  // The wall clock shows the real time: its minute hand has been rotated by the browser.
  await expect.poll(() => hero.locator('#minute').getAttribute('transform')).toMatch(/rotate/)
  await expectNoHorizontalScroll(page)
})

test('home holds every room, each opening as it scrolls into view', async ({ page }) => {
  await open(page, '/')
  for (const id of rooms) {
    const room = page.locator(`[data-room="${id}"]`)
    await room.scrollIntoViewIfNeeded()
    await expect(room).toHaveAttribute('data-open', 'true')
  }
  const main = page.getByRole('main')
  for (const name of [
    /Basic Hindi Reader/,
    /TechNova/,
    /Art Journey/,
    /Why schools choose/,
    /Scan the book/,
    /A test paper/,
    /What's happening/,
    /The people behind the books/,
    /Schools often/,
    /Drop a letter in the/,
  ])
    await expect(main.getByRole('heading', { name }).first()).toBeVisible()
  await expect(main.getByText('Sunil Sharma').first()).toBeVisible()
  await expect(main.getByText('Tausif Khan').first()).toBeVisible()
  await expect(main.getByText('D-9, Ground Floor, Block D, Vyapar Marg')).toBeVisible()
  await expectNoHorizontalScroll(page)
})

test('the class picker flips covers and opens the peek-inside flipbook', async ({ page }) => {
  await open(page, '/')
  const room = page.locator('[data-room="hindi-class"]')
  await room.scrollIntoViewIfNeeded()
  await room.getByRole('button', { name: '3', exact: true }).click()
  await expect(room.getByRole('button', { name: '3', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(room.getByText('Class 3', { exact: false }).first()).toBeVisible()
  await room.getByRole('button', { name: 'Peek inside' }).click()
  const dialog = page.getByRole('dialog').filter({ visible: true }).first()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByTestId('flipbook')).toHaveAttribute('data-ready', 'true', {
    timeout: 15_000,
  })
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(room.getByRole('link', { name: 'Request a sample copy' })).toHaveAttribute(
    'href',
    '/contact/?book=hindi-3',
  )
})

test('the FAQ links to Web Support answers and the postbox form works without a key', async ({
  page,
}) => {
  await open(page, '/')
  const faq = page.locator('[data-room="faq"]')
  await faq.scrollIntoViewIfNeeded()
  await expect(faq.getByRole('link', { name: /sample copy/i }).first()).toHaveAttribute(
    'href',
    /\/web-support\/help\/?#sample-copies/,
  )
  const contact = page.locator('[data-room="contact"]')
  await contact.scrollIntoViewIfNeeded()
  await expect(contact.getByRole('link', { name: /WhatsApp/ }).first()).toHaveAttribute(
    'href',
    /wa\.me\/919625741192/,
  )
  await expect(contact.getByRole('link', { name: '+91 96257 41192' })).toBeVisible()
  // The letter's code loads when the postbox comes near, then the form is there to fill in.
  await expect(contact.getByLabel('Your name')).toBeVisible({ timeout: 10_000 })
})

test('phones get the simplified scene with the hotspot list', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only')
  await open(page, '/')
  const hero = page.locator('[data-room="classroom"]')
  await expect(hero.getByRole('list').getByRole('link')).toHaveCount(7)
  await expectNoHorizontalScroll(page)
})
