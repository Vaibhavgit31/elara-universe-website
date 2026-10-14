'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ArrowRight, MessageCircleQuestion, Send, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { EluMessage } from '@/app/api/chat/route'
import { Elu } from '@/components/mascot/elu'
import { buttonClass } from '@/components/ui/button-class'
import { Tag } from '@/components/ui/tag'
import { cn } from '@/lib/cn'

// Elu's chat panel (AI SDK UI: useChat + DefaultChatTransport, https://ai-sdk.dev/docs/ai-sdk-ui/chatbot).
// Loaded only when the bubble is first opened. The conversation lives in this tab only.

const MAX = 500
const suggestions = [
  'Which books are for Class 3?',
  'How do I get a sample copy?',
  'How does Web Support work?',
  'Upcoming events',
]
const transport = new DefaultChatTransport<EluMessage>({ api: '/api/chat/' })

/** The friendly reason for a failed request: the server's own words for "too many", else general. */
const problem = (error: Error) =>
  'statusCode' in error && (error.statusCode === 429 || error.statusCode === 400)
    ? error.message
    : 'Elu could not answer just now. Please try again, or ask our team.'

export default function ChatPanel({
  open,
  onClose,
  mock,
}: {
  open: boolean
  onClose: () => void
  mock: boolean
}) {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, error, clearError, regenerate } = useChat<EluMessage>({
    transport,
  })
  const field = useRef<HTMLTextAreaElement>(null)
  const log = useRef<HTMLDivElement>(null)
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (open) field.current?.focus()
  }, [open])
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [messages, status])

  const send = (text: string) => {
    const question = text.trim().slice(0, MAX)
    if (!question || busy) return
    clearError()
    sendMessage({ text: question })
    setInput('')
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <section
      id="elu-chat"
      role="dialog"
      aria-labelledby="elu-chat-title"
      hidden={!open}
      onKeyDown={onKeyDown}
      data-testid="chat-panel"
      className="glass fixed inset-x-2 top-[calc(var(--topbar-h)+0.5rem)] bottom-[4.25rem] z-[95] flex flex-col rounded-lg bg-paper/95 md:inset-x-auto md:top-auto md:right-6 md:bottom-24 md:h-[min(36rem,calc(100svh-var(--topbar-h)-8rem))] md:w-[24rem]"
    >
      <header className="flex items-start gap-3 border-b border-sage-100 p-4">
        <Elu pose="wave" className="w-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 id="elu-chat-title" className="text-lg">
              Ask Elu
            </h2>
            {mock && (
              <span data-testid="chat-mock">
                <Tag className="py-0.5 text-xs">Mock mode</Tag>
              </span>
            )}
          </div>
          <p className="text-small text-forest">AI answers can be wrong.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the chat"
          className="focus-glow -m-1 flex size-11 shrink-0 items-center justify-center rounded-full text-forest hover:bg-mint"
        >
          <X aria-hidden size={20} />
        </button>
      </header>

      <div
        ref={log}
        role="log"
        aria-live="polite"
        aria-label="Conversation with Elu"
        className="flex-1 space-y-4 overflow-y-auto p-4 [font-family:var(--font-nunito),var(--font-devanagari),sans-serif]"
      >
        {messages.length === 0 && (
          <div>
            <p>
              Hello! I can answer questions about Elara Universe books and this website. Please do
              not share personal details here.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="focus-glow min-h-11 rounded-full border border-sage px-4 text-left text-small font-semibold text-forest hover:bg-mint"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {messages.map((message) => {
          const said = message.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')
          const links = message.parts.flatMap((p) => (p.type === 'data-links' ? p.data : []))
          const mine = message.role === 'user'
          return (
            <div key={message.id} className={cn('flex flex-col gap-2', mine && 'items-end')}>
              <p
                className={cn(
                  'max-w-[85%] rounded-md px-4 py-2 whitespace-pre-line',
                  mine ? 'bg-leaf-700 text-white' : 'bg-white/80 text-evergreen',
                )}
              >
                <span className="sr-only">{mine ? 'You: ' : 'Elu: '}</span>
                {said}
              </p>
              {links.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Pages for this answer">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={buttonClass(
                          link.kind === 'ask' ? 'secondary' : 'ghost',
                          'min-h-11 px-4 py-1.5 text-small',
                        )}
                      >
                        {link.kind === 'ask' ? (
                          <MessageCircleQuestion aria-hidden size={16} />
                        ) : (
                          <ArrowRight aria-hidden size={16} />
                        )}
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
        {status === 'submitted' && (
          <p className="font-hand text-xl text-forest" data-testid="chat-thinking">
            Elu is thinking…
          </p>
        )}
        {error && (
          <div role="alert" className="rounded-sm bg-drawing-tint p-4 text-small">
            <p>{problem(error)}</p>
            <button type="button" onClick={() => regenerate()} className="link mt-2 font-semibold">
              Try again
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="border-t border-sage-100 p-3"
        aria-label="Ask a question"
      >
        <div className="flex items-end gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Your question</span>
            <textarea
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              maxLength={MAX}
              rows={2}
              placeholder="Ask about books, classes, sample copies…"
              className="block w-full resize-none rounded-sm border border-sage bg-white/70 px-3 py-2 text-small text-evergreen placeholder:text-forest/70 focus:border-forest focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="focus-glow flex size-11 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white hover:bg-forest disabled:opacity-50"
          >
            <Send aria-hidden size={18} />
          </button>
        </div>
        <p className="mt-1 text-right text-xs text-forest">
          {input.length}/{MAX}
        </p>
      </form>
    </section>
  )
}
