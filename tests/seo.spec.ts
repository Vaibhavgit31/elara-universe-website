import { expect, test } from '@playwright/test'
import { open, structuredData } from './helpers'

const origin = 'https://elarauniversepublications.com'

test.beforeEach(({}, { project }) => {
  test.skip(project.name !== 'desktop', 'markup is the same in every project')
})

test('the sitemap lists every page, book and QR address', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  expect(urls).toHaveLength(7 + 24 + 24)
  for (const path of ['/', '/catalog/hindi-1/', '/resources/technova/8/'])
    expect(urls).toContain(`${origin}${path}`)
})

test('robots.txt allows the site, hides the styleguide and names the sitemap', async ({
  request,
}) => {
  const text = await (await request.get('/robots.txt')).text()
  expect(text).toContain('Allow: /')
  expect(text).toContain('Disallow: /styleguide/')
  expect(text).toContain(`Sitemap: ${origin}/sitemap.xml`)
})

test('the web app manifest names the site and its icons exist', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest.name).toBe('Elara Universe Publishers Private Limited')
  for (const { src } of manifest.icons) expect((await request.get(src)).status()).toBe(200)
})

test('every key page has a description, a social title and the organization data', async ({
  page,
}) => {
  for (const path of ['/', '/catalog/', '/catalog/hindi-1/', '/about/', '/contact/']) {
    await open(page, path)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description!.length, path).toBeGreaterThan(40)
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    const org = (await structuredData(page)).find((d) => d['@type'] === 'Organization')
    expect(org).toMatchObject({
      '@type': 'Organization',
      name: 'Elara Universe Publishers Private Limited',
    })
    expect(org.address).toHaveLength(2)
  }
})
