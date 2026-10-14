/** An empty pinboard with one blank note, for "New events coming soon". */
export const EmptyBoard = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 160" className={className} aria-hidden>
    <rect
      x="8"
      y="8"
      width="224"
      height="144"
      rx="8"
      className="fill-cream stroke-brass"
      strokeWidth="4"
    />
    <rect x="24" y="24" width="192" height="112" className="fill-hindi-tint" />
    <g transform="rotate(-4 120 80)">
      <rect x="80" y="52" width="80" height="60" className="fill-paper" />
      <circle cx="120" cy="52" r="5" className="fill-drawing" />
      <path
        d="M92 76h56M92 90h40"
        className="stroke-sage-100"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
    <circle cx="48" cy="44" r="5" className="fill-computer" />
    <circle cx="196" cy="118" r="5" className="fill-leaf" />
  </svg>
)
