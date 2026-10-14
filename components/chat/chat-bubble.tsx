'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { Elu } from '@/components/mascot/elu'
import { cn } from '@/lib/cn'

// The chat panel (and the AI SDK client inside it) loads on the first open only, so the bubble
// costs every page almost nothing.
const ChatPanel = dynamic(() => import('@/components/chat/chat-panel'), { ssr: false })

/** Elu's glass chat bubble, above the WhatsApp button on every page. */
export function ChatBubble({ mock }: { mock: boolean }) {
  const [open, setOpen] = useState(false)
  const [opened, setOpened] = useState(false)
  const bubble = useRef<HTMLButtonElement>(null)
  const close = () => {
    setOpen(false)
    bubble.current?.focus()
  }
  return (
    <>
      <button
        ref={bubble}
        type="button"
        aria-expanded={open}
        aria-controls="elu-chat"
        aria-label={open ? 'Close the chat with Elu' : 'Ask Elu, the Elara helper'}
        onClick={() => (open ? close() : (setOpen(true), setOpened(true)))}
        data-testid="chat-bubble"
        className={cn(
          'glass focus-glow fixed right-4 bottom-36 z-30 flex size-14 items-center justify-center rounded-full shadow-lift transition-transform hover:scale-105 active:scale-95 md:right-6 md:bottom-24',
          open && 'max-md:hidden',
        )}
      >
        <Elu pose="wave" className="w-10" />
      </button>
      {opened && <ChatPanel open={open} onClose={close} mock={mock} />}
    </>
  )
}
