'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useAnimate } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, buttonClass } from '@/components/ui/button'
import { bookBySlug } from '@/content/books'
import { series, subjectLabel, type Subject } from '@/content/series'
import { site, whatsappLink } from '@/content/site'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const roles = ['teacher', 'principal', 'parent', 'distributor', 'other'] as const
const classes = ['1', '2', '3', '4', '5', '6', '7', '8'] as const
const subjects = series.map((s) => s.subject) as [Subject, ...Subject[]]
const COOLDOWN_KEY = 'elara:contact-sent-at'
const COOLDOWN_MS = 60_000
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ''

const schema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.'),
  school: z.string().trim(),
  role: z.enum(roles, { error: 'Please choose your role.' }),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .pipe(
      z
        .string()
        .regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number, e.g. 96257 41192.'),
    ),
  email: z.email('Enter a valid email address.'),
  city: z.string().trim().min(2, 'Which city are you in?'),
  subjects: z.array(z.enum(subjects)).min(1, 'Pick at least one subject.'),
  classes: z.array(z.enum(classes)),
  message: z
    .string()
    .trim()
    .min(10, 'A few words will help us help you.')
    .max(2000, 'Please keep it under 2000 characters.'),
  botcheck: z.boolean(),
})
type Input = z.input<typeof schema>
type Output = z.output<typeof schema>

const subscribe = (notify: () => void) => {
  window.addEventListener('popstate', notify)
  return () => window.removeEventListener('popstate', notify)
}
/** ?book=<slug> pre-fills the letter with a sample copy request for that book. */
const useBookFromUrl = () => {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => '',
  )
  return bookBySlug(new URLSearchParams(search).get('book') ?? '')
}

const lastSentAt = () => {
  try {
    return Number(localStorage.getItem(COOLDOWN_KEY) ?? 0)
  } catch {
    return 0
  }
}

/** Plain-text version of the letter, for the email and WhatsApp fallbacks. */
const letterText = (d: Output) =>
  [
    `Name: ${d.name}`,
    d.school && `School: ${d.school}`,
    `Role: ${d.role}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    `City: ${d.city}`,
    `Subjects: ${d.subjects.map((s) => subjectLabel[s]).join(', ')}`,
    d.classes.length && `Classes: ${d.classes.join(', ')}`,
    '',
    d.message,
  ]
    .filter(Boolean)
    .join('\n')

const Field = ({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) => (
  <label className="block">
    <span className="eyebrow">{label}</span>
    {children}
    {hint && !error && <span className="mt-1 block text-small text-forest">{hint}</span>}
    {error && (
      <span role="alert" className="mt-1 block text-small font-semibold text-drawing">
        {error}
      </span>
    )}
  </label>
)
const inputClass = (invalid?: boolean) =>
  cn(
    'mt-1 block w-full border-0 border-b-2 border-sage bg-transparent px-1 py-2 font-body text-body text-evergreen placeholder:text-sage focus:border-forest focus:outline-none',
    invalid && 'border-drawing',
  )
const chipClass =
  'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-sage px-4 text-small font-semibold text-forest has-checked:border-forest has-checked:bg-sage-100 has-checked:text-evergreen'

async function burst() {
  const confetti = (await import('canvas-confetti')).default
  const leaf = confetti.shapeFromPath({ path: 'M0 10c0-8 8-10 20-10 0 12-8 14-20 10z' })
  confetti({
    particleCount: 70,
    spread: 75,
    startVelocity: 35,
    origin: { y: 0.65 },
    colors: ['#8A9A74', '#B68235', '#3F5645', '#E8A53A', '#DCE5D2'],
    shapes: [leaf, 'star'],
    scalar: 1.1,
  })
}

/** A letter on lined paper. Sent through Web3Forms, or handed to email/WhatsApp without a key. */
export function ContactForm() {
  const book = useBookFromUrl()
  const reduced = useReducedMotion()
  const [scope, animate] = useAnimate()
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'sent' | 'error' | 'fallback' | 'cooldown'
  >('idle')
  const [error, setError] = useState('')
  const [letter, setLetter] = useState<Output | null>(null)
  const form = useForm<Input, unknown, Output>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      school: '',
      phone: '',
      email: '',
      city: '',
      subjects: [],
      classes: [],
      message: '',
      botcheck: false,
    },
  })
  const { reset } = form
  useEffect(() => {
    if (book)
      reset({
        subjects: [book.subject],
        classes: [String(book.class) as (typeof classes)[number]],
        message: `Sample copy request: ${book.series} Class ${book.class}`,
      })
  }, [book, reset])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const fly = async () => {
    if (reduced) return
    await animate(
      'form',
      { scaleY: 0.35, scaleX: 0.6, rotate: -6, opacity: 0.7 },
      { duration: 0.45, ease: 'easeIn' },
    )
    animate('.plane', { opacity: 1 }, { duration: 0.2 })
    await animate(
      scope.current,
      { x: '110vw', y: '-70vh', rotate: -20, scale: 0.5 },
      { duration: 0.9, ease: 'easeIn' },
    )
  }

  const onSubmit = async (data: Output) => {
    setLetter(data)
    if (data.botcheck) return setStatus('sent') // a bot filled the hidden field: pretend it worked
    if (Date.now() - lastSentAt() < COOLDOWN_MS) return setStatus('cooldown')
    if (!ACCESS_KEY) return setStatus('fallback')
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Website enquiry from ${data.name}`,
          from_name: `${site.shortName} website`,
          ...data,
          subjects: data.subjects.map((s) => subjectLabel[s]).join(', '),
          classes: data.classes.join(', '),
        }),
      })
      const json: { success?: boolean; message?: string } = await res.json().catch(() => ({}))
      if (!res.ok || !json.success)
        throw new Error(json.message || `The form service answered ${res.status}.`)
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
      } catch {}
      await fly()
      setStatus('sent')
      if (!reduced) burst()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'sent' && letter)
    return (
      <div role="status" className="relative -rotate-1 bg-hindi-tint p-8 shadow-page">
        <p className="font-hand text-3xl">Thank you, {letter.name}!</p>
        <p className="mt-3">
          Your letter is on its way to {site.email}. We&apos;ll write back to {letter.email}.
        </p>
      </div>
    )

  const text = letter ? letterText(letter) : ''
  return (
    <div ref={scope} className="relative" data-mode={ACCESS_KEY ? 'web3forms' : 'fallback'}>
      <svg
        aria-hidden
        className="plane pointer-events-none absolute top-1/2 left-1/2 w-24 -translate-x-1/2 -translate-y-1/2 opacity-0"
        viewBox="0 0 100 60"
      >
        <path
          d="M2 30 98 4 70 58 48 40 30 56l4-22z"
          fill="#F5F0E8"
          stroke="#3F5645"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M34 34 98 4" fill="none" stroke="#3F5645" strokeWidth="3" />
      </svg>
      <form
        onSubmit={(e) => handleSubmit(onSubmit)(e)}
        noValidate
        className="space-y-5 bg-cream bg-[repeating-linear-gradient(transparent_0_31px,var(--color-sage-100)_31px_32px)] p-6 shadow-page sm:p-8"
        aria-label="Write to us"
      >
        <p className="font-hand text-2xl text-forest">Dear Elara Universe,</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" error={errors.name?.message}>
            <input
              {...register('name')}
              autoComplete="name"
              className={inputClass(!!errors.name)}
              aria-invalid={!!errors.name}
            />
          </Field>
          <Field label="School name" hint="Optional">
            <input {...register('school')} autoComplete="organization" className={inputClass()} />
          </Field>
          <Field label="I am a" error={errors.role?.message}>
            <select
              {...register('role')}
              defaultValue=""
              className={inputClass(!!errors.role)}
              aria-invalid={!!errors.role}
            >
              <option value="" disabled>
                Choose one
              </option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r[0].toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phone" error={errors.phone?.message} hint="10-digit Indian mobile number">
            <input
              {...register('phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={inputClass(!!errors.phone)}
              aria-invalid={!!errors.phone}
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={inputClass(!!errors.email)}
              aria-invalid={!!errors.email}
            />
          </Field>
          <Field label="City" error={errors.city?.message}>
            <input
              {...register('city')}
              autoComplete="address-level2"
              className={inputClass(!!errors.city)}
              aria-invalid={!!errors.city}
            />
          </Field>
        </div>
        <fieldset>
          <legend className="eyebrow">Subjects of interest</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {subjects.map((s) => (
              <label key={s} className={chipClass}>
                <input
                  type="checkbox"
                  value={s}
                  {...register('subjects')}
                  className="accent-forest"
                />
                {subjectLabel[s]}
              </label>
            ))}
          </div>
          {errors.subjects && (
            <p role="alert" className="mt-1 text-small font-semibold text-drawing">
              {errors.subjects.message}
            </p>
          )}
        </fieldset>
        <fieldset>
          <legend className="eyebrow">Classes</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {classes.map((c) => (
              <label key={c} className={chipClass}>
                <input
                  type="checkbox"
                  value={c}
                  {...register('classes')}
                  className="accent-forest"
                />
                {c}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Message" error={errors.message?.message}>
          <textarea
            {...register('message')}
            rows={5}
            className={cn(inputClass(!!errors.message), 'leading-8')}
            aria-invalid={!!errors.message}
          />
        </Field>
        {/* Honeypot: people never see this; bots that fill it get a polite nothing. */}
        <input
          type="checkbox"
          {...register('botcheck')}
          tabIndex={-1}
          aria-hidden
          className="hidden"
        />
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Folding your letter…' : 'Send the letter'}
          </Button>
          <span className="font-hand text-xl text-forest">Yours sincerely</span>
        </div>
        {status === 'error' && (
          <p role="alert" className="rounded-lg bg-drawing-tint p-4 text-small">
            Sorry, the letter could not be sent ({error}). Your words are still here — try again, or
            write to{' '}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        )}
        {status === 'cooldown' && (
          <p role="alert" className="rounded-lg bg-hindi-tint p-4 text-small">
            Thank you — your last letter went a moment ago. Please wait a minute before sending
            another.
          </p>
        )}
      </form>
      <motion.div
        role="status"
        initial={false}
        animate={{ opacity: status === 'fallback' ? 1 : 0, y: status === 'fallback' ? 0 : 12 }}
        className={cn(
          'mt-6 rotate-1 bg-hindi-tint p-6 shadow-page',
          status !== 'fallback' && 'hidden',
        )}
      >
        <p className="font-hand text-2xl">Your letter is written!</p>
        <p className="mt-2 text-small">
          The online letterbox is not connected yet, so send it the way you like best:
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(text)}`}
            className={buttonClass('primary')}
          >
            Send by email
          </a>
          <a
            href={whatsappLink(text)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('secondary')}
          >
            Send on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  )
}
