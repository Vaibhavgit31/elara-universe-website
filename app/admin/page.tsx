import type { Metadata } from 'next'
import { UserPlus } from 'lucide-react'
import { CardList } from '@/components/admin/card-list'
import { DoubtCard } from '@/components/admin/doubt-card'
import { RequestCard } from '@/components/admin/request-card'
import { TeachersTable } from '@/components/admin/teachers-table'
import { MockNote } from '@/components/auth/mock-note'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { requireAdmin } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'

export const metadata: Metadata = { title: 'Admin', robots: { index: false } }

/** The staff room: every account, the requests for access and the doubts, admins only. */
export default async function AdminPage() {
  await requireAdmin()
  const store = await getStore()
  const [profiles, requests, doubts] = await Promise.all([
    store.listProfiles(),
    store.listRequests(),
    store.listDoubts(),
  ])
  return (
    <Main>
      <Section className="py-12 md:py-16">
        {/* [PLACEHOLDER] wording: the lead line */}
        <SectionHeading
          as="h1"
          eyebrow="Staff room"
          title="Admin"
          crayon="leaf"
          lead="Teacher accounts, requests for access and doubts from Help, all in one place."
        />
        <div className="mt-6 max-w-md">
          <MockNote />
        </div>
        <Button href="/admin/teachers/new" className="mt-8">
          <UserPlus aria-hidden size={18} /> New teacher
        </Button>
      </Section>
      <Section id="teachers" className="py-12">
        <SectionHeading eyebrow="Accounts" title="Teachers" />
        <TeachersTable profiles={profiles} className="mt-8" />
      </Section>
      <Section id="requests" tone="mint" className="py-12">
        <SectionHeading eyebrow="Web Support" title="Access requests" />
        <CardList
          items={requests}
          empty="No requests yet."
          render={(request) => <RequestCard request={request} />}
        />
      </Section>
      <Section id="doubts" className="py-12 md:pb-16">
        <SectionHeading eyebrow="Help" title="Doubts" />
        <CardList
          items={doubts}
          empty="No doubts yet."
          render={(doubt) => <DoubtCard doubt={doubt} />}
        />
      </Section>
    </Main>
  )
}
