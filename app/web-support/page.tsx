import type { Metadata } from 'next'
import { MyBooks } from '@/components/portal/my-books'
import { PortalShell } from '@/components/portal/portal-shell'
import { PublicIntro } from '@/components/portal/public-intro'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Web Support',
  description:
    'Teacher portal for Elara Universe books: learning resources, worksheets, quizzes and the Test Maker.',
}

type Props = { searchParams: Promise<{ subject?: string; series?: string }> }

/** Visitors see how Web Support works and the request form; teachers and admins see My books. */
export default async function WebSupportPage({ searchParams }: Props) {
  const session = await getSession()
  if (!session) return <PublicIntro />
  return (
    <PortalShell session={session}>
      <MyBooks session={session} query={await searchParams} />
    </PortalShell>
  )
}
