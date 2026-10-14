export type Session = { name: string; role: 'teacher' | 'admin' } | null

/** Who is logged in. Step F replaces this with the Supabase session (docs/research/supabase.md);
 *  until then nobody is, so the top bar shows "Teacher login". */
export const useSession = (): Session => null
