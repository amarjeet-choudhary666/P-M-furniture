import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp } from 'lucide-react'
import type { Product } from '../data/products'

export interface CartItem { product: Product; qty: number; material: string }

interface CartDrawerProps {
  open: boolean
  items: CartItem[]
  onClose: () => void
  onRemove: (id: number) => void
  onQtyChange: (id: number, qty: number) => void
  onCheckout: () => void
}

function CategoryIcon({ category, size = 20 }: { category: string; size?: number }) {
  const map: Record<string, React.ReactNode> = {
    sofa:   <Sofa size={size} />,
    bed:    <BedDouble size={size} />,
    dining: <UtensilsCrossed size={size} />,
    office: <Briefcase size={size} />,
    decor:  <Lamp size={size} />,
  }
  return <span className="text-[#8b6914]">{map[category] ?? <ShoppingBag size={size} />}</span>
}

export default function CartDrawer({ open, items, onClose, onRemove, onQtyChange, onCheckout }: CartDrawerProps) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const shipping = subtotal > 500 ? 0 : 79
  const total    = subtotal + shipping

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm z-[900]" onClick={onClose} />

          <motion.div key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-[min(440px,100vw)] bg-[#faf8f5] z-[901] flex flex-col shadow-[−20px_0_60px_rgba(26,26,26,0.15)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#2c2c2c]" />
                <h2 className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>Your Cart</h2>
                {items.length > 0 && (
                  <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white bg-[#8b6914]">
                    {items.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#6b6b6b] hover:bg-[#f0ebe3] transition-colors" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-2">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 gap-4 text-[#6b6b6b]">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Your cart is empty</p>
                    <button onClick={onClose}
                      className="px-6 py-2.5 rounded-full border border-[#2c2c2c] text-[#2c2c2c] text-sm font-medium hover:bg-[#2c2c2c] hover:text-white transition-all">
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : items.map((item) => (
                  <motion.div key={item.product.id} layout
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, height: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="flex gap-4 px-6 py-4 border-b border-black/[0.06]"
                  >
                    <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center bg-[#f0ebe3]">
                      <CategoryIcon category={item.product.category} size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-snug truncate text-[#1a1a1a]">{item.product.name}</h3>
                      <p className="text-xs mt-0.5 mb-2 text-[#6b6b6b]">{item.material}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg overflow-hidden border border-black/10">
                          <button onClick={() => item.qty === 1 ? onRemove(item.product.id) : onQtyChange(item.product.id, item.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center text-sm text-[#2c2c2c] hover:bg-[#f0ebe3] transition-colors" aria-label="Decrease">
                            {item.qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">{item.qty}</span>
                          <button onClick={() => onQtyChange(item.product.id, item.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#2c2c2c] hover:bg-[#f0ebe3] transition-colors" aria-label="Increase">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                          ${(item.product.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="px-6 pb-6 pt-4 border-t border-black/10">
                {/* Promo */}
                <div className="flex gap-2 mb-5">
                  <div className="flex-1 flex items-center gap-2 border border-black/10 rounded-xl px-3 py-2.5">
                    <Tag size={14} className="text-[#6b6b6b]" />
                    <input type="text" placeholder="Promo code"
                      className="flex-1 text-sm bg-transparent outline-none text-[#2c2c2c]" />
                  </div>
                  <button className="px-4 py-2 rounded-xl text-sm font-medium bg-[#2c2c2c] text-white">Apply</button>
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between text-[#6b6b6b]"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-[#6b6b6b]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[#8b6914]">Add ${(500 - subtotal).toLocaleString()} more for free shipping</p>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-black/10 text-[#1a1a1a]">
                    <span>Total</span>
                    <span style={{ fontFamily: 'var(--font-serif)' }}>${total.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-[#2c2c2c] text-white text-[13px] font-medium tracking-widest uppercase rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl">
                  <span>Checkout</span>
                  <ArrowRight size={16} />
                </button>
                <p className="text-xs text-center mt-3 text-[#6b6b6b]">Secure checkout · Free returns · 2-year warranty</p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
