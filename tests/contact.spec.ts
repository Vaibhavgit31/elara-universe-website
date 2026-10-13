import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

const fill = async (page: Page) => {
  await page.getByLabel('Your name').fill('Asha Verma')
  await page.getByLabel('School name').fill('Sunrise Public School')
  await page.getByLabel('I am a').selectOption('principal')
  await page.getByLabel('Phone').fill('96257 41192')
  await page.getByLabel('Email').fill('asha@example.com')
  await page.getByLabel('City').fill('Noida')
  await page.getByLabel('Hindi').check()
  await page.getByLabel('3', { exact: true }).check()
  await page.getByLabel('Message').fill('Please send sample copies of the Hindi Reader.')
}
const mode = (page: Page) => page.locator('[data-mode]').getAttribute('data-mode')

test('contact page shows the letter form and the postcard', async ({ page }) => {
  await open(page, '/contact/')
  await expect(page.getByRole('heading', { level: 1, name: 'Write us a letter' })).toBeVisible()
  await expect(page.getByRole('form', { name: 'Write to us' })).toBeVisible()
  const postcard = page.getByRole('complementary', { name: 'Our addresses' })
  await expect(postcard.getByText('Registered office')).toBeVisible()
  await expect(postcard.getByText('Raj Nagar Extension, Ghaziabad')).toBeVisible()
  await expect(postcard.getByRole('link', { name: '+91 96257 41192' })).toHaveAttribute(
    'href',
    'tel:+919625741192',
  )
  await expect(postcard.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me/,
  )
  await expect(page.locator('input[name="botcheck"]')).toBeHidden()
  await expectNoHorizontalScroll(page)
})

test('the map loads only when scrolled into view', async ({ page }) => {
  await open(page, '/contact/')
  const map = page.getByTestId('map')
  const inView = await map.evaluate(
    (el) => el.getBoundingClientRect().top < window.innerHeight + 160,
  )
  if (!inView) await expect(map.locator('iframe')).toHaveCount(0)
  await map.scrollIntoViewIfNeeded()
  await expect(map.locator('iframe')).toHaveAttribute('src', /google\.com\/maps/)
})

test('empty or badly formatted fields show clear errors', async ({ page }) => {
  await open(page, '/contact/')
  await page.getByRole('button', { name: 'Send the letter' }).click()
  await expect(page.getByText('Please tell us your name.')).toBeVisible()
  await expect(page.getByText('Please choose your role.')).toBeVisible()
  await expect(page.getByText('Pick at least one subject.')).toBeVisible()
  await page.getByLabel('Phone').fill('12345')
  await page.getByRole('button', { name: 'Send the letter' }).click()
  await expect(page.getByText(/10-digit Indian mobile number/)).toBeVisible()
})

test('?book= pre-fills a sample copy request', async ({ page }) => {
  await open(page, '/contact/?book=technova-3')
  await expect(page.getByLabel('Message')).toHaveValue('Sample copy request: TechNova Class 3')
  await expect(page.getByLabel('Computer')).toBeChecked()
  await expect(page.getByLabel('3', { exact: true })).toBeChecked()
})

test('without a form key, a valid letter is handed to email and WhatsApp', async ({ page }) => {
  await open(page, '/contact/')
  test.skip((await mode(page)) !== 'fallback', 'built with a Web3Forms key')
  await fill(page)
  await page.getByRole('button', { name: 'Send the letter' }).click()
  const panel = page.getByRole('status').filter({ hasText: 'Your letter is written' })
  await expect(panel).toBeVisible()
  await expect(panel.getByRole('link', { name: 'Send by email' })).toHaveAttribute(
    'href',
    /mailto:info@elarauniversepublications\.com.*Asha%20Verma/,
  )
  await expect(panel.getByRole('link', { name: 'Send on WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me\/919625741192\?text=.*Sunrise/,
  )
})

test('with a form key, the letter flies off and a thank-you note appears; failures keep the text', async ({
  page,
}) => {
  await open(page, '/contact/')
  test.skip((await mode(page)) !== 'web3forms', 'built without a Web3Forms key')
  let fail = true
  await page.route('https://api.web3forms.com/submit', (route) =>
    fail
      ? route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Server down' }),
        })
      : route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'ok' }),
        }),
  )
  await fill(page)
  await page.getByRole('button', { name: 'Send the letter' }).click()
  await expect(page.getByText(/could not be sent \(Server down\)/)).toBeVisible()
  await expect(page.getByLabel('Your name')).toHaveValue('Asha Verma')
  fail = false
  await page.getByRole('button', { name: 'Send the letter' }).click()
  await expect(page.getByText('Thank you, Asha Verma!')).toBeVisible({ timeout: 5000 })
})
