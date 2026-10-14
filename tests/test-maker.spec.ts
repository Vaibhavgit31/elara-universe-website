import AxeBuilder from '@axe-core/playwright'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { demo, expectNoHorizontalScroll, open, signInAs } from './helpers'

// Phase 2, Step I: the Test Maker. Mock mode: no xAI key, so the drafts are sample questions in
// the paper's language (Devanagari for Hindi), produced by the same route, rules and editor.
// Demo Teacher teaches Classes 1–3, Hindi and Computer. A full run drafts about 26 sections for
// Demo Teacher, under the 40-a-day limit; the mock store (and its counts) resets on restart.

const onlyOn = (...projects: string[]) =>
  test.skip(!projects.includes(test.info().project.name), `${projects.join(' and ')} only`)
const questions = (page: Page) => page.getByTestId('editor-question')

/** Opens the Test Maker for a book, ticks two chapters and drafts the default paper. */
async function draftHindiPaper(page: Page) {
  await signInAs(page, demo.teacher)
  await open(page, '/web-support/test-maker/?book=hindi-1')
  await page.getByRole('checkbox', { name: '1. स्वर' }).check()
  await page.getByRole('button', { name: 'Draft the paper' }).click()
  await expect(questions(page)).toHaveCount(16, { timeout: 20_000 })
}

test('"Generate Test Paper" opens the Test Maker with the class and book chosen', async ({
  page,
}) => {
  onlyOn('desktop', 'mobile')
  await signInAs(page, demo.teacher)
  await open(page, '/web-support/')
  await page
    .getByTestId('portal-book')
    .nth(2)
    .getByRole('link', { name: /Generate Test Paper/ })
    .click()
  await expect(page).toHaveURL(/\/web-support\/test-maker\/\?book=hindi-3$/, { timeout: 10_000 })
  await expect(page.getByRole('combobox', { name: /^Class/ })).toHaveValue('3')
  await expect(page.getByRole('combobox', { name: /^Book/ })).toHaveValue('hindi-3')
  await expect(page.getByRole('combobox', { name: /^Class/ }).getByRole('option')).toHaveText([
    'Class 1',
    'Class 2',
    'Class 3',
  ])
  await expect(page.getByRole('checkbox', { name: '1. गधे जी चश्मा लाए' })).toBeVisible()
  await expect(page.getByText('still need checking')).toBeVisible()
  await expect(page.getByTestId('test-maker-mock')).toContainText('Mock mode')
  await expectNoHorizontalScroll(page)
})

test('the form warns when the marks or the difficulty mix do not add up', async ({ page }) => {
  onlyOn('desktop')
  await signInAs(page, demo.teacher)
  await open(page, '/web-support/test-maker/?book=technova-2')
  await expect(page.getByRole('checkbox', { name: 'Picture / drawing task' })).toHaveCount(0)
  await expect(page.getByText('chapter list for this book is coming soon')).toBeVisible()
  await expect(page.getByTestId('totals-warning')).toHaveCount(0)
  await page.getByLabel('Multiple choice: number of questions').fill('6')
  await page.getByLabel('Hard').fill('30')
  await expect(page.getByTestId('totals-warning')).toContainText(
    'The questions add up to 31 marks, not 30.',
  )
  await expect(page.getByTestId('totals-warning')).toContainText('adds up to 110%')
  // A placeholder chapter list needs typed topics before drafting.
  await page.getByRole('button', { name: 'Draft the paper' }).click()
  await expect(
    page.getByRole('form', { name: 'Set up the paper' }).getByRole('alert'),
  ).toContainText('Pick at least one chapter.')
})

test('a Hindi paper is drafted section by section and edited with live totals', async ({
  page,
}) => {
  onlyOn('desktop', 'mobile')
  await draftHindiPaper(page)
  await expect(page.getByTestId('live-total')).toHaveText('30 of 30 marks · 60 minutes')
  const first = questions(page).first()
  await expect(first.getByText('AI draft — please check')).toBeVisible()
  await expect(first.getByRole('textbox', { name: 'Question' })).toHaveValue(/नमूना/)
  // Editing a question marks it checked.
  await first.getByRole('textbox', { name: 'Question' }).fill('स्वर कितने होते हैं?')
  await expect(first.getByText('AI draft — please check')).toHaveCount(0)
  // Move down, delete, add one, change marks: the total follows.
  await first.getByRole('button', { name: 'Move question 1 down' }).click()
  await expect(questions(page).nth(1).getByRole('textbox', { name: 'Question' })).toHaveValue(
    'स्वर कितने होते हैं?',
  )
  await questions(page).nth(15).getByRole('button', { name: 'Delete question 16' }).click()
  await expect(questions(page)).toHaveCount(15)
  await expect(page.getByTestId('live-total')).toHaveText('24 of 30 marks · 60 minutes')
  await page.getByRole('button', { name: 'Add your own question' }).last().click()
  await questions(page).last().getByRole('spinbutton', { name: 'Marks' }).fill('6')
  await expect(page.getByTestId('live-total')).toHaveText('30 of 30 marks · 60 minutes')
  // Regenerate one question: a new draft takes its place.
  const third = questions(page).nth(2).getByRole('textbox', { name: 'Question' })
  const before = await third.inputValue()
  await questions(page).nth(2).getByRole('button', { name: 'Regenerate question 3' }).click()
  await expect(third).not.toHaveValue(before, { timeout: 10_000 })
  await expectNoHorizontalScroll(page)
})

test('the A4 preview has the header, sections, Set B shuffle and the answer key', async ({
  page,
}) => {
  onlyOn('desktop')
  await draftHindiPaper(page)
  await page.getByRole('button', { name: '3. Print' }).click()
  const paper = page.getByTestId('paper')
  await expect(paper).toHaveAttribute('lang', 'hi')
  await expect(paper).toContainText('Demo Public School')
  await expect(paper).toContainText('कक्षा 1 · बेसिक हिंदी रीडर (हिंदी) · सेट A')
  await expect(paper).toContainText('पूर्णांक: 30')
  await expect(paper.getByRole('heading', { level: 2 }).first()).toHaveText(
    /खंड क: सही उत्तर चुनिए\s*\(5 × 1 = 5\)/,
  )
  await expect(page.getByTestId('paper-question')).toHaveCount(16)
  await expect(page.getByTestId('answer-key')).toContainText('उत्तर कुंजी · सेट A')
  const orderA = await page.getByTestId('paper-question').allTextContents()
  await page.getByRole('button', { name: 'Set B' }).click()
  await expect(paper).toContainText('सेट B')
  expect(await page.getByTestId('paper-question').allTextContents()).not.toEqual(orderA)
  await page.getByLabel('Answer key on its own page').uncheck()
  await expect(page.getByTestId('answer-key')).toHaveCount(0)
})

test('printing shows only the paper, on A4, with the Devanagari font embedded', async ({
  page,
}, testInfo) => {
  onlyOn('desktop')
  await draftHindiPaper(page)
  await page.getByRole('button', { name: '3. Print' }).click()
  await page.evaluate(() => document.fonts.ready)
  await page.emulateMedia({ media: 'print' })
  await expect(page.getByRole('banner')).toBeHidden()
  await expect(page.getByRole('button', { name: /Print or save as PDF/ })).toBeHidden()
  await expect(page.getByTestId('paper')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('print.png'), fullPage: true })
  const pdf = testInfo.outputPath('paper.pdf')
  await page.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true })
  test.skip(!existsSync('/usr/bin/pdffonts'), 'pdffonts (poppler) is not installed')
  expect(execFileSync('pdffonts', [pdf]).toString()).toContain('NotoSansDevanagari')
  expect(execFileSync('pdfinfo', [pdf]).toString()).toContain('(A4)')
})

test('the Word download is a .docx with the Hindi text and a Devanagari font', async ({
  page,
}, testInfo) => {
  onlyOn('desktop')
  await draftHindiPaper(page)
  await page.getByRole('button', { name: '3. Print' }).click()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download for Word' }).click()
  const file = testInfo.outputPath('paper.docx')
  await (await download).saveAs(file)
  expect((await download).suggestedFilename()).toMatch(/Set A\.docx$/)
  const xml = execFileSync('unzip', ['-p', file, 'word/document.xml']).toString()
  expect(xml).toContain('w:cs="Mangal"')
  expect(xml).toContain('उत्तर कुंजी')
  expect(xml).toContain('सही उत्तर चुनिए')
  expect(xml).toContain('w:w="11905"') // A4 width in twips
})

test('papers are saved, duplicated and deleted from My tests', async ({ page }) => {
  onlyOn('desktop')
  await draftHindiPaper(page)
  const title = `Hindi test ${Date.now().toString(36)}`
  await page.getByLabel('Paper name (for My tests)').fill(title)
  await page.getByRole('button', { name: 'Save to My tests' }).click()
  await expect(page.getByText('Saved to My tests.')).toBeVisible({ timeout: 10_000 })
  // Saving again updates the same paper; the saved paper opens straight in the editor.
  await page.getByRole('button', { name: 'Save changes' }).click()
  await page.getByRole('link', { name: 'Open it from My tests' }).click()
  await expect(page).toHaveURL(/\/web-support\/tests\/[^/]+\/$/, { timeout: 10_000 })
  await expect(questions(page)).toHaveCount(16)
  await open(page, '/web-support/tests/')
  await expect(page.getByTestId('saved-test').filter({ hasText: title })).toHaveCount(1)
  const card = page.getByTestId('saved-test').filter({ hasText: title }).first()
  await card.getByRole('button', { name: `Duplicate ${title}` }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${title} (copy)`, {
    timeout: 10_000,
  })
  await open(page, '/web-support/tests/')
  const copy = page.getByTestId('saved-test').filter({ hasText: `${title} (copy)` })
  await copy.getByRole('button', { name: `Delete ${title} (copy)` }).click()
  await copy.getByRole('button', { name: 'Delete for good' }).click()
  await expect(page.getByTestId('saved-test').filter({ hasText: `${title} (copy)` })).toHaveCount(
    0,
    { timeout: 10_000 },
  )
  await expect(page.getByTestId('saved-test').filter({ hasText: title })).toHaveCount(1)
})

test.describe('the draft endpoint', () => {
  test.beforeEach(() => onlyOn('desktop'))
  const body = (bookSlug: string, chapters = ['[PLACEHOLDER] Chapter 1']) => ({
    bookSlug,
    chapters,
    type: 'mcq',
    count: 1,
    marks: 1,
    difficulty: { easy: 40, medium: 40, hard: 20 },
  })

  test('needs a session and one of the teacher’s own books', async ({ page }) => {
    const anonymous = await page.request.post('/api/test-maker/draft/', { data: body('hindi-1') })
    expect(anonymous.status()).toBe(401)
    await signInAs(page, demo.teacher)
    const other = await page.request.post('/api/test-maker/draft/', { data: body('technova-5') })
    expect(other.status()).toBe(403)
    const invented = await page.request.post('/api/test-maker/draft/', {
      data: body('hindi-1', ['A chapter that is not in the book']),
    })
    expect(invented.status()).toBe(400)
  })

  test('stops at the daily limit per teacher', async ({ page }) => {
    // Another Teacher (Class 5, Drawing) is used only here.
    await signInAs(page, demo.other)
    const statuses: number[] = []
    for (let i = 0; i < 41; i++)
      statuses.push(
        (
          await page.request.post('/api/test-maker/draft/', { data: body('art-journey-5') })
        ).status(),
      )
    // 40 drafts a day, then "come back tomorrow" (a server that already counted some stops sooner).
    const first429 = statuses.indexOf(429)
    expect(first429, 'the 41st draft at the latest is refused').toBeGreaterThanOrEqual(0)
    expect(statuses.slice(0, first429).every((s) => s === 200)).toBe(true)
    expect(statuses.slice(first429).every((s) => s === 429)).toBe(true)
  })
})

test('every Test Maker step passes the accessibility audit', async ({ page }) => {
  onlyOn('reduced-motion')
  const audit = async (step: string) => {
    const results = await new AxeBuilder({ page })
      .include('main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(results.violations.map((v) => `${step}: ${v.id}`)).toEqual([])
  }
  await signInAs(page, demo.teacher)
  await open(page, '/web-support/test-maker/?book=hindi-1')
  await audit('set up')
  await page.getByRole('button', { name: 'Draft the paper' }).click()
  await expect(questions(page)).toHaveCount(16, { timeout: 20_000 })
  await audit('edit')
  await page.getByRole('button', { name: '3. Print' }).click()
  await audit('print')
})
