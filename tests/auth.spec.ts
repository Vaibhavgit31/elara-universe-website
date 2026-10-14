import { expect, test, type Locator, type Page } from '@playwright/test'
import { open } from './helpers'

// Phase 2, Step F: teacher accounts. The server runs in mock mode (no Supabase keys), so the
// demo accounts from lib/data/memory-store.ts exist, nothing is emailed and every write lives in
// memory until the server restarts. Each test creates what it needs with a unique email and
// never relies on another test's writes. Sign-in attempts are rate-limited per account and per
// IP (lib/auth/rate-limit.ts), so only the basic login tests also run on the phone project.

const admin = { email: 'admin@example.com', password: 'elara-admin-demo' }
const teacher = {
  email: 'teacher@example.com',
  password: 'elara-teacher-demo',
  name: 'Demo Teacher',
}
const portal = /\/web-support\/$/
const nav = { timeout: 10_000 }

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768
const stamp = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
const uniqueEmail = (prefix: string) => `${prefix}-${stamp()}@example.com`
const onlyOn = (...projects: string[]) =>
  test.skip(!projects.includes(test.info().project.name), `${projects.join(' and ')} only`)

/** Fills and submits the sign-in form on the page that is open (keeps any ?next). */
async function submitLogin(page: Page, email: string, password: string) {
  const form = page.getByRole('form', { name: 'Sign in' })
  await form.getByLabel('Email').fill(email)
  await form.getByLabel('Password').fill(password)
  await form.getByRole('button', { name: 'Sign in' }).click()
}

/** Opens the login page, signs in and waits for the portal, where every sign-in lands. */
async function signIn(page: Page, email: string, password: string) {
  await open(page, '/login/')
  await submitLogin(page, email, password)
  await expect(page).toHaveURL(portal, nav)
}

/** Forgets the session cookies: a sign-out without touching the UI. */
const forget = (page: Page) => page.context().clearCookies()

const loginAlert = (page: Page) => page.getByRole('form', { name: 'Sign in' }).getByRole('alert')

/** The teacher button sits in the top bar on laptops and inside the phone menu sheet. */
async function expectTeacherLink(page: Page, name: string) {
  if (!isPhone(page))
    return expect(page.getByRole('banner').getByRole('link', { name })).toBeVisible()
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name })).toBeVisible()
  await page.getByRole('button', { name: 'Close menu' }).click()
}

type NewTeacher = { name: string; email: string; password: string }

/** As the signed-in admin, creates a teacher with a one-time password and returns the details. */
async function createTeacher(
  page: Page,
  { classes = [] as number[], subjects = [] as string[] } = {},
): Promise<NewTeacher> {
  const name = `Test Teacher ${stamp()}`
  const email = uniqueEmail('new')
  await open(page, '/admin/teachers/new/')
  await page.getByRole('textbox', { name: 'Name' }).fill(name)
  await page.getByRole('textbox', { name: 'Email' }).fill(email)
  await page.getByRole('textbox', { name: 'School' }).fill('Demo Public School')
  const classGroup = page.getByRole('group', { name: 'Classes' })
  for (const c of classes)
    await classGroup.getByRole('checkbox', { name: `${c}`, exact: true }).check()
  const subjectGroup = page.getByRole('group', { name: 'Subjects' })
  for (const s of subjects) await subjectGroup.getByRole('checkbox', { name: s }).check()
  await page.getByRole('radio', { name: 'Show a one-time password' }).check()
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Account created' })).toBeVisible(nav)
  const password = (await page.getByTestId('temporary-password').textContent())?.trim() ?? ''
  expect(password, 'the one-time password').not.toBe('')
  return { name, email, password }
}

test.describe('login', () => {
  test.beforeEach(() => onlyOn('desktop', 'mobile'))

  test('the login page lists the demo accounts and rejects a wrong password', async ({ page }) => {
    await open(page, '/login/')
    await expect(page.getByRole('heading', { level: 1, name: 'Welcome back' })).toBeVisible()
    const note = page.getByTestId('mock-note')
    await expect(note).toContainText(admin.email)
    await expect(note).toContainText(teacher.email)
    await submitLogin(page, uniqueEmail('nobody'), 'wrong-password')
    await expect(loginAlert(page)).toHaveText(
      'That email and password do not match. Please try again.',
      nav,
    )
  })

  test('teacher login lands on the portal, shows "My portal" and signs out again', async ({
    page,
  }) => {
    await signIn(page, teacher.email, teacher.password)
    await expect(
      page.getByRole('heading', { level: 1, name: `Hello, ${teacher.name}` }),
    ).toBeVisible()
    await expectTeacherLink(page, 'My portal')
    // On phones the portal links (Sign out among them) fold into the "Portal menu" (Step G).
    if (isPhone(page)) await page.getByRole('button', { name: 'Portal menu' }).click()
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL('/', nav)
    await expectTeacherLink(page, 'Teacher login')
  })
})

test.describe('desktop only', () => {
  test.beforeEach(() => onlyOn('desktop'))

  test('protected pages redirect to the login page and come back after signing in', async ({
    page,
  }) => {
    await page.goto('/admin/')
    await expect(page).toHaveURL(/\/login\/\?next=.*admin/)
    await open(page, '/account/update-password/')
    await expect(page).toHaveURL(/\/login\/\?next=.*update-password/)
    await submitLogin(page, teacher.email, teacher.password)
    await expect(page).toHaveURL(/\/account\/update-password\/$/, nav)
    await expect(page.getByRole('heading', { level: 1, name: 'Set a new password' })).toBeVisible()
  })

  test('sign-in and email links never send anyone off the site', async ({ page, baseURL }) => {
    await open(page, `/login/?next=${encodeURIComponent('/\\evil.example/x')}`)
    await submitLogin(page, teacher.email, teacher.password)
    await page.waitForURL((url) => url.pathname !== '/login/', nav)
    expect(new URL(page.url()).origin).toBe(baseURL)
    const session = (await page.context().cookies()).find((c) => c.name === 'elara_mock_session')
    expect(session, 'the session cookie').toMatchObject({ httpOnly: true, sameSite: 'Lax' })
    for (const next of ['//evil.example', 'https://evil.example', '/\\evil.example']) {
      await page.goto(`/auth/confirm/?next=${encodeURIComponent(next)}`)
      expect(new URL(page.url()).origin).toBe(baseURL)
    }
    await forget(page)
    await open(page, '/login/?expired=1')
    await expect(page.getByRole('status')).toContainText('expired or was already used')
  })

  test('a teacher who opens the admin page is sent to the portal', async ({ page }) => {
    await signIn(page, teacher.email, teacher.password)
    await page.goto('/admin/')
    await expect(page).toHaveURL(portal, nav)
  })

  test('the admin creates a teacher with a one-time password who can then sign in', async ({
    page,
  }) => {
    await signIn(page, admin.email, admin.password)
    const created = await createTeacher(page, { classes: [2, 4], subjects: ['Hindi'] })
    await expect(page.locator('main')).toContainText(created.email)
    await expect(page.getByText('Copy it now: it is shown only once.')).toBeVisible()
    await open(page, '/admin/')
    const row = page.getByTestId('teacher-row').filter({ hasText: created.email })
    await expect(row).toContainText('2, 4')
    await expect(row).toContainText('Hindi')
    await expect(row).toContainText('Active')
    await forget(page)
    await signIn(page, created.email, created.password)
    await expect(
      page.getByRole('heading', { level: 1, name: `Hello, ${created.name}` }),
    ).toBeVisible()
  })

  test('a deactivated teacher can no longer sign in', async ({ page }) => {
    await signIn(page, admin.email, admin.password)
    const created = await createTeacher(page)
    await open(page, '/admin/')
    await page
      .getByTestId('teacher-row')
      .filter({ hasText: created.email })
      .getByRole('link', { name: `Edit ${created.name}` })
      .click()
    await expect(page).toHaveURL(/\/admin\/teachers\/[^/?]+\/?$/, nav)
    await expect(page.getByRole('heading', { level: 1, name: created.name })).toBeVisible()
    await page.getByRole('button', { name: 'Deactivate' }).click()
    await expect(page.locator('main')).toContainText('Deactivated', nav)
    await expect(page.getByRole('button', { name: 'Reactivate' })).toBeVisible()
    await forget(page)
    await open(page, '/login/')
    await submitLogin(page, created.email, created.password)
    await expect(loginAlert(page)).toHaveText(/deactivated/, nav)
  })

  test('six wrong attempts for one account hit the rate limit', async ({ page }) => {
    await open(page, '/login/')
    const email = uniqueEmail('locked')
    const button = page
      .getByRole('form', { name: 'Sign in' })
      .getByRole('button', { name: 'Sign in' })
    for (let attempt = 1; attempt <= 6; attempt++) {
      // Wait for the action's response and for the form to settle before the next attempt.
      const answered = page.waitForResponse((r) => r.request().method() === 'POST')
      await submitLogin(page, email, 'wrong-password')
      await answered
      await expect(button).toBeEnabled()
      await expect(loginAlert(page)).toHaveText(
        attempt < 6
          ? 'That email and password do not match. Please try again.'
          : 'Too many attempts. Please wait 15 minutes and try again.',
      )
    }
  })

  test('the forgot-password page answers the same way for any email', async ({ page }) => {
    await open(page, '/login/forgot/')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Forgot your password?' }),
    ).toBeVisible()
    const form = page.getByRole('form', { name: 'Reset your password' })
    await form.getByLabel('Email').fill(uniqueEmail('forgot'))
    await form.getByRole('button', { name: 'Send the reset link' }).click()
    await expect(form.getByRole('status')).toHaveText(
      'If that account exists, an email with a reset link is on its way.',
      nav,
    )
  })

  test('a signed-in teacher sets a new password and signs in with it', async ({ page }) => {
    await signIn(page, admin.email, admin.password)
    const created = await createTeacher(page)
    await forget(page)
    await signIn(page, created.email, created.password)
    await open(page, '/account/update-password/')
    const form = page.getByRole('form', { name: 'Set a new password' })
    const password = `changed-${stamp()}`
    await form.getByLabel('New password').fill(password)
    await form.getByLabel('Type it again').fill(password)
    await form.getByRole('button', { name: 'Save the new password' }).click()
    await expect(page).toHaveURL(portal, nav)
    await forget(page)
    await signIn(page, created.email, password)
    await expect(
      page.getByRole('heading', { level: 1, name: `Hello, ${created.name}` }),
    ).toBeVisible()
  })

  // These three touch the seeded demo request and doubt, so they run in order: the listing
  // first, then the writes. They skip, with a note, when an earlier run on the same server has
  // already used up the seed.
  test.describe('seeded admin data', () => {
    test.describe.configure({ mode: 'default' })
    const seedUsed = 'used by an earlier run on this server; restart it to reset the mock data'
    const demoRequest = (page: Page) =>
      page.getByTestId('access-request').filter({ hasText: 'Demo Principal' })
    const demoDoubt = (page: Page) =>
      page.getByTestId('doubt').filter({ hasText: 'Where do I find the Class 2 worksheets?' })
    const status = (card: Locator, text: string) => card.getByText(text, { exact: true })

    test('the admin page lists teachers, access requests and doubts', async ({ page }) => {
      await signIn(page, admin.email, admin.password)
      await open(page, '/admin/')
      await expect(page.getByRole('heading', { level: 1, name: 'Admin' })).toBeVisible()
      await expect(page.getByTestId('mock-note')).toBeVisible()
      await expect(page.getByRole('link', { name: 'New teacher' })).toHaveAttribute(
        'href',
        /\/admin\/teachers\/new\/?$/,
      )
      const row = page.getByTestId('teacher-row').filter({ hasText: teacher.name })
      await expect(row).toContainText(teacher.email)
      await expect(row).toContainText('1, 2, 3')
      await expect(row.getByRole('link', { name: `Edit ${teacher.name}` })).toHaveAttribute(
        'href',
        /\/admin\/teachers\/mock-teacher\/?$/,
      )
      const request = demoRequest(page)
      await expect(request).toContainText('principal@example.com')
      await expect(demoDoubt(page)).toBeVisible()
      test.skip(await status(request, 'approved').isVisible(), `demo request ${seedUsed}`)
      await expect(request.getByRole('link', { name: 'Create account' })).toHaveAttribute(
        'href',
        /request=mock-request-1$/,
      )
    })

    test('the admin answers an open doubt', async ({ page }) => {
      await signIn(page, admin.email, admin.password)
      await open(page, '/admin/')
      const doubt = demoDoubt(page)
      test.skip(await status(doubt, 'answered').isVisible(), `demo doubt ${seedUsed}`)
      await expect(status(doubt, 'open')).toBeVisible()
      const answer = 'Thank you for asking. We will point you to them in Web Support.'
      await doubt.getByRole('textbox', { name: 'Answer' }).fill(answer)
      await doubt.getByRole('button', { name: 'Send answer' }).click()
      await expect(status(doubt, 'answered')).toBeVisible(nav)
      await expect(doubt).toContainText(answer)
      await expect(doubt.getByRole('button', { name: 'Send answer' })).toHaveCount(0)
    })

    test('"Create account" on a request pre-fills the form and approves the request', async ({
      page,
    }) => {
      await signIn(page, admin.email, admin.password)
      await open(page, '/admin/')
      const request = demoRequest(page)
      test.skip(await status(request, 'approved').isVisible(), `demo request ${seedUsed}`)
      await request.getByRole('link', { name: 'Create account' }).click()
      await expect(page).toHaveURL(/\/admin\/teachers\/new\/?\?request=mock-request-1$/, nav)
      await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Demo Principal')
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'principal@example.com',
      )
      // hindi-3 in the request: Class 3 and Hindi come pre-checked.
      await expect(
        page
          .getByRole('group', { name: 'Classes' })
          .getByRole('checkbox', { name: '3', exact: true }),
      ).toBeChecked()
      await expect(
        page.getByRole('group', { name: 'Subjects' }).getByRole('checkbox', { name: 'Hindi' }),
      ).toBeChecked()
      await page.getByRole('button', { name: 'Create account' }).click()
      await expect(page.getByRole('heading', { level: 2, name: 'Account created' })).toBeVisible(
        nav,
      )
      await open(page, '/admin/')
      await expect(status(request, 'approved')).toBeVisible()
      await expect(request.getByRole('link', { name: 'Create account' })).toHaveCount(0)
    })
  })
})
