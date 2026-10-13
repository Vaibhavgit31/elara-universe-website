'use client'

import { m, useScroll, useTransform } from 'framer-motion'
import { useFlipPageActive } from '@/components/flip/flip-pad'

// Leaves and paper dots behind the hero, drifting at different speeds for a sense of depth.
const leaves = [
  { x: '6%', y: '18%', size: 44, speed: 0.12, color: '#8A9A74', delay: 0 },
  { x: '88%', y: '12%', size: 34, speed: 0.2, color: '#B68235', delay: 1.1 },
  { x: '78%', y: '70%', size: 52, speed: 0.06, color: '#8A9A74', delay: 0.6 },
  { x: '14%', y: '80%', size: 30, speed: 0.16, color: '#B68235', delay: 1.8 },
  { x: '55%', y: '8%', size: 26, speed: 0.1, color: '#3F5645', delay: 2.4 },
]
const dots = [
  ['22%', '34%'],
  ['68%', '26%'],
  ['40%', '88%'],
  ['92%', '48%'],
  ['4%', '56%'],
  ['60%', '62%'],
]

function Leaf({ x, y, size, speed, color, delay }: (typeof leaves)[number]) {
  const active = useFlipPageActive()
  const { scrollY } = useScroll()
  const drift = useTransform(scrollY, (v) => -v * speed)
  return (
    <m.svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className="absolute"
      style={{ left: x, top: y, y: drift }}
      animate={active ? { x: [0, 8, 0], rotate: [0, 10, 0] } : {}}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <path d="M20 2C8 10 4 24 20 38c16-14 12-28 0-36Z" fill={color} opacity=".25" />
      <path d="M20 8v26" stroke={color} strokeWidth="1.5" opacity=".35" />
    </m.svg>
  )
}

export const DriftingLeaves = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    {leaves.map((leaf) => (
      <Leaf key={`${leaf.x}${leaf.y}`} {...leaf} />
    ))}
    {dots.map(([x, y]) => (
      <span
        key={`${x}${y}`}
        className="absolute size-1.5 rounded-full bg-brass/30"
        style={{ left: x, top: y }}
      />
    ))}
  </div>
)
