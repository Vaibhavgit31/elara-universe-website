/** An empty pinboard with one blank note, for "New events coming soon". */
export const EmptyBoard = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 160" className={className} aria-hidden>
    <rect
      x="8"
      y="8"
      width="224"
      height="144"
      rx="8"
      fill="#F5F0E8"
      stroke="#B68235"
      strokeWidth="4"
    />
    <rect x="24" y="24" width="192" height="112" fill="#EEF3EA" />
    <g transform="rotate(-4 120 80)">
      <rect x="80" y="52" width="80" height="60" fill="#FCEFD6" />
      <circle cx="120" cy="52" r="5" fill="#E07A5F" />
      <path d="M92 76h56M92 90h40" stroke="#DCE5D2" strokeWidth="3" strokeLinecap="round" />
    </g>
    <circle cx="48" cy="44" r="5" fill="#4A90C2" />
    <circle cx="196" cy="118" r="5" fill="#8A9A74" />
  </svg>
)
