import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import type { Product } from '../data/products'

interface WishlistDrawerProps {
  open: boolean
  items: Product[]
  onClose: () => void
  onRemove: (id: number) => void
  onAddToCart: (product: Product) => void
}

const EMOJI: Record<string, string> = { sofa: '🛋', bed: '🛏', dining: '🪑', office: '💼', decor: '🏺' }

export default function WishlistDrawer({ open, items, onClose, onRemove, onAddToCart }: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="wl-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm z-[900]" onClick={onClose} />

          <motion.div key="wl-drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-[min(440px,100vw)] bg-[#faf8f5] z-[901] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div className="flex items-center gap-3">
                <Heart size={20} className="text-[#e05c5c]" fill="#e05c5c" />
                <h2 className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>Wishlist</h2>
                {items.length > 0 && (
                  <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white bg-[#e05c5c]">
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#6b6b6b] hover:bg-[#f0ebe3] transition-colors" aria-label="Close wishlist">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-2">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 gap-4 text-[#6b6b6b]">
                    <Heart size={48} strokeWidth={1} />
                    <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>No saved items yet</p>
                    <button onClick={onClose}
                      className="px-6 py-2.5 rounded-full border border-[#2c2c2c] text-[#2c2c2c] text-sm font-medium hover:bg-[#2c2c2c] hover:text-white transition-all">
                      Explore Products
                    </button>
                  </motion.div>
                ) : items.map((product) => (
                  <motion.div key={product.id} layout
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                    className="flex gap-4 px-6 py-4 border-b border-black/[0.06]"
                  >
                    <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center bg-[#f0ebe3] text-3xl">
                      {EMOJI[product.category] ?? '✦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate text-[#1a1a1a]">{product.name}</h3>
                      <p className="text-xs mt-0.5 mb-3 capitalize text-[#6b6b6b]">{product.category}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                          ${product.price.toLocaleString()}
                        </span>
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => { onAddToCart(product); onRemove(product.id) }}
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#2c2c2c]">
                          <ShoppingBag size={11} /> Add to Cart
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => onRemove(product.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#e05c5c] bg-[#fff0f0]"
                          aria-label="Remove from wishlist">
                          <Trash2 size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="px-6 pb-6 pt-4 border-t border-black/10">
                <button
                  onClick={() => { items.forEach(p => onAddToCart(p)); items.forEach(p => onRemove(p.id)) }}
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-[#2c2c2c] text-white text-[13px] font-medium tracking-widest uppercase rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span>Add All to Cart</span>
                  <ShoppingBag size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
