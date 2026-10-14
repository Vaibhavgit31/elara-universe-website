import 'server-only'

import { randomBytes, randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { demoLogins, isAdminEmail } from '@/lib/auth/config'
import { MOCK_SESSION_COOKIE } from '@/lib/auth/cookie-names'
import { openMockSession, sealMockSession } from '@/lib/auth/mock-cookie'
import type { DataStore } from '@/lib/data/store'
import type { AccessRequest, Doubt, Profile, SavedTest } from '@/lib/data/types'

// Mock mode: accounts, requests, doubts and papers live in this process's memory and reset on
// restart. The demo sign-ins below are printed on the login page in mock mode; they are not
// secrets and never exist in a real deployment.
export const demoAccounts = [
  { email: 'admin@example.com', password: 'elara-admin-demo', role: 'admin' },
  { email: 'teacher@example.com', password: 'elara-teacher-demo', role: 'teacher' },
  { email: 'other@example.com', password: 'elara-other-demo', role: 'teacher' },
] as const

const now = () => new Date().toISOString()
const profile = (p: Partial<Profile> & Pick<Profile, 'id' | 'email' | 'name'>): Profile => ({
  school: '',
  phone: '',
  role: 'teacher',
  classes: [],
  subjects: [],
  active: true,
  createdAt: now(),
  ...p,
})

const profiles = new Map<string, Profile>(
  [
    profile({ id: 'mock-admin', email: 'admin@example.com', name: 'Demo Admin', role: 'admin' }),
    profile({
      id: 'mock-teacher',
      email: 'teacher@example.com',
      name: 'Demo Teacher',
      school: 'Demo Public School',
      phone: '+91 96257 41192',
      classes: [1, 2, 3],
      subjects: ['hindi', 'computer'],
    }),
    profile({
      id: 'mock-other',
      email: 'other@example.com',
      name: 'Another Teacher',
      school: 'Demo Public School',
      classes: [5],
      subjects: ['drawing'],
    }),
  ].map((p) => [p.id, p]),
)
const passwords = new Map<string, string>(demoAccounts.map((a) => [a.email, a.password]))
const requests = new Map<string, AccessRequest>([
  [
    'mock-request-1',
    {
      id: 'mock-request-1',
      name: 'Demo Principal',
      school: 'Demo Public School',
      role: 'principal',
      email: 'principal@example.com',
      phone: '+91 96257 41192',
      book: 'hindi-3',
      class: 3,
      message: 'We use the Hindi Reader in Classes 1 to 3.',
      status: 'new',
      userId: null,
      createdAt: now(),
    },
  ],
])
const doubts = new Map<string, Doubt>([
  [
    'mock-doubt-1',
    {
      id: 'mock-doubt-1',
      name: 'Demo Teacher',
      email: 'teacher@example.com',
      school: 'Demo Public School',
      question: 'Where do I find the Class 2 worksheets?',
      page: '/web-support/help',
      userId: 'mock-teacher',
      status: 'open',
      answer: '',
      createdAt: now(),
    },
  ],
])
const seedTest = (
  t: Pick<SavedTest, 'id' | 'teacherId' | 'title' | 'class' | 'subject' | 'bookSlug'>,
): SavedTest => ({
  ...t,
  chapters: [],
  settings: {},
  questions: [],
  createdAt: now(),
  updatedAt: now(),
})
const tests = new Map<string, SavedTest>(
  [
    seedTest({
      id: 'mock-test-1',
      teacherId: 'mock-teacher',
      title: 'Hindi unit test (demo)',
      class: 1,
      subject: 'hindi',
      bookSlug: 'hindi-1',
    }),
    seedTest({
      id: 'mock-test-2',
      teacherId: 'mock-other',
      title: 'Drawing test (demo)',
      class: 5,
      subject: 'drawing',
      bookSlug: 'art-journey-5',
    }),
  ].map((t) => [t.id, t]),
)
const usage = new Map<string, number>()

const byEmail = (email: string) =>
  [...profiles.values()].find((p) => p.email === email.trim().toLowerCase())
const temporaryPassword = () => `elara-${randomBytes(6).toString('base64url')}`
const newest = <T extends { createdAt: string }>(items: Iterable<T>) =>
  [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const memoryStore: DataStore = {
  async signIn(email, password) {
    if (!demoLogins) return { ok: false, code: 'unavailable' }
    const found = byEmail(email)
    if (!found || passwords.get(found.email) !== password)
      return { ok: false, code: 'invalid_credentials' }
    if (!found.active) return { ok: false, code: 'inactive' }
    if (isAdminEmail(found.email)) found.role = 'admin'
    ;(await cookies()).set(MOCK_SESSION_COOKIE, sealMockSession(found.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return { ok: true, profile: found }
  },
  async signOut() {
    ;(await cookies()).delete(MOCK_SESSION_COOKIE)
  },
  async currentProfile() {
    if (!demoLogins) return null
    const id = openMockSession((await cookies()).get(MOCK_SESSION_COOKIE)?.value)
    const found = id ? profiles.get(id) : undefined
    return found?.active ? found : null
  },
  async requestPasswordReset() {
    // Nothing is sent in mock mode; the page says so.
  },
  async updatePassword(password) {
    const me = await memoryStore.currentProfile()
    if (!me) return { ok: false, message: 'Please sign in again.' }
    passwords.set(me.email, password)
    return { ok: true }
  },

  async updateOwnProfile(changes) {
    const me = await memoryStore.currentProfile()
    if (!me) throw new Error('Please sign in again.')
    return Object.assign(me, changes)
  },

  async listProfiles() {
    return [...profiles.values()].sort((a, b) => a.name.localeCompare(b.name))
  },
  async getProfile(id) {
    return profiles.get(id) ?? null
  },
  async createTeacher(data, mode) {
    const email = data.email.trim().toLowerCase()
    if (byEmail(email)) throw new Error('An account with this email already exists.')
    const created = profile({ ...data, email, id: randomUUID() })
    profiles.set(created.id, created)
    const password = temporaryPassword()
    passwords.set(email, password)
    return mode === 'password'
      ? { profile: created, temporaryPassword: password }
      : { profile: created }
  },
  async updateTeacher(id, changes) {
    const found = profiles.get(id)
    if (!found) throw new Error('Account not found.')
    Object.assign(found, changes)
    return found
  },
  async resetTeacherPassword(id, mode) {
    const found = profiles.get(id)
    if (!found) throw new Error('Account not found.')
    if (mode === 'email') return {}
    const password = temporaryPassword()
    passwords.set(found.email, password)
    return { temporaryPassword: password }
  },

  async createRequest(data) {
    const request: AccessRequest = {
      ...data,
      id: randomUUID(),
      status: 'new',
      userId: null,
      createdAt: now(),
    }
    requests.set(request.id, request)
    return request
  },
  async listRequests() {
    return newest(requests.values())
  },
  async getRequest(id) {
    return requests.get(id) ?? null
  },
  async setRequestStatus(id, status, _by, userId) {
    const found = requests.get(id)
    if (found) Object.assign(found, { status, userId: userId ?? found.userId })
  },
  async createDoubt(data) {
    const doubt: Doubt = { ...data, id: randomUUID(), status: 'open', answer: '', createdAt: now() }
    doubts.set(doubt.id, doubt)
    return doubt
  },
  async listDoubts() {
    return newest(doubts.values())
  },
  async answerDoubt(id, answer) {
    const found = doubts.get(id)
    if (found) Object.assign(found, { answer, status: 'answered' })
  },

  async listTests(teacherId) {
    return [...tests.values()]
      .filter((t) => t.teacherId === teacherId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
  async getTest(id, teacherId) {
    const found = tests.get(id)
    return found?.teacherId === teacherId ? found : null
  },
  async saveTest(test) {
    const existing = test.id ? tests.get(test.id) : undefined
    if (test.id && existing?.teacherId !== test.teacherId) throw new Error('Test not found.')
    const saved: SavedTest = {
      ...test,
      id: existing?.id ?? randomUUID(),
      createdAt: existing?.createdAt ?? now(),
      updatedAt: now(),
    }
    tests.set(saved.id, saved)
    return saved
  },
  async deleteTest(id, teacherId) {
    if (tests.get(id)?.teacherId === teacherId) tests.delete(id)
  },

  async bumpUsage(kind, key, windowStart, limit) {
    const k = `${kind}:${key}:${windowStart.toISOString()}`
    const count = (usage.get(k) ?? 0) + 1
    usage.set(k, count)
    return { allowed: count <= limit, count }
  },
}
