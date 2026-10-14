import type { ReactNode } from 'react'
import { Main } from '@/components/frame/main'
import { PortalNav } from '@/components/portal/portal-nav'
import { Section } from '@/components/ui/section'
import type { Profile } from '@/lib/data/types'

/** The signed-in Web Support layout: the glass sidebar beside the page (above it on phones). */
export const PortalShell = ({ session, children }: { session: Profile; children: ReactNode }) => (
  <Main>
    <Section className="grid items-start gap-6 py-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10 md:py-12 lg:grid-cols-[17rem_minmax(0,1fr)] print:block print:p-0">
      <PortalNav
        name={session.name || session.email}
        school={session.school}
        admin={session.role === 'admin'}
      />
      <div className="min-w-0">{children}</div>
    </Section>
  </Main>
)
