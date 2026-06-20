import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react'
import Logo from './Logo'

interface NavbarProps {
  cartCount: number
  wishlistCount: number
  onCartOpen: () => void
  onWishlistOpen: () => void
  currentPage?: string
  onNavigate?: (page: string) => void
}

const NAV_LINKS = ['Collections', 'Rooms', 'New Arrivals', 'Sale', 'About']

export default function Navbar({ cartCount, wishlistCount, onCartOpen, onWishlistOpen, currentPage: _currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-[800] transition-all duration-500 ${
          scrolled
            ? 'bg-[#faf8f5]/85 backdrop-blur-xl border-b border-black/5 shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <motion.button whileHover={{ scale: 1.02 }} className="select-none" onClick={() => onNavigate?.('home')}>
            <Logo variant={scrolled ? 'dark' : 'light'} size="md" />
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => link === 'Collections' ? onNavigate?.('collections') : undefined}
                className={`nav-link transition-colors ${scrolled ? 'text-[#2c2c2c] hover:text-[#8b6914]' : 'text-white/85 hover:text-white'}`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${scrolled ? 'text-[#2c2c2c] hover:bg-[#f0ebe3]' : 'text-white hover:bg-white/10'}`}
              aria-label="Search"
            >
              <Search size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={onWishlistOpen}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${scrolled ? 'text-[#2c2c2c] hover:bg-[#f0ebe3]' : 'text-white hover:bg-white/10'}`}
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

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={onCartOpen}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all ${
                scrolled ? 'bg-[#2c2c2c]' : 'bg-white/15 border border-white/30 backdrop-blur-sm'
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

            <button
              className={`lg:hidden w-9 h-9 flex items-center justify-center ${scrolled ? 'text-[#2c2c2c]' : 'text-white'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
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
            <button className="absolute top-5 right-6 text-[#2c2c2c]" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="font-serif text-3xl font-medium text-left text-[#1a1a1a]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                  onClick={() => { setMobileOpen(false); link === 'Collections' && onNavigate?.('collections') }}
                >
                  {link}
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl flex items-center gap-4 px-6 py-4 shadow-2xl">
                <Search size={20} className="text-[#6b6b6b]" />
                <input autoFocus type="text" placeholder="Search for sofas, beds, dining tables…"
                  className="flex-1 bg-transparent outline-none text-lg font-sans text-[#1a1a1a]" />
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
