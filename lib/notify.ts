import 'server-only'

import { site } from '@/content/site'

// Emails the team about a new access request or doubt through Web3Forms (the same free service
// the contact form uses), so no mail server is needed: https://docs.web3forms.com — "Submit a
// form via JSON". Without NEXT_PUBLIC_WEB3FORMS_KEY nothing is sent; the admin page still lists
// everything, so nothing is lost.
export async function notifyTeam(subject: string, fields: Record<string, string>) {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY
  if (!key) return { sent: false as const }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject,
        from_name: `${site.shortName} website`,
        ...fields,
      }),
    })
    return { sent: res.ok }
  } catch {
    return { sent: false as const }
  }
}
