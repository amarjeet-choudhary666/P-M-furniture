import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal, X, ChevronDown, ChevronRight, Star,
  Heart, ShoppingBag, Eye, ArrowRight, Search,
  Shield, Truck, RotateCcw, CreditCard,
  Grid3X3, List, ChevronLeft,
  Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp,
  LayoutGrid, TreePine
} from 'lucide-react'
import type { Product } from '../data/products'
import { PRODUCTS } from '../data/products'

// ─── Types ────────────────────────────────────────────────────
interface CollectionPageProps {
  onAddToCart: (p: Product) => void
  onWishlist: (p: Product) => void
  onQuickView: (p: Product) => void
  wishlist: number[]
}

type SortOption = 'featured' | 'best-selling' | 'newest' | 'price-asc' | 'price-desc' | 'rating'
type ViewMode   = 'grid' | 'list'

// ─── Static data ──────────────────────────────────────────────
const COLLECTION_CATEGORIES = [
  { id: 'all',     label: 'All Furniture',    count: 48, Icon: LayoutGrid },
  { id: 'sofa',    label: 'Sofas & Chairs',   count: 12, Icon: Sofa },
  { id: 'bed',     label: 'Beds & Bedroom',   count: 10, Icon: BedDouble },
  { id: 'dining',  label: 'Dining & Kitchen', count: 9,  Icon: UtensilsCrossed },
  { id: 'office',  label: 'Home Office',      count: 8,  Icon: Briefcase },
  { id: 'decor',   label: 'Décor & Lighting', count: 9,  Icon: Lamp },
]

const MATERIALS = ['Wood', 'Metal', 'Fabric', 'Leather', 'Marble', 'Glass']
const COLORS = [
  { name: 'Walnut',   hex: '#6b4226' },
  { name: 'Oak',      hex: '#c49a3a' },
  { name: 'Charcoal', hex: '#3a3a3a' },
  { name: 'Ivory',    hex: '#f5f0e8' },
  { name: 'Sage',     hex: '#8a9e8a' },
  { name: 'Navy',     hex: '#2a3f5f' },
]

const FEATURED_CATS = [
  { label: 'Living Room', count: 18, Icon: Sofa,             bg: 'from-[#2c1810] to-[#5a3020]' },
  { label: 'Bedroom',     count: 14, Icon: BedDouble,        bg: 'from-[#1a2535] to-[#2a3f5f]' },
  { label: 'Dining Room', count: 12, Icon: UtensilsCrossed,  bg: 'from-[#1a2510] to-[#2a4020]' },
  { label: 'Office',      count: 10, Icon: Briefcase,        bg: 'from-[#251a10] to-[#4a3520]' },
  { label: 'Outdoor',     count: 8,  Icon: TreePine,         bg: 'from-[#102520] to-[#1a3530]' },
]

const REVIEWS = [
  { id:1, name:'Sofia A.',   avatar:'SA', color:'#c49a3a', rating:5, text:'Absolutely stunning quality. The sofa arrived perfectly packaged and looks even better in person.', product:'Velour Cloud Sofa' },
  { id:2, name:'Marcus W.',  avatar:'MW', color:'#5a80c8', rating:5, text:'The Oslo Bed is everything I wanted. Minimal, sturdy and incredibly well-made. Worth every penny.', product:'Oslo Platform Bed' },
  { id:3, name:'Priya N.',   avatar:'PN', color:'#9a5aaa', rating:5, text:'This dining table is an absolute conversation starter. The live edge is stunning.', product:'Loft Dining Table' },
]

const WHY_FEATURES = [
  { icon: Shield,    title: 'Premium Quality',   desc: 'Hand-crafted by master artisans with 20+ years experience.' },
  { icon: Truck,     title: 'Free Shipping',      desc: 'Complimentary White Glove delivery on all orders over $500.' },
  { icon: RotateCcw, title: 'Easy Returns',       desc: '30-day hassle-free returns. No questions asked.' },
  { icon: CreditCard,title: 'Secure Payments',   desc: '256-bit SSL encryption on every transaction.' },
]

// ─── Main Component ───────────────────────────────────────────
export default function CollectionPage({ onAddToCart, onWishlist, onQuickView, wishlist }: CollectionPageProps) {
  const navigate = useNavigate()
  const onNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy]         = useState<SortOption>('featured')
  const [viewMode, setViewMode]     = useState<ViewMode>('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedColors, setSelectedColors]       = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minRating, setMinRating]   = useState(0)
  const [page, setPage]             = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const PER_PAGE = 8

  const filtered = PRODUCTS
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => selectedMaterials.length === 0 || p.materials.some(m => selectedMaterials.includes(m.name)))
    .filter(p => p.rating >= minRating)
    .filter(p => searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating')     return b.rating - a.rating
      return 0
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleMaterial = (m: string) =>
    setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const clearFilters = () => {
    setActiveCategory('all')
    setPriceRange([0, 5000])
    setSelectedMaterials([])
    setSelectedColors([])
    setInStockOnly(false)
    setMinRating(0)
  }

  const activeFilterCount = (activeCategory !== 'all' ? 1 : 0)
    + (priceRange[1] < 5000 || priceRange[0] > 0 ? 1 : 0)
    + selectedMaterials.length
    + selectedColors.length
    + (inStockOnly ? 1 : 0)
    + (minRating > 0 ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <CollectionHero onShopClick={() => document.getElementById('collection-grid')?.scrollIntoView({ behavior: 'smooth' })} onNavigate={onNavigate} />

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
          <button onClick={() => onNavigate('home')} className="hover:text-[#8b6914] transition-colors">Home</button>
          <ChevronRight size={14} />
          <span className="text-[#2c2c2c] font-medium">Collections</span>
        </div>
      </div>

      {/* ── Category scroll tabs ───────────────────────────────── */}
      <div className="sticky top-[60px] z-40 bg-[#faf8f5]/95 backdrop-blur-xl border-b border-black/5 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {COLLECTION_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setPage(1) }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#1a1a1a] text-white shadow-md'
                    : 'bg-white text-[#2c2c2c] border border-black/10 hover:border-[#2c2c2c]/30'
                }`}>
                <cat.Icon size={13} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-black/5 text-[#6b6b6b]'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout: Sidebar + Grid ───────────────────────── */}
      <div id="collection-grid" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-[130px] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1a1a1a] text-sm uppercase tracking-widest">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-[#8b6914] hover:underline font-medium">
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>
              <FilterContent
                priceRange={priceRange} setPriceRange={setPriceRange}
                selectedMaterials={selectedMaterials} toggleMaterial={toggleMaterial}
                selectedColors={selectedColors} toggleColor={toggleColor}
                inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                minRating={minRating} setMinRating={setMinRating}
              />
            </div>
          </aside>

          {/* ── Products Area ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 bg-white text-sm font-medium text-[#2c2c2c] hover:border-[#2c2c2c]/40 transition-colors">
                  <SlidersHorizontal size={15} />
                  Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-white text-[10px] flex items-center justify-center">{activeFilterCount}</span>}
                </button>
                <span className="text-sm text-[#6b6b6b]">{filtered.length} products</span>
                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-black/10 bg-white">
                  <Search size={14} className="text-[#6b6b6b]" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products…" className="text-sm outline-none bg-transparent text-[#2c2c2c] w-36" />
                  {searchQuery && <button onClick={() => setSearchQuery('')}><X size={12} className="text-[#6b6b6b]" /></button>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
                  className="text-sm border border-black/10 rounded-xl px-3 py-2 outline-none bg-white text-[#2c2c2c] cursor-pointer focus:border-[#8b6914] transition-colors">
                  <option value="featured">Featured</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                {/* View toggle */}
                <div className="flex rounded-xl border border-black/10 overflow-hidden bg-white">
                  <button onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:text-[#2c2c2c]'}`}>
                    <Grid3X3 size={16} />
                  </button>
                  <button onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:text-[#2c2c2c]'}`}>
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeCategory !== 'all' && (
                  <FilterChip label={COLLECTION_CATEGORIES.find(c=>c.id===activeCategory)?.label??''} onRemove={() => setActiveCategory('all')} />
                )}
                {selectedMaterials.map(m => <FilterChip key={m} label={m} onRemove={() => toggleMaterial(m)} />)}
                {minRating > 0 && <FilterChip label={`${minRating}★+`} onRemove={() => setMinRating(0)} />}
                {inStockOnly && <FilterChip label="In Stock" onRemove={() => setInStockOnly(false)} />}
              </div>
            )}

            {/* Product grid / list */}
            <AnimatePresence mode="wait">
              {paginated.length === 0 ? (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="flex flex-col items-center justify-center py-24 gap-4 text-[#6b6b6b]">
                  <div className="text-6xl">🔍</div>
                  <p className="text-xl font-medium text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)' }}>No products found</p>
                  <p className="text-sm">Try adjusting your filters or search query</p>
                  <button onClick={clearFilters} className="mt-2 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm font-medium hover:-translate-y-0.5 transition-all">
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div key={activeCategory + sortBy + viewMode + page}
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  transition={{ duration:0.3 }}
                  className={viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'}
                >
                  {paginated.map((product, i) => (
                    viewMode === 'grid'
                      ? <CollectionCard key={product.id} product={product} index={i}
                          onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                          isWishlisted={wishlist.includes(product.id)} />
                      : <CollectionListCard key={product.id} product={product}
                          onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                          isWishlisted={wishlist.includes(product.id)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mid-page promotional banner */}
            {paginated.length > 0 && page === 1 && (
              <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="my-10 rounded-3xl overflow-hidden relative bg-[#1a1a1a] px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute inset-0 opacity-30" style={{ background:'radial-gradient(ellipse at 20% 50%, #8b6914, transparent 60%)' }} />
                <div className="relative z-10">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#c49a3a] font-medium">Limited Time</span>
                  <h3 className="text-2xl font-semibold text-white mt-1" style={{ fontFamily:'var(--font-serif)' }}>
                    Summer Furniture Sale
                  </h3>
                  <p className="text-white/55 text-sm mt-1">Up to 40% off selected items — this weekend only.</p>
                </div>
                <button className="relative z-10 flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-[#c49a3a] text-[#1a1a1a] text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-lg">
                  Explore Deals <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center disabled:opacity-40 hover:border-[#2c2c2c] transition-colors bg-white">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${n===page ? 'bg-[#1a1a1a] text-white shadow-md' : 'bg-white border border-black/10 text-[#2c2c2c] hover:border-[#2c2c2c]'}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                  className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center disabled:opacity-40 hover:border-[#2c2c2c] transition-colors bg-white">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Featured Categories ─────────────────────────────────── */}
      <section className="py-20 bg-[#f0ebe3]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12">
            <span className="section-label mb-3">Browse by Room</span>
            <h2 className="font-semibold text-[#1a1a1a] leading-tight" style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.8rem,4vw,3rem)' }}>
              Find Your Perfect Space
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURED_CATS.map((cat, i) => (
              <motion.div key={cat.label}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y:-6, scale:1.02 }}
                className={`group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br ${cat.bg} p-6 aspect-square flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.12)]`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <cat.Icon size={24} className="text-white/80" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily:'var(--font-serif)' }}>{cat.label}</p>
                  <p className="text-white/50 text-xs mt-0.5">{cat.count} products</p>
                  <div className="mt-3 flex items-center gap-1 text-[#c49a3a] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop now <ArrowRight size={11} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────── */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12">
            <span className="section-label mb-3">Our Promise</span>
            <h2 className="font-semibold text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.8rem,4vw,3rem)' }}>
              Why Choose LUMINA
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <motion.div key={feat.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y:-4 }}
                  className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(44,44,44,0.08)] text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#f0ebe3] flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-[#8b6914]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2" style={{ fontFamily:'var(--font-serif)' }}>{feat.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{feat.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ──────────────────────────────────────── */}
      <ReviewSection />

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <NewsletterSection />

      {/* ── Mobile Filter Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[800] lg:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
              transition={{ type:'spring', stiffness:300, damping:30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#faf8f5] z-[801] flex flex-col overflow-hidden lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
                <h3 className="font-semibold text-[#1a1a1a]">Filters</h3>
                <div className="flex items-center gap-3">
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-[#8b6914] font-medium">Clear all</button>
                  )}
                  <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <FilterContent
                  priceRange={priceRange} setPriceRange={setPriceRange}
                  selectedMaterials={selectedMaterials} toggleMaterial={toggleMaterial}
                  selectedColors={selectedColors} toggleColor={toggleColor}
                  inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                  minRating={minRating} setMinRating={setMinRating}
                />
              </div>
              <div className="p-6 border-t border-black/10">
                <button onClick={() => setSidebarOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#1a1a1a] text-white font-medium text-sm">
                  Show {filtered.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────
function CollectionHero({ onShopClick, onNavigate }: { onShopClick: () => void; onNavigate: (p: string) => void }) {
  return (
    <div className="relative w-full h-[60vh] min-h-[420px] overflow-hidden flex items-center">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2c2010] to-[#3d2e1a]" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage:'radial-gradient(ellipse at 70% 40%, #c49a3a 0%, transparent 60%)' }} />
      {/* Floating shapes */}
      <motion.div animate={{ y:[0,-20,0] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
        className="absolute right-[10%] top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 bg-[#c49a3a]"
        style={{ filter:'blur(60px)' }} />
      <motion.div animate={{ rotate:360 }}
        transition={{ duration:30, repeat:Infinity, ease:'linear' }}
        className="absolute top-10 right-20 w-16 h-16 rounded-full border border-white/20 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
        <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#c49a3a]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#c49a3a] font-medium">Curated Collection</span>
          </div>
          <h1 className="text-white font-semibold mb-4 max-w-2xl leading-[1.1]"
            style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2.4rem,5vw,4.2rem)' }}>
            Modern Living<br />Collection 2025
          </h1>
          <p className="text-white/60 max-w-md text-base leading-relaxed mb-8">
            Explore our premium collection of handcrafted furniture — where timeless design meets contemporary living.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={onShopClick}
              className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#c49a3a] text-[#1a1a1a] text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-[#c49a3a]/30">
              Shop Collection <ArrowRight size={15} />
            </button>
            <button onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all">
              View Lookbook
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div animate={{ y:[0,6,0] }} transition={{ repeat:Infinity, duration:2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        <span className="text-[10px] text-white/30 uppercase tracking-widest">Scroll</span>
      </motion.div>
    </div>
  )
}

// ─── Filter Sidebar Content ───────────────────────────────────
interface FilterProps {
  priceRange: number[]; setPriceRange: (v: number[]) => void
  selectedMaterials: string[]; toggleMaterial: (m: string) => void
  selectedColors: string[]; toggleColor: (c: string) => void
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void
  minRating: number; setMinRating: (v: number) => void
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-black/[0.06] pb-5">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-3 group">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]">{title}</span>
        <ChevronDown size={14} className={`text-[#6b6b6b] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterContent({ priceRange, setPriceRange, selectedMaterials, toggleMaterial,
  selectedColors, toggleColor, inStockOnly, setInStockOnly, minRating, setMinRating }: FilterProps) {
  return (
    <div className="space-y-5">
      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-[#6b6b6b]">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
          <input type="range" min={0} max={5000} step={100} value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-[#8b6914] cursor-pointer" />
          <div className="grid grid-cols-2 gap-2">
            {[500,1000,2000,3000].map(p => (
              <button key={p} onClick={() => setPriceRange([0, p])}
                className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${priceRange[1]===p ? 'bg-[#1a1a1a] text-white' : 'bg-[#f0ebe3] text-[#2c2c2c] hover:bg-[#e8ddd0]'}`}>
                Under ${p/1000 >= 1 ? `${p/1000}k` : p}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material">
        <div className="space-y-2">
          {MATERIALS.map(m => (
            <label key={m} className="flex items-center gap-3 cursor-pointer group">
              <div onClick={() => toggleMaterial(m)}
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${selectedMaterials.includes(m) ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'border-black/20 group-hover:border-[#1a1a1a]'}`}>
                {selectedMaterials.includes(m) && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className="text-sm text-[#2c2c2c] group-hover:text-[#1a1a1a] transition-colors">{m}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button key={c.name} onClick={() => toggleColor(c.name)} title={c.name}
              className={`w-7 h-7 rounded-full transition-all ${selectedColors.includes(c.name) ? 'scale-110 ring-2 ring-offset-2 ring-[#1a1a1a]' : 'hover:scale-105'}`}
              style={{ background: c.hex }} aria-label={c.name} />
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${inStockOnly ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'border-black/20'}`}>
            {inStockOnly && <span className="text-white text-[10px]">✓</span>}
          </div>
          <span className="text-sm text-[#2c2c2c]">In Stock Only</span>
        </label>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <div className="space-y-2">
          {[4,3,2,1].map(r => (
            <button key={r} onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`flex items-center gap-2 w-full py-1.5 px-2 rounded-lg transition-colors ${minRating===r ? 'bg-[#fdf6e8]' : 'hover:bg-[#f0ebe3]'}`}>
              <div className="flex">
                {Array.from({length:5}).map((_,i) => (
                  <Star key={i} size={12} fill={i<r ? '#c49a3a' : 'none'} className={i<r ? 'text-[#c49a3a]' : 'text-[#e0d5c5]'} />
                ))}
              </div>
              <span className="text-xs text-[#6b6b6b]">& up</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

// ─── Collection Card (Grid) ───────────────────────────────────
function CollectionCard({ product, index, onAddToCart, onWishlist, onQuickView, isWishlisted }:
  { product:Product; index:number; onAddToCart:(p:Product)=>void; onWishlist:(p:Product)=>void; onQuickView:(p:Product)=>void; isWishlisted:boolean }) {
  const [matIdx, setMatIdx] = useState(0)
  const [added, setAdded]   = useState(false)
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null
  const c = product.materials[matIdx].color

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:index*0.07 }}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(44,44,44,0.08)] hover:shadow-[0_20px_60px_rgba(44,44,44,0.16)] hover:-translate-y-2 transition-all duration-400 cursor-pointer">
        {/* Image */}
        <div className="relative h-64 bg-[#f0ebe3] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-44 transition-transform duration-500 group-hover:scale-105">
            <rect x="10" y="70" width="180" height="45" rx="8" fill={`${c}22`} stroke={c} strokeWidth="1.5"/>
            <rect x="5"   y="55" width="38"  height="60" rx="8" fill={`${c}22`} stroke={c} strokeWidth="1"/>
            <rect x="157" y="55" width="38"  height="60" rx="8" fill={`${c}22`} stroke={c} strokeWidth="1"/>
            <rect x="20"  y="40" width="65"  height="42" rx="8" fill={`${c}30`} stroke={`${c}80`} strokeWidth="1"/>
            <rect x="95"  y="40" width="65"  height="42" rx="8" fill={`${c}30`} stroke={`${c}80`} strokeWidth="1"/>
          </svg>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-[#8b6914]">{product.badge}</span>}
            {product.isNew && <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-[#2c2c2c]">New</span>}
            {discount && <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-[#e05c5c]">-{discount}%</span>}
          </div>
          {/* Hover actions */}
          <div className="absolute inset-0 bg-[#1a1a1a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={(e) => { e.stopPropagation(); onQuickView(product) }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#2c2c2c]">
              <Eye size={15} />
            </motion.button>
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={(e) => { e.stopPropagation(); onWishlist(product) }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
              style={{ color: isWishlisted ? '#e05c5c' : '#2c2c2c' }}>
              <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
        </div>
        {/* Body */}
        <div className="p-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b6914]">{product.category}</span>
          <h3 className="mt-1 mb-1.5 font-medium text-[#1a1a1a] leading-snug" style={{ fontFamily:'var(--font-serif)', fontSize:'1.05rem' }}>{product.name}</h3>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">{Array.from({length:5}).map((_,i) => <Star key={i} size={11} fill={i < Math.floor(product.rating) ? '#c49a3a' : 'none'} className={i < Math.floor(product.rating) ? 'text-[#c49a3a]' : 'text-[#e0d5c5]'} />)}</div>
            <span className="text-xs text-[#6b6b6b]">{product.rating} ({product.reviews})</span>
          </div>
          {/* Swatches */}
          <div className="flex gap-1.5 mb-4">
            {product.materials.map((mat, i) => (
              <button key={mat.name} onClick={(e) => { e.stopPropagation(); setMatIdx(i) }} title={mat.name}
                className={`w-5 h-5 rounded-full transition-all ${i===matIdx ? 'ring-2 ring-offset-1 ring-[#2c2c2c] scale-110' : 'hover:scale-110'}`}
                style={{ background: mat.color }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)' }}>${product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="text-sm ml-2 line-through text-[#6b6b6b]">${product.originalPrice.toLocaleString()}</span>}
            </div>
            <motion.button whileTap={{ scale:0.9 }} onClick={handleAdd}
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

// ─── List Card ────────────────────────────────────────────────
function CollectionListCard({ product, onAddToCart, onWishlist, onQuickView, isWishlisted }:
  { product:Product; onAddToCart:(p:Product)=>void; onWishlist:(p:Product)=>void; onQuickView:(p:Product)=>void; isWishlisted:boolean }) {
  const c = product.materials[0].color
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null
  const [added, setAdded] = useState(false)

  return (
    <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
      className="group flex gap-5 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(44,44,44,0.06)] hover:shadow-[0_8px_32px_rgba(44,44,44,0.12)] hover:-translate-y-1 transition-all duration-300">
      {/* Thumb */}
      <div className="w-32 h-32 flex-shrink-0 rounded-xl bg-[#f0ebe3] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 group-hover:scale-105 transition-transform duration-500">
          <rect x="5" y="45" width="110" height="28" rx="5" fill={`${c}22`} stroke={c} strokeWidth="1.2"/>
          <rect x="2" y="35" width="22"  height="38" rx="5" fill={`${c}22`} stroke={c} strokeWidth="0.8"/>
          <rect x="96" y="35" width="22" height="38" rx="5" fill={`${c}22`} stroke={c} strokeWidth="0.8"/>
          <rect x="12" y="25" width="40" height="26" rx="5" fill={`${c}30`} stroke={`${c}80`} strokeWidth="0.8"/>
          <rect x="58" y="25" width="40" height="26" rx="5" fill={`${c}30`} stroke={`${c}80`} strokeWidth="0.8"/>
        </svg>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b6914]">{product.category}</span>
            <h3 className="mt-0.5 font-medium text-[#1a1a1a] text-lg leading-snug" style={{ fontFamily:'var(--font-serif)' }}>{product.name}</h3>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {product.badge && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-[#8b6914]">{product.badge}</span>}
            {discount && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-[#e05c5c]">-{discount}%</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 mb-2">
          <div className="flex">{Array.from({length:5}).map((_,i) => <Star key={i} size={11} fill={i < Math.floor(product.rating) ? '#c49a3a' : 'none'} className={i < Math.floor(product.rating) ? 'text-[#c49a3a]' : 'text-[#e0d5c5]'} />)}</div>
          <span className="text-xs text-[#6b6b6b]">{product.rating} ({product.reviews} reviews)</span>
        </div>
        <p className="text-sm text-[#6b6b6b] leading-relaxed mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)' }}>${product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-sm ml-2 line-through text-[#6b6b6b]">${product.originalPrice.toLocaleString()}</span>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => onQuickView(product)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/10 text-[#2c2c2c] text-xs font-medium hover:border-[#2c2c2c] transition-colors">
              <Eye size={13} /> Quick View
            </button>
            <button onClick={() => onWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${isWishlisted ? 'bg-[#fff0f0] border-[#e05c5c] text-[#e05c5c]' : 'border-black/10 text-[#2c2c2c] hover:border-[#2c2c2c]'}`}>
              <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <motion.button whileTap={{ scale:0.95 }}
              onClick={() => { onAddToCart(product); setAdded(true); setTimeout(()=>setAdded(false),1200) }}
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

// ─── Filter chip ──────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label:string; onRemove:()=>void }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1a] text-white text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:opacity-70"><X size={11} /></button>
    </div>
  )
}

// ─── Reviews Carousel ─────────────────────────────────────────
function ReviewSection() {
  const [idx, setIdx] = useState(0)
  return (
    <section className="py-20 bg-[#f0ebe3]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-12">
          <span className="section-label mb-3">Customer Stories</span>
          <h2 className="font-semibold text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.8rem,4vw,3rem)' }}>
            Loved by <span className="gradient-text">50,000+</span> Homeowners
          </h2>
        </motion.div>
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              transition={{ duration:0.4 }}
              className="bg-white rounded-3xl p-8 lg:p-12 text-center shadow-[0_8px_32px_rgba(44,44,44,0.08)]"
            >
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({length:REVIEWS[idx].rating}).map((_,i) => <Star key={i} size={18} fill="#c49a3a" className="text-[#c49a3a]" />)}
              </div>
              <blockquote className="text-xl font-medium leading-relaxed mb-6 text-[#1a1a1a]"
                style={{ fontFamily:'var(--font-serif)' }}>
                "{REVIEWS[idx].text}"
              </blockquote>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6914] mb-5">Re: {REVIEWS[idx].product}</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ background: REVIEWS[idx].color }}>{REVIEWS[idx].avatar}</div>
                <span className="font-medium text-[#1a1a1a] text-sm">{REVIEWS[idx].name}</span>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Dots */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => setIdx(i => (i-1+REVIEWS.length)%REVIEWS.length)}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:border-[#2c2c2c] bg-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            {REVIEWS.map((_,i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i===idx ? 'w-6 bg-[#8b6914]' : 'w-2 bg-[#e8ddd0]'}`} />
            ))}
            <button onClick={() => setIdx(i => (i+1)%REVIEWS.length)}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:border-[#2c2c2c] bg-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Newsletter ───────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="py-20 bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ background:'radial-gradient(ellipse at 50% 100%, #8b6914, transparent 60%)' }} />
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#c49a3a] font-medium block mb-4">Stay Inspired</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-3" style={{ fontFamily:'var(--font-serif)' }}>
            Get Furniture Trends &<br />Exclusive Offers
          </h2>
          <p className="text-white/50 text-sm mb-8">Join 80,000+ subscribers. No spam, unsubscribe anytime.</p>
          {submitted ? (
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
              className="flex items-center justify-center gap-3 text-[#c49a3a] font-medium">
              <span className="text-2xl">✓</span> You're on the list! Welcome to LUMINA.
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if(email) setSubmitted(true) }}
              className="flex gap-2 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address" required
                className="flex-1 bg-white/10 border border-white/15 text-white placeholder-white/40 rounded-full px-5 py-3.5 text-sm outline-none focus:border-[#c49a3a] transition-colors" />
              <button type="submit"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#c49a3a] text-[#1a1a1a] text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-lg">
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
