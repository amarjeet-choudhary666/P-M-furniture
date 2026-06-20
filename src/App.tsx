import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

import LoadingScreen    from './components/LoadingScreen'
import Cursor          from './components/Cursor'
import Navbar          from './components/Navbar'
import Hero            from './components/Hero'
import FeaturesSection from './components/FeaturesSection'
import ProductGrid     from './components/ProductGrid'
import QuickView       from './components/QuickView'
import Testimonials    from './components/Testimonials'
import RoomPlanner     from './components/RoomPlanner'
import CartDrawer,     { type CartItem } from './components/CartDrawer'
import WishlistDrawer  from './components/WishlistDrawer'
import CheckoutModal   from './components/CheckoutModal'
import Footer          from './components/Footer'

import type { Product } from './data/products'
import { PRODUCTS } from './data/products'

/* ── Toast notification ────────────────────────────────────── */
interface Toast { id: number; message: string; type?: 'success' | 'info' }

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="flex items-center gap-3 px-5 py-3 rounded-full shadow-xl text-sm font-medium text-white bg-[#1a1a1a] backdrop-blur-xl"
          >
            <CheckCircle size={16} className="text-[#5a9a5a] flex-shrink-0" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ── Smooth scroll progress bar ───────────────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setProgress(Math.min(pct, 1))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <motion.div
      className="fixed top-0 left-0 h-0.5 z-[900] origin-left bg-gradient-to-r from-[#8b6914] to-[#c49a3a]"
      style={{ scaleX: progress }}
    />
  )
}

/* ── Back to top ───────────────────────────────────────────── */
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg z-[800] bg-[#2c2c2c] text-white font-bold text-lg"
          aria-label="Back to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ── App ───────────────────────────────────────────────────── */
export default function App() {
  /* Loading */
  const [loading, setLoading] = useState(true)

  /* Cart */
  const [cartItems, setCartItems]     = useState<CartItem[]>([])
  const [cartOpen, setCartOpen]       = useState(false)

  /* Wishlist */
  const [wishlist, setWishlist]       = useState<number[]>([])
  const [wishlistOpen, setWishlistOpen] = useState(false)

  /* Quick view */
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  /* Checkout */
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  /* Toasts */
  const [toasts, setToasts]           = useState<Toast[]>([])
  const toastId                        = useRef(0)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const addToast = (message: string) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }

  /* Cart handlers */
  const handleAddToCart = (product: Product) => {
    setCartItems((items) => {
      const existing = items.find((i) => i.product.id === product.id)
      if (existing) {
        return items.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...items, { product, qty: 1, material: product.materials[0].name }]
    })
    addToast(`${product.name} added to cart`)
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems((items) => items.filter((i) => i.product.id !== id))
  }

  const handleQtyChange = (id: number, qty: number) => {
    setCartItems((items) =>
      items.map((i) => i.product.id === id ? { ...i, qty } : i)
    )
  }

  /* Wishlist handlers */
  const handleWishlist = (product: Product) => {
    setWishlist((wl) => {
      if (wl.includes(product.id)) {
        addToast(`${product.name} removed from wishlist`)
        return wl.filter((id) => id !== product.id)
      }
      addToast(`${product.name} saved to wishlist`)
      return [...wl, product.id]
    })
  }

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id))

  /* Checkout success */
  const handleCheckoutSuccess = () => {
    setCartItems([])
    addToast('Order placed! Thank you for shopping with LUMINA.')
  }

  /* Scroll to products */
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Loading screen */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {/* Global utilities */}
      <Cursor />
      <ScrollProgress />
      <BackToTop />

      {/* Nav */}
      <Navbar
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        wishlistCount={wishlist.length}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
      />

      {/* Main content */}
      <main>
        <Hero onShopClick={scrollToProducts} />
        <FeaturesSection />
        <ProductGrid
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          onQuickView={setQuickViewProduct}
          wishlist={wishlist}
        />
        <Testimonials />
        <RoomPlanner />
      </main>

      <Footer />

      {/* Overlays */}
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemoveFromCart}
        onQtyChange={handleQtyChange}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />

      <WishlistDrawer
        open={wishlistOpen}
        items={wishlistProducts}
        onClose={() => setWishlistOpen(false)}
        onRemove={(id) => setWishlist((wl) => wl.filter((x) => x !== id))}
        onAddToCart={handleAddToCart}
      />

      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          isWishlisted={wishlist.includes(quickViewProduct.id)}
        />
      )}

      <CheckoutModal
        open={checkoutOpen}
        items={cartItems}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </>
  )
}
