import { createHmac, randomUUID } from 'node:crypto'
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from 'ai'
import { z } from 'zod'
import { siteConfig } from '@/content/site-config'
import { aiConfigured, grok } from '@/lib/ai/xai'
import { clientIp } from '@/lib/auth/rate-limit'
import { systemPrompt } from '@/lib/chat/knowledge'
import { mockAnswer, pickLinks, type ChatLink } from '@/lib/chat/links'
import { getStore } from '@/lib/data/store'

// Elu's chat endpoint. Streams the answer as an AI SDK UI message stream (createUIMessageStream +
// toUIMessageStream, AI SDK 7: https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data) from xAI Grok
// (https://ai-sdk.dev/providers/ai-sdk-providers/xai), then adds the link buttons as a data part.
// Nothing said in the chat is stored: only an anonymous counter per visitor for the rate limit.
export const maxDuration = 30

export type EluMessage = import('ai').UIMessage<never, { links: ChatLink[] }>

const MAX_CHARS = 500
const WINDOW_MS = 10 * 60_000
const text = z.string().max(4000)
const body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        parts: z.array(z.object({ type: z.string(), text: text.optional() })).max(20),
      }),
    )
    .min(1)
    .max(30),
})

const plain = (status: number, message: string) =>
  new Response(message, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } })

/** The visitor, as a keyed hash of their IP and today's date: counts cannot be traced back. */
const visitorKey = (ip: string) =>
  createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'elara-mock-mode')
    .update(`${new Date().toISOString().slice(0, 10)}|${ip}`)
    .digest('base64url')

export async function POST(request: Request) {
  // Only this site's own pages may use the endpoint (and the shared AI budget).
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== request.headers.get('host'))
    return plain(403, 'Not allowed.')
  const parsed = body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return plain(400, 'Please send a question.')
  // Text only, the last eight turns; links and other parts from the browser are dropped.
  const messages = parsed.data.messages
    .map(({ role, parts }) => ({
      role,
      content: parts
        .filter((p) => p.type === 'text')
        .map((p) => p.text ?? '')
        .join(' ')
        .trim(),
    }))
    .filter((m) => m.content)
    .slice(-8)
  const question = messages.at(-1)
  if (question?.role !== 'user') return plain(400, 'Please send a question.')
  if (question.content.length > MAX_CHARS)
    return plain(400, `Please keep your question under ${MAX_CHARS} characters.`)

  const ip = await clientIp()
  if (ip) {
    const window = new Date(Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS)
    const usage = await (
      await getStore()
    ).bumpUsage('chat', visitorKey(ip), window, siteConfig.chatPer10Minutes)
    if (!usage.allowed)
      return plain(
        429,
        'You have asked a lot of questions. Please wait a few minutes and try again.',
      )
  }

  const stream = createUIMessageStream<EluMessage>({
    execute: async ({ writer }) => {
      let answer: string
      if (aiConfigured) {
        const result = streamText({
          model: grok(),
          instructions: systemPrompt(),
          messages,
          maxOutputTokens: 350,
          temperature: 0.3,
          maxRetries: 2,
          timeout: { firstChunkMs: 15_000, totalMs: 25_000 },
          providerOptions: { xai: { store: false } },
        })
        writer.merge(toUIMessageStream({ stream: result.stream, sendFinish: false }))
        answer = await result.text
      } else {
        // Mock mode: the same content answers, without any AI, streamed like a real reply.
        answer = mockAnswer(question.content)
        const id = randomUUID()
        writer.write({ type: 'start' })
        writer.write({ type: 'text-start', id })
        for (const word of answer.split(/(?<= )/))
          writer.write({ type: 'text-delta', id, delta: word })
        writer.write({ type: 'text-end', id })
      }
      writer.write({ type: 'data-links', data: pickLinks(question.content, answer) })
      writer.write({ type: 'finish' })
    },
    onError: () => 'Elu could not answer just now. Please try again, or ask our team.',
  })
  return createUIMessageStreamResponse({ stream })
}
