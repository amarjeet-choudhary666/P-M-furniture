import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ShoppingBag, Heart, Eye, Star, ChevronLeft, ChevronRight,
  ArrowRight, Calendar, CheckCircle, Mail, Zap,
  Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp, Tv,
  Archive, Home, Leaf, Palette, Bell, Utensils, Users, Package,
  type LucideIcon,
} from 'lucide-react'
import { PRODUCTS, type Product } from '../data/products'

// ─── Props ────────────────────────────────────────────────────────
interface RoomsPageProps {
  onAddToCart: (product: Product) => void
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  wishlist: number[]
}

// ─── Data ─────────────────────────────────────────────────────────
const ROOMS = [
  { id: 'living',  name: 'Living Room',     Icon: Sofa,           count: 124, accent: '#c47858',
    gradient: 'linear-gradient(135deg, #c4785828 0%, #f0ebe380 50%, #e8ddd060 100%)',
    desc: 'Gather, relax, and entertain in style' },
  { id: 'bedroom', name: 'Bedroom',          Icon: BedDouble,      count: 98,  accent: '#8a9e8a',
    gradient: 'linear-gradient(135deg, #8a9e8a28 0%, #d4b8b050 50%, #f0ebe360 100%)',
    desc: 'Design your perfect sanctuary for rest' },
  { id: 'dining',  name: 'Dining Room',      Icon: UtensilsCrossed,count: 76,  accent: '#c4a878',
    gradient: 'linear-gradient(135deg, #c4a87828 0%, #f5f0e870 50%, #e8ddd050 100%)',
    desc: 'Set the stage for memorable meals' },
  { id: 'office',  name: 'Home Office',      Icon: Briefcase,      count: 64,  accent: '#5a6070',
    gradient: 'linear-gradient(135deg, #5a607035 0%, #8c8c8c25 50%, #f0ebe350 100%)',
    desc: 'Elevate your productivity in style' },
  { id: 'kitchen', name: 'Kitchen',          Icon: Utensils,       count: 45,  accent: '#a07040',
    gradient: 'linear-gradient(135deg, #c8b09035 0%, #faf8f560 50%, #e8ddd040 100%)',
    desc: 'Practical elegance for everyday life' },
  { id: 'outdoor', name: 'Outdoor & Patio',  Icon: Leaf,           count: 53,  accent: '#6b8f71',
    gradient: 'linear-gradient(135deg, #6b8f7130 0%, #e8ddd060 50%, #c8b09030 100%)',
    desc: 'Extend your living space into nature' },
  { id: 'kids',    name: 'Kids Room',        Icon: Palette,        count: 38,  accent: '#c49a3a',
    gradient: 'linear-gradient(135deg, #c49a3a28 0%, #e8d4a040 50%, #a0c4d835 100%)',
    desc: 'Safe, fun furniture for curious minds' },
  { id: 'guest',   name: 'Guest Room',       Icon: Bell,           count: 42,  accent: '#9a8aaa',
    gradient: 'linear-gradient(135deg, #9a8aaa28 0%, #d4cfc850 50%, #f0ebe360 100%)',
    desc: 'Make every visitor feel at home' },
]

const ROOM_COLLECTIONS: Record<string, { name: string; Icon: LucideIcon; count: number }[]> = {
  living:  [
    { name: 'Sofas & Sectionals', Icon: Sofa,           count: 42 },
    { name: 'Coffee Tables',      Icon: Lamp,           count: 31 },
    { name: 'TV Units',           Icon: Tv,             count: 18 },
    { name: 'Accent Chairs',      Icon: Archive,        count: 33 },
  ],
  bedroom: [
    { name: 'Beds & Frames',      Icon: BedDouble,      count: 36 },
    { name: 'Wardrobes',          Icon: Archive,        count: 24 },
    { name: 'Nightstands',        Icon: Lamp,           count: 28 },
    { name: 'Dressers',           Icon: Package,        count: 10 },
  ],
  dining:  [
    { name: 'Dining Tables',      Icon: UtensilsCrossed,count: 28 },
    { name: 'Dining Chairs',      Icon: Users,          count: 34 },
    { name: 'Sideboards',         Icon: Archive,        count: 14 },
  ],
  office:  [
    { name: 'Office Desks',       Icon: Briefcase,      count: 22 },
    { name: 'Ergonomic Chairs',   Icon: Users,          count: 18 },
    { name: 'Storage Cabinets',   Icon: Archive,        count: 24 },
  ],
}

const ROOM_PRODUCTS: Record<string, number[]> = {
  living:  [1, 7, 8, 9, 15, 4],
  bedroom: [2, 11, 12, 14, 6],
  dining:  [3, 10, 8, 4, 11],
  office:  [5, 13, 12, 16, 6],
}

const DESIGN_TIPS = [
  { room: 'Living Room', Icon: Sofa, accent: '#c47858',
    tips: [
      'Anchor with a rug that defines the seating zone',
      'Layer lighting: floor, table, and overhead',
      'Mix textures — velvet, linen, and leather add depth',
      'Leave 18" of breathing room from walls',
    ] },
  { room: 'Bedroom', Icon: BedDouble, accent: '#8a9e8a',
    tips: [
      'Centre the bed on the primary wall as the focal point',
      'Choose natural fibres — linen and cotton breathe best',
      'Install blackout curtains for true rest',
      'Keep 24" clearance on each side of the bed',
    ] },
  { room: 'Home Office', Icon: Briefcase, accent: '#5a6070',
    tips: [
      'Desk perpendicular to windows minimises glare',
      'Invest in ergonomic seating — your spine will thank you',
      'Use vertical shelving to keep the floor clear',
      'Separate work and rest zones, even in a small space',
    ] },
]

const ROOM_PACKAGES = [
  { name: 'Essential Living Room', Icon: Sofa,           accent: '#c47858',
    items: ['3-Seater Sofa', 'Coffee Table', 'TV Unit', 'Floor Lamp'],
    original: 6490, bundle: 4390 },
  { name: 'Master Bedroom Suite', Icon: BedDouble,      accent: '#8a9e8a',
    items: ['King Platform Bed', 'Wardrobe ×2', 'Nightstand ×2', 'Dresser'],
    original: 9800, bundle: 6490 },
  { name: 'Dining Room Complete', Icon: UtensilsCrossed, accent: '#c4a878',
    items: ['Dining Table', 'Dining Chair ×6', 'Sideboard', 'Pendant Light'],
    original: 6280, bundle: 4280 },
  { name: 'Home Office Setup',    Icon: Briefcase,      accent: '#5a6070',
    items: ['Writing Desk', 'Ergonomic Chair', 'Storage Cabinet', 'Desk Lamp'],
    original: 4490, bundle: 2990 },
]

const SHOWCASE = [
  { name: 'Emma W.', loc: 'London',   room: 'Living Room',  accent: '#c47858', initials: 'EW', rating: 5,
    quote: 'P&M Craft transformed my living room completely. The sofa is even more beautiful in person than online.' },
  { name: 'James M.', loc: 'New York', room: 'Home Office',  accent: '#5a6070', initials: 'JM', rating: 5,
    quote: 'My home office now feels like a boutique workspace. The Aura Writing Desk is simply stunning.' },
  { name: 'Isabelle C.', loc: 'Paris', room: 'Bedroom',      accent: '#8a9e8a', initials: 'IC', rating: 5,
    quote: 'Beautiful packaging, easy assembly, exceptional quality. The bedroom collection is flawless.' },
  { name: 'Marcus T.', loc: 'Toronto', room: 'Dining Room',  accent: '#c4a878', initials: 'MT', rating: 5,
    quote: 'We host monthly and the Loft Dining Table is always the first thing guests comment on.' },
  { name: 'Zoe K.',    loc: 'Sydney',  room: 'Living Room',  accent: '#c47858', initials: 'ZK', rating: 5,
    quote: 'Premium quality at honest prices. The Haven Sectional fits our open-plan home perfectly.' },
  { name: 'Oliver R.', loc: 'Berlin',  room: 'Bedroom',      accent: '#8a9e8a', initials: 'OR', rating: 5,
    quote: 'The Oslo Platform Bed is a masterpiece. Every morning feels like waking up in a boutique hotel.' },
]

const GALLERY = [
  { h: 260, gradient: 'linear-gradient(160deg, #c4785830, #f0ebe380)', room: 'Living Room' },
  { h: 340, gradient: 'linear-gradient(160deg, #8a9e8a30, #d4b8b060)', room: 'Bedroom' },
  { h: 220, gradient: 'linear-gradient(160deg, #c4a87830, #f5f0e870)', room: 'Dining Room' },
  { h: 300, gradient: 'linear-gradient(160deg, #5a607035, #8c8c8c30)', room: 'Home Office' },
  { h: 240, gradient: 'linear-gradient(160deg, #6b8f7130, #e8ddd060)', room: 'Outdoor' },
  { h: 320, gradient: 'linear-gradient(160deg, #9a8aaa28, #d4cfc850)', room: 'Guest Room' },
  { h: 200, gradient: 'linear-gradient(160deg, #c4785830, #e8d4a040)', room: 'Kids Room' },
  { h: 280, gradient: 'linear-gradient(160deg, #c4a87828, #8a9e8a30)', room: 'Dining Room' },
]

// ─── Helpers ──────────────────────────────────────────────────────
function getSalePrice(p: Product) {
  if (p.originalPrice) return { original: p.originalPrice, sale: p.price }
  const pct = 0.22 + (p.id % 5) * 0.06
  return { original: Math.round(p.price / (1 - pct) / 10) * 10, sale: p.price }
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={11}
          className={i < Math.floor(n) ? 'fill-[#c49a3a] text-[#c49a3a]' : 'fill-[#e8ddd0] text-[#e8ddd0]'} />
      ))}
    </span>
  )
}

function useReveal() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.1 })
  return { ref, inView }
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

function SectionHeader({ eyebrow, headline, sub }: { eyebrow: string; headline: string; sub?: string }) {
  return (
    <div className="text-center mb-12">
      <p className="text-[10px] uppercase tracking-[0.22em] mb-3 font-semibold"
        style={{ color: '#8b6914', fontFamily: 'var(--font-sans)' }}>
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-[2.6rem] font-medium leading-tight"
        style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
        {headline}
      </h2>
      {sub && (
        <p className="text-sm leading-relaxed mt-3 mx-auto" style={{ color: '#6b6b6b', maxWidth: 460 }}>
          {sub}
        </p>
      )}
    </div>
  )
}

// ─── Room Card ────────────────────────────────────────────────────
function RoomCard({ room, index, large }: { room: typeof ROOMS[0]; index: number; large?: boolean }) {
  const navigate = useNavigate()
  return (
    <motion.div
      custom={index} variants={fadeUp}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${large ? 'md:col-span-2 md:row-span-2' : ''}`}
      style={{ minHeight: large ? 420 : 240, background: room.gradient }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate('/collections')}
    >
      {/* Inner zoom container */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ background: room.gradient }} />

      {/* Accent stripe at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: room.accent }} />

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: room.accent }} />

      {/* Room icon */}
      {(() => {
        const RoomIcon = ROOMS[index]?.Icon ?? Home
        return (
          <div className="absolute top-5 left-5 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
            <RoomIcon size={18} className="text-[#6b6b6b]" />
          </div>
        )
      })()}

      {/* Hover CTA */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="px-5 py-2.5 rounded-full text-sm font-medium text-white flex items-center gap-2"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
          Explore <ArrowRight size={14} />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5"
        style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.55) 0%, transparent 100%)' }}>
        <h3 className="font-medium text-white mb-0.5"
          style={{ fontFamily: 'var(--font-serif)', fontSize: large ? '1.5rem' : '1.05rem' }}>
          {room.name}
        </h3>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{room.count} pieces</p>
        {large && (
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{room.desc}</p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Sub-category card ────────────────────────────────────────────
function SubCard({ sub, accent }: { sub: { name: string; Icon: LucideIcon; count: number }; accent: string }) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group rounded-xl p-5 border cursor-pointer transition-shadow hover:shadow-md"
      style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: accent + '18' }}>
        <sub.Icon size={18} style={{ color: accent }} />
      </div>
      <p className="text-sm font-medium mb-0.5" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
        {sub.name}
      </p>
      <p className="text-[11px]" style={{ color: '#6b6b6b' }}>{sub.count} items</p>
      <div className="flex items-center gap-1 mt-3 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: accent }}>
        Browse <ArrowRight size={11} />
      </div>
    </motion.div>
  )
}

// ─── Compact Product Card (for carousel) ─────────────────────────
function CarouselCard({ product, onAddToCart, onWishlist, onQuickView, wishlisted }:
  { product: Product; onAddToCart(p: Product): void; onWishlist(p: Product): void; onQuickView(p: Product): void; wishlisted: boolean }) {
  const { sale } = getSalePrice(product)
  return (
    <div className="group flex-shrink-0 w-52 rounded-xl overflow-hidden border"
      style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
      <div className="relative h-40 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.materials[0].color}28, ${product.materials[0].color}55)` }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full opacity-30" style={{ background: product.materials[0].color }} />
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onWishlist(product)} aria-label="Wishlist"
            className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
            <Heart size={12} className={wishlisted ? 'fill-[#B04A22] text-[#B04A22]' : 'text-[#6b6b6b]'} />
          </button>
          <button onClick={() => onQuickView(product)} aria-label="Quick view"
            className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
            <Eye size={12} className="text-[#6b6b6b]" />
          </button>
        </div>
        <button onClick={() => onAddToCart(product)}
          className="absolute bottom-0 left-0 right-0 py-2 text-xs font-medium text-white flex items-center justify-center gap-1 translate-y-full group-hover:translate-y-0 transition-transform duration-250"
          style={{ background: '#1a1a1a' }}>
          <ShoppingBag size={11} /> Add
        </button>
      </div>
      <div className="p-3">
        <h4 className="text-xs font-medium leading-snug mb-1 truncate"
          style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
          {product.name}
        </h4>
        <div className="flex items-center gap-1 mb-1">
          <Stars n={product.rating} />
          <span className="text-[9px]" style={{ color: '#6b6b6b' }}>({product.reviews})</span>
        </div>
        <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>${sale.toLocaleString()}</p>
      </div>
    </div>
  )
}

// ─── Carousel ─────────────────────────────────────────────────────
function Carousel({ products, onAddToCart, onWishlist, onQuickView, wishlist }:
  { products: Product[]; onAddToCart(p: Product): void; onWishlist(p: Product): void; onQuickView(p: Product): void; wishlist: number[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <button onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center border hover:shadow-lg transition-shadow"
        style={{ borderColor: 'rgba(44,44,44,0.08)' }} aria-label="Scroll left">
        <ChevronLeft size={16} style={{ color: '#1a1a1a' }} />
      </button>
      <div ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 px-1"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {products.map(p => (
          <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
            <CarouselCard product={p}
              onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
              wishlisted={wishlist.includes(p.id)} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center border hover:shadow-lg transition-shadow"
        style={{ borderColor: 'rgba(44,44,44,0.08)' }} aria-label="Scroll right">
        <ChevronRight size={16} style={{ color: '#1a1a1a' }} />
      </button>
    </div>
  )
}

// ─── Gallery Card ─────────────────────────────────────────────────
function GalleryCard({ item }: { item: typeof GALLERY[0] }) {
  return (
    <div className="group relative rounded-xl overflow-hidden cursor-pointer mb-4"
      style={{ height: item.h, background: item.gradient }}>
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)' }} />
      {/* Room label */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium"
        style={{ background: 'rgba(255,255,255,0.85)', color: '#1a1a1a' }}>
        {item.room}
      </div>
      {/* Shop the look overlay */}
      <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <ShoppingBag size={11} /> Shop the Look
        </button>
      </div>
    </div>
  )
}

// ─── Package Card ─────────────────────────────────────────────────
function PackageCard({ pkg, index }: { pkg: typeof ROOM_PACKAGES[0]; index: number }) {
  const savings = pkg.original - pkg.bundle
  const pct = Math.round(savings / pkg.original * 100)
  return (
    <motion.div custom={index} variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group rounded-2xl border overflow-hidden cursor-pointer"
      style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
      {/* Visual header */}
      <div className="relative h-40 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${pkg.accent}20, ${pkg.accent}40)` }}>
        <pkg.Icon size={48} className="group-hover:scale-110 transition-transform duration-300" style={{ color: pkg.accent }} />
        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
          style={{ background: '#8b6914' }}>
          Save {pct}%
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-medium mb-2" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
          {pkg.name}
        </h3>
        <ul className="mb-4 space-y-1">
          {pkg.items.map(item => (
            <li key={item} className="flex items-center gap-2 text-[11px]" style={{ color: '#6b6b6b' }}>
              <CheckCircle size={11} style={{ color: pkg.accent }} /> {item}
            </li>
          ))}
        </ul>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>${pkg.bundle.toLocaleString()}</span>
          <span className="text-sm line-through" style={{ color: '#9a9a9a' }}>${pkg.original.toLocaleString()}</span>
        </div>
        <div className="p-2 rounded-lg text-[11px] font-medium text-center mb-3"
          style={{ background: pkg.accent + '15', color: pkg.accent }}>
          You save ${savings.toLocaleString()} with this bundle
        </div>
        <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1a1a1a' }}>
          Shop This Room
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────
type RoomTab = 'living' | 'bedroom' | 'dining' | 'office'

export default function RoomsPage({ onAddToCart, onWishlist, onQuickView, wishlist }: RoomsPageProps) {
  const navigate = useNavigate()
  const [activeCollection, setActiveCollection] = useState<RoomTab>('living')
  const [activeBestSeller, setActiveBestSeller] = useState<RoomTab>('living')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { ref: gridRef,     inView: gridIn     } = useReveal()
  const { ref: collRef,     inView: _collIn    } = useReveal()
  const { ref: gallRef,     inView: gallIn     } = useReveal()
  const { ref: bestRef,     inView: bestIn     } = useReveal()
  const { ref: tipsRef,     inView: tipsIn     } = useReveal()
  const { ref: pkgRef,      inView: pkgIn      } = useReveal()
  const { ref: showcaseRef, inView: showcaseIn } = useReveal()

  const COLL_TABS: { id: RoomTab; label: string }[] = [
    { id: 'living',  label: 'Living Room' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'dining',  label: 'Dining Room' },
    { id: 'office',  label: 'Home Office' },
  ]

  function getCarouselProducts(room: RoomTab): Product[] {
    const ids = ROOM_PRODUCTS[room] ?? []
    return ids.map(id => PRODUCTS.find(p => p.id === id)!).filter(Boolean)
  }

  return (
    <div style={{ background: '#faf8f5' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#faf8f5' }}>
        {/* Subtle warm gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(196,154,58,0.07) 0%, transparent 60%)' }} />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: editorial text */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-8" style={{ background: '#8b6914' }} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: '#8b6914' }}>
                  Shop by Room
                </span>
              </div>
              <h1 className="font-medium leading-tight mb-6"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                  color: '#1a1a1a',
                  letterSpacing: '-0.02em',
                }}>
                Furniture for<br />
                <span style={{ fontStyle: 'italic', color: '#8b6914' }}>Every Room</span>
              </h1>
              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: '#6b6b6b' }}>
                Curated collections designed to elevate every corner of your home. From living rooms to home offices — discover furniture that fits your life.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('room-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3.5 rounded-full text-sm font-medium text-white flex items-center gap-2"
                  style={{ background: '#1a1a1a' }}>
                  Explore Rooms <ArrowRight size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('room-packages')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3.5 rounded-full text-sm font-medium border"
                  style={{ borderColor: '#e8ddd0', color: '#2c2c2c' }}>
                  Room Packages
                </motion.button>
              </div>
            </motion.div>

            {/* Right: mini room mosaic */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden lg:grid grid-cols-2 gap-3">
              {ROOMS.slice(0, 4).map((room, i) => (
                <motion.div key={room.id}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{ height: i % 2 === 0 ? 180 : 140, background: room.gradient }}
                  onClick={() => navigate('/collections')}>
                  <div className="absolute bottom-0 left-0 right-0 p-3"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}>
                    <p className="text-white text-xs font-medium">{room.name}</p>
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px]"
                    style={{ background: 'rgba(255,255,255,0.85)', color: '#1a1a1a' }}>
                    {room.count} pieces
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: '#e8ddd0' }} />
      </section>

      {/* ── Room Grid ────────────────────────────────────────────── */}
      <section id="room-grid" ref={gridRef as React.RefObject<HTMLElement>} className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="All Spaces" headline="Which Room Are You Designing?"
          sub="Select a room to explore furniture curated specifically for that space." />
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[200px]"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate={gridIn ? 'visible' : 'hidden'}>
          {ROOMS.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} large={i === 0} />
          ))}
        </motion.div>
      </section>

      {/* ── Room Collections (tabbed) ─────────────────────────────── */}
      <section ref={collRef as React.RefObject<HTMLElement>} className="py-20" style={{ background: '#f5f1ea' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader eyebrow="Featured Collections" headline="Shop by Category" />

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {COLL_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveCollection(tab.id)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeCollection === tab.id ? '#1a1a1a' : 'transparent',
                  color: activeCollection === tab.id ? '#fff' : '#6b6b6b',
                  border: `1px solid ${activeCollection === tab.id ? '#1a1a1a' : '#e8ddd0'}`,
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeCollection}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}>
              {/* Room intro */}
              {(() => {
                const room = ROOMS.find(r => r.id === activeCollection)!
                return (
                  <div className="flex items-center gap-4 mb-8 p-5 rounded-2xl border"
                    style={{ background: room.gradient, borderColor: 'rgba(44,44,44,0.06)' }}>
                    {(() => {
                      const rm = ROOMS.find(r => r.id === activeCollection)
                      const RoomIcon = rm?.Icon ?? Home
                      return (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: (rm?.accent ?? '#8b6914') + '20' }}>
                          <RoomIcon size={22} style={{ color: rm?.accent ?? '#8b6914' }} />
                        </div>
                      )
                    })()}
                    <div>
                      <h3 className="font-medium mb-0.5" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a', fontSize: '1.1rem' }}>
                        {room.name}
                      </h3>
                      <p className="text-sm" style={{ color: '#6b6b6b' }}>{room.desc}</p>
                    </div>
                    <button onClick={() => navigate('/collections')}
                      className="ml-auto px-5 py-2 rounded-full text-xs font-medium text-white hidden sm:block"
                      style={{ background: '#1a1a1a' }}>
                      View All
                    </button>
                  </div>
                )
              })()}

              {/* Sub-category grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(ROOM_COLLECTIONS[activeCollection] ?? []).map(sub => (
                  <SubCard key={sub.name} sub={sub}
                    accent={ROOMS.find(r => r.id === activeCollection)?.accent ?? '#8b6914'} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Inspiration Gallery ───────────────────────────────────── */}
      <section ref={gallRef as React.RefObject<HTMLElement>} className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Room Inspiration" headline="See It Styled"
          sub="Browse real room setups. Click any image to explore the furniture featured." />
        <motion.div
          initial={{ opacity: 0 }}
          animate={gallIn ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY.map((item, i) => (
            <div key={i}>
              <GalleryCard item={item} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Best Sellers by Room ──────────────────────────────────── */}
      <section ref={bestRef as React.RefObject<HTMLElement>} className="py-20" style={{ background: '#f5f1ea' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader eyebrow="Most Loved" headline="Best Sellers by Room" />

          {/* Room tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {COLL_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveBestSeller(tab.id)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeBestSeller === tab.id ? '#1a1a1a' : 'transparent',
                  color: activeBestSeller === tab.id ? '#fff' : '#6b6b6b',
                  border: `1px solid ${activeBestSeller === tab.id ? '#1a1a1a' : '#e8ddd0'}`,
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeBestSeller}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-5">
              {bestIn && (
                <Carousel
                  products={getCarouselProducts(activeBestSeller)}
                  onAddToCart={onAddToCart}
                  onWishlist={onWishlist}
                  onQuickView={onQuickView}
                  wishlist={wishlist}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Design Tips ───────────────────────────────────────────── */}
      <section ref={tipsRef as React.RefObject<HTMLElement>} className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Expert Advice" headline="Styling Tips from Our Designers"
          sub="Simple principles that make any room feel curated and complete." />
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate={tipsIn ? 'visible' : 'hidden'}>
          {DESIGN_TIPS.map((tip, i) => (
            <motion.div key={tip.room} custom={i} variants={fadeUp}
              className="rounded-2xl p-6 border"
              style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: tip.accent + '18' }}>
                  <tip.Icon size={20} style={{ color: tip.accent }} />
                </div>
                <h3 className="font-medium" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
                  {tip.room}
                </h3>
              </div>
              <ul className="space-y-3">
                {tip.tips.map((t, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm leading-snug" style={{ color: '#4a4a4a' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: tip.accent }} />
                    {t}
                  </li>
                ))}
              </ul>
              <button className="mt-5 text-xs font-medium flex items-center gap-1"
                style={{ color: tip.accent }}>
                More tips <ArrowRight size={11} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Room Packages ─────────────────────────────────────────── */}
      <section id="room-packages" ref={pkgRef as React.RefObject<HTMLElement>} className="py-20"
        style={{ background: '#f5f1ea' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader eyebrow="Complete Sets" headline="Shop Complete Room Packages"
            sub="Pre-designed room bundles — everything you need, curated and priced together." />
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden"
            animate={pkgIn ? 'visible' : 'hidden'}>
            {ROOM_PACKAGES.map((pkg, i) => <PackageCard key={pkg.name} pkg={pkg} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Customer Showcase ─────────────────────────────────────── */}
      <section ref={showcaseRef as React.RefObject<HTMLElement>} className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Real Homes" headline="Customer Home Showcase"
          sub="Thousands of P&M Craft homes across the world. Here are some of our favourites." />
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate={showcaseIn ? 'visible' : 'hidden'}>
          {SHOWCASE.map((s, i) => (
            <motion.div key={s.name} custom={i} variants={fadeUp}
              className="rounded-2xl overflow-hidden border"
              style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
              {/* Simulated room photo */}
              <div className="relative h-40"
                style={{ background: `linear-gradient(135deg, ${s.accent}25, ${s.accent}50)` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full opacity-25" style={{ background: s.accent }} />
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(255,255,255,0.85)', color: '#1a1a1a' }}>
                  {s.room}
                </div>
                <div className="absolute top-3 right-3 flex gap-0.5">
                  {Array.from({ length: s.rating }, (_, j) => (
                    <Star key={j} size={12} className="fill-[#c49a3a] text-[#c49a3a]" />
                  ))}
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: '#4a4a4a' }}>
                  "{s.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #f0ebe3' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ background: s.accent }}>
                    {s.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#1a1a1a' }}>{s.name}</p>
                    <p className="text-[10px]" style={{ color: '#6b6b6b' }}>{s.loc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Room Planner CTA ──────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#1C1714' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(196,154,58,0.09) 0%, transparent 55%)' }} />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(196,154,58,0.12)' }}>
            <Calendar size={20} className="text-[#c49a3a]" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: '#c49a3a' }}>
            Free Service
          </p>
          <h2 className="text-3xl md:text-4xl font-medium mb-5"
            style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            Need Help Designing<br />
            <span style={{ fontStyle: 'italic', color: '#c49a3a' }}>Your Space?</span>
          </h2>
          <p className="text-sm mb-8 leading-relaxed mx-auto max-w-md" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Our interior design consultants will help you choose the perfect furniture for your room, layout, and budget. No obligation — just great advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full text-sm font-medium text-white flex items-center gap-2 justify-center"
              style={{ background: '#8b6914' }}>
              <Calendar size={15} /> Book a Free Consultation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/collections')}
              className="px-8 py-4 rounded-full text-sm font-medium border flex items-center gap-2 justify-center"
              style={{ borderColor: 'rgba(255,255,255,0.18)', color: '#fff', background: 'rgba(255,255,255,0.04)' }}>
              Browse Collections <ArrowRight size={15} />
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-5 justify-center mt-8">
            {['Personalised advice', 'No commitment required', '30-min video call'].map(b => (
              <span key={b} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <CheckCircle size={11} className="text-[#c49a3a]" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section className="py-20 max-w-2xl mx-auto px-6 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: '#f0ebe3' }}>
          <Mail size={18} style={{ color: '#8b6914' }} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-3" style={{ color: '#8b6914' }}>
          Stay Inspired
        </p>
        <h2 className="text-2xl md:text-3xl font-medium mb-3"
          style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
          Room Inspiration, Delivered
        </h2>
        <p className="text-sm mb-7 leading-relaxed" style={{ color: '#6b6b6b' }}>
          Monthly design tips, new arrivals, and exclusive member offers — straight to your inbox.
        </p>

        {!submitted ? (
          <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
            className="flex gap-2 max-w-md mx-auto">
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none border"
              style={{ borderColor: '#e8ddd0', background: '#fff', color: '#1a1a1a' }}
            />
            <button type="submit"
              className="px-6 py-3.5 rounded-full text-sm font-medium text-white flex items-center gap-1.5 whitespace-nowrap hover:opacity-90 transition-opacity"
              style={{ background: '#1a1a1a' }}>
              <Zap size={13} /> Subscribe
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            className="py-4 px-8 rounded-full text-sm font-medium max-w-md mx-auto"
            style={{ background: '#f0ebe3', color: '#8b6914', border: '1px solid #e8ddd0' }}>
            Welcome to the P&M Craft community, {email}
          </motion.div>
        )}
        <p className="text-[10px] mt-4" style={{ color: '#a0a0a0' }}>
          No spam. Unsubscribe anytime.
        </p>
      </section>

    </div>
  )
}
