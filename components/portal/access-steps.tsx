import { ChalkLine, ChalkText, Chalkboard } from '@/components/classroom/chalkboard'
import { site } from '@/content/site'

// The four steps printed on the Basic Hindi Reader back cover (PLAYBOOK.md, Step G): visit the
// website → Web Support → request access → get approval → use the content. The one-line notes
// under each step are [PLACEHOLDER] wording written for this build.
const steps = [
  ['Visit the website', `Open ${site.domain} and choose Web Support.`],
  ['Request access', 'Fill in the form below with your school, book and class.'],
  ['Get approval', 'Elara Universe creates your teacher account and emails you the login.'],
  ['Use the content', 'Sign in for e-books, videos, worksheets, quizzes and the Test Maker.'],
]

/** The four steps on a chalkboard, numbered like a lesson plan. */
export const AccessSteps = () => (
  <Chalkboard>
    <ChalkText as="h2" text="How Web Support works" write className="text-3xl md:text-4xl" />
    <ChalkLine className="mt-1" />
    <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-testid="access-steps">
      {steps.map(([title, note], i) => (
        <li key={title} className="border-l-2 border-cream/40 pl-4">
          <p className="font-hand text-2xl text-hindi">Step {i + 1}</p>
          <h3 className="mt-1 text-lg text-cream">{title}</h3>
          <p className="mt-1 text-small text-cream/90">{note}</p>
        </li>
      ))}
    </ol>
  </Chalkboard>
)
