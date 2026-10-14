import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { open } from './helpers'

const routes = [
  '/',
  '/catalog/',
  '/catalog/hindi-1/',
  '/catalog/art-journey-2/',
  '/about/',
  '/events/',
  '/contact/',
  '/resources/',
  '/resources/technova/3/',
]

for (const route of routes)
  test(`no serious accessibility violations on ${route}`, async ({ page }, { project }) => {
    test.skip(project.name !== 'reduced-motion', 'audit once, with every page in normal flow')
    await open(page, route)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
      .analyze()
    const serious = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )
    expect(
      serious.map(
        (v) =>
          `${v.id}: ${v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 3)
            .join(' | ')}`,
      ),
    ).toEqual([])
    expect(results.violations.map((v) => v.id)).toEqual([])
  })

test('404 page passes the audit too', async ({ page }, { project }) => {
  test.skip(project.name !== 'reduced-motion', 'audit once')
  await page.goto('/missing-page/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(results.violations.map((v) => v.id)).toEqual([])
})
