import { expect, test, type Page } from '@playwright/test'

// Phase 2, Step C: every text/background pair in the design system passes WCAG AA (4.5:1 for
// body text, 3:1 for large text and UI). Colours are read from the built CSS, so this follows
// the tokens. Glass is white at 55% over the lightest mesh colour (the worst case for contrast).
type Pair = [text: string, background: string, min: number, note: string]
const pairs: Pair[] = [
  ['evergreen', 'glass', 4.5, 'body text on glass'],
  ['evergreen', 'paper', 4.5, 'body text on paper'],
  ['evergreen', 'cream', 4.5, 'body text on cream pages'],
  ['evergreen', 'mint', 4.5, 'body text on mint'],
  ['forest', 'glass', 4.5, 'secondary text and links on glass'],
  ['forest', 'cream', 4.5, 'secondary text on cream'],
  ['gold-ink', 'glass', 4.5, 'eyebrow labels on glass'],
  ['gold-ink', 'cream', 4.5, 'eyebrow labels on cream'],
  ['white', 'leaf-700', 4.5, 'primary button'],
  ['cream', 'forest', 4.5, 'dark buttons and ribbons'],
  ['cream', 'chalkboard', 4.5, 'chalk text on the chalkboard'],
  ['evergreen', 'brass', 4.5, 'active ribbon and brass buttons'],
  ['evergreen', 'hindi-tint', 4.5, 'Hindi tags'],
  ['evergreen', 'computer-tint', 4.5, 'Computer tags'],
  ['evergreen', 'drawing-tint', 4.5, 'Drawing tags'],
  ['leaf-700', 'glass', 3, 'leaf icons, focus ring and large accents on glass'],
  ['brass', 'glass', 3, 'brass stop of the focus ring on glass'],
  ['forest', 'cream', 3, 'forest stop of the focus ring on cream'],
]

const ratios = (page: Page) =>
  page.evaluate(() => {
    const css = getComputedStyle(document.documentElement)
    const hex = (name: string) => {
      if (name === 'white') return [255, 255, 255]
      const v = css.getPropertyValue(`--color-${name}`).trim()
      const n = parseInt(v.slice(1), 16)
      return [n >> 16, (n >> 8) & 255, n & 255]
    }
    const over = (top: number[], alpha: number, under: number[]) =>
      top.map((c, i) => Math.round(c * alpha + under[i] * (1 - alpha)))
    const lum = (rgb: number[]) => {
      const [r, g, b] = rgb.map((c) => {
        const s = c / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const colour = (name: string) =>
      name === 'glass' ? over([255, 255, 255], 0.55, hex('mesh-lime')) : hex(name)
    const ratio = (a: string, b: string) => {
      const [l1, l2] = [lum(colour(a)), lum(colour(b))].sort((x, y) => y - x)
      return (l1 + 0.05) / (l2 + 0.05)
    }
    return (window as unknown as { pairs: [string, string][] }).pairs.map(([t, b]) => ratio(t, b))
  })

test('every text and background pair of the system passes WCAG AA', async ({ page }, {
  project,
}) => {
  test.skip(project.name !== 'desktop', 'colours are the same in every project')
  await page.goto('/styleguide/')
  await page.evaluate(
    (p) => ((window as unknown as { pairs: unknown }).pairs = p),
    pairs.map(([t, b]) => [t, b]),
  )
  const results = await ratios(page)
  const failures = pairs
    .map(([t, b, min, note], i) => ({
      pair: `${t} on ${b} (${note})`,
      ratio: +results[i].toFixed(2),
      min,
    }))
    .filter((r) => r.ratio < r.min)
  expect(failures).toEqual([])
})
