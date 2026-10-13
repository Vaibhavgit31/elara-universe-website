import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { site } from '@/content/site'

// Temporary landing page. Phase 5 replaces it with the 7-page flip-pad home.
export default function Home() {
  return (
    <Main className="mx-auto w-full max-w-3xl items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="eyebrow">Coming to life</p>
      <h1 className="font-display font-medium">{site.shortName}</h1>
      <p className="max-w-xl">{site.tagline}</p>
      <Button href="/styleguide" variant="secondary">
        Open the style guide
      </Button>
    </Main>
  )
}
