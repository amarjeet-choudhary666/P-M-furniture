import { useState, type ReactElement } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onWishlist: (product: Product) => void
  onQuickView: (product: Product) => void
  isWishlisted: boolean
  index: number
}

export default function ProductCard({ product, onAddToCart, onWishlist, onQuickView, isWishlisted, index }: ProductCardProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(0)
  const [addedAnim, setAddedAnim] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product)
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 1200)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(44,44,44,0.08)] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(44,44,44,0.20)]">
        {/* Image */}
        <div className="relative h-[280px] bg-[#f0ebe3] flex items-center justify-center overflow-hidden">
          <ProductIllustration category={product.category} material={product.materials[selectedMaterial]} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full text-white bg-[#8b6914]">
                {product.badge}
              </span>
            )}
            {product.isNew && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full text-white bg-[#2c2c2c]">
                New
              </span>
            )}
            {discount && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full text-white bg-[#e05c5c]">
                -{discount}%
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#1a1a1a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onQuickView(product) }}
              className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#2c2c2c]"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onWishlist(product) }}
              className={`w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center wishlist-btn`}
              style={{ color: isWishlisted ? '#e05c5c' : '#2c2c2c' }}
              aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist`}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <span className="section-label text-[10px]">{product.category}</span>

          <h3 className="mt-1 mb-2 text-lg font-medium leading-snug text-[#1a1a1a]"
            style={{ fontFamily: 'var(--font-serif)' }}>
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor"
                  className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
              ))}
            </div>
            <span className="text-xs text-[#6b6b6b]">{product.rating} ({product.reviews})</span>
          </div>

          {/* Swatches */}
          <div className="flex gap-2 mb-4">
            {product.materials.map((mat, i) => (
              <button
                key={mat.name}
                className="swatch"
                style={{ background: mat.color, ...(i === selectedMaterial ? { outline: '2px solid #2c2c2c', outlineOffset: '2px' } : {}) }}
                onClick={(e) => { e.stopPropagation(); setSelectedMaterial(i) }}
                title={mat.name}
                aria-label={`Select ${mat.name}`}
              />
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm ml-2 line-through text-[#6b6b6b]">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300"
              style={{ background: addedAnim ? '#8b6914' : '#2c2c2c' }}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProductIllustration({ category, material }: { category: string; material: { color: string } }) {
  const c = material.color
  const bg = `${c}22`

  const illustrations: Record<string, ReactElement> = {
    sofa: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48">
        <rect x="10" y="70" width="180" height="45" rx="8" fill={bg} stroke={c} strokeWidth="1.5"/>
        <rect x="5"   y="55" width="38" height="60" rx="8" fill={bg} stroke={c} strokeWidth="1"/>
        <rect x="157" y="55" width="38" height="60" rx="8" fill={bg} stroke={c} strokeWidth="1"/>
        <rect x="20"  y="40" width="65" height="42" rx="8" fill={`${c}30`} stroke={`${c}80`} strokeWidth="1"/>
        <rect x="95"  y="40" width="65" height="42" rx="8" fill={`${c}30`} stroke={`${c}80`} strokeWidth="1"/>
        <rect x="30"  y="115" width="14" height="12" rx="3" fill={c} opacity="0.6"/>
        <rect x="156" y="115" width="14" height="12" rx="3" fill={c} opacity="0.6"/>
      </svg>
    ),
    bed: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48">
        <rect x="15"  y="75" width="170" height="40" rx="6" fill={bg} stroke={c} strokeWidth="1.5"/>
        <rect x="15"  y="52" width="170" height="28" rx="6" fill={`${c}20`} stroke={`${c}60`} strokeWidth="1"/>
        <rect x="15"  y="30" width="30"  height="90" rx="4" fill={bg} stroke={c} strokeWidth="1"/>
        <rect x="50"  y="60" width="45"  height="20" rx="4" fill={`${c}25`} stroke={`${c}70`} strokeWidth="1"/>
        <rect x="105" y="60" width="45"  height="20" rx="4" fill={`${c}25`} stroke={`${c}70`} strokeWidth="1"/>
        <rect x="22"  y="115" width="12" height="10" rx="2" fill={c} opacity="0.5"/>
        <rect x="167" y="115" width="12" height="10" rx="2" fill={c} opacity="0.5"/>
      </svg>
    ),
    dining: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48">
        <rect x="30"  y="58" width="140" height="12" rx="6" fill={bg} stroke={c} strokeWidth="1.5"/>
        <rect x="45"  y="70" width="10"  height="45" rx="3" fill={`${c}40`}/>
        <rect x="145" y="70" width="10"  height="45" rx="3" fill={`${c}40`}/>
        <ellipse cx="72"  cy="48"  rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
        <ellipse cx="128" cy="48"  rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
        <ellipse cx="72"  cy="112" rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
        <ellipse cx="128" cy="112" rx="22" ry="14" fill={`${c}15`} stroke={`${c}50`} strokeWidth="1"/>
      </svg>
    ),
    office: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48">
        <rect x="50" y="50" width="100" height="70" rx="10" fill={bg} stroke={c} strokeWidth="1.5"/>
        <rect x="65" y="38" width="70"  height="20" rx="6"  fill={`${c}30`} stroke={c} strokeWidth="1"/>
        <rect x="90" y="120" width="20" height="12" rx="3" fill={`${c}40`}/>
        <ellipse cx="100" cy="130" rx="16" ry="6" fill={`${c}25`} stroke={c} strokeWidth="1"/>
        <circle cx="100" cy="88" r="20" fill={`${c}15`} stroke={`${c}60`} strokeWidth="1"/>
      </svg>
    ),
    decor: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48">
        <ellipse cx="100" cy="110" rx="50" ry="8" fill={`${c}20`}/>
        <path d="M80 110 Q85 40 100 30 Q115 40 120 110 Z" fill={bg} stroke={c} strokeWidth="1.5"/>
        <ellipse cx="100" cy="30" rx="10" ry="6" fill={`${c}50`}/>
        <rect x="88" y="110" width="24" height="8" rx="2" fill={`${c}40`}/>
        <path d="M88 75 Q100 68 112 75" stroke={`${c}70`} strokeWidth="1.5" fill="none"/>
        <path d="M86 90 Q100 82 114 90" stroke={`${c}70`} strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-6">
      {illustrations[category] ?? illustrations['decor']}
    </div>
  )
}
