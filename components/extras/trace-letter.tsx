'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'

const crayons = ['#E07A5F', '#4A90C2', '#E8A53A', '#8A9A74']

/** Trace the Hindi letter अ with a finger or the mouse. */
export default function TraceLetter() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState(crayons[0])
  const [strokes, setStrokes] = useState(0)
  const drawing = useRef(false)

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return [
      ((e.clientX - rect.left) / rect.width) * 300,
      ((e.clientY - rect.top) / rect.height) * 300,
    ]
  }
  const start = (e: PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    drawing.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    const [x, y] = point(e)
    ctx.strokeStyle = color
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvas.current?.getContext('2d')
    const [x, y] = point(e)
    ctx?.lineTo(x, y)
    ctx?.stroke()
  }
  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    setStrokes((n) => n + 1)
  }
  const clear = () => {
    canvas.current?.getContext('2d')?.clearRect(0, 0, 300, 300)
    setStrokes(0)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative aspect-square w-full max-w-[300px] rounded-md bg-paper shadow-page">
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-devanagari text-[200px] leading-none text-sage-100 select-none"
        >
          अ
        </span>
        <canvas
          ref={canvas}
          width={300}
          height={300}
          aria-label="Drawing area: trace the letter अ"
          className="absolute inset-0 h-full w-full touch-none rounded-md"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        {strokes >= 3 && (
          <Elu pose="cheer" label="Elu cheering" className="absolute -right-6 -bottom-4 w-20" />
        )}
      </div>
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="radiogroup"
        aria-label="Crayon colour"
      >
        {crayons.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={color === c}
            aria-label={`Crayon ${c}`}
            onClick={() => setColor(c)}
            className="size-11 rounded-full border-4"
            style={{ background: c, borderColor: color === c ? '#1B241D' : 'transparent' }}
          />
        ))}
        <Button variant="ghost" onClick={clear}>
          Clear
        </Button>
      </div>
      <p className="font-hand text-xl text-forest">
        {strokes >= 3 ? 'शाबाश! Well traced.' : 'Follow the grey letter with your finger.'}
      </p>
    </div>
  )
}
