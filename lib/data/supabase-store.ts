import 'server-only'

import { randomBytes } from 'node:crypto'
import { isAdminEmail, siteUrl } from '@/lib/auth/config'
import type { DataStore, SignInResult } from '@/lib/data/store'
import type { AccessRequest, Doubt, Profile, SavedTest } from '@/lib/data/types'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// Supabase implementation. Reads on behalf of a teacher go through the request's user client, so
// Row Level Security applies (a teacher's client cannot see another teacher's rows); admin
// operations and the public forms use the secret-key client after lib/auth/session.ts has
// confirmed who is calling. API references read from the installed @supabase/auth-js types
// (docs/research/supabase.md): auth.signInWithPassword, getUser, resetPasswordForEmail, updateUser,
// auth.admin.createUser / inviteUserByEmail / updateUserById.

type Row = Record<string, unknown>
const str = (v: unknown) => (typeof v === 'string' ? v : '')

const toProfile = (r: Row): Profile => ({
  id: str(r.id),
  email: str(r.email),
  name: str(r.name),
  school: str(r.school),
  phone: str(r.phone),
  role: r.role === 'admin' ? 'admin' : 'teacher',
  classes: (r.classes as Profile['classes']) ?? [],
  subjects: (r.subjects as Profile['subjects']) ?? [],
  active: r.active !== false,
  createdAt: str(r.created_at),
})
const toRequest = (r: Row): AccessRequest => ({
  id: str(r.id),
  name: str(r.name),
  school: str(r.school),
  role: r.role as AccessRequest['role'],
  email: str(r.email),
  phone: str(r.phone),
  book: str(r.book),
  class: Number(r.class) as AccessRequest['class'],
  message: str(r.message),
  status: r.status as AccessRequest['status'],
  userId: (r.user_id as string | null) ?? null,
  createdAt: str(r.created_at),
})
const toDoubt = (r: Row): Doubt => ({
  id: str(r.id),
  name: str(r.name),
  email: str(r.email),
  school: str(r.school),
  question: str(r.question),
  page: str(r.page),
  userId: (r.user_id as string | null) ?? null,
  status: r.status as Doubt['status'],
  answer: str(r.answer),
  createdAt: str(r.created_at),
})
const toTest = (r: Row): SavedTest => ({
  id: str(r.id),
  teacherId: str(r.teacher_id),
  title: str(r.title),
  class: Number(r.class) as SavedTest['class'],
  subject: r.subject as SavedTest['subject'],
  bookSlug: str(r.book_slug),
  chapters: (r.chapters as string[]) ?? [],
  settings: (r.settings as Record<string, unknown>) ?? {},
  questions: (r.questions as unknown[]) ?? [],
  createdAt: str(r.created_at),
  updatedAt: str(r.updated_at),
})

const temporaryPassword = () => `elara-${randomBytes(6).toString('base64url')}`
const fail = (error: { message: string } | null) => {
  if (error) throw new Error(error.message)
}

/** The signed-in user's profile. Admin emails (ADMIN_EMAILS) are promoted on first sight so the
 *  database's own admin check (private.is_admin) agrees with the environment. */
async function profileFor(userId: string, email: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (!data) return null
  const profile = toProfile(data)
  if (isAdminEmail(email) && profile.role !== 'admin') {
    await createAdminClient().from('profiles').update({ role: 'admin' }).eq('id', userId)
    profile.role = 'admin'
  }
  return profile
}

export const supabaseStore: DataStore = {
  async signIn(email, password): Promise<SignInResult> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user)
      return {
        ok: false,
        code: error?.code === 'invalid_credentials' ? 'invalid_credentials' : 'error',
      }
    const profile = await profileFor(data.user.id, data.user.email ?? email)
    if (!profile?.active) {
      await supabase.auth.signOut({ scope: 'local' })
      return { ok: false, code: 'inactive' }
    }
    return { ok: true, profile }
  },
  async signOut() {
    await (await createClient()).auth.signOut({ scope: 'local' })
  },
  async currentProfile() {
    const supabase = await createClient()
    // getUser() asks the Auth server, so a revoked session is noticed (never trust getSession()).
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null
    const profile = await profileFor(data.user.id, data.user.email ?? '')
    return profile?.active ? profile : null
  },
  async requestPasswordReset(email) {
    // Never reveals whether the account exists; the email template sends people to /auth/confirm.
    await (
      await createClient()
    ).auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/account/update-password`,
    })
  },
  async updatePassword(password) {
    const { error } = await (await createClient()).auth.updateUser({ password })
    return error ? { ok: false, message: error.message } : { ok: true }
  },

  async updateOwnProfile(changes) {
    // The user's own client: RLS allows the row and the column grant allows only these fields.
    const supabase = await createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error('Please sign in again.')
    const { data, error } = await supabase
      .from('profiles')
      .update(changes)
      .eq('id', auth.user.id)
      .select()
      .single()
    fail(error)
    return toProfile(data)
  },

  async listProfiles() {
    const { data, error } = await createAdminClient().from('profiles').select('*').order('name')
    fail(error)
    return (data ?? []).map(toProfile)
  },
  async getProfile(id) {
    const { data } = await createAdminClient()
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    return data ? toProfile(data) : null
  },
  async createTeacher(data, mode) {
    const admin = createAdminClient()
    const email = data.email.trim().toLowerCase()
    const metadata = { ...data, email, role: 'teacher' }
    const password = temporaryPassword()
    // The handle_new_user trigger turns user_metadata into the profile row (migration).
    const { data: created, error } =
      mode === 'invite'
        ? await admin.auth.admin.inviteUserByEmail(email, {
            data: metadata,
            redirectTo: `${siteUrl}/account/update-password`,
          })
        : await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: metadata,
          })
    fail(error)
    const profile = await supabaseStore.getProfile(created.user!.id)
    if (!profile) throw new Error('The account was created but its profile is missing.')
    return mode === 'password' ? { profile, temporaryPassword: password } : { profile }
  },
  async updateTeacher(id, changes) {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('profiles')
      .update(changes)
      .eq('id', id)
      .select()
      .single()
    fail(error)
    if (changes.active !== undefined) {
      // A deactivated teacher cannot sign in any more (ban); sessions end at their next check.
      const { error: banError } = await admin.auth.admin.updateUserById(id, {
        ban_duration: changes.active ? 'none' : '876000h',
      })
      fail(banError)
    }
    return toProfile(data)
  },
  async resetTeacherPassword(id, mode) {
    const admin = createAdminClient()
    if (mode === 'email') {
      const profile = await supabaseStore.getProfile(id)
      if (profile) await supabaseStore.requestPasswordReset(profile.email)
      return {}
    }
    const password = temporaryPassword()
    const { error } = await admin.auth.admin.updateUserById(id, { password })
    fail(error)
    return { temporaryPassword: password }
  },

  async createRequest(data) {
    const { data: row, error } = await createAdminClient()
      .from('access_requests')
      .insert(data)
      .select()
      .single()
    fail(error)
    return toRequest(row)
  },
  async listRequests() {
    const { data, error } = await createAdminClient()
      .from('access_requests')
      .select('*')
      .order('created_at', { ascending: false })
    fail(error)
    return (data ?? []).map(toRequest)
  },
  async getRequest(id) {
    const { data } = await createAdminClient()
      .from('access_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    return data ? toRequest(data) : null
  },
  async setRequestStatus(id, status, by, userId) {
    const { error } = await createAdminClient()
      .from('access_requests')
      .update({ status, handled_by: by, handled_at: new Date().toISOString(), user_id: userId })
      .eq('id', id)
    fail(error)
  },
  async createDoubt(data) {
    const { userId, ...rest } = data
    const { data: row, error } = await createAdminClient()
      .from('doubts')
      .insert({ ...rest, user_id: userId })
      .select()
      .single()
    fail(error)
    return toDoubt(row)
  },
  async listDoubts() {
    const { data, error } = await createAdminClient()
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false })
    fail(error)
    return (data ?? []).map(toDoubt)
  },
  async answerDoubt(id, answer, by) {
    const { error } = await createAdminClient()
      .from('doubts')
      .update({
        answer,
        status: 'answered',
        answered_by: by,
        answered_at: new Date().toISOString(),
      })
      .eq('id', id)
    fail(error)
  },

  async listTests(teacherId) {
    const { data, error } = await (
      await createClient()
    )
      .from('tests')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('updated_at', { ascending: false })
    fail(error)
    return (data ?? []).map(toTest)
  },
  async getTest(id, teacherId) {
    const { data } = await (
      await createClient()
    )
      .from('tests')
      .select('*')
      .eq('id', id)
      .eq('teacher_id', teacherId)
      .maybeSingle()
    return data ? toTest(data) : null
  },
  async saveTest({ id, teacherId, bookSlug, ...rest }) {
    const row = { ...rest, teacher_id: teacherId, book_slug: bookSlug }
    const query = (await createClient()).from('tests')
    const { data, error } = id
      ? await query.update(row).eq('id', id).eq('teacher_id', teacherId).select().single()
      : await query.insert(row).select().single()
    fail(error)
    return toTest(data)
  },
  async deleteTest(id, teacherId) {
    const { error } = await (
      await createClient()
    )
      .from('tests')
      .delete()
      .eq('id', id)
      .eq('teacher_id', teacherId)
    fail(error)
  },

  async bumpUsage(kind, key, windowStart, limit, userId) {
    const { data, error } = await createAdminClient().rpc('bump_ai_usage', {
      p_kind: kind,
      p_key: key,
      p_window: windowStart.toISOString(),
      p_user: userId ?? null,
    })
    fail(error)
    const count = Number(data ?? 0)
    return { allowed: count <= limit, count }
  },
}
