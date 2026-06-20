import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Search, X, SlidersHorizontal,
  Heart, ShoppingBag, Eye, Star, ChevronLeft, ChevronRight,
  Truck, Shield, Leaf, RotateCcw,
  Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp,
  Sparkles, TrendingUp, Grid3X3, List, CheckCircle, type LucideIcon
} from 'lucide-react'
import type { Product } from '../data/products'
import { PRODUCTS } from '../data/products'

// ── Types ──────────────────────────────────────────────────────
interface NewArrivalsPageProps {
  onAddToCart: (p: Product) => void
  onWishlist:  (p: Product) => void
  onQuickView: (p: Product) => void
  wishlist:    number[]
}

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'best-selling'
type ViewMode = 'grid' | 'list'

// ── Static data ────────────────────────────────────────────────
const CATS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'all',    label: 'All',    Icon: Grid3X3         },
  { id: 'sofa',   label: 'Sofas',  Icon: Sofa            },
  { id: 'bed',    label: 'Beds',   Icon: BedDouble       },
  { id: 'dining', label: 'Dining', Icon: UtensilsCrossed },
  { id: 'office', label: 'Office', Icon: Briefcase       },
  { id: 'decor',  label: 'Décor',  Icon: Lamp            },
]

const MATERIALS = ['Wood', 'Metal', 'Fabric', 'Leather', 'Marble']

const COLOR_OPTIONS = [
  { name: 'Walnut',   hex: '#6b4226' },
  { name: 'Oak',      hex: '#c49a3a' },
  { name: 'Charcoal', hex: '#3a3a3a' },
  { name: 'Ivory',    hex: '#f5f0e8' },
  { name: 'Sage',     hex: '#8a9e8a' },
  { name: 'Navy',     hex: '#2a3f5f' },
]

const WHY_US = [
  { Icon: Truck,     title: 'Free Shipping',              desc: 'Complimentary White Glove delivery on all orders over $500.' },
  { Icon: Shield,    title: 'Premium Quality Materials',  desc: 'Hand-selected hardwoods, top-grain leathers and fine fabrics.' },
  { Icon: Leaf,      title: 'Sustainable Craftsmanship',  desc: 'FSC-certified materials and carbon-offset fulfilment.' },
  { Icon: RotateCcw, title: 'Easy Returns',               desc: '30-day hassle-free returns — no questions asked.' },
]

const REVIEWS = [
  { id:1, initials:'SA', color:'#c49a3a', name:'Sofia Andersen',  location:'Copenhagen, DK', rating:5, text:'Absolutely breathtaking. The new Oslo bed arrived flawlessly and transformed our bedroom overnight.' },
  { id:2, initials:'MW', color:'#5a80c8', name:'Marcus Webb',     location:'New York, US',   rating:5, text:'Best furniture purchase I\'ve ever made. The quality is unmatched and delivery was seamless.' },
  { id:3, initials:'PN', color:'#9a5aaa', name:'Priya Nair',      location:'London, UK',     rating:5, text:'The Loft dining table is the centrepiece of our home now. Solid, beautiful, and timeless.' },
  { id:4, initials:'TR', color:'#c4605a', name:'Tomás Reyes',     location:'Barcelona, ES',  rating:5, text:'Ordered 3 pieces from the new collection. Each one exceeded expectations. Highly recommend.' },
]

const TRENDING = PRODUCTS.slice(0, 6)

// ── Page Component ─────────────────────────────────────────────
export default function NewArrivalsPage({ onAddToCart, onWishlist, onQuickView, wishlist }: NewArrivalsPageProps) {
  const navigate = useNavigate()
  const onNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy]               = useState<SortKey>('newest')
  const [viewMode, setViewMode]           = useState<ViewMode>('grid')
  const [search, setSearch]              = useState('')
  const [priceMax, setPriceMax]          = useState(5000)
  const [selMaterials, setSelMaterials]  = useState<string[]>([])
  const [selColors, setSelColors]        = useState<string[]>([])
  const [filterOpen, setFilterOpen]      = useState(false)

  const filtered = PRODUCTS
    .filter(p => !activeCategory || activeCategory === 'all' || p.category === activeCategory)
    .filter(p => p.price <= priceMax)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => selMaterials.length === 0 || p.materials.some(m => selMaterials.includes(m.name)))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'best-selling') return b.reviews - a.reviews
      return b.id - a.id // newest first
    })

  const toggleMat = (m: string) =>
    setSelMaterials(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])
  const toggleColor = (c: string) =>
    setSelColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])

  const activeFilters = (activeCategory !== 'all' ? 1 : 0) + selMaterials.length + selColors.length + (priceMax < 5000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* 1. Hero */}
      <HeroSection onShopClick={() => document.getElementById('new-arrivals-grid')?.scrollIntoView({ behavior: 'smooth' })} onNavigate={onNavigate} />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center gap-2 text-sm text-[#6b6b6b]">
        <button onClick={() => onNavigate('home')} className="hover:text-[#8b6914] transition-colors">Home</button>
        <ChevronRight size={13} />
        <span className="text-[#2c2c2c] font-medium">New Arrivals</span>
      </div>

      {/* 2. Filter & Sort Bar */}
      <div id="new-arrivals-grid" className="sticky top-[60px] z-40 bg-[#faf8f5]/95 backdrop-blur-xl border-b border-black/5 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATS.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#1a1a1a] text-white shadow-md'
                    : 'bg-white text-[#2c2c2c] border border-black/10 hover:border-[#2c2c2c]/30'
                }`}>
                <cat.Icon size={13} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid area */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-black/10 bg-white">
              <Search size={14} className="text-[#6b6b6b] flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search new arrivals…"
                className="text-sm outline-none bg-transparent text-[#2c2c2c] w-40 sm:w-52" />
              {search && <button onClick={() => setSearch('')}><X size={12} className="text-[#6b6b6b]" /></button>}
            </div>
            {/* Filter toggle */}
            <button onClick={() => setFilterOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 bg-white text-sm font-medium text-[#2c2c2c] hover:border-[#2c2c2c]/40 transition-colors">
              <SlidersHorizontal size={14} />
              Filters
              {activeFilters > 0 && <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-white text-[10px] flex items-center justify-center">{activeFilters}</span>}
            </button>
            <span className="text-sm text-[#6b6b6b]">{filtered.length} products</span>
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
              className="text-sm border border-black/10 rounded-xl px-3 py-2.5 outline-none bg-white text-[#2c2c2c] cursor-pointer focus:border-[#8b6914] transition-colors">
              <option value="newest">Newest First</option>
              <option value="best-selling">Best Selling</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <div className="flex rounded-xl border border-black/10 overflow-hidden bg-white">
              <button onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:text-[#2c2c2c]'}`}>
                <Grid3X3 size={15} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:text-[#2c2c2c]'}`}>
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(44,44,44,0.06)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-3">Price Range</p>
                  <div className="flex justify-between text-sm text-[#6b6b6b] mb-2">
                    <span>$0</span><span>${priceMax.toLocaleString()}</span>
                  </div>
                  <input type="range" min={200} max={5000} step={100} value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#8b6914] cursor-pointer" />
                  <div className="flex gap-2 mt-3">
                    {[1000, 2000, 3000].map(p => (
                      <button key={p} onClick={() => setPriceMax(p)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${priceMax === p ? 'bg-[#1a1a1a] text-white' : 'bg-[#f0ebe3] text-[#2c2c2c] hover:bg-[#e8ddd0]'}`}>
                        &lt;${p >= 1000 ? `${p / 1000}k` : p}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Material */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-3">Material</p>
                  <div className="space-y-2">
                    {MATERIALS.map(m => (
                      <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                        <div onClick={() => toggleMat(m)}
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${selMaterials.includes(m) ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'border-black/20 group-hover:border-[#1a1a1a]'}`}>
                          {selMaterials.includes(m) && <CheckCircle size={9} className="text-white flex-shrink-0" />}
                        </div>
                        <span className="text-sm text-[#2c2c2c]">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Color */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-3">Color</p>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_OPTIONS.map(c => (
                      <button key={c.name} onClick={() => toggleColor(c.name)} title={c.name}
                        className={`w-8 h-8 rounded-full transition-all ${selColors.includes(c.name) ? 'ring-2 ring-offset-2 ring-[#1a1a1a] scale-110' : 'hover:scale-105'}`}
                        style={{ background: c.hex }} aria-label={c.name} />
                    ))}
                  </div>
                </div>
                {/* Clear */}
                <div className="flex flex-col justify-end">
                  {activeFilters > 0 && (
                    <button onClick={() => { setActiveCategory('all'); setPriceMax(5000); setSelMaterials([]); setSelColors([]) }}
                      className="px-5 py-2.5 rounded-xl border border-[#2c2c2c] text-[#2c2c2c] text-sm font-medium hover:bg-[#2c2c2c] hover:text-white transition-all">
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Product Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-28 gap-4 text-[#6b6b6b]">
              <Search size={48} strokeWidth={1} />
              <p className="text-xl font-medium text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>No products found</p>
              <button onClick={() => { setSearch(''); setActiveCategory('all'); setPriceMax(5000); setSelMaterials([]) }}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm font-medium hover:-translate-y-0.5 transition-all">
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div key={activeCategory + sortBy + viewMode}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'}
            >
              {filtered.map((product, i) =>
                viewMode === 'grid'
                  ? <ArrivalCard key={product.id} product={product} index={i}
                      onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                      isWishlisted={wishlist.includes(product.id)} />
                  : <ArrivalListCard key={product.id} product={product}
                      onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                      isWishlisted={wishlist.includes(product.id)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Featured Collection */}
      <FeaturedCollection />

      {/* 5. Trending This Month */}
      <TrendingSection products={TRENDING} onAddToCart={onAddToCart} onWishlist={onWishlist} wishlist={wishlist} />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Reviews */}
      <ReviewsSection />

      {/* 8. Newsletter */}
      <NewsletterSection />
    </div>
  )
}

// ── 1. Hero ───────────────────────────────────────────────────
function HeroSection({ onShopClick, onNavigate }: { onShopClick: () => void; onNavigate: (p: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div ref={ref} className="relative w-full h-[80vh] min-h-[560px] overflow-hidden flex items-center">
      {/* BG layers */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110 bg-gradient-to-br from-[#0f0f0f] via-[#1a1208] to-[#2a1f0a]" />
      <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(ellipse at 65% 40%, #c49a3a 0%, transparent 55%)' }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Animated orbs */}
      <motion.div animate={{ y: [0, -24, 0], scale: [1, 1.08, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[8%] top-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,154,58,0.18), transparent 70%)', filter: 'blur(40px)' }} />
      <motion.div animate={{ y: [0, 18, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute left-[5%] bottom-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)', filter: 'blur(30px)' }} />

      {/* Spinning ring deco */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute top-12 right-16 w-16 h-16 rounded-full border border-white/15 hidden lg:block pointer-events-none">
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c49a3a]" />
      </motion.div>

      {/* SVG decoration — right side */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:flex items-center justify-center pr-12 pointer-events-none">
        <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}
          className="w-[340px] h-[300px] rounded-3xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm flex items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
          <HeroFurnitureSVG />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 w-full">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          className="lg:max-w-[55%]">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#c49a3a]/15 border border-[#c49a3a]/30 mb-6">
            <Sparkles size={13} className="text-[#c49a3a]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c49a3a] font-medium">Just Landed — 2026 Collection</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
            className="text-white font-semibold leading-[1.08] mb-5 max-w-2xl"
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
            New<br />Arrivals
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-base lg:text-lg leading-relaxed max-w-md mb-10 font-light">
            Discover the latest additions crafted for modern living — where timeless design meets contemporary comfort.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4">
            <button onClick={onShopClick}
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#c49a3a] text-[#1a1a1a] text-sm font-semibold overflow-hidden hover:-translate-y-0.5 transition-all shadow-[0_8px_32px_rgba(196,154,58,0.35)]">
              <span className="absolute inset-0 bg-white/20 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12" />
              <span className="relative">Shop New Collection</span>
              <ArrowRight size={15} className="relative" />
            </button>
            <button onClick={() => onNavigate('collections')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/25 text-white text-sm font-medium hover:bg-white/10 transition-all">
              View All Collections
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex items-center gap-8 mt-10">
            {[['24', 'New Pieces'], ['100%', 'Handcrafted'], ['Free', 'Delivery >$500']].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-serif)' }}>{val}</p>
                <p className="text-white/40 text-[11px] uppercase tracking-widest mt-0.5">{lbl}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        <span className="text-[10px] text-white/30 uppercase tracking-widest">Scroll</span>
      </motion.div>
    </div>
  )
}

function HeroFurnitureSVG() {
  return (
    <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-52">
      {/* Sofa body */}
      <rect x="20" y="110" width="240" height="58" rx="14" fill="rgba(196,154,58,0.12)" stroke="rgba(196,154,58,0.35)" strokeWidth="1.5"/>
      {/* Arms */}
      <rect x="10"  y="88" width="52" height="80" rx="12" fill="rgba(196,154,58,0.08)" stroke="rgba(196,154,58,0.25)" strokeWidth="1.5"/>
      <rect x="218" y="88" width="52" height="80" rx="12" fill="rgba(196,154,58,0.08)" stroke="rgba(196,154,58,0.25)" strokeWidth="1.5"/>
      {/* Cushions */}
      <rect x="30"  y="60" width="98" height="60" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      <rect x="152" y="60" width="98" height="60" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      {/* Legs */}
      <rect x="42"  y="168" width="16" height="18" rx="4" fill="rgba(196,154,58,0.3)"/>
      <rect x="222" y="168" width="16" height="18" rx="4" fill="rgba(196,154,58,0.3)"/>
      {/* Decorative pillow */}
      <rect x="118" y="75" width="44" height="36" rx="8" fill="rgba(196,154,58,0.2)" stroke="rgba(196,154,58,0.5)" strokeWidth="1"/>
      {/* Floating sparkles */}
      <circle cx="240" cy="48" r="3" fill="rgba(196,154,58,0.6)"/>
      <circle cx="52"  cy="38" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="190" cy="30" r="4" fill="rgba(196,154,58,0.3)"/>
    </svg>
  )
}

// ── 3. Arrival Card (Grid) ────────────────────────────────────
function ArrivalCard({ product, index, onAddToCart, onWishlist, onQuickView, isWishlisted }:
  { product: Product; index: number; onAddToCart:(p:Product)=>void; onWishlist:(p:Product)=>void; onQuickView:(p:Product)=>void; isWishlisted:boolean }) {
  const [matIdx, setMatIdx] = useState(0)
  const [added, setAdded]   = useState(false)
  const [hovered, setHovered] = useState(false)
  const c = product.materials[matIdx].color
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.06 }}>
      <div
        className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2"
        style={{ boxShadow: hovered ? '0 24px 60px rgba(44,44,44,0.16)' : '0 2px 12px rgba(44,44,44,0.07)' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image area */}
        <div className="relative h-64 bg-[#f0ebe3] flex items-center justify-center overflow-hidden">
          <motion.div animate={{ scale: hovered ? 1.06 : 1 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full h-full flex items-center justify-center p-6">
            <ArrivalIllustration category={product.category} color={c} hovered={hovered} />
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-[#8b6914]">
              <Sparkles size={9} /> New
            </span>
            {product.badge && <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-[#2c2c2c]">{product.badge}</span>}
            {discount && <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-[#e05c5c]">−{discount}%</span>}
          </div>

          {/* Hover action overlay */}
          <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#1a1a1a]/10 flex items-center justify-center gap-3">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={e => { e.stopPropagation(); onQuickView(product) }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#2c2c2c]">
              <Eye size={15} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={e => { e.stopPropagation(); onWishlist(product) }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
              style={{ color: isWishlisted ? '#e05c5c' : '#2c2c2c' }}>
              <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </motion.div>
        </div>

        {/* Body */}
        <div className="p-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b6914]">{product.category}</span>
          <h3 className="mt-1 mb-1.5 font-medium text-[#1a1a1a] leading-snug" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} fill={i < Math.floor(product.rating) ? '#c49a3a' : 'none'}
                className={i < Math.floor(product.rating) ? 'text-[#c49a3a]' : 'text-[#e0d5c5]'} />
            ))}
            <span className="text-xs text-[#6b6b6b] ml-1">{product.rating} ({product.reviews})</span>
          </div>
          {/* Swatches */}
          <div className="flex gap-1.5 mb-4">
            {product.materials.map((mat, i) => (
              <button key={mat.name} onClick={e => { e.stopPropagation(); setMatIdx(i) }} title={mat.name}
                className={`w-5 h-5 rounded-full transition-all ${i === matIdx ? 'ring-2 ring-offset-1 ring-[#2c2c2c] scale-110' : 'hover:scale-105'}`}
                style={{ background: mat.color }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && <span className="text-sm ml-2 line-through text-[#6b6b6b]">${product.originalPrice.toLocaleString()}</span>}
            </div>
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={e => { e.stopPropagation(); onAddToCart(product); setAdded(true); setTimeout(() => setAdded(false), 1200) }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-xs font-medium transition-all"
              style={{ background: added ? '#8b6914' : '#2c2c2c' }}>
              <ShoppingBag size={13} />{added ? 'Added!' : 'Add'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Arrival List Card ─────────────────────────────────────────
function ArrivalListCard({ product, onAddToCart, onWishlist, onQuickView, isWishlisted }:
  { product: Product; onAddToCart:(p:Product)=>void; onWishlist:(p:Product)=>void; onQuickView:(p:Product)=>void; isWishlisted:boolean }) {
  const c = product.materials[0].color
  const [added, setAdded] = useState(false)
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      className="group flex gap-5 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(44,44,44,0.06)] hover:shadow-[0_12px_40px_rgba(44,44,44,0.12)] hover:-translate-y-1 transition-all duration-300">
      <div className="w-32 h-32 flex-shrink-0 rounded-xl bg-[#f0ebe3] flex items-center justify-center overflow-hidden">
        <ArrivalIllustration category={product.category} color={c} hovered={false} small />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b6914]">{product.category}</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-[#8b6914]"><Sparkles size={8} />New</span>
            {discount && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-[#e05c5c]">−{discount}%</span>}
          </div>
        </div>
        <h3 className="font-medium text-[#1a1a1a] text-base leading-snug mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} fill={i < Math.floor(product.rating) ? '#c49a3a' : 'none'} className={i < Math.floor(product.rating) ? 'text-[#c49a3a]' : 'text-[#e0d5c5]'} />)}
          <span className="text-xs text-[#6b6b6b] ml-1">{product.rating} ({product.reviews})</span>
        </div>
        <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>${product.price.toLocaleString()}</span>
          {product.originalPrice && <span className="text-sm line-through text-[#6b6b6b]">${product.originalPrice.toLocaleString()}</span>}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => onQuickView(product)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/10 text-[#2c2c2c] text-xs font-medium hover:border-[#2c2c2c] transition-colors">
              <Eye size={13} />Quick View
            </button>
            <button onClick={() => onWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${isWishlisted ? 'bg-[#fff0f0] border-[#e05c5c] text-[#e05c5c]' : 'border-black/10 text-[#2c2c2c] hover:border-[#2c2c2c]'}`}>
              <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => { onAddToCart(product); setAdded(true); setTimeout(() => setAdded(false), 1200) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-medium transition-all"
              style={{ background: added ? '#8b6914' : '#2c2c2c' }}>
              <ShoppingBag size={13} />{added ? 'Added!' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── SVG illustrations ─────────────────────────────────────────
function ArrivalIllustration({ category, color, hovered, small }: { category:string; color:string; hovered:boolean; small?:boolean }) {
  const c = color
  const bg = `${c}20`
  const sz = small ? 'w-24' : 'w-44'

  const shapes: Record<string, React.ReactElement> = {
    sofa: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={sz}>
        <rect x="10" y="70" width="180" height="45" rx="8" fill={bg} stroke={c} strokeWidth={hovered ? '2' : '1.5'}/>
        <rect x="5"   y="55" width="38" height="60" rx="8" fill={bg} stroke={c} strokeWidth="1"/>
        <rect x="157" y="55" width="38" height="60" rx="8" fill={bg} stroke={c} strokeWidth="1"/>
        <rect x="20"  y="40" width="65" height="42" rx="8" fill={`${c}30`} stroke={`${c}80`} strokeWidth="1"/>
        <rect x="95"  y="40" width="65" height="42" rx="8" fill={`${c}30`} stroke={`${c}80`} strokeWidth="1"/>
        <rect x="30"  y="115" width="14" height="12" rx="3" fill={c} opacity="0.55"/>
        <rect x="156" y="115" width="14" height="12" rx="3" fill={c} opacity="0.55"/>
      </svg>
    ),
    bed: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={sz}>
        <rect x="15"  y="75" width="170" height="40" rx="6" fill={bg} stroke={c} strokeWidth={hovered ? '2' : '1.5'}/>
        <rect x="15"  y="52" width="170" height="28" rx="6" fill={`${c}20`} stroke={`${c}60`} strokeWidth="1"/>
        <rect x="15"  y="30" width="30"  height="90" rx="4" fill={bg} stroke={c} strokeWidth="1"/>
        <rect x="50"  y="60" width="45"  height="20" rx="4" fill={`${c}25`} stroke={`${c}70`} strokeWidth="1"/>
        <rect x="105" y="60" width="45"  height="20" rx="4" fill={`${c}25`} stroke={`${c}70`} strokeWidth="1"/>
        <rect x="22"  y="115" width="12" height="10" rx="2" fill={c} opacity="0.5"/>
        <rect x="167" y="115" width="12" height="10" rx="2" fill={c} opacity="0.5"/>
      </svg>
    ),
    dining: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={sz}>
        <rect x="30"  y="58" width="140" height="12" rx="6" fill={bg} stroke={c} strokeWidth={hovered ? '2' : '1.5'}/>
        <rect x="45"  y="70" width="10"  height="45" rx="3" fill={`${c}40`}/>
        <rect x="145" y="70" width="10"  height="45" rx="3" fill={`${c}40`}/>
        <ellipse cx="72"  cy="48"  rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
        <ellipse cx="128" cy="48"  rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
        <ellipse cx="72"  cy="112" rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
        <ellipse cx="128" cy="112" rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
      </svg>
    ),
    office: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={sz}>
        <rect x="50" y="50" width="100" height="70" rx="10" fill={bg} stroke={c} strokeWidth={hovered ? '2' : '1.5'}/>
        <rect x="65" y="38" width="70"  height="20" rx="6" fill={`${c}30`} stroke={c} strokeWidth="1"/>
        <rect x="90" y="120" width="20" height="12" rx="3" fill={`${c}40`}/>
        <ellipse cx="100" cy="130" rx="16" ry="6" fill={`${c}25`} stroke={c} strokeWidth="1"/>
        <circle cx="100" cy="88" r="20" fill={`${c}15`} stroke={`${c}60`} strokeWidth="1"/>
      </svg>
    ),
    decor: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={sz}>
        <ellipse cx="100" cy="110" rx="50" ry="8" fill={`${c}15`}/>
        <path d="M80 110 Q85 40 100 30 Q115 40 120 110 Z" fill={bg} stroke={c} strokeWidth={hovered ? '2' : '1.5'}/>
        <ellipse cx="100" cy="30" rx="10" ry="6" fill={`${c}55`}/>
        <rect x="88" y="110" width="24" height="8" rx="2" fill={`${c}40`}/>
        <path d="M88 75 Q100 68 112 75" stroke={`${c}70`} strokeWidth="1.5" fill="none"/>
        <path d="M86 90 Q100 82 114 90" stroke={`${c}70`} strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  }
  return shapes[category] ?? shapes['decor']
}

// ── 4. Featured Collection ────────────────────────────────────
function FeaturedCollection() {
  return (
    <section className="py-20 bg-[#f0ebe3]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#1a1a1a] via-[#2a1c0c] to-[#1a1a1a] min-h-[400px] flex flex-col lg:flex-row items-center">
          {/* Glow */}
          <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(ellipse at 30% 50%, #c49a3a, transparent 55%)' }} />
          {/* SVG art */}
          <div className="lg:w-1/2 flex items-center justify-center p-12 lg:p-16 relative z-10">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-72 h-60 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
              <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56">
                <rect x="16" y="95"  width="208" height="55" rx="14" fill="rgba(196,154,58,0.14)" stroke="rgba(196,154,58,0.4)" strokeWidth="1.5"/>
                <rect x="8"  y="72"  width="48"  height="78" rx="12" fill="rgba(196,154,58,0.09)" stroke="rgba(196,154,58,0.25)" strokeWidth="1.5"/>
                <rect x="184" y="72" width="48"  height="78" rx="12" fill="rgba(196,154,58,0.09)" stroke="rgba(196,154,58,0.25)" strokeWidth="1.5"/>
                <rect x="26"  y="50"  width="86"  height="54" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                <rect x="128" y="50"  width="86"  height="54" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                <rect x="36"  y="150" width="16"  height="16" rx="4" fill="rgba(196,154,58,0.35)"/>
                <rect x="188" y="150" width="16"  height="16" rx="4" fill="rgba(196,154,58,0.35)"/>
              </svg>
            </motion.div>
          </div>
          {/* Text */}
          <div className="lg:w-1/2 p-10 lg:p-16 relative z-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#c49a3a] font-medium block mb-4">Featured Collection</span>
            <h2 className="text-white font-semibold leading-tight mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
              The Artisan<br />Living Series
            </h2>
            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-sm">
              A curated edit of hand-finished pieces that bring warmth, texture and soul to the modern home. Each piece is crafted by master artisans.
            </p>
            <button className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-[#c49a3a]/60 text-[#c49a3a] text-sm font-medium hover:bg-[#c49a3a] hover:text-[#1a1a1a] transition-all">
              Explore Collection
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── 5. Trending This Month ────────────────────────────────────
function TrendingSection({ products, onAddToCart, onWishlist, wishlist }:
  { products:Product[]; onAddToCart:(p:Product)=>void; onWishlist:(p:Product)=>void; wishlist:number[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label mb-2">Hot Right Now</span>
            <h2 className="font-semibold text-[#1a1a1a] leading-tight flex items-center gap-3"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
              <TrendingUp size={28} className="text-[#c49a3a]" />
              Trending This Month
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-white hover:border-[#2c2c2c] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-white hover:border-[#2c2c2c] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {products.map((product, i) => {
            const c = product.materials[0].color
            return (
              <motion.div key={product.id}
                initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex-shrink-0 w-64 snap-start">
                <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(44,44,44,0.07)] hover:shadow-[0_16px_48px_rgba(44,44,44,0.14)] hover:-translate-y-1.5 transition-all duration-400 cursor-pointer">
                  <div className="relative h-52 bg-[#f0ebe3] flex items-center justify-center overflow-hidden">
                    <ArrivalIllustration category={product.category} color={c} hovered={false} />
                    {/* Rank badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a1a1a]/80 backdrop-blur-sm">
                      <TrendingUp size={10} className="text-[#c49a3a]" />
                      <span className="text-[10px] text-white font-medium">#{i + 1} Trending</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button onClick={() => onWishlist(product)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                        style={{ color: wishlist.includes(product.id) ? '#e05c5c' : '#6b6b6b' }}>
                        <Heart size={13} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#8b6914] font-medium">{product.category}</span>
                    <p className="font-medium text-[#1a1a1a] text-sm mt-0.5 mb-2 leading-snug" style={{ fontFamily: 'var(--font-serif)' }}>{product.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>${product.price.toLocaleString()}</span>
                      <button onClick={() => onAddToCart(product)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2c2c2c] text-white text-xs font-medium hover:bg-[#8b6914] transition-colors">
                        <ShoppingBag size={11} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── 6. Why Choose Us ─────────────────────────────────────────
function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#f0ebe3]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="section-label mb-3">Our Promise</span>
          <h2 className="font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Why Choose P&M Craft
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_US.map((item, i) => {
            const Icon = item.Icon
            return (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 text-center shadow-[0_2px_12px_rgba(44,44,44,0.06)]">
                <div className="w-14 h-14 rounded-2xl bg-[#fdf6e8] flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-[#8b6914]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2 text-sm" style={{ fontFamily: 'var(--font-serif)' }}>{item.title}</h3>
                <p className="text-xs text-[#6b6b6b] leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── 7. Reviews ───────────────────────────────────────────────
function ReviewsSection() {
  const [idx, setIdx] = useState(0)
  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="section-label mb-3">Customer Love</span>
          <h2 className="font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Desktop: all cards */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(44,44,44,0.07)] flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={13} fill="#c49a3a" className="text-[#c49a3a]" />)}
              </div>
              <p className="text-sm text-[#2c2c2c] leading-relaxed flex-1 italic">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-black/[0.05]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: r.color }}>{r.initials}</div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{r.name}</p>
                  <p className="text-[11px] text-[#6b6b6b]">{r.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(44,44,44,0.08)]">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: REVIEWS[idx].rating }).map((_, j) => <Star key={j} size={14} fill="#c49a3a" className="text-[#c49a3a]" />)}
              </div>
              <p className="text-sm text-[#2c2c2c] leading-relaxed mb-5 italic">"{REVIEWS[idx].text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: REVIEWS[idx].color }}>{REVIEWS[idx].initials}</div>
                <div>
                  <p className="font-medium text-[#1a1a1a] text-sm">{REVIEWS[idx].name}</p>
                  <p className="text-xs text-[#6b6b6b]">{REVIEWS[idx].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-5">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-[#8b6914]' : 'w-2 bg-[#e8ddd0]'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 8. Newsletter ────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [done, setDone]   = useState(false)
  return (
    <section className="py-20 bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 100%, #8b6914, transparent 55%)' }} />
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c49a3a]/15 border border-[#c49a3a]/30 mb-5">
            <Sparkles size={12} className="text-[#c49a3a]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c49a3a] font-medium">Early Access</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            Be First to Know
          </h2>
          <p className="text-white/50 text-sm mb-2">Get notified about new launches and exclusive offers.</p>
          <p className="text-white/35 text-xs mb-8">Join 80,000+ subscribers. No spam, unsubscribe anytime.</p>
          {done ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 text-[#c49a3a] font-medium">
              <CheckCircle size={20} className="flex-shrink-0" /> You're on the list! Welcome to P&M Craft.
            </motion.div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setDone(true) }}
              className="flex gap-2 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Your email address"
                className="flex-1 bg-white/10 border border-white/15 text-white placeholder-white/35 rounded-full px-5 py-3.5 text-sm outline-none focus:border-[#c49a3a] transition-colors" />
              <button type="submit"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#c49a3a] text-[#1a1a1a] text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(196,154,58,0.3)]">
                Subscribe <ArrowRight size={13} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
