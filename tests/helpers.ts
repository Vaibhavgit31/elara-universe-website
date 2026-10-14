import { expect, type BrowserContext, type Page } from '@playwright/test'

// The phone layout must never scroll sideways (PLAYBOOK launch checklist).
export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0)
}

/** Opens a page and waits until React is interactive and the page-turn entrance has settled. */
export async function open(page: Page, url: string) {
  await page.goto(url)
  await expect(page.locator('body')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.getByTestId('page')).toHaveCSS('transform', 'none')
  // Web fonts change line counts and so every measured page height; wait for them once.
  await page.evaluate(() => document.fonts.ready)
}

/** Waits (up to 5 s) until nothing in the first screen is still waiting to be revealed, i.e. no
 *  element in the viewport has opacity 0; then screenshots are deterministic. */
export async function settled(page: Page) {
  await page
    .waitForFunction(
      () =>
        ![...document.querySelectorAll<HTMLElement>('main *')].some((el) => {
          const r = el.getBoundingClientRect()
          return (
            r.width > 0 &&
            r.top < innerHeight &&
            r.bottom > 0 &&
            getComputedStyle(el).opacity === '0'
          )
        }),
      undefined,
      { timeout: 5_000 },
    )
    .catch(() => {})
}

/** Waits until a flip pad has measured its pages (it sets its own height, or is the stacked
 *  reduced-motion version) and returns its top. */
export async function padTop(page: Page) {
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="flip-pad"]') as HTMLElement
    return el.style.height !== '' || (el.dataset.stacked !== undefined && !!el.dataset.starts)
  })
  return page.evaluate(() => {
    const el = document.querySelector('[data-testid="flip-pad"]') as HTMLElement
    return el.getBoundingClientRect().top + window.scrollY
  })
}

/** Every JSON-LD block on the page, parsed. */
export const structuredData = async (page: Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) =>
    JSON.parse(t),
  )

/** Demo accounts of the mock store (lib/data/memory-store.ts); the tests run in mock mode. */
export const demo = {
  admin: { email: 'admin@example.com', password: 'elara-admin-demo', name: 'Demo Admin' },
  teacher: { email: 'teacher@example.com', password: 'elara-teacher-demo', name: 'Demo Teacher' },
  other: { email: 'other@example.com', password: 'elara-other-demo', name: 'Another Teacher' },
}

// Session cookies per account, kept for the life of a test worker: signing in through the form
// once is enough, and the per-account sign-in limit is never touched by parallel tests.
const sessions = new Map<string, Awaited<ReturnType<BrowserContext['cookies']>>>()

/** Signs in as a demo account (through /login the first time in this worker). */
export async function signInAs(
  page: Page,
  { email, password }: { email: string; password: string },
) {
  const cached = sessions.get(email)
  if (cached) return page.context().addCookies(cached)
  await open(page, '/login/')
  const form = page.getByRole('form', { name: 'Sign in' })
  await form.getByLabel('Email').fill(email)
  await form.getByLabel('Password').fill(password)
  await form.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/web-support\/$/, { timeout: 10_000 })
  sessions.set(email, await page.context().cookies())
}
