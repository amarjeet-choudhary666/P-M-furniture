import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react'
import Logo from './Logo'

interface NavbarProps {
  cartCount: number
  wishlistCount: number
  onCartOpen: () => void
  onWishlistOpen: () => void
}

// Map nav link labels to their routes
const NAV_LINKS: { label: string; path: string; highlight?: boolean }[] = [
  { label: 'Collections',  path: '/collections'  },
  { label: 'Rooms',        path: '/rooms'         },
  { label: 'New Arrivals', path: '/new-arrivals' },
  { label: 'Sale',         path: '/sale', highlight: true },
  { label: 'About',        path: '/about'        },
]

export default function Navbar({ cartCount, wishlistCount, onCartOpen, onWishlistOpen }: NavbarProps) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)

  // Reset scroll detection each time the route changes
  useEffect(() => {
    setScrolled(window.scrollY > 60)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isHeroPage = location.pathname === '/'
  const isLight    = isHeroPage && !scrolled  // white text over dark hero
  const isSolid    = scrolled || !isHeroPage  // opaque cream background

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-[800] transition-all duration-500 ${
          isSolid
            ? 'bg-[#faf8f5]/95 backdrop-blur-xl border-b border-black/8 shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">

          {/* Logo */}
          <motion.button whileHover={{ scale: 1.02 }} className="select-none" onClick={() => navigate('/')}>
            <Logo variant={isLight ? 'light' : 'dark'} size="md" />
          </motion.button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, path, highlight }) => {
              const isActive = location.pathname === path && path !== '/'
              const isSaleActive = highlight && location.pathname === '/sale'
              return (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`nav-link transition-colors ${
                    isSaleActive
                      ? '!text-[#B04A22] font-semibold'
                      : isLight
                        ? 'text-white/85 hover:text-white'
                        : 'text-[#2c2c2c] hover:text-[#8b6914]'
                  } ${isActive && !highlight ? '!text-[#8b6914]' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                  {highlight && !isSaleActive && (
                    <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ background: '#B04A22', color: '#fff', verticalAlign: 'middle' }}>
                      70% Off
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                isLight ? 'text-white hover:bg-white/10' : 'text-[#2c2c2c] hover:bg-[#f0ebe3]'
              }`}
              aria-label="Search"
            >
              <Search size={18} />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={onWishlistOpen}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                isLight ? 'text-white hover:bg-white/10' : 'text-[#2c2c2c] hover:bg-[#f0ebe3]'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white bg-[#8b6914]">
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={onCartOpen}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all ${
                isLight ? 'bg-white/15 border border-white/30 backdrop-blur-sm' : 'bg-[#2c2c2c]'
              }`}
              aria-label="Cart"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline text-xs tracking-wide">Cart</span>
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#8b6914]">
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              className={`lg:hidden w-9 h-9 flex items-center justify-center ${isLight ? 'text-white' : 'text-[#2c2c2c]'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[790] glass flex flex-col p-8 pt-24"
          >
            <button
              className="absolute top-5 right-6 text-[#2c2c2c]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu">
              <X size={24} />
            </button>
            <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ label, path, highlight }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="font-serif text-3xl font-medium text-left flex items-center gap-3"
                  style={{ fontFamily: 'var(--font-serif)', color: highlight ? '#B04A22' : '#1a1a1a' }}
                  onClick={() => navigate(path)}
                >
                  {label}
                  {highlight && (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: '#B04A22', color: '#fff', verticalAlign: 'middle' }}>
                      Sale
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[850] flex items-start justify-center pt-24 px-4 bg-[#1a1a1a]/60 backdrop-blur-lg"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="glass rounded-2xl flex items-center gap-4 px-6 py-4 shadow-2xl">
                <Search size={20} className="text-[#6b6b6b]" />
                <input
                  autoFocus type="text"
                  placeholder="Search for sofas, beds, dining tables…"
                  aria-label="Search"
                  className="flex-1 bg-transparent outline-none text-lg font-sans text-[#1a1a1a]"
                />
                <button onClick={() => setSearchOpen(false)} className="text-[#6b6b6b]" aria-label="Close search">
                  <X size={18} />
                </button>
              </div>
              <p className="text-center text-sm mt-4 text-white/50">
                Popular: Sofa, Dining Table, Bed Frame, Armchair
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
