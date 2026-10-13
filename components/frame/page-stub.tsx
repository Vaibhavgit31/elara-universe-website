import { Main } from '@/components/frame/main'

// Placeholder for pages built in later phases, so the menu never leads to a 404.
export const PageStub = ({ title, phase }: { title: string; phase: number }) => (
  <Main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
    <p className="eyebrow">Coming in Phase {phase}</p>
    <h1>{title}</h1>
    <p className="mt-3">This page is being written.</p>
  </Main>
)
