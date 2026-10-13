import { useEffect, type RefObject } from 'react'

const colors = ['#E8A53A', '#4A90C2', '#E07A5F', '#8A9A74', '#B68235']

/** A short, fading crayon-dot trail behind the mouse (desktop pointers only). */
export function useCrayonTrail(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let last = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.timeStamp - last < 45) return
      last = e.timeStamp
      const rect = el.getBoundingClientRect()
      const dot = document.createElement('span')
      dot.className = 'crayon-dot'
      dot.style.left = `${e.clientX - rect.left}px`
      dot.style.top = `${e.clientY - rect.top}px`
      dot.style.background = colors[Math.floor(Math.random() * colors.length)]
      el.appendChild(dot)
      setTimeout(() => dot.remove(), 650)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [ref, enabled])
}
