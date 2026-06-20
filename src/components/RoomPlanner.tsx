import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Download, Sofa, BedDouble, UtensilsCrossed, Lamp } from 'lucide-react'

type FurnitureItem = {
  id: string
  label: string
  icon: string
  size: [number, number] // grid cells [cols, rows]
  color: string
}

type PlacedItem = {
  uid: string
  item: FurnitureItem
  row: number
  col: number
}

const FURNITURE_PALETTE: FurnitureItem[] = [
  { id: 'sofa',    label: 'Sofa',         icon: '🛋',  size: [3, 2], color: '#c49a3a' },
  { id: 'bed',     label: 'King Bed',     icon: '🛏',  size: [3, 3], color: '#5a80c8' },
  { id: 'table',   label: 'Dining Table', icon: '🍽',  size: [3, 2], color: '#9a5aaa' },
  { id: 'desk',    label: 'Desk',         icon: '💻',  size: [3, 1], color: '#5a9a5a' },
  { id: 'lamp',    label: 'Floor Lamp',   icon: '💡',  size: [1, 1], color: '#c4605a' },
  { id: 'chair',   label: 'Armchair',     icon: '🪑',  size: [2, 2], color: '#8b6914' },
  { id: 'shelf',   label: 'Bookshelf',    icon: '📚',  size: [1, 3], color: '#3a5a3a' },
  { id: 'rug',     label: 'Area Rug',     icon: '▭',   size: [4, 3], color: '#c49a3a' },
]

const GRID_COLS = 10
const GRID_ROWS = 8

export default function RoomPlanner() {
  const [placed, setPlaced]     = useState<PlacedItem[]>([])
  const [selected, setSelected] = useState<FurnitureItem>(FURNITURE_PALETTE[0])
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null)

  const isCellOccupied = (row: number, col: number, excludeUid?: string): boolean => {
    return placed.some((p) => {
      if (p.uid === excludeUid) return false
      for (let r = p.row; r < p.row + p.item.size[1]; r++) {
        for (let c = p.col; c < p.col + p.item.size[0]; c++) {
          if (r === row && c === col) return true
        }
      }
      return false
    })
  }

  const canPlace = (row: number, col: number, item: FurnitureItem): boolean => {
    if (col + item.size[0] > GRID_COLS) return false
    if (row + item.size[1] > GRID_ROWS)  return false
    for (let r = row; r < row + item.size[1]; r++) {
      for (let c = col; c < col + item.size[0]; c++) {
        if (isCellOccupied(r, c)) return false
      }
    }
    return true
  }

  const handleCellClick = (row: number, col: number) => {
    if (!canPlace(row, col, selected)) return
    const uid = `${selected.id}-${Date.now()}`
    setPlaced((prev) => [...prev, { uid, item: selected, row, col }])
  }

  const removeItem = (uid: string) => {
    setPlaced((prev) => prev.filter((p) => p.uid !== uid))
  }

  const getPlacedAt = (row: number, col: number): PlacedItem | undefined => {
    return placed.find(
      (p) => row >= p.row && row < p.row + p.item.size[1] &&
             col >= p.col && col < p.col + p.item.size[0]
    )
  }

  const isTopLeftOf = (row: number, col: number): boolean => {
    return placed.some((p) => p.row === row && p.col === col)
  }

  const previewCells = new Set<string>()
  if (hoverCell) {
    const [hr, hc] = hoverCell
    if (canPlace(hr, hc, selected)) {
      for (let r = hr; r < hr + selected.size[1]; r++) {
        for (let c = hc; c < hc + selected.size[0]; c++) {
          previewCells.add(`${r}-${c}`)
        }
      }
    }
  }

  return (
    <section className="py-24 lg:py-32" style={{ background: 'var(--color-beige)' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="section-label mb-3">Interactive Tool</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="section-title">
              Design Your<br />
              <span className="gradient-text">Dream Room</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Pick a furniture piece, then click anywhere on the grid to place it.
              Click placed items to remove them.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-60 flex-shrink-0"
          >
            <p className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: 'var(--color-muted)' }}>
              Furniture
            </p>
            <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
              {FURNITURE_PALETTE.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all"
                  style={{
                    background:   selected.id === item.id ? 'var(--color-charcoal)' : 'white',
                    color:        selected.id === item.id ? 'white' : 'var(--color-charcoal)',
                    boxShadow:    'var(--shadow-sm)',
                    border:       `2px solid ${selected.id === item.id ? 'var(--color-charcoal)' : 'transparent'}`,
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                  <span className="text-[10px] opacity-60">
                    {item.size[0]}×{item.size[1]}
                  </span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setPlaced([])}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'white', color: 'var(--color-charcoal)', boxShadow: 'var(--shadow-sm)' }}
              >
                <RotateCcw size={14} />
                Clear Room
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--color-charcoal)', color: 'white' }}
              >
                <Download size={14} />
                Save Layout
              </button>
            </div>

            {/* Room info */}
            <div className="mt-6 p-4 rounded-xl text-sm space-y-1" style={{ background: 'white' }}>
              <p className="font-medium" style={{ color: 'var(--color-dark)' }}>Room: 5m × 4m</p>
              <p style={{ color: 'var(--color-muted)' }}>Items placed: {placed.length}</p>
              <p style={{ color: 'var(--color-muted)' }}>
                Remaining space: {Math.round((1 - placed.reduce((s, p) => s + p.item.size[0] * p.item.size[1], 0) / (GRID_COLS * GRID_ROWS)) * 100)}%
              </p>
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex-1"
          >
            <div
              className="relative rounded-3xl overflow-hidden p-4"
              style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}
            >
              {/* Room walls */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ border: '3px solid var(--color-sand)' }}
              />

              {/* Floor pattern */}
              <div
                className="absolute inset-0 rounded-3xl opacity-30"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, var(--color-beige) 0px, var(--color-beige) 1px, transparent 1px, transparent 60px),
                    repeating-linear-gradient(90deg, var(--color-beige) 0px, var(--color-beige) 1px, transparent 1px, transparent 60px)`,
                }}
              />

              <div
                className="relative"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                  gap: '3px',
                  aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
                }}
              >
                {Array.from({ length: GRID_ROWS }).map((_, row) =>
                  Array.from({ length: GRID_COLS }).map((_, col) => {
                    const placed_ = getPlacedAt(row, col)
                    const isTop   = isTopLeftOf(row, col)
                    const isPreview = previewCells.has(`${row}-${col}`)
                    const canDrop   = hoverCell?.[0] === row && hoverCell?.[1] === col && canPlace(row, col, selected)
                    void canDrop

                    return (
                      <div
                        key={`${row}-${col}`}
                        className="relative rounded-sm transition-all duration-150 cursor-pointer"
                        style={{
                          background: placed_
                            ? `${placed_.item.color}25`
                            : isPreview
                            ? `${selected.color}30`
                            : 'transparent',
                          border: placed_
                            ? `1px solid ${placed_.item.color}60`
                            : isPreview
                            ? `1px dashed ${selected.color}80`
                            : '1px solid transparent',
                          aspectRatio: '1',
                        }}
                        onClick={() => placed_ ? removeItem(placed_.uid) : handleCellClick(row, col)}
                        onMouseEnter={() => !placed_ && setHoverCell([row, col])}
                        onMouseLeave={() => setHoverCell(null)}
                      >
                        {isTop && placed_ && (
                          <div
                            className="absolute inset-0 flex items-center justify-center text-base select-none"
                            style={{ zIndex: 2 }}
                            title={`${placed_.item.label} — click to remove`}
                          >
                            {placed_.item.icon}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Room labels */}
              <div className="flex justify-between mt-2 px-1">
                <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>0m</span>
                <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>5m (width)</span>
              </div>
            </div>

            <p className="text-xs text-center mt-3" style={{ color: 'var(--color-muted)' }}>
              Click to place · Click placed item to remove · Hover to preview
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// suppress unused import warnings for icon components
void Sofa; void BedDouble; void UtensilsCrossed; void Lamp
