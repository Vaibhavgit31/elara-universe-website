// A phone scanning the QR code printed in a book.
export const QrDoor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 360 260" className={className} aria-hidden>
    <path
      d="M30 200c50-22 100-22 150 0V60c-50-22-100-22-150 0Z"
      fill="#F5F0E8"
      stroke="#3F5645"
      strokeWidth="3"
    />
    <path
      d="M180 200c50-22 100-22 150 0V60c-50-22-100-22-150 0Z"
      fill="#F5F0E8"
      stroke="#3F5645"
      strokeWidth="3"
    />
    <path d="M30 200c50-22 100-22 150 0 50-22 100-22 150 0v14H30Z" fill="#1B241D" />
    <path
      d="M52 86h90M52 106h90M52 126h60"
      stroke="#DCE5D2"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <g transform="translate(212 84)">
      <rect width="72" height="72" rx="4" fill="#FBF9F4" stroke="#1B241D" strokeWidth="2" />
      {[
        [6, 6],
        [46, 6],
        [6, 46],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x} y={y} width="20" height="20" fill="#1B241D" />
          <rect x={x + 5} y={y + 5} width="10" height="10" fill="#FBF9F4" />
        </g>
      ))}
      {[
        [32, 8],
        [40, 16],
        [32, 24],
        [48, 32],
        [56, 40],
        [36, 44],
        [44, 52],
        [60, 56],
        [52, 60],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="#1B241D" />
      ))}
    </g>
    <g transform="rotate(-12 290 150)">
      <rect x="258" y="78" width="78" height="150" rx="14" fill="#3F5645" />
      <rect x="265" y="92" width="64" height="122" rx="6" fill="#EEF3EA" />
      <path
        d="M277 110h12v-4h-16v16h4zm40-4h-16v4h12v12h4zm-40 44v12h12v4h-16v-16zm44 0v16h-16v-4h12v-12z"
        fill="#B68235"
      />
      <path d="M273 134h48" stroke="#E07A5F" strokeWidth="2" strokeLinecap="round" />
    </g>
    <path
      d="M232 128c-18 10-28 26-24 46"
      fill="none"
      stroke="#B68235"
      strokeWidth="2"
      strokeDasharray="5 6"
      strokeLinecap="round"
    />
  </svg>
)
