import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ShoppingBag, Heart, Eye, Star, Clock, Truck,
  Shield, RotateCcw, Award, Leaf, Mail, Zap,
  ChevronRight, Package, Flame,
} from 'lucide-react'
import { PRODUCTS, type Product } from '../data/products'

// ─── Props ────────────────────────────────────────────────────────
interface SalePageProps {
  onAddToCart: (product: Product) => void
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  wishlist: number[]
}

// ─── Helpers ──────────────────────────────────────────────────────
function getCountdown() {
  const now = new Date()
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const diff = Math.max(0, end.getTime() - now.getTime())
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

function getSalePrice(product: Product) {
  if (product.originalPrice) return { original: product.originalPrice, sale: product.price }
  const pct = 0.22 + (product.id % 5) * 0.06
  return {
    original: Math.round(product.price / (1 - pct) / 10) * 10,
    sale: product.price,
  }
}

function getDiscount(product: Product) {
  const { original, sale } = getSalePrice(product)
  return Math.round((1 - sale / original) * 100)
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={11}
          className={i < Math.floor(rating) ? 'fill-[#c49a3a] text-[#c49a3a]' : 'text-[#e8ddd0] fill-[#e8ddd0]'} />
      ))}
    </span>
  )
}

// ─── Scroll reveal ────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.12 })
  return { ref, inView }
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } }),
}

// ─── Countdown ────────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState(getCountdown())
  useEffect(() => {
    const id = setInterval(() => setTime(getCountdown()), 1000)
    return () => clearInterval(id)
  }, [])
  const segs = [
    { label: 'Hours',   v: time.hours },
    { label: 'Minutes', v: time.minutes },
    { label: 'Seconds', v: time.seconds },
  ]
  return (
    <div className="flex items-center gap-2">
      {segs.map(({ label, v }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.11)',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.04em',
              }}>
              {pad(v)}
            </div>
            <span className="text-[9px] uppercase tracking-[0.18em] mt-1.5"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
              {label}
            </span>
          </div>
          {i < segs.length - 1 && (
            <span className="text-xl font-light pb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>:</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────
function SectionHeader({ eyebrow, headline, sub }: { eyebrow: string; headline: string; sub?: string }) {
  return (
    <div className="text-center mb-12">
      <p className="text-[10px] uppercase tracking-[0.22em] mb-3 font-semibold"
        style={{ color: '#B04A22', fontFamily: 'var(--font-sans)' }}>
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

// ─── Sale Categories ──────────────────────────────────────────────
const SALE_CATS = [
  { name: 'Sofas',       emoji: '🛋️', discount: 40, count: 38, bg: '#c4a87822' },
  { name: 'Beds',        emoji: '🛏️', discount: 55, count: 24, bg: '#8a9e8a22' },
  { name: 'Dining Sets', emoji: '🍽️', discount: 35, count: 19, bg: '#c4785822' },
  { name: 'Coffee Tables', emoji: '◼', discount: 50, count: 31, bg: '#a0a0a022' },
  { name: 'Office',      emoji: '💼', discount: 45, count: 22, bg: '#a05c2c22' },
  { name: 'Storage',     emoji: '📦', discount: 60, count: 17, bg: '#7a726822' },
  { name: 'Outdoor',     emoji: '🌿', discount: 70, count: 15, bg: '#6b8f7122' },
]

function CategoryCard({ cat, i }: { cat: typeof SALE_CATS[0]; i: number }) {
  return (
    <motion.div custom={i} variants={fadeUp} className="group cursor-pointer">
      <div className="relative rounded-2xl overflow-hidden aspect-square mb-2.5 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ background: cat.bg }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ background: '#B04A22' }}>
          -{cat.discount}%
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
          <p className="text-white text-[11px] text-center">{cat.count} items</p>
        </div>
      </div>
      <p className="text-center text-xs font-medium" style={{ color: '#1a1a1a' }}>{cat.name}</p>
    </motion.div>
  )
}

// ─── Flash Deal Card ──────────────────────────────────────────────
const FLASH_IDS = [2, 6, 5, 15]
const FLASH_DEALS = FLASH_IDS.map(id => PRODUCTS.find(p => p.id === id)!).filter(Boolean)

function FlashCard({ product, i, onAddToCart, onWishlist, onQuickView, wishlisted }:
  { product: Product; i: number; onAddToCart(p: Product): void; onWishlist(p: Product): void; onQuickView(p: Product): void; wishlisted: boolean }) {
  const { original, sale } = getSalePrice(product)
  const discount = getDiscount(product)
  const stockPct = [28, 41, 63, 35][i] ?? 40

  return (
    <motion.div custom={i} variants={fadeUp}
      className="rounded-2xl overflow-hidden border flex flex-col"
      style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
      {/* Visual */}
      <div className="relative h-48 flex-shrink-0 group overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.materials[0].color}30, ${product.materials[0].color}60)` }}>
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
          style={{ background: '#B04A22' }}>
          -{discount}%
        </div>
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.92)' }}>
          <Flame size={14} className="text-[#B04A22]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full opacity-35"
            style={{ background: product.materials[0].color }} />
        </div>
        <div className="absolute inset-0 flex items-end justify-center gap-2 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onWishlist(product)} aria-label="Wishlist"
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <Heart size={13} className={wishlisted ? 'fill-[#B04A22] text-[#B04A22]' : 'text-[#6b6b6b]'} />
          </button>
          <button onClick={() => onQuickView(product)} aria-label="Quick view"
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <Eye size={13} className="text-[#6b6b6b]" />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-widest mb-1 font-semibold" style={{ color: '#B04A22' }}>Flash Deal</p>
        <h3 className="text-sm font-medium mb-2 leading-snug flex-1"
          style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-semibold" style={{ color: '#1a1a1a' }}>${sale.toLocaleString()}</span>
          <span className="text-xs line-through" style={{ color: '#6b6b6b' }}>${original.toLocaleString()}</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded ml-auto"
            style={{ background: '#B04A2215', color: '#B04A22' }}>
            Save ${(original - sale).toLocaleString()}
          </span>
        </div>
        {/* Stock bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: '#6b6b6b' }}>
            <span>Remaining stock</span>
            <span style={{ color: stockPct < 40 ? '#B04A22' : '#6b6b6b', fontWeight: 600 }}>{stockPct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#f0ebe3' }}>
            <div className="h-full rounded-full" style={{
              width: `${stockPct}%`,
              background: stockPct < 40 ? '#B04A22' : '#8b6914',
            }} />
          </div>
        </div>
        <button onClick={() => onAddToCart(product)}
          className="w-full py-2.5 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
          style={{ background: '#1a1a1a' }}>
          <ShoppingBag size={13} /> Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

// ─── Sale Product Card ────────────────────────────────────────────
function SaleCard({ product, onAddToCart, onWishlist, onQuickView, wishlisted }:
  { product: Product; onAddToCart(p: Product): void; onWishlist(p: Product): void; onQuickView(p: Product): void; wishlisted: boolean }) {
  const { original, sale } = getSalePrice(product)
  const discount = getDiscount(product)

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      className="group rounded-2xl overflow-hidden border flex flex-col"
      style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
      {/* Image area */}
      <div className="relative h-52 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.materials[0].color}28, ${product.materials[0].color}55)` }}>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#B04A22' }}>
            -{discount}% OFF
          </span>
          {product.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: '#faf8f5', color: '#8b6914' }}>
              {product.badge}
            </span>
          )}
        </div>
        {/* Abstract product visual */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full opacity-30" style={{ background: product.materials[0].color }} />
        </div>
        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button onClick={() => onWishlist(product)} aria-label="Wishlist"
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <Heart size={13} className={wishlisted ? 'fill-[#B04A22] text-[#B04A22]' : 'text-[#6b6b6b]'} />
          </button>
          <button onClick={() => onQuickView(product)} aria-label="Quick view"
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <Eye size={13} className="text-[#6b6b6b]" />
          </button>
        </div>
        {/* Slide-up cart bar */}
        <button onClick={() => onAddToCart(product)}
          className="absolute bottom-0 left-0 right-0 py-2.5 text-xs font-medium text-white flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: '#1a1a1a' }}>
          <ShoppingBag size={13} /> Add to Cart
        </button>
      </div>
      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-medium mb-1 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={product.rating} />
          <span className="text-[10px]" style={{ color: '#6b6b6b' }}>({product.reviews})</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold" style={{ color: '#1a1a1a' }}>${sale.toLocaleString()}</span>
            <span className="text-xs line-through" style={{ color: '#9a9a9a' }}>${original.toLocaleString()}</span>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: '#8b6914' }}>
            You save ${(original - sale).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Bundle Card ──────────────────────────────────────────────────
const BUNDLES = [
  { name: 'Living Room Bundle', emoji: '🛋️', items: ['Velour Cloud Sofa', 'Mist Coffee Table', 'Arc Floor Lamp'], original: 4090, bundle: 2790, accent: '#c4a878' },
  { name: 'Bedroom Bundle',     emoji: '🛏️', items: ['Oslo Platform Bed', 'Zephyr Side Table ×2', 'Solis Pendant Light'], original: 4390, bundle: 2890, accent: '#8a9e8a' },
  { name: 'Dining Bundle',      emoji: '🍽️', items: ['Loft Dining Table', 'Porto Dining Chair ×4'], original: 4520, bundle: 2980, accent: '#c47858' },
]

function BundleCard({ b, i }: { b: typeof BUNDLES[0]; i: number }) {
  const savings = b.original - b.bundle
  const pct = Math.round(savings / b.original * 100)
  return (
    <motion.div custom={i} variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group rounded-2xl p-6 border relative overflow-hidden cursor-pointer"
      style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
      <div className="absolute top-0 right-0 w-28 h-28 rounded-bl-[40px] opacity-[0.07] group-hover:opacity-[0.13] transition-opacity duration-300"
        style={{ background: b.accent }} />
      <div className="text-3xl mb-4">{b.emoji}</div>
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white mb-3"
        style={{ background: '#B04A22' }}>
        Save {pct}%
      </span>
      <h3 className="text-base font-medium mb-2" style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
        {b.name}
      </h3>
      <ul className="mb-4 space-y-1">
        {b.items.map(item => (
          <li key={item} className="flex items-center gap-2 text-[11px]" style={{ color: '#6b6b6b' }}>
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: b.accent }} />
            {item}
          </li>
        ))}
      </ul>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>${b.bundle.toLocaleString()}</span>
        <span className="text-sm line-through" style={{ color: '#9a9a9a' }}>${b.original.toLocaleString()}</span>
      </div>
      <div className="p-2 rounded-lg text-[11px] font-medium text-center mb-3"
        style={{ background: '#B04A2210', color: '#B04A22' }}>
        Bundle savings: ${savings.toLocaleString()}
      </div>
      <button className="w-full py-2.5 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
        style={{ background: '#1a1a1a' }}>
        <Package size={13} /> Shop This Bundle
      </button>
    </motion.div>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Alexandra Chen', loc: 'New York, NY', initials: 'AC', accent: '#c4a878', item: 'Oslo Platform Bed', rating: 5,
    text: 'The Oslo Bed transformed my bedroom into a sanctuary. LUMINA\'s craftsmanship is in a different league — you can feel the quality immediately. The sale pricing made it accessible without compromising an inch of luxury.' },
  { name: 'Marcus Rowell', loc: 'San Francisco, CA', initials: 'MR', accent: '#8a9e8a', item: 'Velour Cloud Sofa', rating: 5,
    text: 'Ordered the Velour Cloud Sofa during the sale and I\'m absolutely floored. Three months in and it looks as pristine as day one. Customer service was impeccable through the entire delivery process.' },
  { name: 'Sophie Laurent', loc: 'Chicago, IL', initials: 'SL', accent: '#c47858', item: 'Float Lounge Chair', rating: 5,
    text: 'I\'ve furnished three homes and LUMINA is genuinely the best I\'ve encountered at any price point. The Float Lounge Chair I picked up on sale is now the centerpiece of my living room.' },
]

// ─── Trust benefits ───────────────────────────────────────────────
const TRUST = [
  { Icon: Truck,    title: 'Free Shipping',  desc: 'On orders over $500' },
  { Icon: Shield,   title: 'Secure Payment', desc: '256-bit SSL encryption' },
  { Icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free process' },
  { Icon: Award,    title: '5-Year Warranty', desc: 'On all premium pieces' },
  { Icon: Leaf,     title: 'Sustainably Made', desc: 'FSC certified materials' },
]

// ─── Room data ────────────────────────────────────────────────────
type RoomKey = 'living' | 'bedroom' | 'dining' | 'office' | 'outdoor'
const ROOM_TABS: { id: RoomKey; label: string }[] = [
  { id: 'living',  label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'dining',  label: 'Dining Room' },
  { id: 'office',  label: 'Home Office' },
  { id: 'outdoor', label: 'Outdoor' },
]
const ROOM_DEALS: Record<RoomKey, Product[]> = {
  living:  PRODUCTS.filter(p => ['sofa', 'decor'].includes(p.category)).slice(0, 4),
  bedroom: PRODUCTS.filter(p => p.category === 'bed').concat(PRODUCTS.filter(p => p.category === 'decor').slice(0, 3)).slice(0, 4),
  dining:  PRODUCTS.filter(p => p.category === 'dining').concat(PRODUCTS.filter(p => p.category === 'chair')).slice(0, 4),
  office:  PRODUCTS.filter(p => p.category === 'office').concat(PRODUCTS.filter(p => p.category === 'storage')).slice(0, 4),
  outdoor: PRODUCTS.filter((_, idx) => idx % 3 !== 0).slice(0, 4),
}

// ─── Main Page ────────────────────────────────────────────────────
export default function SalePage({ onAddToCart, onWishlist, onQuickView, wishlist }: SalePageProps) {
  const navigate = useNavigate()
  const [activeRoom, setActiveRoom] = useState<RoomKey>('living')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { ref: catRef,    inView: catIn    } = useReveal()
  const { ref: flashRef,  inView: flashIn  } = useReveal()
  const { ref: bestRef,   inView: bestIn   } = useReveal()
  const { ref: bundleRef, inView: bundleIn } = useReveal()
  const { ref: reviewRef, inView: reviewIn } = useReveal()
  const { ref: trustRef,  inView: trustIn  } = useReveal()

  return (
    <div style={{ background: '#faf8f5' }}>

      {/* ── Sticky Promo Bar ──────────────────────────────────────── */}
      <div className="sticky top-[72px] z-[750] flex items-center justify-center gap-6 px-4 py-2.5 text-white text-[11px] font-medium"
        style={{ background: '#B04A22' }}>
        <span className="flex items-center gap-1.5">
          <Flame size={11} /> Sale Ends Tonight — Up to 70% Off
        </span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Truck size={11} /> Free Shipping Over $500
        </span>
        <span className="hidden md:inline opacity-40">|</span>
        <span className="hidden md:inline">Code: <strong>LUMINA70</strong></span>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden"
        style={{ background: '#1C1714' }}>
        {/* Ambient gradients */}
        <div className="absolute top-0 right-0 w-[640px] h-[560px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 75% 25%, rgba(196,154,58,0.10) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 85%, rgba(176,74,34,0.10) 0%, transparent 55%)' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: '#B04A22' }} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: '#B04A22' }}>
                  Limited Time Event
                </span>
              </div>

              {/* Editorial headline treatment */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.35em] font-light mb-0.5"
                  style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-sans)' }}>
                  Mega
                </p>
                <h1 className="font-medium leading-none"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3.5rem, 8.5vw, 7.5rem)',
                    color: '#fff',
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                  }}>
                  Furniture
                </h1>
                <h1 className="font-medium leading-none"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3.5rem, 8.5vw, 7.5rem)',
                    color: '#B04A22',
                    fontStyle: 'normal',
                    letterSpacing: '-0.02em',
                  }}>
                  Sale.
                </h1>
              </div>

              <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.48)' }}>
                Up to <span style={{ color: '#c49a3a', fontWeight: 600 }}>70% off</span> on premium sofas, beds, dining sets, and more.
                Luxury that doesn't wait — this is the moment to invest in your home.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('sale-products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3.5 rounded-full text-sm font-medium text-white flex items-center gap-2"
                  style={{ background: '#B04A22' }}>
                  <ShoppingBag size={15} /> Shop the Sale
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('flash-deals')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3.5 rounded-full text-sm font-medium border"
                  style={{ borderColor: 'rgba(255,255,255,0.18)', color: '#fff', background: 'rgba(255,255,255,0.04)' }}>
                  View Flash Deals
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-5">
                {['Free Shipping $500+', '30-Day Returns', '5-Year Warranty'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#8b6914' }} />{t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: Countdown card */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[340px] rounded-3xl p-8"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(18px)',
                }}>
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={15} className="text-[#B04A22]" />
                  <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Sale ends in
                  </span>
                </div>
                <CountdownTimer />
                <div className="mt-7 pt-6 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[10px] uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    What's on sale
                  </p>
                  {[
                    ['Sofas & Sectionals', '40%'],
                    ['Bedroom Collection', '55%'],
                    ['Dining & Chairs', '35%'],
                    ['Storage & Decor', '60%'],
                  ].map(([label, pct]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.48)' }}>{label}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                        style={{ background: '#B04A2220', color: '#e07050' }}>
                        Up to {pct} Off
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fade to page background */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #faf8f5, transparent)' }} />
      </section>

      {/* ── Sale Categories ────────────────────────────────────────── */}
      <section ref={catRef as React.RefObject<HTMLElement>} className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Browse by Type" headline="Shop Every Room"
          sub="Handpicked categories with the deepest discounts of the season." />
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate={catIn ? 'visible' : 'hidden'}>
          {SALE_CATS.map((cat, i) => <CategoryCard key={cat.name} cat={cat} i={i} />)}
        </motion.div>
      </section>

      {/* ── Flash Deals ───────────────────────────────────────────── */}
      <section id="flash-deals" ref={flashRef as React.RefObject<HTMLElement>} className="py-20"
        style={{ background: '#f5f1ea' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame size={15} className="text-[#B04A22]" />
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: '#B04A22' }}>
                  Limited Quantity
                </p>
              </div>
              <h2 className="text-3xl md:text-[2.5rem] font-medium"
                style={{ fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>
                Flash Deals
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0"
              style={{ background: '#B04A2215', color: '#B04A22' }}>
              <Clock size={12} />
              <span className="text-xs font-medium">Ends at midnight</span>
            </div>
          </div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden"
            animate={flashIn ? 'visible' : 'hidden'}>
            {FLASH_DEALS.map((p, i) => (
              <FlashCard key={p.id} product={p} i={i}
                onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                wishlisted={wishlist.includes(p.id)} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────── */}
      <section id="sale-products" ref={bestRef as React.RefObject<HTMLElement>} className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Top Picks" headline="Best Selling Sale Items"
          sub="Our most loved pieces, now at their lowest prices. Each curated for lasting quality." />
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate={bestIn ? 'visible' : 'hidden'}>
          {PRODUCTS.slice(0, 8).map((p, i) => (
            <motion.div key={p.id} custom={i} variants={fadeUp}>
              <SaleCard product={p}
                onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                wishlisted={wishlist.includes(p.id)} />
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-10">
          <button onClick={() => navigate('/collections')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium border transition-all hover:bg-[#1a1a1a] hover:text-white"
            style={{ borderColor: '#1a1a1a', color: '#1a1a1a' }}>
            View All Sale Items <ChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* ── Clearance Banner ──────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#1C1714' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(196,154,58,0.10) 0%, transparent 55%)' }} />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-3 font-semibold" style={{ color: '#B04A22' }}>
              Final Reductions
            </p>
            <h2 className="text-4xl md:text-5xl font-medium mb-5 leading-tight"
              style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontStyle: 'italic' }}>
              Last Chance<br />Clearance Sale
            </h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Our final clearance — these pieces won't be restocked. Up to 70% off on statement furniture built to elevate any interior.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/collections')}
              className="px-8 py-4 rounded-full text-sm font-medium text-white flex items-center gap-2 w-fit"
              style={{ background: '#B04A22' }}>
              Shop Clearance <ChevronRight size={16} />
            </motion.button>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:min-w-[280px]">
            {[
              { cat: 'Sofas',   pct: 'Up to 40% off', c: '#c4a878' },
              { cat: 'Beds',    pct: 'Up to 55% off', c: '#8a9e8a' },
              { cat: 'Tables',  pct: 'Up to 50% off', c: '#c49a3a' },
              { cat: 'Storage', pct: 'Up to 60% off', c: '#7a7268' },
            ].map(({ cat, pct, c }) => (
              <div key={cat} className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-5 h-5 rounded-full mb-2" style={{ background: c + '66' }} />
                <p className="text-white text-sm font-medium" style={{ fontFamily: 'var(--font-serif)' }}>{cat}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#c49a3a' }}>{pct}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deals by Room ─────────────────────────────────────────── */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Shop by Space" headline="Deals for Every Room" />
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {ROOM_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveRoom(tab.id)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeRoom === tab.id ? '#1a1a1a' : 'transparent',
                color: activeRoom === tab.id ? '#fff' : '#6b6b6b',
                border: `1px solid ${activeRoom === tab.id ? '#1a1a1a' : '#e8ddd0'}`,
              }}>
              {tab.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoom}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROOM_DEALS[activeRoom].map(p => (
              <SaleCard key={p.id} product={p}
                onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                wishlisted={wishlist.includes(p.id)} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Bundle & Save ─────────────────────────────────────────── */}
      <section ref={bundleRef as React.RefObject<HTMLElement>} className="py-20" style={{ background: '#f5f1ea' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader eyebrow="Bundle Deals" headline="Buy Together, Save More"
            sub="Curated room sets at exclusive bundle pricing — the easiest way to furnish a whole space." />
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate={bundleIn ? 'visible' : 'hidden'}>
            {BUNDLES.map((b, i) => <BundleCard key={b.name} b={b} i={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Customer Reviews ──────────────────────────────────────── */}
      <section ref={reviewRef as React.RefObject<HTMLElement>} className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Verified Buyers" headline="What Our Customers Say" />
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          animate={reviewIn ? 'visible' : 'hidden'}>
          {REVIEWS.map((r, i) => (
            <motion.div key={r.name} custom={i} variants={fadeUp}
              className="rounded-2xl p-6 border"
              style={{ background: '#fff', borderColor: 'rgba(44,44,44,0.08)' }}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.rating }, (_, j) => (
                  <Star key={j} size={13} className="fill-[#c49a3a] text-[#c49a3a]" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#4a4a4a' }}>"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #f0ebe3' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  style={{ background: r.accent }}>
                  {r.initials}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{r.name}</p>
                  <p className="text-[11px]" style={{ color: '#8b6914' }}>Purchased: {r.item}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Trust & Benefits ──────────────────────────────────────── */}
      <section ref={trustRef as React.RefObject<HTMLElement>} className="py-16"
        style={{ borderTop: '1px solid #e8ddd0', borderBottom: '1px solid #e8ddd0' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-8"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden"
            animate={trustIn ? 'visible' : 'hidden'}>
            {TRUST.map(({ Icon, title, desc }, i) => (
              <motion.div key={title} custom={i} variants={fadeUp}
                className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#f0ebe3' }}>
                  <Icon size={19} style={{ color: '#8b6914' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1a1a1a', fontFamily: 'var(--font-serif)' }}>{title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#6b6b6b' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#1C1714' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 65% 50%, rgba(139,105,20,0.09) 0%, transparent 55%)' }} />
        <div className="relative max-w-xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(196,154,58,0.12)' }}>
            <Mail size={19} className="text-[#c49a3a]" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: '#c49a3a' }}>
            Members Only
          </p>
          <h2 className="text-3xl md:text-4xl font-medium mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            Unlock Extra 10% Off
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Join our private members list — receive an exclusive discount on your first order, plus early access to sales and new collections.
          </p>

          {!submitted ? (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
              className="flex gap-2 max-w-md mx-auto">
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#fff',
                }}
              />
              <button type="submit"
                className="px-6 py-3.5 rounded-full text-sm font-medium text-white flex items-center gap-1.5 whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{ background: '#B04A22' }}>
                <Zap size={13} /> Get 10% Off
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="py-4 px-8 rounded-full text-sm font-medium max-w-md mx-auto"
              style={{ background: 'rgba(139,105,20,0.18)', color: '#c49a3a', border: '1px solid rgba(196,154,58,0.25)' }}>
              ✓ Your exclusive code is on its way to {email}
            </motion.div>
          )}

          <p className="text-[10px] mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No spam. Unsubscribe anytime. New subscribers only.
          </p>
        </div>
      </section>

    </div>
  )
}
