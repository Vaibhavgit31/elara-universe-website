import type { CSSProperties } from 'react'

/** A horizontal pencil in the brand palette; size it with h-* (width follows) and tilt in degrees. */
export function Pencil({ tilt = 0, className }: { tilt?: number; className?: string }) {
  const style: CSSProperties | undefined = tilt ? { rotate: `${tilt}deg` } : undefined
  return (
    <svg aria-hidden viewBox="0 0 240 40" className={className} style={style}>
      {/* eraser */}
      <rect x="4" y="8" width="28" height="24" rx="8" className="fill-drawing" />
      {/* ferrule with two crimp lines */}
      <rect x="28" y="8" width="24" height="24" className="fill-brass" />
      <rect x="34" y="8" width="3" height="24" className="fill-gold-ink/50" />
      <rect x="43" y="8" width="3" height="24" className="fill-gold-ink/50" />
      {/* body with a lit top facet and a shaded bottom facet */}
      <rect x="52" y="8" width="140" height="24" className="fill-hindi" />
      <rect x="52" y="8" width="140" height="7" className="fill-cream/40" />
      <rect x="52" y="25" width="140" height="7" className="fill-gold-ink/25" />
      {/* sharpened wood and graphite point */}
      <polygon points="192,8 192,32 236,20" className="fill-cream" />
      <polygon points="192,20 192,32 236,20" className="fill-brass/20" />
      <polygon points="223,16.5 223,23.5 236,20" className="fill-evergreen" />
    </svg>
  )
}
