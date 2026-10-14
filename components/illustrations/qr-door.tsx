// The three finder squares and the data cells of a stylised QR code, on a 72-unit square.
const finders = [
  [6, 6],
  [46, 6],
  [6, 46],
]
const cells = [
  [32, 8],
  [40, 16],
  [32, 24],
  [48, 32],
  [56, 40],
  [36, 44],
  [44, 52],
  [60, 56],
  [52, 60],
]

/** A phone scanning the QR code printed in an open Elara book. */
export const QrDoor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 360 260" className={className} aria-hidden>
    {/* open book: two cream pages on an evergreen spine, ruled lines on the left page */}
    <path
      d="M30 200c50-22 100-22 150 0V60c-50-22-100-22-150 0Z"
      className="fill-cream stroke-forest"
      strokeWidth="3"
    />
    <path
      d="M180 200c50-22 100-22 150 0V60c-50-22-100-22-150 0Z"
      className="fill-cream stroke-forest"
      strokeWidth="3"
    />
    <path d="M30 200c50-22 100-22 150 0 50-22 100-22 150 0v14H30Z" className="fill-evergreen" />
    <path
      d="M52 86h90M52 106h90M52 126h60"
      className="stroke-sage-100"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* the QR square printed on the right page */}
    <g transform="translate(212 84)">
      <rect width="72" height="72" rx="4" className="fill-paper stroke-evergreen" strokeWidth="2" />
      {finders.map(([x, y]) => (
        <g key={`${x}${y}`} className="fill-evergreen">
          <rect x={x} y={y} width="20" height="20" />
          <rect x={x + 5} y={y + 5} width="10" height="10" className="fill-paper" />
        </g>
      ))}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" className="fill-evergreen" />
      ))}
    </g>
    {/* the phone, its camera frame in brass and the scan line in drawing red */}
    <g transform="rotate(-12 290 150)">
      <rect x="258" y="78" width="78" height="150" rx="14" className="fill-forest" />
      <rect x="265" y="92" width="64" height="122" rx="6" className="fill-mist" />
      <path
        d="M277 110h12v-4h-16v16h4zm40-4h-16v4h12v12h4zm-40 44v12h12v4h-16v-16zm44 0v16h-16v-4h12v-12z"
        className="fill-brass"
      />
      <path d="M273 134h48" className="stroke-drawing" strokeWidth="2" strokeLinecap="round" />
    </g>
    <path
      d="M232 128c-18 10-28 26-24 46"
      className="fill-none stroke-brass"
      strokeWidth="2"
      strokeLinecap="round"
      opacity=".7"
    />
  </svg>
)
