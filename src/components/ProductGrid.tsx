import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal,
  LayoutGrid, Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp,
  type LucideIcon
} from 'lucide-react'
import { CATEGORIES, getProductsByCategory } from '../data/products'
import type { Product } from '../data/products'
import ProductCard from './ProductCard'

// Map iconName strings to actual Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid, Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp,
}

interface ProductGridProps {
  onAddToCart: (product: Product) => void
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  wishlist: number[]
}

export default function ProductGrid({ onAddToCart, onWishlist, onQuickView, wishlist }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
  const [loaded] = useState(true)

  const filtered = getProductsByCategory(activeCategory)
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'rating')     return b.rating - a.rating
    return 0
  })

  return (
    <section id="products" className="py-24 lg:py-32 bg-[#faf8f5]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8 }}
          className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div>
            <span className="section-label mb-3">Our Collections</span>
            <h2 className="font-semibold leading-tight text-[#1a1a1a]"
              style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2rem,5vw,3.6rem)' }}>
              Crafted for Every<br /><span className="gradient-text">Corner of Your Home</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={16} className="text-[#6b6b6b]" />
            <span className="text-sm text-[#6b6b6b]">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-black/10 rounded-lg px-3 py-2 outline-none cursor-pointer bg-white text-[#2c2c2c] focus:border-[#8b6914] transition-colors">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.6, delay:0.1 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName]
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'bg-[#2c2c2c] text-white border-[#2c2c2c] shadow-[0_8px_32px_rgba(44,44,44,0.12)]'
                    : 'bg-white text-[#2c2c2c] border-black/10 hover:border-[#2c2c2c]/30'
                }`}>
                {Icon && <Icon size={13} />}
                {cat.label}
              </button>
            )
          })}
        </motion.div>

        {/* Count */}
        <motion.p key={activeCategory} initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="text-sm mb-8 text-[#6b6b6b]">
          Showing {sorted.length} {activeCategory === 'all' ? 'products' : CATEGORIES.find(c => c.id === activeCategory)?.label.toLowerCase()}
        </motion.p>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loaded ? (
            <motion.div key={activeCategory + sortBy}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            >
              {sorted.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i}
                  onAddToCart={onAddToCart} onWishlist={onWishlist} onQuickView={onQuickView}
                  isWishlisted={wishlist.includes(product.id)} />
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton h-72 w-full" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-3 w-1/3 rounded" />
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Load more */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="flex justify-center mt-16">
          <button className="px-8 py-3.5 rounded-full border border-[#2c2c2c] text-[#2c2c2c] text-sm font-medium tracking-widest uppercase hover:bg-[#2c2c2c] hover:text-white transition-all duration-300">
            Load More Products
          </button>
        </motion.div>
      </div>
    </section>
  )
}
