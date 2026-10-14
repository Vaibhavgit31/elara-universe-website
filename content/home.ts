// Home page copy that is not a company fact. Copy marked [PLACEHOLDER] was written for this
// build and is open for Vaibhav's review; facts come from PLAYBOOK.md and content/site.ts.

export type WhyNote = {
  title: string
  text: string
  /** Sticker tint: the neutral mist or one subject tint (subject colours only on small things). */
  tone: 'mist' | 'hindi' | 'computer' | 'drawing'
  /** A small "coming soon" tag under the text. */
  soon?: string
}

/** The four "why schools choose Elara" stickers on the home page. */
export const whyNotes: WhyNote[] = [
  {
    tone: 'mist',
    title: 'Aligned to NEP 2020 and NCF 2023',
    text: 'Every series follows the National Education Policy 2020 and the National Curriculum Framework 2023.',
  }, // [PLACEHOLDER] wording
  {
    tone: 'hindi',
    title: 'Text-cum-workbook design',
    text: 'Lessons and practice sit side by side in one book, so children read, write and do in the same place.',
  }, // [PLACEHOLDER] wording
  {
    tone: 'computer',
    title: 'Digital support',
    text: 'Animated videos, worksheets, interactive quizzes and an e-book back up the printed chapters.',
  }, // [PLACEHOLDER] wording
  {
    tone: 'drawing',
    title: 'Teacher support',
    text: 'Worksheet booklets for every class, and a test generator for teachers.',
    soon: 'Test generator: coming soon',
  },
]
