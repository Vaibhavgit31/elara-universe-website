import { expect, test } from '@playwright/test'

// Every prepared image must be served by the static build (Phase 2).
const assets = [
  '/brand/logo-full.svg',
  '/brand/logo-horizontal.svg',
  '/brand/mark.svg',
  '/brand/icon-512.png',
  '/favicon.ico',
  '/books/technova-1.webp',
  '/books/technova-8-thumb.webp',
  '/books/technova-back.webp',
  '/books/hindi-1.webp',
  '/books/hindi-3-thumb.webp',
  '/books/samples/hindi-1/01.webp',
  '/books/samples/hindi-3/08.webp',
  '/books/art-journey-1.svg',
  '/books/art-journey-8.svg',
]

test('prepared brand and book images are served', async ({ request }) => {
  for (const path of assets) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    expect(res.headers()['content-type'], path).toMatch(/image\//)
  }
})

test('link preview image and icons are declared in the page head', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /opengraph-image/,
  )
  await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', /favicon|icon/)
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', /apple-icon/)
})
