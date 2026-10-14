// Questions schools ask most, grouped by topic. Each answer is at /web-support/help#<id> (Step G)
// and the six marked `top` appear on the home page. Answers marked [PLACEHOLDER] are waiting
// for Vaibhav (PLAYBOOK.md → "Content needed for Phase 2"); only facts from PLAYBOOK.md and
// content/site.ts are stated.
export type FaqTopic =
  'books' | 'ordering' | 'sample-copies' | 'digital-access' | 'login' | 'qr-codes' | 'test-maker'

export const faqTopicLabel: Record<FaqTopic, string> = {
  books: 'Books',
  ordering: 'Ordering',
  'sample-copies': 'Sample copies',
  'digital-access': 'Digital access',
  login: 'Login',
  'qr-codes': 'QR codes',
  'test-maker': 'Test Maker',
}

export type Faq = {
  id: string
  topic: FaqTopic
  question: string
  answer: string
  /** Shown on the home page (six at most). */
  top?: boolean
  isPlaceholder: boolean
}

export const faqs: Faq[] = [
  {
    id: 'which-books',
    topic: 'books',
    question: 'Which books does Elara Universe publish?',
    answer:
      'Three series for Classes 1–8: Basic Hindi Reader (text-cum-workbook, also for non-Hindi-speaking regions), TechNova (computer education, Windows 11 with Office 2024) and Art Journey (drawing). All are aligned to NEP 2020 and NCF 2023.',
    top: true,
    isPlaceholder: false,
  },
  {
    id: 'which-class',
    topic: 'books',
    question: 'Which book is for which class?',
    answer:
      'Every series has one book per class, from Class 1 to Class 8. The catalog lets you filter by subject and class.',
    top: true,
    isPlaceholder: false,
  },
  {
    id: 'sample-copies',
    topic: 'sample-copies',
    question: 'How do I get a sample copy for my school?',
    answer:
      'Ask on the contact page or on WhatsApp (+91 96257 41192) with your school name, the series and the classes you teach. [PLACEHOLDER: how sample copies are sent and who receives them]',
    top: true,
    isPlaceholder: true,
  },
  {
    id: 'ordering',
    topic: 'ordering',
    question: 'How does a school order books?',
    answer: '[PLACEHOLDER: ordering process, minimum quantities, delivery time and areas]',
    top: true,
    isPlaceholder: true,
  },
  {
    id: 'prices',
    topic: 'ordering',
    question: 'What do the books cost?',
    answer:
      'Basic Hindi Reader Class 1 is ₹240. Prices for the other books are on request: ask on the contact page. [PLACEHOLDER: full price list and school discounts]',
    isPlaceholder: true,
  },
  {
    id: 'digital-access',
    topic: 'digital-access',
    question: 'What digital support comes with the books?',
    answer:
      'Basic Hindi Reader comes with animated videos, worksheets, interactive quizzes and downloadable resources; TechNova with web support, a test generator, an e-book, animated videos, a worksheet booklet and AI worksheets. Teachers reach them through Web Support.',
    top: true,
    isPlaceholder: false,
  },
  {
    id: 'web-support-access',
    topic: 'login',
    question: 'How does a teacher get Web Support access?',
    answer:
      'Accounts are created by Elara Universe for teachers only. Fill in the "Request access" form on the Web Support page; once approved, you receive your login by email.',
    top: true,
    isPlaceholder: false,
  },
  {
    id: 'forgot-password',
    topic: 'login',
    question: 'I forgot my password. What do I do?',
    answer:
      'Use "Forgot password" on the login page; a reset link is sent to the email your account was created with.',
    isPlaceholder: false,
  },
  {
    id: 'qr-codes',
    topic: 'qr-codes',
    question: 'What happens when I scan the QR code in a book?',
    answer:
      'It opens QR Corner for that book and class on this website, where the extra resources for that book will live. Until they are ready, it shows a friendly "coming soon" page.',
    isPlaceholder: false,
  },
  {
    id: 'qr-not-working',
    topic: 'qr-codes',
    question: 'The QR code does not open. What can I do?',
    answer:
      'Type the address printed next to the code into a browser (it looks like elarauniversepublications.com/resources/hindi/1), or write to us on the contact page with the book and class.',
    isPlaceholder: false,
  },
  {
    id: 'test-maker',
    topic: 'test-maker',
    question: 'What is the Test Maker?',
    answer:
      'A tool in Web Support for teachers: pick the class, book, chapters, question types and marks, let the AI draft questions, edit them, and print or download the paper with an answer key. Every draft is marked for the teacher to check.',
    isPlaceholder: false,
  },
  {
    id: 'test-maker-hindi',
    topic: 'test-maker',
    question: 'Can the Test Maker make Hindi papers?',
    answer:
      'Yes. Papers for Basic Hindi Reader are generated in Devanagari; Computer and Drawing papers are in English.',
    isPlaceholder: false,
  },
]

export const topFaqs = faqs.filter((f) => f.top).slice(0, 6)
