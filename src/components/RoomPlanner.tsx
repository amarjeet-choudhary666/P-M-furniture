import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw, ShoppingBag, Sparkles, ChevronLeft, ArrowRight, Check,
  Sofa, BedDouble, UtensilsCrossed, Lamp, Monitor, Armchair,
  BookOpen, SquareDashed, Undo2, Star, Home, Briefcase,
  type LucideIcon,
} from 'lucide-react'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

// ── Types ──────────────────────────────────────────────────────────────
type FurnitureItem = {
  id: string
  label: string
  Icon: LucideIcon
  size: [number, number]
  color: string
  price: number
  category: string
}

type PlacedItem = {
  uid: string
  item: FurnitureItem
  row: number
  col: number
}

type Phase = 'room' | 'plan' | 'summary'

type RoomType = {
  id: string
  name: string
  tagline: string
  Icon: LucideIcon
  accent: string
  gradient: string
  pieces: number
}

type DesignScores = {
  overall: number
  comfort: number
  space: number
  lighting: number
  balance: number
}

// ── Constants ──────────────────────────────────────────────────────────
const GRID_COLS = 12
const GRID_ROWS = 9

const ROOM_TYPES: RoomType[] = [
  {
    id: 'living', name: 'Living Room', tagline: 'Comfort & Connection',
    Icon: Sofa, accent: '#c47858',
    gradient: 'linear-gradient(135deg, #c4785820, #f0ebe370)',
    pieces: 124,
  },
  {
    id: 'bedroom', name: 'Bedroom', tagline: 'Rest & Restore',
    Icon: BedDouble, accent: '#5a80c8',
    gradient: 'linear-gradient(135deg, #5a80c818, #dce8f060)',
    pieces: 98,
  },
  {
    id: 'dining', name: 'Dining Room', tagline: 'Gather & Celebrate',
    Icon: UtensilsCrossed, accent: '#c4a878',
    gradient: 'linear-gradient(135deg, #c4a87820, #f5f0e870)',
    pieces: 76,
  },
  {
    id: 'office', name: 'Home Office', tagline: 'Focus & Create',
    Icon: Briefcase, accent: '#5a6070',
    gradient: 'linear-gradient(135deg, #5a607022, #8c8c8c28)',
    pieces: 64,
  },
  {
    id: 'studio', name: 'Studio Apt', tagline: 'Live & Work',
    Icon: Home, accent: '#9a8aaa',
    gradient: 'linear-gradient(135deg, #9a8aaa20, #d4cfc848)',
    pieces: 52,
  },
]

const FURNITURE_ITEMS: FurnitureItem[] = [
  { id: 'sofa',  label: 'Cloud Sofa',    Icon: Sofa,            size: [3, 2], color: '#c49a3a', price: 1299, category: 'Seating'  },
  { id: 'chair', label: 'Haven Chair',   Icon: Armchair,        size: [2, 2], color: '#c47858', price: 699,  category: 'Seating'  },
  { id: 'bed',   label: 'Oslo Bed',      Icon: BedDouble,       size: [3, 3], color: '#5a80c8', price: 1899, category: 'Bedroom'  },
  { id: 'table', label: 'Loft Table',    Icon: UtensilsCrossed, size: [4, 2], color: '#9a5aaa', price: 1499, category: 'Dining'   },
  { id: 'desk',  label: 'Aura Desk',     Icon: Monitor,         size: [3, 1], color: '#5a9a5a', price: 799,  category: 'Office'   },
  { id: 'lamp',  label: 'Halo Lamp',     Icon: Lamp,            size: [1, 1], color: '#c4605a', price: 299,  category: 'Lighting' },
  { id: 'shelf', label: 'Arc Shelf',     Icon: BookOpen,        size: [1, 3], color: '#3a5a3a', price: 499,  category: 'Storage'  },
  { id: 'rug',   label: 'Terra Rug',     Icon: SquareDashed,    size: [4, 3], color: '#a08050', price: 399,  category: 'Decor'    },
]

// ── Helpers ────────────────────────────────────────────────────────────
function calcScores(placed: PlacedItem[]): DesignScores {
  if (placed.length === 0) return { overall: 0, comfort: 0, space: 0, lighting: 0, balance: 0 }

  const totalCells = GRID_COLS * GRID_ROWS
  const usedCells  = placed.reduce((s, p) => s + p.item.size[0] * p.item.size[1], 0)
  const ratio      = usedCells / totalCells

  const space = ratio < 0.25
    ? Math.round(ratio / 0.25 * 70)
    : ratio < 0.55
    ? Math.round(70 + (ratio - 0.25) / 0.30 * 30)
    : Math.max(10, Math.round(100 - (ratio - 0.55) / 0.45 * 90))

  const ids      = placed.map(p => p.item.id)
  const hasLight = ids.includes('lamp')
  const hasSeat  = ids.some(id => ['sofa', 'chair'].includes(id))
  const hasStore = ids.some(id => ['shelf', 'rug'].includes(id))
  const comfort  = Math.min(100, (hasSeat ? 40 : 0) + (hasLight ? 20 : 0) + (hasStore ? 15 : 0) + placed.length * 4)
  const lighting = hasLight ? Math.min(100, 50 + placed.filter(p => p.item.id === 'lamp').length * 25) : 18

  const q = [0, 0, 0, 0]
  placed.forEach(p => { q[(p.row < GRID_ROWS / 2 ? 0 : 2) + (p.col < GRID_COLS / 2 ? 0 : 1)]++ })
  const spread  = Math.max(...q) - Math.min(...q)
  const balance = Math.max(0, Math.round(100 - spread / placed.length * 55))

  const overall = Math.round(space * 0.28 + comfort * 0.32 + lighting * 0.20 + balance * 0.20)
  return { overall, comfort, space, lighting, balance }
}

function getAiTips(placed: PlacedItem[], roomId: string): string[] {
  const ids  = placed.map(p => p.item.id)
  const tips: string[] = []
  if (!ids.includes('lamp'))                                    tips.push('Layer your lighting — a floor lamp adds warm ambient depth.')
  if (!ids.includes('rug'))                                     tips.push('A rug anchors the seating zone and adds warmth to bare floors.')
  if (roomId === 'living'  && !ids.includes('sofa'))            tips.push('A sofa anchors the room — place it first as your foundation.')
  if (roomId === 'bedroom' && !ids.includes('bed'))             tips.push('Centre the bed on the main wall for the best proportions.')
  if (roomId === 'office'  && !ids.includes('desk'))            tips.push('A desk perpendicular to windows reduces screen glare.')
  if (ids.includes('sofa') && !ids.some(id => id === 'chair')) tips.push('Balance your sofa with an accent chair for conversational seating.')
  if (placed.length > 7)                                        tips.push('Leave 18–24″ walkways between pieces for comfortable flow.')
  if (tips.length === 0) tips.push('Excellent balance — your room is well-spaced and beautifully considered.')
  return tips.slice(0, 3)
}

// ── Phase 1: Room Selector ─────────────────────────────────────────────
function RoomSelectorPhase({ onSelect }: { onSelect: (room: RoomType) => void }) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="text-center mb-12"
      >
        <p className="text-[10px] uppercase tracking-[0.26em] font-semibold mb-3" style={{ color: '#8b6914' }}>
          Interactive Design Tool
        </p>
        <h2 className="font-medium leading-tight mb-4"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#1a1a1a' }}>
          Design Your<br />
          <span style={{ fontStyle: 'italic', color: '#8b6914' }}>Dream Room</span>
        </h2>
        <p className="text-sm leading-relaxed mx-auto" style={{ color: '#6b6b6b', maxWidth: 480 }}>
          Choose a room type to begin. Place furniture pieces, receive real-time AI feedback, and build your complete shopping list — all in one place.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ROOM_TYPES.map((room, i) => (
          <motion.button
            key={room.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(room)}
            className="group relative rounded-2xl overflow-hidden p-6 text-left border cursor-pointer"
            style={{ background: room.gradient, borderColor: 'rgba(44,44,44,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: room.accent + '22' }}>
              <room.Icon size={20} style={{ color: room.accent }} />
            </div>
            <h3 className="font-medium mb-1 text-sm" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
              {room.name}
            </h3>
            <p className="text-[11px] mb-3 leading-snug" style={{ color: '#6b6b6b' }}>{room.tagline}</p>
            <p className="text-[10px] font-medium flex items-center gap-1" style={{ color: room.accent }}>
              {room.pieces} pieces
              <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </p>
            <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-250"
              style={{ background: room.accent }}>
              <ArrowRight size={12} className="text-white" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── Phase 2: Planner ───────────────────────────────────────────────────
function PlannerPhase({
  room, onBack, onFinish, placed, setPlaced,
}: {
  room: RoomType
  onBack: () => void
  onFinish: () => void
  placed: PlacedItem[]
  setPlaced: React.Dispatch<React.SetStateAction<PlacedItem[]>>
}) {
  const [selected, setSelected]           = useState<FurnitureItem>(FURNITURE_ITEMS[0])
  const [hoverCell, setHoverCell]         = useState<[number, number] | null>(null)
  const [undoStack, setUndoStack]         = useState<PlacedItem[][]>([])
  const [showTips, setShowTips]           = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const scores    = calcScores(placed)
  const aiTips    = getAiTips(placed, room.id)
  const totalCost = placed.reduce((s, p) => s + p.item.price, 0)

  function isCellOccupied(row: number, col: number): boolean {
    return placed.some(p =>
      row >= p.row && row < p.row + p.item.size[1] &&
      col >= p.col && col < p.col + p.item.size[0]
    )
  }

  function canPlace(row: number, col: number, item: FurnitureItem): boolean {
    if (col + item.size[0] > GRID_COLS || row + item.size[1] > GRID_ROWS) return false
    for (let r = row; r < row + item.size[1]; r++)
      for (let c = col; c < col + item.size[0]; c++)
        if (isCellOccupied(r, c)) return false
    return true
  }

  function handlePlace(row: number, col: number) {
    if (!canPlace(row, col, selected)) return
    setUndoStack(prev => [...prev, placed])
    setPlaced(prev => [...prev, { uid: `${selected.id}-${Date.now()}`, item: selected, row, col }])
  }

  function handleRemove(uid: string) {
    setUndoStack(prev => [...prev, placed])
    setPlaced(prev => prev.filter(p => p.uid !== uid))
  }

  function undo() {
    if (!undoStack.length) return
    setPlaced(undoStack[undoStack.length - 1])
    setUndoStack(s => s.slice(0, -1))
  }

  function getPlacedAt(row: number, col: number) {
    return placed.find(p =>
      row >= p.row && row < p.row + p.item.size[1] &&
      col >= p.col && col < p.col + p.item.size[0]
    )
  }

  const previewCells = new Set<string>()
  if (hoverCell) {
    const [hr, hc] = hoverCell
    if (canPlace(hr, hc, selected)) {
      for (let r = hr; r < hr + selected.size[1]; r++)
        for (let c = hc; c < hc + selected.size[0]; c++)
          previewCells.add(`${r}-${c}`)
    }
  }

  const allCats      = ['All', ...Array.from(new Set(FURNITURE_ITEMS.map(f => f.category)))]
  const filteredItems = activeCategory === 'All' ? FURNITURE_ITEMS : FURNITURE_ITEMS.filter(f => f.category === activeCategory)
  const fillPct      = Math.round(placed.reduce((s, p) => s + p.item.size[0] * p.item.size[1], 0) / (GRID_COLS * GRID_ROWS) * 100)

  return (
    <div>
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:bg-[#f5f1ea]"
            style={{ borderColor: '#e8ddd0' }}>
            <ChevronLeft size={16} style={{ color: '#1a1a1a' }} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <room.Icon size={13} style={{ color: room.accent }} />
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
                {room.name}
              </span>
            </div>
            <p className="text-[11px]" style={{ color: '#9a9a9a' }}>
              {placed.length} piece{placed.length !== 1 ? 's' : ''} · ${totalCost.toLocaleString()} est.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ background: scores.overall > 50 ? '#8b691412' : '#f5f1ea' }}>
          <Star size={12} className={scores.overall > 50 ? 'fill-[#c49a3a] text-[#c49a3a]' : 'text-[#c0b090]'} />
          <span className="text-xs font-medium" style={{ color: scores.overall > 50 ? '#8b6914' : '#6b6b6b' }}>
            Score: {scores.overall}/100
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={!undoStack.length} title="Undo"
            className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors disabled:opacity-30 hover:bg-[#f5f1ea]"
            style={{ borderColor: '#e8ddd0' }}>
            <Undo2 size={13} style={{ color: '#1a1a1a' }} />
          </button>
          <button onClick={() => { setUndoStack(prev => [...prev, placed]); setPlaced([]) }} title="Clear room"
            className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors hover:bg-[#f5f1ea]"
            style={{ borderColor: '#e8ddd0' }}>
            <RotateCcw size={13} style={{ color: '#1a1a1a' }} />
          </button>
          <button onClick={onFinish}
            className="px-5 py-2 rounded-full text-xs font-medium text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: '#1a1a1a' }}>
            Review Room <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* ── Main layout (desktop: 3-col, mobile: stacked) ── */}
      <div className="flex flex-col gap-3">

        {/* Mobile: Horizontal furniture strip */}
        <div className="lg:hidden overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-2 min-w-max">
            {FURNITURE_ITEMS.map(item => (
              <button key={item.id}
                onClick={() => setSelected(item)}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all"
                style={{
                  background: selected.id === item.id ? '#1a1a1a' : '#fff',
                  borderColor: selected.id === item.id ? '#1a1a1a' : 'rgba(44,44,44,0.08)',
                  minWidth: '68px',
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: selected.id === item.id ? 'rgba(255,255,255,0.1)' : item.color + '25' }}>
                  <item.Icon size={14} style={{ color: selected.id === item.id ? '#fff' : item.color }} />
                </div>
                <span className="text-[10px] font-medium leading-tight text-center"
                  style={{ color: selected.id === item.id ? '#fff' : '#1a1a1a' }}>
                  {item.label.split(' ')[0]}
                </span>
                <span className="text-[9px]"
                  style={{ color: selected.id === item.id ? 'rgba(255,255,255,0.5)' : '#9a9a9a' }}>
                  ${item.price >= 1000 ? (item.price / 1000).toFixed(1) + 'k' : item.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop row: palette + grid + scores */}
        <div className="flex gap-4">

        {/* Left: Furniture palette (desktop only) */}
        <div className="hidden lg:block w-48 flex-shrink-0">
          <div className="flex flex-wrap gap-1 mb-3">
            {allCats.slice(0, 6).map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-all"
                style={{
                  background: activeCategory === cat ? '#1a1a1a' : '#f0ebe3',
                  color: activeCategory === cat ? '#fff' : '#6b6b6b',
                }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#e8ddd0 transparent' }}>
            {filteredItems.map(item => (
              <button key={item.id}
                onClick={() => setSelected(item)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all border"
                style={{
                  background: selected.id === item.id ? '#1a1a1a' : '#fff',
                  borderColor: selected.id === item.id ? '#1a1a1a' : 'rgba(44,44,44,0.08)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: selected.id === item.id ? 'rgba(255,255,255,0.1)' : item.color + '25' }}>
                  <item.Icon size={14} style={{ color: selected.id === item.id ? '#fff' : item.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium truncate"
                    style={{ color: selected.id === item.id ? '#fff' : '#1a1a1a' }}>
                    {item.label}
                  </p>
                  <p className="text-[10px]"
                    style={{ color: selected.id === item.id ? 'rgba(255,255,255,0.5)' : '#9a9a9a' }}>
                    ${item.price.toLocaleString()} · {item.size[0]}×{item.size[1]}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-xl text-[11px]"
            style={{ background: selected.color + '14', border: `1px dashed ${selected.color}55` }}>
            <p className="font-medium mb-0.5" style={{ color: selected.color }}>Active: {selected.label}</p>
            <p style={{ color: '#5a5a5a' }}>{selected.size[0]}×{selected.size[1]} grid · ${selected.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Center: Grid canvas */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <div className="px-4 py-2.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid #f5f1ea' }}>
              <span className="text-[11px]" style={{ color: '#9a9a9a' }}>
                {room.name} · {GRID_COLS}ft × {GRID_ROWS}ft floor plan
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                style={{ background: '#f5f1ea', color: '#8b6914' }}>
                {fillPct}% filled
              </span>
            </div>

            <div className="p-3 sm:p-4"
              style={{
                background: '#faf8f5',
                backgroundImage: `
                  repeating-linear-gradient(0deg,  rgba(232,221,208,0.45) 0px, rgba(232,221,208,0.45) 1px, transparent 1px, transparent 44px),
                  repeating-linear-gradient(90deg, rgba(232,221,208,0.45) 0px, rgba(232,221,208,0.45) 1px, transparent 1px, transparent 44px)
                `,
              }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gap: '2px',
                aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
              }}>
                {Array.from({ length: GRID_ROWS }).map((_, row) =>
                  Array.from({ length: GRID_COLS }).map((_, col) => {
                    const p         = getPlacedAt(row, col)
                    const isTopLeft = p?.row === row && p?.col === col
                    const isPreview = previewCells.has(`${row}-${col}`)
                    return (
                      <div key={`${row}-${col}`}
                        className="relative cursor-pointer select-none"
                        style={{
                          aspectRatio: '1',
                          background: p ? `${p.item.color}38` : isPreview ? `${selected.color}28` : 'transparent',
                          border: p ? `1px solid ${p.item.color}70` : isPreview ? `1px dashed ${selected.color}90` : '1px solid transparent',
                          borderRadius: '3px',
                          transition: 'background 0.08s',
                        }}
                        onClick={() => p ? handleRemove(p.uid) : handlePlace(row, col)}
                        onMouseEnter={() => !p && setHoverCell([row, col])}
                        onMouseLeave={() => setHoverCell(null)}
                      >
                        {isTopLeft && p && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p.item.Icon
                              size={Math.min(p.item.size[0], p.item.size[1]) >= 2 ? 15 : 9}
                              style={{ color: p.item.color }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <p className="text-[10px] text-center py-2" style={{ color: '#b8b0a8' }}>
              Click to place · Click placed item to remove · Hover to preview
            </p>
          </div>
        </div>

        {/* Right: Scores + AI + Cart */}
        <div className="w-56 flex-shrink-0 space-y-3">

          {/* Design Score */}
          <div className="rounded-2xl p-4 border" style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Star size={12} className="fill-[#c49a3a] text-[#c49a3a]" />
              <span className="text-xs font-medium" style={{ color: '#1a1a1a' }}>Design Score</span>
            </div>
            <div className="text-2xl font-semibold mb-3"
              style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              {scores.overall}
              <span className="text-xs font-normal ml-1" style={{ color: '#a0a0a0' }}>/100</span>
            </div>
            {([
              ['Comfort',  scores.comfort  ],
              ['Space',    scores.space    ],
              ['Lighting', scores.lighting ],
              ['Balance',  scores.balance  ],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="mb-1.5">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span style={{ color: '#8a8a8a' }}>{label}</span>
                  <span style={{ color: '#4a4a4a' }}>{val}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#f0ebe3' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #8b6914, #c49a3a)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.55, ease: EASE }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI Tips */}
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-4 border overflow-hidden"
                style={{ background: '#1C1714', borderColor: 'rgba(196,154,58,0.15)' }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={11} className="text-[#c49a3a]" />
                    <span className="text-[11px] font-medium text-white">AI Suggestions</span>
                  </div>
                  <button onClick={() => setShowTips(false)}
                    className="text-[10px] transition-colors hover:text-white/60"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    hide
                  </button>
                </div>
                <ul className="space-y-2">
                  {aiTips.map((tip, i) => (
                    <li key={i} className="text-[11px] leading-snug flex items-start gap-1.5"
                      style={{ color: 'rgba(255,255,255,0.62)' }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: '#c49a3a' }}>›</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          {!showTips && (
            <button onClick={() => setShowTips(true)}
              className="w-full py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 border transition-colors hover:bg-[#f5f1ea]"
              style={{ borderColor: '#e8ddd0', color: '#8b6914' }}>
              <Sparkles size={11} /> Show AI Tips
            </button>
          )}

          {/* Cart summary */}
          {placed.length > 0 && (
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(44,44,44,0.08)' }}>
              <div className="px-4 py-2.5 flex items-center gap-2 bg-white"
                style={{ borderBottom: '1px solid #f0ebe3' }}>
                <ShoppingBag size={12} style={{ color: '#1a1a1a' }} />
                <span className="text-[11px] font-medium" style={{ color: '#1a1a1a' }}>Cart Summary</span>
              </div>
              <div className="px-3 py-2 bg-white max-h-40 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#e8ddd0 transparent' }}>
                {placed.map(p => (
                  <div key={p.uid} className="flex justify-between py-1 text-[11px]">
                    <span className="truncate mr-2" style={{ color: '#5a5a5a' }}>{p.item.label}</span>
                    <span style={{ color: '#1a1a1a' }}>${p.item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between bg-[#faf8f5]"
                style={{ borderTop: '1px solid #f0ebe3' }}>
                <span className="text-xs font-medium" style={{ color: '#1a1a1a' }}>Total</span>
                <span className="text-sm font-semibold"
                  style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
                  ${totalCost.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-white" style={{ borderTop: '1px solid #f0ebe3' }}>
                <button onClick={onFinish}
                  className="w-full py-2.5 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  style={{ background: '#1a1a1a' }}>
                  <ShoppingBag size={11} /> Finalise Room
                </button>
              </div>
            </div>
          )}
        </div>{/* end right panel */}

        </div>{/* end desktop row */}

        {/* Mobile: Compact scores + AI + cart */}
        <div className="lg:hidden grid grid-cols-2 gap-3">

          {/* Score card */}
          <div className="rounded-2xl p-3.5 border" style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Star size={11} className="fill-[#c49a3a] text-[#c49a3a]" />
              <span className="text-[11px] font-medium" style={{ color: '#1a1a1a' }}>Score</span>
              <span className="ml-auto text-xl font-semibold"
                style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>{scores.overall}/100</span>
            </div>
            {([
              ['Comfort',  scores.comfort  ],
              ['Space',    scores.space    ],
              ['Lighting', scores.lighting ],
              ['Balance',  scores.balance  ],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="mb-1.5">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span style={{ color: '#9a9a9a' }}>{label}</span>
                  <span style={{ color: '#4a4a4a' }}>{val}</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: '#f0ebe3' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#8b6914,#c49a3a)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.5, ease: EASE }} />
                </div>
              </div>
            ))}
          </div>

          {/* Cart + AI tips */}
          <div className="flex flex-col gap-2.5">
            {placed.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(44,44,44,0.08)' }}>
                <div className="px-3 py-2.5 bg-white flex items-center justify-between"
                  style={{ borderBottom: '1px solid #f0ebe3' }}>
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag size={11} style={{ color: '#1a1a1a' }} />
                    <span className="text-[10px] font-medium" style={{ color: '#1a1a1a' }}>{placed.length} items</span>
                  </div>
                  <span className="text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
                    ${totalCost.toLocaleString()}
                  </span>
                </div>
                <button onClick={onFinish}
                  className="w-full py-2 text-[11px] font-medium text-white flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                  style={{ background: '#1a1a1a' }}>
                  Review <ArrowRight size={10} />
                </button>
              </div>
            )}
            <button
              onClick={() => setShowTips(t => !t)}
              className="py-2.5 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 border transition-colors"
              style={{ borderColor: '#e8ddd0', color: '#8b6914', background: '#fff' }}>
              <Sparkles size={11} /> {showTips ? 'Hide' : 'Show'} AI Tips
            </button>
            {showTips && (
              <div className="rounded-xl p-3 border" style={{ background: '#1C1714', borderColor: 'rgba(196,154,58,0.15)' }}>
                <ul className="space-y-1.5">
                  {aiTips.slice(0, 2).map((tip, i) => (
                    <li key={i} className="text-[10px] leading-snug flex items-start gap-1"
                      style={{ color: 'rgba(255,255,255,0.62)' }}>
                      <span className="flex-shrink-0" style={{ color: '#c49a3a' }}>›</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>{/* end mobile panel */}

      </div>{/* end outer wrapper */}
    </div>
  )
}

// ── Phase 3: Summary ───────────────────────────────────────────────────
function SummaryPhase({
  room, placed, scores, onRestart, onBack,
}: {
  room: RoomType
  placed: PlacedItem[]
  scores: DesignScores
  onRestart: () => void
  onBack: () => void
}) {
  const [added, setAdded] = useState(false)
  const totalCost = placed.reduce((s, p) => s + p.item.price, 0)

  const uniqueItems = placed.reduce<Record<string, { item: FurnitureItem; count: number }>>((acc, p) => {
    if (acc[p.item.id]) acc[p.item.id].count++
    else                acc[p.item.id] = { item: p.item, count: 1 }
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:bg-[#f5f1ea]"
          style={{ borderColor: '#e8ddd0' }}>
          <ChevronLeft size={16} style={{ color: '#1a1a1a' }} />
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: '#8b6914' }}>
            Design Complete
          </p>
          <h3 className="font-medium text-lg" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
            Your {room.name} Design
          </h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* Left (3): Room preview + scores */}
        <div className="lg:col-span-3 space-y-4">

          {/* Mini room render */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: room.gradient, borderColor: 'rgba(44,44,44,0.08)' }}>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <room.Icon size={13} style={{ color: room.accent }} />
                <span className="text-xs font-medium"
                  style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
                  {room.name}
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.82)', color: '#1a1a1a' }}>
                Final Design
              </span>
            </div>
            <div className="px-4 pb-4">
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gap: '2px',
                aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
              }}>
                {Array.from({ length: GRID_ROWS }).map((_, row) =>
                  Array.from({ length: GRID_COLS }).map((_, col) => {
                    const p = placed.find(pl =>
                      row >= pl.row && row < pl.row + pl.item.size[1] &&
                      col >= pl.col && col < pl.col + pl.item.size[0]
                    )
                    const isTopLeft = p?.row === row && p?.col === col
                    return (
                      <div key={`${row}-${col}`}
                        style={{
                          aspectRatio: '1',
                          background: p ? `${p.item.color}42` : 'rgba(255,255,255,0.22)',
                          border: p ? `1px solid ${p.item.color}65` : '1px solid rgba(255,255,255,0.18)',
                          borderRadius: '2px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        {isTopLeft && p && (
                          <p.item.Icon
                            size={Math.min(p.item.size[0], p.item.size[1]) >= 2 ? 11 : 7}
                            style={{ color: p.item.color }}
                          />
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="rounded-2xl p-5 border" style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold"
                  style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                  {scores.overall}
                </span>
                <span className="text-sm" style={{ color: '#9a9a9a' }}>Design Score</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14}
                    className={i < Math.round(scores.overall / 20) ? 'fill-[#c49a3a] text-[#c49a3a]' : 'fill-[#e8ddd0] text-[#e8ddd0]'} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([
                ['Comfort',  scores.comfort  ],
                ['Space',    scores.space    ],
                ['Lighting', scores.lighting ],
                ['Balance',  scores.balance  ],
              ] as [string, number][]).map(([label, val]) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: '#faf8f5' }}>
                  <p className="text-[10px] mb-1" style={{ color: '#9a9a9a' }}>{label}</p>
                  <p className="text-xl font-medium"
                    style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>{val}</p>
                  <div className="h-1 rounded-full mt-1.5" style={{ background: '#e8ddd0' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${val}%`, background: 'linear-gradient(90deg, #8b6914, #c49a3a)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (2): Items + CTA */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(44,44,44,0.08)' }}>
            <div className="px-4 py-3 flex items-center gap-2 bg-white"
              style={{ borderBottom: '1px solid #f0ebe3' }}>
              <ShoppingBag size={13} style={{ color: '#1a1a1a' }} />
              <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Your Furniture</span>
            </div>
            <div className="p-2 bg-white">
              {Object.values(uniqueItems).map(({ item, count }) => (
                <div key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#faf8f5] transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: item.color + '22' }}>
                    <item.Icon size={13} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#1a1a1a' }}>
                      {item.label}{count > 1 ? ` ×${count}` : ''}
                    </p>
                    <p className="text-[10px]" style={{ color: '#9a9a9a' }}>${item.price.toLocaleString()} each</p>
                  </div>
                  <span className="text-xs font-medium flex-shrink-0" style={{ color: '#1a1a1a' }}>
                    ${(item.price * count).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 flex items-center justify-between bg-[#faf8f5]"
              style={{ borderTop: '1px solid #f0ebe3' }}>
              <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
                Total ({placed.length} pieces)
              </span>
              <span className="text-xl font-semibold"
                style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
                ${totalCost.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <AnimatePresence mode="wait">
              {!added ? (
                <motion.button key="add"
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setAdded(true)}
                  className="w-full py-4 rounded-2xl text-sm font-medium text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #8b6914, #c49a3a)', boxShadow: '0 8px 24px rgba(139,105,20,0.22)' }}>
                  <ShoppingBag size={15} /> Add Entire Room to Cart
                </motion.button>
              ) : (
                <motion.div key="added"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 border"
                  style={{ background: '#1a8a4a12', color: '#1a8a4a', borderColor: '#1a8a4a30' }}>
                  <Check size={15} /> {placed.length} items added to cart!
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={onRestart}
              className="w-full py-3.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 border transition-colors hover:bg-[#f5f1ea]"
              style={{ borderColor: '#e8ddd0', color: '#1a1a1a', background: '#fff' }}>
              <RotateCcw size={14} /> Design Another Room
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────
export default function RoomPlanner() {
  const [phase, setPhase]               = useState<Phase>('room')
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [placed, setPlaced]             = useState<PlacedItem[]>([])

  const scores = calcScores(placed)

  function handleRoomSelect(room: RoomType) {
    setSelectedRoom(room)
    setPlaced([])
    setPhase('plan')
  }

  return (
    <section className="py-24 lg:py-32" style={{ background: '#faf8f5' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatePresence mode="wait">
          {phase === 'room' && (
            <motion.div key="room"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: EASE }}>
              <RoomSelectorPhase onSelect={handleRoomSelect} />
            </motion.div>
          )}

          {phase === 'plan' && selectedRoom && (
            <motion.div key="plan"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: EASE }}>
              <PlannerPhase
                room={selectedRoom}
                onBack={() => setPhase('room')}
                onFinish={() => setPhase('summary')}
                placed={placed}
                setPlaced={setPlaced}
              />
            </motion.div>
          )}

          {phase === 'summary' && selectedRoom && (
            <motion.div key="summary"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: EASE }}>
              <SummaryPhase
                room={selectedRoom}
                placed={placed}
                scores={scores}
                onRestart={() => { setSelectedRoom(null); setPlaced([]); setPhase('room') }}
                onBack={() => setPhase('plan')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
