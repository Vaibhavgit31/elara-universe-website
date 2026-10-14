import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, open } from './helpers'

// Phase 2, Step H: Elu's chat. No xAI key here, so the server answers in mock mode from the
// site's own content; the panel says "Mock mode" and every reply streams like a real one.

const panel = (page: Page) => page.getByTestId('chat-panel')

async function openChat(page: Page, path = '/') {
  await open(page, path)
  await page.getByRole('button', { name: 'Ask Elu, the Elara helper' }).click()
  await expect(panel(page)).toBeVisible()
}

test('the bubble opens Elu’s panel with the four suggestions, the note and mock mode', async ({
  page,
}) => {
  await openChat(page, '/catalog/')
  await expect(panel(page).getByRole('heading', { name: 'Ask Elu' })).toBeVisible()
  await expect(panel(page)).toContainText('AI answers can be wrong.')
  await expect(page.getByTestId('chat-mock')).toHaveText('Mock mode')
  await expect(
    panel(page).getByRole('list', { name: 'Suggested questions' }).getByRole('button'),
  ).toHaveText([
    'Which books are for Class 3?',
    'How do I get a sample copy?',
    'How does Web Support work?',
    'Upcoming events',
  ])
  await expect(panel(page).getByRole('textbox', { name: 'Your question' })).toBeFocused()
  await expectNoHorizontalScroll(page)
})

test('a suggestion gets a streamed answer with buttons to the right page', async ({ page }) => {
  await openChat(page)
  await panel(page).getByRole('button', { name: 'Which books are for Class 3?' }).click()
  const log = panel(page).getByRole('log')
  await expect(log).toContainText('Basic Hindi Reader Class 3, TechNova Class 3', {
    timeout: 10_000,
  })
  const link = log.getByRole('link', { name: 'Books for Class 3' })
  await expect(link).toHaveAttribute('href', '/catalog/?class=3')
  await link.click()
  await expect(page).toHaveURL(/\/catalog\/?\?class=3$/)
  await expect(panel(page)).toBeHidden()
})

test('an off-topic question is declined and offers "Ask our team" with the question', async ({
  page,
}) => {
  await openChat(page)
  const field = panel(page).getByRole('textbox', { name: 'Your question' })
  await field.fill('What is the capital of France?')
  await field.press('Enter')
  const log = panel(page).getByRole('log')
  await expect(log).toContainText("I don't know that yet.", { timeout: 10_000 })
  await expect(log.getByRole('link', { name: 'Ask our team' })).toHaveAttribute(
    'href',
    `/web-support/help/?q=${encodeURIComponent('What is the capital of France?')}#ask`,
  )
  await expect(log).not.toContainText('Paris')
})

test('the FAQ answer links to its own anchor on Help', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'desktop only')
  await openChat(page)
  await panel(page).getByRole('button', { name: 'How do I get a sample copy?' }).click()
  await expect(
    panel(page).getByRole('log').getByRole('link', { name: 'Open this answer' }),
  ).toHaveAttribute('href', '/web-support/help/#sample-copies', { timeout: 10_000 })
})

test('the keyboard opens and closes the chat; Escape returns to the bubble', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'desktop only')
  await open(page, '/')
  const bubble = page.getByTestId('chat-bubble')
  await bubble.focus()
  await page.keyboard.press('Enter')
  await expect(panel(page).getByRole('textbox', { name: 'Your question' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(panel(page)).toBeHidden()
  await expect(bubble).toBeFocused()
  await expect(bubble).toHaveAttribute('aria-expanded', 'false')
})

test('questions are capped at 500 characters', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'desktop only')
  await openChat(page)
  const field = panel(page).getByRole('textbox', { name: 'Your question' })
  await field.fill('a'.repeat(600))
  await expect(field).toHaveValue('a'.repeat(500))
  await expect(panel(page)).toContainText('500/500')
})

test('the open panel passes the accessibility audit', async ({ page }) => {
  test.skip(test.info().project.name !== 'reduced-motion', 'audit once')
  await openChat(page)
  const results = await new AxeBuilder({ page })
    .include('#elu-chat')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(results.violations.map((v) => v.id)).toEqual([])
})

test.describe('the chat endpoint', () => {
  test.beforeEach(() => test.skip(test.info().project.name !== 'desktop', 'desktop only'))
  const ask = (text: string) => ({
    messages: [{ id: '1', role: 'user', parts: [{ type: 'text', text }] }],
  })

  test('limits each visitor to 20 questions in 10 minutes', async ({ request }) => {
    const headers = { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 250)}` }
    for (let i = 0; i < 20; i++)
      expect((await request.post('/api/chat/', { data: ask('Hello'), headers })).status()).toBe(200)
    const limited = await request.post('/api/chat/', { data: ask('Hello'), headers })
    expect(limited.status()).toBe(429)
    expect(await limited.text()).toContain('wait a few minutes')
  })

  test('refuses long questions and other websites', async ({ request }) => {
    expect((await request.post('/api/chat/', { data: ask('x'.repeat(501)) })).status()).toBe(400)
    const foreign = await request.post('/api/chat/', {
      data: ask('Hello'),
      headers: { origin: 'https://evil.example' },
    })
    expect(foreign.status()).toBe(403)
  })
})
