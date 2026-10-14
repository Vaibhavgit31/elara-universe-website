import type { Subject } from '@/content/series'

// Records kept in Supabase (supabase/migrations/20261014120000_phase2_schema.sql) and, in mock
// mode, in memory. Field names mirror the table columns so the two stores stay interchangeable.

export type Role = 'teacher' | 'admin'
export type RequestRole = 'teacher' | 'principal' | 'coordinator'
export type ClassNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Profile = {
  id: string
  email: string
  name: string
  school: string
  phone: string
  role: Role
  classes: ClassNumber[]
  subjects: Subject[]
  active: boolean
  createdAt: string
}

/** Who is signed in: a profile, or null for a visitor. */
export type Session = Profile | null

export type AccessRequest = {
  id: string
  name: string
  school: string
  role: RequestRole
  email: string
  phone: string
  book: string
  class: ClassNumber
  message: string
  status: 'new' | 'approved' | 'declined'
  userId: string | null
  createdAt: string
}

export type Doubt = {
  id: string
  name: string
  email: string
  school: string
  question: string
  page: string
  userId: string | null
  status: 'open' | 'answered'
  answer: string
  createdAt: string
}

/** A saved Test Maker paper. `settings` and `questions` are the Test Maker's own JSON shapes. */
export type SavedTest = {
  id: string
  teacherId: string
  title: string
  class: ClassNumber
  subject: Subject
  bookSlug: string
  chapters: string[]
  settings: Record<string, unknown>
  questions: unknown[]
  createdAt: string
  updatedAt: string
}

export type NewTeacher = Pick<
  Profile,
  'email' | 'name' | 'school' | 'phone' | 'classes' | 'subjects'
>
export type TeacherChanges = Partial<
  Pick<Profile, 'name' | 'school' | 'phone' | 'classes' | 'subjects' | 'active'>
>
export type NewRequest = Omit<AccessRequest, 'id' | 'status' | 'userId' | 'createdAt'>
export type NewDoubt = Omit<Doubt, 'id' | 'status' | 'answer' | 'createdAt'>
export type NewTest = Omit<SavedTest, 'id' | 'createdAt' | 'updatedAt'>

/** Result of creating an account: the invite went out, or a one-time password is shown once. */
export type Created = { profile: Profile; temporaryPassword?: string }
