import { Button } from '@/components/ui/button'
import { site } from '@/content/site'

// Temporary landing page. Phase 5 replaces it with the 7-page flip-pad home.
export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="eyebrow">Coming to life</p>
      <h1 className="font-display font-medium">{site.shortName}</h1>
      <p className="max-w-xl">{site.tagline}</p>
      <Button href="/styleguide" variant="secondary">
        Open the style guide
      </Button>
    </main>
  )
}
