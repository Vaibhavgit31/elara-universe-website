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
