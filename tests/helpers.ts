import { expect, type Page } from '@playwright/test'

// The phone layout must never scroll sideways (PLAYBOOK launch checklist).
export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0)
}
