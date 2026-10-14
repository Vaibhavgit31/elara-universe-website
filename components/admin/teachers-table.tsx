import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import { subjectLabel } from '@/content/series'
import type { Profile } from '@/lib/data/types'

const columns = ['Name', 'Email', 'School', 'Role', 'Classes', 'Subjects', 'Status']
const cell = 'px-4 py-3 align-middle'
const list = (items: string[]) => items.join(', ') || '—'

/** Every account as a real table on glass; wide screens see it all, phones scroll it sideways. */
export function TeachersTable({
  profiles,
  className,
}: {
  profiles: Profile[]
  className?: string
}) {
  return (
    <Glass spotlight={false} className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl text-left text-small">
          <thead className="border-b border-sage-100">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className={`${cell} eyebrow`}>
                  {column}
                </th>
              ))}
              <th scope="col" className={cell}>
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100">
            {profiles.map((p) => (
              <tr key={p.id} data-testid="teacher-row">
                <td className={`${cell} font-bold`}>{p.name}</td>
                <td className={cell}>{p.email}</td>
                <td className={cell}>{p.school || '—'}</td>
                <td className={`${cell} capitalize`}>{p.role}</td>
                <td className={cell}>{list(p.classes.map(String))}</td>
                <td className={cell}>{list(p.subjects.map((s) => subjectLabel[s]))}</td>
                <td className={cell}>
                  <Tag>{p.active ? 'Active' : 'Deactivated'}</Tag>
                </td>
                <td className={cell}>
                  <Button
                    href={`/admin/teachers/${p.id}`}
                    variant="ghost"
                    className="px-4 py-1.5 text-small"
                  >
                    <Pencil aria-hidden size={16} /> Edit<span className="sr-only"> {p.name}</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Glass>
  )
}
