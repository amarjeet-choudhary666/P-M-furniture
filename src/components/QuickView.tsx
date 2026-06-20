import { useState, type ReactElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Heart, Star, Check, Scan, RotateCcw } from 'lucide-react'
import type { Product } from '../data/products'

interface QuickViewProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
  onWishlist: (product: Product) => void
  isWishlisted: boolean
}

export default function QuickView({ product, onClose, onAddToCart, onWishlist, isWishlisted }: QuickViewProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [viewing360, setViewing360] = useState(false)

  if (!product) return null

  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="fixed inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm z-[900]" onClick={onClose} />

      <motion.div
        initial={{ opacity:0, scale:0.92, y:30 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.92, y:30 }}
        transition={{ type:'spring', stiffness:300, damping:28 }}
        className="fixed inset-4 lg:inset-12 xl:inset-20 z-[910] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl bg-[#faf8f5]"
        style={{ maxHeight:'90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.08] hover:bg-black/[0.14] transition-colors"
          aria-label="Close">
          <X size={18} />
        </button>

        {/* Image Panel */}
        <div className="relative lg:w-1/2 flex-shrink-0 flex items-center justify-center p-8 bg-[#f0ebe3] overflow-hidden min-h-[300px]">
          <motion.div
            animate={viewing360 ? { rotateY: [0, 180, 360] } : {}}
            transition={viewing360 ? { duration:3, ease:'linear' } : {}}
            className="w-full max-w-xs"
          >
            <QuickViewIllustration category={product.category} color={product.materials[selectedMaterial].color} />
          </motion.div>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button onClick={() => setViewing360(v => !v)}
              className="glass flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#2c2c2c]">
              <RotateCcw size={12} />{viewing360 ? 'Stop 360°' : '360° View'}
            </button>
            <button className="glass flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#2c2c2c]">
              <Scan size={12} />AR Preview
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <span className="section-label">{product.category}</span>
          <h2 className="text-3xl font-semibold mt-2 mb-3 text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)' }}>
            {product.name}
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length:5 }).map((_,i) => (
                <Star key={i} size={14} fill="currentColor"
                  className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-[#6b6b6b]">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-semibold text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)' }}>
              ${(product.price * qty).toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg line-through text-[#6b6b6b]">${product.originalPrice.toLocaleString()}</span>
                <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-[#fee] text-[#e05c5c]">Save {discount}%</span>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-6 text-[#6b6b6b]">{product.description}</p>

          {/* Material selector */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3 text-[#2c2c2c]">
              Material: <span className="text-[#8b6914]">{product.materials[selectedMaterial].name}</span>
            </p>
            <div className="flex gap-2.5">
              {product.materials.map((mat, i) => (
                <button key={mat.name} className="swatch" onClick={() => setSelectedMaterial(i)} title={mat.name}
                  style={{ background: mat.color, ...(i === selectedMaterial ? { outline:'2px solid #2c2c2c', outlineOffset:'3px' } : {}) }}
                  aria-label={`Select ${mat.name}`} />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <p className="text-sm font-medium mb-3 text-[#2c2c2c]">Key Features</p>
            <ul className="grid grid-cols-2 gap-2">
              {product.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-[#6b6b6b]">
                  <Check size={13} className="text-[#8b6914] flex-shrink-0" />{feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Qty + Add */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-black/10 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty-1))}
                className="w-10 h-11 flex items-center justify-center text-lg text-[#2c2c2c] hover:bg-[#f0ebe3] transition-colors" aria-label="Decrease">−</button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(qty+1)}
                className="w-10 h-11 flex items-center justify-center text-lg text-[#2c2c2c] hover:bg-[#f0ebe3] transition-colors" aria-label="Increase">+</button>
            </div>
            <motion.button whileTap={{ scale:0.97 }} onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#2c2c2c] text-white text-[13px] font-medium tracking-widest uppercase rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
              aria-label={`Add ${product.name} to cart`}>
              <span>{added ? 'Added!' : 'Add to Cart'}</span>
              {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            </motion.button>
            <motion.button whileTap={{ scale:0.9 }} onClick={() => onWishlist(product)}
              className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all"
              style={{ borderColor:'rgba(44,44,44,0.1)', color: isWishlisted ? '#e05c5c' : '#2c2c2c', background: isWishlisted ? '#fff5f5' : 'transparent' }}
              aria-label="Add to wishlist">
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
          <p className="text-xs text-center text-[#6b6b6b]">Free shipping on orders over $500 · 30-day returns</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function QuickViewIllustration({ category, color }: { category:string; color:string }) {
  const bg = `${color}22`
  const shapes: Record<string, ReactElement> = {
    sofa: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <rect x="10" y="85" width="220" height="52" rx="12" fill={bg} stroke={color} strokeWidth="2"/>
        <rect x="4"   y="65" width="46"  height="72" rx="12" fill={bg} stroke={color} strokeWidth="1.5"/>
        <rect x="190" y="65" width="46"  height="72" rx="12" fill={bg} stroke={color} strokeWidth="1.5"/>
        <rect x="22"  y="46" width="80"  height="50" rx="12" fill={`${color}30`} stroke={`${color}80`} strokeWidth="1.5"/>
        <rect x="112" y="46" width="80"  height="50" rx="12" fill={`${color}30`} stroke={`${color}80`} strokeWidth="1.5"/>
        <rect x="32"  y="137" width="18" height="14" rx="4" fill={color} opacity="0.5"/>
        <rect x="190" y="137" width="18" height="14" rx="4" fill={color} opacity="0.5"/>
      </svg>
    ),
    bed: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <rect x="14" y="88" width="212" height="46" rx="10" fill={bg} stroke={color} strokeWidth="2"/>
        <rect x="14" y="62" width="212" height="32" rx="8" fill={`${color}20`} stroke={`${color}60`} strokeWidth="1.5"/>
        <rect x="14" y="36" width="36"  height="108" rx="6" fill={bg} stroke={color} strokeWidth="1.5"/>
        <rect x="62" y="72" width="54"  height="24" rx="6" fill={`${color}30`} stroke={`${color}70`} strokeWidth="1"/>
        <rect x="126" y="72" width="54" height="24" rx="6" fill={`${color}30`} stroke={`${color}70`} strokeWidth="1"/>
        <rect x="22"  y="134" width="16" height="12" rx="3" fill={color} opacity="0.5"/>
        <rect x="202" y="134" width="16" height="12" rx="3" fill={color} opacity="0.5"/>
      </svg>
    ),
    dining: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <rect x="30" y="68" width="180" height="14" rx="7" fill={bg} stroke={color} strokeWidth="2"/>
        <rect x="50" y="82" width="14"  height="52" rx="4" fill={`${color}40`}/>
        <rect x="176" y="82" width="14" height="52" rx="4" fill={`${color}40`}/>
        <ellipse cx="84"  cy="55" rx="28" ry="18" fill={`${color}15`} stroke={`${color}50`} strokeWidth="1.5"/>
        <ellipse cx="156" cy="55" rx="28" ry="18" fill={`${color}15`} stroke={`${color}50`} strokeWidth="1.5"/>
        <ellipse cx="84"  cy="132" rx="28" ry="18" fill={`${color}15`} stroke={`${color}50`} strokeWidth="1.5"/>
        <ellipse cx="156" cy="132" rx="28" ry="18" fill={`${color}15`} stroke={`${color}50`} strokeWidth="1.5"/>
      </svg>
    ),
    office: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <rect x="60" y="55" width="120" height="80" rx="14" fill={bg} stroke={color} strokeWidth="2"/>
        <rect x="78" y="42" width="84"  height="22" rx="8" fill={`${color}30`} stroke={color} strokeWidth="1.5"/>
        <rect x="106" y="135" width="28" height="14" rx="4" fill={`${color}40`}/>
        <ellipse cx="120" cy="148" rx="20" ry="7" fill={`${color}20`} stroke={color} strokeWidth="1"/>
        <circle cx="120" cy="97" r="24" fill={`${color}15`} stroke={`${color}60`} strokeWidth="1.5"/>
      </svg>
    ),
    decor: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <ellipse cx="120" cy="135" rx="60" ry="10" fill={`${color}15`}/>
        <path d="M95 135 Q102 48 120 36 Q138 48 145 135 Z" fill={bg} stroke={color} strokeWidth="2"/>
        <ellipse cx="120" cy="36" rx="14" ry="9" fill={`${color}60`}/>
        <rect x="104" y="135" width="32" height="10" rx="3" fill={`${color}40`}/>
        <path d="M104 90 Q120 80 136 90" stroke={`${color}80`} strokeWidth="2" fill="none"/>
        <path d="M100 108 Q120 96 140 108" stroke={`${color}80`} strokeWidth="2" fill="none"/>
      </svg>
    ),
  }
  return shapes[category] ?? shapes['decor']
}
