import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, Play, Star } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    headline: 'Where Craft\nMeets Comfort',
    sub: 'Handcrafted furniture for the modern home, made with sustainably sourced materials.',
    badge: 'New Collection 2025',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #3d2e1a 100%)',
  },
  {
    id: 2,
    headline: 'Timeless Design,\nModern Living',
    sub: 'Explore our curated dining collections — built to bring families together.',
    badge: 'Featured',
    bg: 'linear-gradient(135deg, #1c1410 0%, #2e2010 50%, #3d2c14 100%)',
  },
  {
    id: 3,
    headline: 'Rest in Pure\nLuxury',
    sub: 'Premium bedroom furniture designed for the sleep you deserve.',
    badge: 'Best Seller',
    bg: 'linear-gradient(135deg, #10141c 0%, #101e2e 50%, #141a28 100%)',
  },
]

export default function Hero({ onShopClick }: { onShopClick: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yBg    = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const yText   = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const springY = useSpring(yBg, { stiffness: 100, damping: 30 })

  const [slide, setSlide]       = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({
      x: (e.clientX / window.innerWidth  - 0.5) * 30,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const current = SLIDES[slide]

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
      aria-label="Hero section"
    >
      {/* Animated BG layer */}
      <motion.div
        key={`bg-${slide}`}
        className="absolute inset-0 scale-110"
        style={{ y: springY, background: current.bg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Gold orb */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c49a3a, transparent)', x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* White orb */}
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, white, transparent)', x: mousePos.x * -0.3, y: mousePos.y * -0.3 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Spinning ring */}
      <motion.div
        className="absolute top-16 right-16 w-20 h-20 rounded-full opacity-20 hidden lg:block border border-white/40 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60" />
      </motion.div>

      {/* Furniture card */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center pointer-events-none"
        style={{ x: mousePos.x * -1.2, y: mousePos.y * -0.8 }}
      >
        <motion.div
          key={slide}
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-[420px] h-[360px] rounded-3xl overflow-hidden bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex items-center justify-center"
        >
          <FurnitureSVG id={slide} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center px-8 lg:px-20 max-w-[1400px]"
        style={{ y: yText }}
      >
        {/* Badge */}
        <motion.div
          key={`badge-${slide}`}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-8 h-px bg-[#c49a3a]" aria-hidden="true" />
          <span className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#c49a3a]">
            {current.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          key={`h1-${slide}`}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-white mb-4 max-w-2xl lg:max-w-3xl font-semibold leading-[1.1] whitespace-pre-line"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem,6vw,5rem)' }}
        >
          {current.headline}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          key={`sub-${slide}`}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mb-10 leading-relaxed text-base font-light text-white/65"
        >
          {current.sub}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            onClick={onShopClick}
            className="relative inline-flex items-center gap-2.5 px-8 py-4 bg-[#2c2c2c] text-white text-[13px] font-medium tracking-widest uppercase rounded-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(44,44,44,0.3)] group"
            aria-label="Shop the collection"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8b6914] to-[#c49a3a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Shop Collection</span>
            <ArrowRight size={16} className="relative z-10" />
          </button>
          <button
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white text-[13px] font-medium tracking-widest uppercase border border-white/35 rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#2c2c2c] hover:-translate-y-0.5"
            aria-label="Watch our story"
          >
            <Play size={14} fill="currentColor" />
            Watch Our Story
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-10 mt-16"
        >
          {([['2,400+', 'Products', false], ['140+', 'Countries', false], ['4.9', 'Rating', true]] as [string, string, boolean][]).map(([val, label, star]) => (
            <div key={label}>
              <div className="text-white font-semibold text-xl flex items-center gap-1" style={{ fontFamily: 'var(--font-serif)' }}>
                {val}{star && <Star size={14} className="fill-[#c49a3a] text-[#c49a3a]" />}
              </div>
              <div className="text-[11px] uppercase tracking-widest mt-0.5 text-white/45">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-8 lg:left-20 flex items-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer p-0 ${i === slide ? 'w-7 bg-[#c49a3a]' : 'w-2 bg-white/35'}`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 right-8 lg:right-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        <span className="text-[10px] tracking-widest uppercase rotate-90 origin-center text-white/40 inline-block mt-1">Scroll</span>
      </motion.div>
    </motion.section>
  )
}

function FurnitureSVG({ id }: { id: number }) {
  const shapes = [
    <svg key="sofa" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-8">
      <rect x="20" y="110" width="280" height="60" rx="12" fill="rgba(196,154,58,0.15)" stroke="rgba(196,154,58,0.4)" strokeWidth="1.5"/>
      <rect x="10"  y="90"  width="60"  height="80" rx="10" fill="rgba(196,154,58,0.10)" stroke="rgba(196,154,58,0.3)" strokeWidth="1.5"/>
      <rect x="250" y="90"  width="60"  height="80" rx="10" fill="rgba(196,154,58,0.10)" stroke="rgba(196,154,58,0.3)" strokeWidth="1.5"/>
      <rect x="30"  y="60"  width="100" height="60" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <rect x="140" y="60"  width="100" height="60" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <rect x="50"  y="170" width="20"  height="20" rx="4" fill="rgba(196,154,58,0.3)"/>
      <rect x="250" y="170" width="20"  height="20" rx="4" fill="rgba(196,154,58,0.3)"/>
    </svg>,
    <svg key="table" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-8">
      <rect x="40"  y="90"  width="240" height="16" rx="8"  fill="rgba(196,154,58,0.2)"  stroke="rgba(196,154,58,0.5)" strokeWidth="1.5"/>
      <rect x="60"  y="106" width="12"  height="60" rx="4"  fill="rgba(255,255,255,0.12)"/>
      <rect x="248" y="106" width="12"  height="60" rx="4"  fill="rgba(255,255,255,0.12)"/>
      <ellipse cx="100" cy="70"  rx="30" ry="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <ellipse cx="220" cy="70"  rx="30" ry="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <ellipse cx="100" cy="155" rx="30" ry="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <ellipse cx="220" cy="155" rx="30" ry="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    </svg>,
    <svg key="bed" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-8">
      <rect x="20"  y="120" width="280" height="50" rx="8"  fill="rgba(196,154,58,0.12)" stroke="rgba(196,154,58,0.4)"  strokeWidth="1.5"/>
      <rect x="20"  y="80"  width="280" height="45" rx="8"  fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <rect x="20"  y="50"  width="60"  height="140" rx="6" fill="rgba(196,154,58,0.08)" stroke="rgba(196,154,58,0.25)" strokeWidth="1.5"/>
      <rect x="60"  y="95"  width="80"  height="30" rx="6"  fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="160" y="95"  width="80"  height="30" rx="6"  fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="30"  y="170" width="14"  height="16" rx="3"  fill="rgba(196,154,58,0.3)"/>
      <rect x="276" y="170" width="14"  height="16" rx="3"  fill="rgba(196,154,58,0.3)"/>
    </svg>,
  ]
  return shapes[id % shapes.length]
}
