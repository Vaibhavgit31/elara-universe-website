'use client'

import { m } from 'framer-motion'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { cn } from '@/lib/cn'

export type EluPose = 'wave' | 'point' | 'read' | 'search' | 'cheer' | 'phone' | 'peek'

const blink = {
  animate: { scaleY: [1, 1, 0.1, 1] },
  transition: { duration: 0.4, times: [0, 0.6, 0.8, 1], repeat: Infinity, repeatDelay: 3.4 },
}
const idle = {
  animate: { rotate: [0, 1.5, 0, -1.5, 0] },
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
}

const Eye = ({ x, look = 0 }: { x: number; look?: number }) => (
  <m.g style={{ originX: `${x}px`, originY: '78px' }} {...blink}>
    <circle cx={x} cy="78" r="7.5" fill="#FBF9F4" />
    <circle cx={x + look} cy="79" r="3.6" fill="#1B241D" />
    <circle cx={x + look + 1.4} cy="77" r="1.2" fill="#FBF9F4" />
  </m.g>
)

const Pencil = ({ x, y, rotate = -30 }: { x: number; y: number; rotate?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x="-4" y="-22" width="8" height="30" rx="1.5" fill="#B68235" />
    <path d="M-4 8l4 9 4-9z" fill="#F5F0E8" stroke="#1B241D" strokeWidth="1" />
    <path d="M-1.5 13l1.5 4 1.5-4z" fill="#1B241D" />
    <rect x="-4" y="-25" width="8" height="4" rx="1" fill="#E07A5F" />
  </g>
)

const arm = { fill: 'none', stroke: '#3F5645', strokeWidth: 5, strokeLinecap: 'round' as const }
const Hand = ({ x, y }: { x: number; y: number }) => (
  <circle cx={x} cy={y} r="5" fill="#8A9A74" stroke="#3F5645" strokeWidth="2" />
)

/**
 * Elu, the Elara Universe mascot: a sage-green leaf sprite inspired by the leaves in the logo,
 * holding a pencil. An original character drawn for this site. Decorative unless given a label.
 */
export function Elu({
  pose = 'wave',
  className,
  label,
}: {
  pose?: EluPose
  className?: string
  label?: string
}) {
  const active = useFlipPageActive()
  const look = pose === 'search' || pose === 'phone' ? 2.5 : pose === 'peek' ? -2 : 0
  return (
    <m.svg
      viewBox="0 0 170 180"
      className={cn('w-28', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label}
      style={{ originX: '85px', originY: '160px' }}
      {...(active && pose !== 'peek' ? idle : {})}
    >
      {/* arms behind the body */}
      {pose === 'wave' && (
        <m.g
          style={{ originX: '48px', originY: '98px' }}
          animate={active ? { rotate: [0, -22, 0, -22, 0] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5 }}
        >
          <path d="M48 98C30 90 22 72 28 56" {...arm} />
          <Hand x={28} y={55} />
        </m.g>
      )}
      {pose === 'cheer' && (
        <>
          <path d="M48 98C30 86 22 66 30 50" {...arm} />
          <Hand x={30} y={49} />
          <path d="M122 98C140 86 148 66 140 50" {...arm} />
          <Hand x={140} y={49} />
        </>
      )}
      {pose === 'search' && (
        <>
          <path d="M122 98C136 88 142 78 146 66" {...arm} />
          <circle
            cx="146"
            cy="52"
            r="13"
            fill="rgb(238 243 234 / 0.8)"
            stroke="#1B241D"
            strokeWidth="3"
          />
          <path d="M146 65v10" stroke="#1B241D" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {(pose === 'read' || pose === 'phone') && <path d="M48 98C40 108 48 118 62 118" {...arm} />}

      {/* body: a leaf standing on two little feet */}
      <m.g
        animate={active && pose === 'cheer' ? { y: [0, -12, 0] } : {}}
        transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1.2 }}
      >
        <ellipse cx="70" cy="156" rx="11" ry="5" fill="#3F5645" />
        <ellipse cx="100" cy="156" rx="11" ry="5" fill="#3F5645" />
        <path
          d="M85 18C44 40 34 108 85 152C136 108 126 40 85 18Z"
          fill="#8A9A74"
          stroke="#3F5645"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M85 34v108" stroke="#3F5645" strokeWidth="2" strokeDasharray="3 5" opacity=".5" />
        <path
          d="M85 18c6-10 14-12 20-8"
          fill="none"
          stroke="#3F5645"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="62" cy="94" r="5" fill="#FBE4DD" />
        <circle cx="108" cy="94" r="5" fill="#FBE4DD" />
        <Eye x={70} look={look} />
        <Eye x={100} look={look} />
        <path
          d={pose === 'cheer' ? 'M72 102q13 14 26 0' : 'M74 102q11 9 22 0'}
          fill="none"
          stroke="#1B241D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </m.g>

      {/* arms in front of the body */}
      {(pose === 'wave' || pose === 'point') && (
        <>
          <path
            d={
              pose === 'point' ? 'M122 98C138 94 150 90 160 88' : 'M122 98C136 106 140 120 136 132'
            }
            {...arm}
          />
          <Hand x={pose === 'point' ? 160 : 136} y={pose === 'point' ? 88 : 132} />
          <Pencil
            x={pose === 'point' ? 160 : 136}
            y={pose === 'point' ? 88 : 132}
            rotate={pose === 'point' ? 60 : -30}
          />
        </>
      )}
      {pose === 'wave' && (
        <>
          <path d="M48 98C40 108 44 120 56 126" {...arm} />
        </>
      )}
      {pose === 'read' && (
        <>
          <path d="M122 98C130 108 122 118 108 118" {...arm} />
          <path
            d="M58 112h26v26H58zM86 112h26v26H86z"
            fill="#F5F0E8"
            stroke="#3F5645"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M64 120h14M64 126h14M92 120h14M92 126h14"
            stroke="#DCE5D2"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Hand x={58} y={128} />
          <Hand x={112} y={128} />
        </>
      )}
      {pose === 'phone' && (
        <>
          <path d="M122 98C132 106 128 118 116 122" {...arm} />
          <g transform="rotate(-10 104 124)">
            <rect x="92" y="104" width="24" height="42" rx="5" fill="#3F5645" />
            <rect x="95" y="109" width="18" height="30" rx="2" fill="#EEF3EA" />
            <path
              d="M98 113h5v5h-5zm9 0h5v5h-5zm-9 9h5v5h-5zm9 2h2v2h-2zm3 2h2v2h-2z"
              fill="#1B241D"
            />
          </g>
          <Hand x={100} y={128} />
        </>
      )}
      {pose === 'search' && (
        <>
          <path d="M48 98C40 108 48 118 62 118" {...arm} />
          <Hand x={62} y={118} />
        </>
      )}
      {pose === 'cheer' &&
        [
          [22, 30],
          [148, 26],
          [12, 84],
        ].map(([x, y], i) => (
          <m.path
            key={i}
            d="M0-7l2 5 5 .5-4 3.5 1.2 5L0 4l-4.2 3 1.2-5-4-3.5 5-.5z"
            fill="#B68235"
            style={{ originX: `${x}px`, originY: `${y}px`, x, y }}
            animate={active ? { scale: [0, 1.2, 1, 0], opacity: [0, 1, 1, 0] } : { scale: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, delay: i * 0.3 }}
          />
        ))}
      {pose === 'peek' && (
        <>
          <Hand x={52} y={60} />
          <Hand x={118} y={60} />
        </>
      )}
    </m.svg>
  )
}
