import { mockMode } from '@/lib/auth/config'
import { memoryStore } from '@/lib/data/memory-store'
import type {
  AccessRequest,
  Created,
  Doubt,
  NewDoubt,
  NewRequest,
  NewTeacher,
  NewTest,
  Profile,
  SavedTest,
  Session,
  TeacherChanges,
} from '@/lib/data/types'

export type SignInError = 'invalid_credentials' | 'inactive' | 'error'
export type SignInResult = { ok: true; profile: Profile } | { ok: false; code: SignInError }
export type ResetMode = 'email' | 'password'

/**
 * Everything the site reads and writes about people and papers. Two implementations: Supabase
 * (lib/data/supabase-store.ts) and an in-memory mock with demo accounts (memory-store.ts) used
 * whenever the Supabase variables are missing. Callers never touch a database client directly;
 * authorisation happens in lib/auth/session.ts before any admin method is called.
 */
export interface DataStore {
  // Sessions (read and written through cookies; only valid inside Server Actions / handlers).
  signIn(email: string, password: string): Promise<SignInResult>
  signOut(): Promise<void>
  currentProfile(): Promise<Session>
  requestPasswordReset(email: string): Promise<void>
  updatePassword(password: string): Promise<{ ok: boolean; message?: string }>
  /** A signed-in person changes their own contact details (never role, classes or subjects). */
  updateOwnProfile(changes: Pick<Profile, 'name' | 'school' | 'phone'>): Promise<Profile>

  // Admin: accounts.
  listProfiles(): Promise<Profile[]>
  getProfile(id: string): Promise<Profile | null>
  createTeacher(data: NewTeacher, mode: 'invite' | 'password'): Promise<Created>
  updateTeacher(id: string, changes: TeacherChanges): Promise<Profile>
  resetTeacherPassword(id: string, mode: ResetMode): Promise<{ temporaryPassword?: string }>

  // Public forms (written by the server after validation) and their admin views.
  createRequest(data: NewRequest): Promise<AccessRequest>
  listRequests(): Promise<AccessRequest[]>
  getRequest(id: string): Promise<AccessRequest | null>
  setRequestStatus(
    id: string,
    status: AccessRequest['status'],
    by: string,
    userId?: string,
  ): Promise<void>
  createDoubt(data: NewDoubt): Promise<Doubt>
  listDoubts(): Promise<Doubt[]>
  answerDoubt(id: string, answer: string, by: string): Promise<void>

  // Test Maker papers, always scoped to the signed-in teacher.
  listTests(teacherId: string): Promise<SavedTest[]>
  getTest(id: string, teacherId: string): Promise<SavedTest | null>
  saveTest(test: NewTest & { id?: string }): Promise<SavedTest>
  deleteTest(id: string, teacherId: string): Promise<void>

  /** Counts one more use in the window; `allowed` is false once `limit` is reached. */
  bumpUsage(
    kind: 'chat' | 'test',
    key: string,
    windowStart: Date,
    limit: number,
    userId?: string,
  ): Promise<{ allowed: boolean; count: number }>
}

/** The store for this deployment: Supabase when configured, the demo memory store otherwise. */
export async function getStore(): Promise<DataStore> {
  if (mockMode) return memoryStore
  const { supabaseStore } = await import('@/lib/data/supabase-store')
  return supabaseStore
}
