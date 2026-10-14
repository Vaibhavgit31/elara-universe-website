import { expect, type Page } from '@playwright/test'

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
}

/** Waits until a flip pad has measured its pages (it then sets its own height) and returns its top. */
export async function padTop(page: Page) {
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="flip-pad"]') as HTMLElement
    return el.style.height !== ''
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
