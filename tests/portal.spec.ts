import { expect, test, type Page } from '@playwright/test'
import { demo, expectNoHorizontalScroll, open, signInAs } from './helpers'

// Phase 2, Step G: the Web Support portal. Mock mode: Demo Teacher teaches Classes 1–3, Hindi
// and Computer; Another Teacher owns the demo test mock-test-2.

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768
const onlyOn = (...projects: string[]) =>
  test.skip(!projects.includes(test.info().project.name), `${projects.join(' and ')} only`)
const stamp = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** The portal links: in the sidebar on wider screens, behind "Portal menu" on phones. */
async function portalLinks(page: Page) {
  if (isPhone(page)) await page.getByRole('button', { name: 'Portal menu' }).click()
  return page.getByRole('navigation', { name: 'Web Support' })
}

test.describe('signed out', () => {
  test('the public page shows the four steps, the request form and the login card', async ({
    page,
  }) => {
    await open(page, '/web-support/')
    await expect(page.getByRole('heading', { level: 1, name: 'Teacher portal' })).toBeVisible()
    const steps = page.getByTestId('access-steps').getByRole('listitem')
    await expect(steps).toHaveCount(4)
    for (const step of ['Visit the website', 'Request access', 'Get approval', 'Use the content'])
      await expect(page.getByTestId('access-steps')).toContainText(step)
    await expect(page.getByRole('form', { name: 'Request access' })).toBeVisible()
    await expect(
      page.getByTestId('portal-login').getByRole('form', { name: 'Sign in' }),
    ).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('every portal page except the intro and Help sends visitors to the login page', async ({
    page,
  }) => {
    onlyOn('desktop')
    for (const path of [
      '/web-support/books/hindi-1/',
      '/web-support/tests/',
      '/web-support/tests/mock-test-1/',
      '/web-support/profile/',
      '/web-support/test-maker/',
    ]) {
      await page.goto(path)
      await expect(page, path).toHaveURL(
        new RegExp(`/login/\\?next=${encodeURIComponent(path.replace(/\/$/, ''))}`),
      )
    }
    await page.goto('/web-support/help/')
    await expect(page.getByRole('heading', { level: 1, name: 'Help & Doubts' })).toBeVisible()
  })

  test('a request for access reaches the admin page', async ({ page }) => {
    onlyOn('desktop')
    const name = `Request ${stamp()}`
    await open(page, '/web-support/')
    const form = page.getByRole('form', { name: 'Request access' })
    await form.getByLabel('Name').fill(name)
    await form.getByLabel('School').fill('Demo Public School')
    await form.getByLabel('Email').fill(`${stamp()}@example.com`)
    await form.getByLabel('Phone').fill('+91 96257 41192')
    await form.getByRole('radio', { name: 'Coordinator' }).check()
    await form.getByLabel('Book').selectOption({ label: 'TechNova' })
    await form.getByLabel('Class').selectOption({ label: 'Class 4' })
    await form.getByRole('button', { name: 'Send the request' }).click()
    await expect(page.getByTestId('request-sent')).toContainText('your request is in', {
      timeout: 10_000,
    })
    await signInAs(page, demo.admin)
    await open(page, '/admin/')
    const card = page.getByTestId('access-request').filter({ hasText: name })
    await expect(card).toContainText('TechNova Class 4')
    await expect(card).toContainText('coordinator')
  })
})

test.describe('signed in', () => {
  test('a teacher sees the sidebar and only their own classes and subjects', async ({ page }) => {
    await signInAs(page, demo.teacher)
    await open(page, '/web-support/')
    await expect(page.getByTestId('portal-user')).toHaveText(demo.teacher.name)
    const links = await portalLinks(page)
    for (const name of ['My books', 'My tests', 'Help & Doubts', 'Profile'])
      await expect(links.getByRole('link', { name })).toBeVisible()
    await expect(links.getByRole('button', { name: 'Sign out' })).toBeVisible()
    await expect(links.getByRole('link', { name: 'Admin' })).toHaveCount(0)
    const subject = page.getByLabel('Step 1 · Subject')
    await expect(subject.getByRole('option')).toHaveText(['Hindi', 'Computer'])
    const books = page.getByTestId('portal-book')
    await expect(books).toHaveCount(3)
    await expect(books.getByRole('heading')).toHaveText([
      'Basic Hindi Reader (Class 1)',
      'Basic Hindi Reader (Class 2)',
      'Basic Hindi Reader (Class 3)',
    ])
    for (const label of ['Learning Resources', 'Generate Test Paper'])
      await expect(books.first().getByRole('link', { name: new RegExp(label) })).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('subject and series live in the URL and Back returns to the last choice', async ({
    page,
  }) => {
    onlyOn('desktop', 'mobile')
    await signInAs(page, demo.teacher)
    await open(page, '/web-support/')
    await page.getByLabel('Step 1 · Subject').selectOption('computer')
    await expect(page).toHaveURL(/\?subject=computer&series=technova$/)
    await expect(page.getByTestId('portal-book').first().getByRole('heading')).toHaveText(
      'TechNova (Class 1)',
    )
    await expect(page.getByLabel('Step 2 · Series').getByRole('option')).toHaveText(['TechNova'])
    await page.goBack()
    await expect(page.getByTestId('portal-book').first().getByRole('heading')).toHaveText(
      'Basic Hindi Reader (Class 1)',
    )
    // A subject the teacher does not teach falls back to their first one.
    await open(page, '/web-support/?subject=drawing&series=art-journey')
    await expect(page.getByLabel('Step 1 · Subject')).toHaveValue('hindi')
  })

  test('an admin sees every subject and all eight classes', async ({ page }) => {
    onlyOn('desktop')
    await signInAs(page, demo.admin)
    await open(page, '/web-support/?subject=drawing&series=art-journey')
    await expect(page.getByLabel('Step 1 · Subject').getByRole('option')).toHaveCount(3)
    await expect(page.getByTestId('portal-book')).toHaveCount(8)
    await expect(
      page.getByRole('navigation', { name: 'Web Support' }).getByRole('link', { name: 'Admin' }),
    ).toBeVisible()
  })

  test('Learning Resources opens the tabs; other classes stay closed', async ({ page }) => {
    await signInAs(page, demo.teacher)
    await open(page, '/web-support/')
    await page
      .getByTestId('portal-book')
      .first()
      .getByRole('link', { name: /Learning Resources/ })
      .click()
    await expect(page).toHaveURL(/\/web-support\/books\/hindi-1\/$/, { timeout: 10_000 })
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Basic Hindi Reader')
    const tabs = page.getByRole('tablist', { name: 'Learning resources' }).getByRole('tab')
    await expect(tabs).toHaveText([
      'E-book',
      'Animated videos',
      'Worksheets',
      'Interactive quizzes',
      'Downloads',
    ])
    await expect(page.getByRole('tabpanel')).toBeVisible()
    await expect(page.getByTestId('flipbook')).toBeVisible()
    await tabs.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel').getByTestId('coming-soon')).toContainText('Coming soon')
    await expect(page.getByRole('link', { name: 'Generate Test Paper' })).toHaveAttribute(
      'href',
      /\/web-support\/test-maker\/?\?book=hindi-1$/,
    )
    await expectNoHorizontalScroll(page)
    const other = await page.goto('/web-support/books/technova-5/')
    expect(other?.status(), 'a class the teacher does not teach').toBe(404)
  })

  test('My tests lists only the teacher’s own papers; another teacher’s paper is a 404', async ({
    page,
  }) => {
    onlyOn('desktop', 'mobile')
    await signInAs(page, demo.teacher)
    await open(page, '/web-support/tests/')
    const tests = page.getByTestId('saved-test')
    await expect(tests.filter({ hasText: 'Hindi unit test (demo)' })).toBeVisible()
    await expect(page.getByText('Drawing test (demo)')).toHaveCount(0)
    const own = await page.goto('/web-support/tests/mock-test-1/')
    expect(own?.status()).toBe(200)
    const foreign = await page.goto('/web-support/tests/mock-test-2/')
    expect(foreign?.status(), "another teacher's test").toBe(404)
  })

  test('a teacher changes their own phone number on Profile', async ({ page }) => {
    onlyOn('desktop')
    await signInAs(page, demo.teacher)
    await open(page, '/web-support/profile/')
    await expect(page.getByTestId('access')).toContainText('1, 2, 3')
    const form = page.getByRole('form', { name: 'Your details' })
    await form.getByLabel('Phone').fill('+91 96257 41192')
    await form.getByRole('button', { name: 'Save my details' }).click()
    await expect(form.getByRole('status')).toHaveText('Saved.', { timeout: 10_000 })
    await expect(page.getByRole('link', { name: 'Change password' })).toHaveAttribute(
      'href',
      /\/account\/update-password/,
    )
  })
})

test.describe('Help & Doubts', () => {
  test('search narrows the answers and every answer has its own anchor', async ({ page }) => {
    await open(page, '/web-support/help/#sample-copies')
    await expect(page.locator('#sample-copies')).toBeInViewport()
    await expect(page.getByRole('heading', { level: 2, name: 'Sample copies' })).toBeVisible()
    await page.getByRole('searchbox').fill('password')
    await expect(page.getByTestId('faq')).toHaveCount(1)
    await expect(page.getByTestId('faq')).toContainText('I forgot my password')
    await page.getByRole('searchbox').fill('zzzz')
    await expect(page.getByRole('link', { name: 'Ask our team' })).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('?q= fills in the doubt and the admin sees it once sent', async ({ page }) => {
    onlyOn('desktop')
    const question = `Is there a Class 4 Hindi workbook? ${stamp()}`
    await open(page, `/web-support/help/?q=${encodeURIComponent(question)}#ask`)
    const form = page.getByRole('form', { name: 'Ask a doubt' })
    await expect(form.getByLabel('Your question')).toHaveValue(question)
    await form.getByLabel('Name').fill('Visiting Teacher')
    await form.getByLabel('Email').fill(`${stamp()}@example.com`)
    await form.getByRole('button', { name: 'Send my question' }).click()
    await expect(page.getByTestId('doubt-sent')).toBeVisible({ timeout: 10_000 })
    await signInAs(page, demo.admin)
    await open(page, '/admin/')
    await expect(page.getByTestId('doubt').filter({ hasText: question })).toBeVisible()
  })
})
