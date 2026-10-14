import { cn } from '@/lib/cn'
import { hotspots, sceneSize, type HotspotId } from '@/content/hero'

// Brand palette (app/globals.css tokens); subject colours appear only as small accents.
const c = {
  paper: '#FBF9F4',
  cream: '#F5F0E8',
  mist: '#EEF3EA',
  sage100: '#DCE5D2',
  sage: '#8A9A74',
  forest: '#3F5645',
  evergreen: '#1B241D',
  brass: '#B68235',
  gold: '#8A6122',
  leaf: '#34A56F',
  leaf700: '#23794B',
  mint: '#E3F6EA',
  board: '#2C4A3B',
  sky: '#DCEFF5',
  hindi: '#E8A53A',
  hindiTint: '#FCEFD6',
  computer: '#4A90C2',
  computerTint: '#E1EEF7',
  drawing: '#E07A5F',
  drawingTint: '#FBE4DD',
}

/** The crop used on phones: chalkboard, teacher's desk and the nearest pupils. */
export const COMPACT_BOX = { x: 260, y: 50, w: 560, h: 440 } as const
/** Centre of the wall clock, for rotating the hands by id. */
export const CLOCK_CENTER = { x: 865, y: 120 } as const
const TREE_BASE = { x: 135, y: 260 }

/** Rotates the `#hour`, `#minute` and `#second` hands inside `root` to `date`'s local time. */
export function setClock(root: ParentNode, date: Date) {
  const m = date.getMinutes()
  const angles = {
    hour: (date.getHours() % 12) * 30 + m * 0.5,
    minute: m * 6,
    second: date.getSeconds() * 6,
  }
  for (const [id, deg] of Object.entries(angles))
    root
      .querySelector(`#${id}`)
      ?.setAttribute('transform', `rotate(${deg} ${CLOCK_CENTER.x} ${CLOCK_CENTER.y})`)
}

// One parallax layer: the hero sets --px/--py (unitless px) on an ancestor; `depth` scales them.
const layer = (depth: number) => ({
  transform: `translate(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px))`,
})

const hand = (id: string, len: number, width: number, deg: number, stroke = c.evergreen) => (
  <line
    id={id}
    x1={CLOCK_CENTER.x}
    y1={CLOCK_CENTER.y + 6}
    x2={CLOCK_CENTER.x}
    y2={CLOCK_CENTER.y - len}
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    transform={`rotate(${deg} ${CLOCK_CENTER.x} ${CLOCK_CENTER.y})`}
    className={id === 'second' ? 'motion-reduce:hidden' : undefined}
  />
)

const skins = ['#8D5524', '#A9703E', '#C68642', '#E0AC69', '#F1C58E']
const hairs = [c.evergreen, '#3B2A1E', c.gold, c.evergreen, '#3B2A1E']
const tops = [c.mint, c.computerTint, c.hindiTint, c.drawingTint, c.sage100]
type Hair = 'short' | 'bob' | 'bun' | 'braids' | 'curly'

/** A child reading at a desk; drawn with the desk top at (0,0). */
function Pupil({
  skin,
  hair,
  top,
  style,
}: {
  skin: string
  hair: string
  top: string
  style: Hair
}) {
  const cap = 'M-23-66a23 23 0 0 1 46 0z'
  return (
    <>
      <rect x="-31" y="-46" width="62" height="58" rx="18" fill={top} />
      <rect
        x="-42"
        y="-24"
        width="14"
        height="30"
        rx="7"
        fill={skin}
        transform="rotate(14 -35 -22)"
      />
      <rect
        x="28"
        y="-24"
        width="14"
        height="30"
        rx="7"
        fill={skin}
        transform="rotate(-14 35 -22)"
      />
      {style === 'braids' && (
        <>
          <rect x="-31" y="-66" width="9" height="40" rx="4.5" fill={hair} />
          <rect x="22" y="-66" width="9" height="40" rx="4.5" fill={hair} />
        </>
      )}
      <circle cy="-66" r="22" fill={skin} />
      <path
        d={style === 'bob' ? 'M-23-66a23 23 0 0 1 46 0v18h-8v-16h-30v16h-8z' : cap}
        fill={hair}
      />
      {style === 'bun' && <circle cy="-91" r="8" fill={hair} />}
      {style === 'curly' &&
        [-19, -7, 7, 19].map((x) => (
          <circle key={x} cx={x} cy={Math.abs(x) > 10 ? -80 : -87} r="8" fill={hair} />
        ))}
      <circle cx="-7" cy="-60" r="2.2" fill={c.evergreen} />
      <circle cx="7" cy="-60" r="2.2" fill={c.evergreen} />
      <path
        d="M-6-52q6 5 12 0"
        fill="none"
        stroke={c.evergreen}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="-65" y="0" width="130" height="12" rx="4" fill={c.gold} />
      <rect x="-57" y="12" width="114" height="42" rx="3" fill={c.brass} />
      <rect x="-60" y="54" width="8" height="18" fill={c.gold} />
      <rect x="52" y="54" width="8" height="18" fill={c.gold} />
      <path
        d="M-30-2q15-9 30-2q15-7 30 2v6q-15-7-30 0q-15-7-30 0z"
        fill={c.paper}
        stroke={c.forest}
        strokeWidth="2"
      />
    </>
  )
}

const pupils: [number, number, number, Hair][] = [
  [640, 470, 0.92, 'bob'],
  [800, 470, 0.92, 'short'],
  [400, 590, 1, 'braids'],
  [560, 590, 1, 'curly'],
  [720, 590, 1, 'bun'],
]

const bookColours = [c.leaf, c.hindi, c.computer, c.drawing, c.forest, c.brass, c.sage, c.leaf700]
const bookWidths = [14, 18, 12, 20, 16, 14, 18, 12, 16, 20, 14]

/** A row of standing books on a shelf whose top edge is at `y`. */
function Books({ y, offset }: { y: number; offset: number }) {
  let x = 938
  return bookWidths.map((w, i) => {
    const h = 34 + ((i * 7 + offset) % 18)
    const rect = (
      <rect
        key={i}
        x={x}
        y={y - h}
        width={w}
        height={h}
        rx="2"
        fill={bookColours[(i + offset) % 8]}
      />
    )
    x += w + 3
    return rect
  })
}

const notes: [number, number, number, string, string][] = [
  [948, 96, -4, c.paper, c.drawing],
  [1020, 104, 3, c.mint, c.computer],
  [1088, 92, -2, c.drawingTint, c.leaf],
  [990, 160, 2, c.paper, c.hindi],
  [1066, 164, -3, c.computerTint, c.drawing],
]

/**
 * One original classroom, as an inline SVG: `glow` lights the halo behind that hotspot, `compact`
 * crops to the chalkboard end of the room. Decorative only (aria-hidden); the hero adds the text.
 */
export function ClassroomScene({
  glow = null,
  compact = false,
  className,
}: {
  glow?: HotspotId | null
  compact?: boolean
  className?: string
}) {
  const box = compact ? COMPACT_BOX : { x: 0, y: 0, ...sceneSize }
  return (
    <svg
      aria-hidden
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      className={cn('block h-auto w-full', className)}
    >
      <style>{`@keyframes scene-sway{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}`}</style>
      <defs>
        <filter id="scene-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id="scene-win">
          <rect x="52" y="82" width="176" height="226" rx="8" />
        </clipPath>
      </defs>

      {/* Back wall layer: moves a little less than the furniture. */}
      <g id="back" style={layer(0.4)}>
        <rect x="-20" y="-20" width="1240" height="500" fill={c.mist} />
        <rect x="-20" y="470" width="1240" height="260" fill={c.sage100} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={i}
            x1={i * 200}
            y1="480"
            x2={i * 200 - 90}
            y2="720"
            stroke={c.sage}
            strokeWidth="2"
            opacity="0.3"
          />
        ))}
        <rect x="-20" y="462" width="1240" height="10" fill={c.sage} />

        {/* Halos: one blurred leaf-green rect per hotspot, shown by opacity only. */}
        {hotspots.map(({ id, box: b }) => (
          <rect
            key={id}
            x={(b.x / 100) * sceneSize.w - 10}
            y={(b.y / 100) * sceneSize.h - 10}
            width={(b.w / 100) * sceneSize.w + 20}
            height={(b.h / 100) * sceneSize.h + 20}
            rx="28"
            fill={c.leaf}
            filter="url(#scene-blur)"
            opacity={glow === id ? 0.55 : 0}
            className="transition-opacity duration-300"
          />
        ))}

        {/* Window with a swaying tree */}
        <g id="window">
          <rect
            x="40"
            y="70"
            width="200"
            height="250"
            rx="12"
            fill={c.cream}
            stroke={c.sage}
            strokeWidth="4"
          />
          <g clipPath="url(#scene-win)">
            <rect x="52" y="82" width="176" height="226" fill={c.sky} />
            <circle cx="192" cy="118" r="18" fill={c.hindi} opacity="0.9" />
            <path d="M52 262c40-30 90-34 176-10v56H52z" fill={c.mint} />
            <rect x="52" y="266" width="176" height="42" fill={c.sage100} />
            <g
              id="tree"
              className="animate-[scene-sway_5s_ease-in-out_infinite] motion-reduce:animate-none"
              style={{ transformOrigin: `${TREE_BASE.x}px ${TREE_BASE.y}px` }}
            >
              <rect x="128" y="196" width="14" height="66" rx="4" fill={c.gold} />
              <circle cx="135" cy="186" r="36" fill={c.leaf700} />
              <circle cx="112" cy="202" r="26" fill={c.leaf} />
              <circle cx="160" cy="204" r="26" fill={c.leaf} />
              <circle cx="135" cy="164" r="24" fill={c.leaf} />
            </g>
          </g>
          <path d="M140 82v226M52 194h176" stroke={c.cream} strokeWidth="6" />
          <rect
            x="32"
            y="318"
            width="216"
            height="10"
            rx="3"
            fill={c.sage100}
            stroke={c.sage}
            strokeWidth="2"
          />
        </g>

        {/* Chalkboard (the hero writes the headline over it in HTML) */}
        <g id="chalkboard">
          <rect x="270" y="60" width="540" height="290" rx="12" fill={c.brass} />
          <rect x="282" y="72" width="516" height="246" rx="8" fill={c.board} />
          <rect x="282" y="318" width="516" height="20" fill={c.cream} />
          <rect x="300" y="324" width="22" height="7" rx="3.5" fill="#fff" />
          <rect x="330" y="324" width="16" height="7" rx="3.5" fill={c.hindi} />
          <rect x="756" y="322" width="30" height="10" rx="2" fill={c.sage} />
        </g>

        {/* Wall clock; the hero rotates the hands by id */}
        <g id="clock">
          <circle
            cx={CLOCK_CENTER.x}
            cy={CLOCK_CENTER.y}
            r="40"
            fill={c.paper}
            stroke={c.brass}
            strokeWidth="5"
          />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <line
              key={i}
              x1={CLOCK_CENTER.x}
              y1={CLOCK_CENTER.y - 33}
              x2={CLOCK_CENTER.x}
              y2={CLOCK_CENTER.y - (i % 3 ? 29 : 26)}
              stroke={c.evergreen}
              strokeWidth={i % 3 ? 1.5 : 3}
              transform={`rotate(${i * 30} ${CLOCK_CENTER.x} ${CLOCK_CENTER.y})`}
            />
          ))}
          {hand('hour', 20, 4, 305)}
          {hand('minute', 29, 3, 60)}
          {hand('second', 31, 1.5, 0, c.drawing)}
          <circle cx={CLOCK_CENTER.x} cy={CLOCK_CENTER.y} r="3.5" fill={c.evergreen} />
        </g>

        {/* Cork notice board */}
        <g id="board">
          <rect x="920" y="70" width="240" height="160" rx="8" fill={c.gold} />
          <rect x="930" y="80" width="220" height="140" rx="4" fill={c.hindiTint} />
          {notes.map(([x, y, rot, fill, pin]) => (
            <g key={x} transform={`rotate(${rot} ${x + 26} ${y + 20})`}>
              <rect x={x} y={y} width="52" height="44" rx="2" fill={fill} stroke={c.sage100} />
              <path
                d={`M${x + 8} ${y + 14}h36M${x + 8} ${y + 23}h28M${x + 8} ${y + 32}h32`}
                stroke={c.sage}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx={x + 26} cy={y + 4} r="3.5" fill={pin} />
            </g>
          ))}
        </g>

        {/* Bookshelf */}
        <g id="bookshelf">
          <rect x="920" y="256" width="240" height="214" rx="6" fill={c.gold} />
          <rect x="930" y="266" width="220" height="196" fill={c.cream} />
          {[330, 396, 462].map((y, i) => (
            <g key={y}>
              <Books y={y} offset={i * 3} />
              <rect x="926" y={y} width="228" height="8" rx="2" fill={c.gold} />
            </g>
          ))}
        </g>
      </g>

      {/* Furniture layer */}
      <g id="front" style={layer(1)}>
        {/* Potted plant under the window */}
        <g id="plant">
          <path
            d="M130 440c-24-10-36-36-30-62 22 8 34 34 30 62zm0 0c24-10 36-36 30-62-22 8-34 34-30 62zm0-6c-6-26 4-52 24-66 6 26-4 52-24 66z"
            fill={c.leaf}
          />
          <path d="M130 434c-2-28 10-50 24-62 2 28-10 50-24 62z" fill={c.leaf700} />
          <path d="M104 440h52l-6 42h-40z" fill={c.drawing} />
          <rect x="100" y="436" width="60" height="10" rx="3" fill={c.gold} />
        </g>

        {/* Teacher's desk with books, a pencil cup and a sheet of paper */}
        <g id="desk">
          <rect x="320" y="356" width="46" height="10" rx="2" fill={c.forest} />
          <rect x="324" y="346" width="40" height="10" rx="2" fill={c.hindi} />
          <rect x="322" y="336" width="44" height="10" rx="2" fill={c.computer} />
          <rect x="402" y="342" width="20" height="26" rx="3" fill={c.sage} />
          <path
            d="M408 342v-16M416 342v-20"
            stroke={c.hindi}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            x="434"
            y="350"
            width="40"
            height="18"
            rx="2"
            fill={c.paper}
            stroke={c.sage100}
            transform="rotate(-6 454 359)"
          />
          <rect x="300" y="366" width="220" height="16" rx="6" fill={c.gold} />
          <rect x="310" y="382" width="200" height="72" rx="4" fill={c.brass} />
          <rect x="312" y="454" width="10" height="22" fill={c.gold} />
          <rect x="498" y="454" width="10" height="22" fill={c.gold} />
        </g>

        {/* Globe on the desk's corner */}
        <g id="globe">
          <ellipse cx="495" cy="372" rx="16" ry="4" fill={c.evergreen} />
          <path d="M495 372v-14" stroke={c.evergreen} strokeWidth="4" />
          <circle cx="495" cy="338" r="22" fill={c.sky} />
          <path
            d="M483 328c6-5 15-3 17 3s-4 11-10 11-11-8-7-14zm18 14c5-2 10 1 9 6s-7 6-10 3-3-7 1-9z"
            fill={c.leaf}
          />
          <path
            d="M495 312a26 26 0 0 1 0 52"
            fill="none"
            stroke={c.evergreen}
            strokeWidth="3"
            strokeLinecap="round"
            transform="rotate(22 495 338)"
          />
        </g>

        {pupils.map(([x, y, s, style], i) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <Pupil skin={skins[i]} hair={hairs[i]} top={tops[i]} style={style} />
          </g>
        ))}

        {/* Computer on its own desk */}
        <g id="computer">
          <rect x="926" y="426" width="108" height="66" rx="6" fill={c.evergreen} />
          <rect x="932" y="432" width="96" height="54" rx="3" fill={c.computerTint} />
          <path
            d="M942 446h40M942 456h60M942 466h28"
            stroke={c.computer}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect x="1004" y="462" width="16" height="16" rx="3" fill={c.leaf} />
          <rect x="975" y="492" width="10" height="8" fill={c.evergreen} />
          <ellipse cx="980" cy="500" rx="22" ry="3" fill={c.evergreen} />
          <rect x="880" y="500" width="180" height="12" rx="4" fill={c.gold} />
          <rect x="888" y="512" width="8" height="72" fill={c.gold} />
          <rect x="1044" y="512" width="8" height="72" fill={c.gold} />
          <rect x="932" y="494" width="68" height="7" rx="2" fill={c.sage100} stroke={c.sage} />
          <ellipse cx="1020" cy="497" rx="7" ry="4" fill={c.sage} />
        </g>

        {/* Art easel with a canvas */}
        <g id="easel">
          <path
            d="M1080 680l40-210M1170 680l-40-210M1125 560v120M1092 602h66"
            stroke={c.gold}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect
            x="1084"
            y="470"
            width="82"
            height="104"
            rx="3"
            fill={c.paper}
            stroke={c.sage}
            strokeWidth="2"
          />
          <path d="M1084 548c20-18 40-20 82-6v26h-82z" fill={c.mint} />
          <circle cx="1146" cy="494" r="11" fill={c.hindi} />
          <path d="M1104 540c-10-12-10-30 4-38 12 10 12 28-4 38z" fill={c.drawing} />
          <path d="M1120 536c-2-16 8-28 22-30-2 16-10 26-22 30z" fill={c.leaf} />
          <rect x="1080" y="574" width="90" height="8" rx="2" fill={c.gold} />
        </g>
      </g>
    </svg>
  )
}
