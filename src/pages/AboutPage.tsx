import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Leaf, Award, Truck, RotateCcw, HeartHandshake,
  Recycle, Package, Wind, TreePine, Star, Quote,
  Hammer, Palette, Search, CheckSquare, MapPin,
} from 'lucide-react'

// ── ease tuple ────────────────────────────────────────────────────
const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

// ── reveal hook ──────────────────────────────────────────────────
function useReveal(amount = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount })
  return { ref, inView }
}

// ── fade-up variant ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
  }),
}

// ── Static data ───────────────────────────────────────────────────
const TIMELINE = [
  { year: '2009', title: 'Founded in Brooklyn', desc: 'A small workshop with a big vision: furniture that lasts a lifetime.' },
  { year: '2013', title: 'First Flagship Store', desc: 'Opened our Manhattan showroom, bringing the studio experience to customers.' },
  { year: '2017', title: 'Sustainability Pledge', desc: 'Committed to 100% FSC-certified wood and carbon-neutral shipping.' },
  { year: '2020', title: 'Global Expansion', desc: 'Launched shipping to 40+ countries and opened our London atelier.' },
  { year: '2024', title: 'P&M Craft Online', desc: 'Digital-first flagship with AR room planning and White Glove delivery.' },
]

const PHILOSOPHY = [
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    desc: 'Every joint, surface, and finish is inspected by hand before it leaves our workshop. We hold ourselves to standards most factories abandoned decades ago.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Sourcing',
    desc: 'All wood is FSC-certified. Our textiles meet OEKO-TEX® Standard 100. We audit every supplier against our ethical sourcing charter annually.',
  },
  {
    icon: Palette,
    title: 'Timeless Design',
    desc: 'We reject fast-furniture trends. Our pieces are designed with restraint — proportions and materials that remain beautiful for decades.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer-First Always',
    desc: 'From the first browse to the final delivery, every touchpoint is designed around making you feel at home — long before the furniture arrives.',
  },
]

const TEAM = [
  {
    name: 'Eleanor Ashford',
    role: 'Founder & Creative Director',
    initials: 'EA',
    color: '#8b6914',
    bio: 'Former architect turned furniture designer, Eleanor founded P&M Craft with a conviction that everyday objects deserve the same care as great buildings.',
  },
  {
    name: 'Marcus Webb',
    role: 'Head of Design',
    initials: 'MW',
    color: '#5a80c8',
    bio: 'With 15 years at leading Scandinavian studios, Marcus brings a rigorous yet warm approach to every collection he leads.',
  },
  {
    name: 'Priya Nair',
    role: 'Chief Sustainability Officer',
    initials: 'PN',
    color: '#5a9a6a',
    bio: 'Priya has spent her career pushing manufacturers toward responsible practices. At P&M Craft she turns those convictions into concrete commitments.',
  },
  {
    name: 'James Okafor',
    role: 'Head of Production',
    initials: 'JO',
    color: '#c4605a',
    bio: 'A master craftsman who trained under furniture makers in Portugal and Japan, James oversees every manufacturing partnership we hold.',
  },
]

const PROCESS = [
  { Icon: Palette,     step: '01', title: 'Design',             desc: 'Sketched by hand, refined in 3-D. Every piece starts with weeks of iteration.' },
  { Icon: Search,      step: '02', title: 'Material Selection', desc: 'Only the finest certified hardwoods, top-grain leathers, and woven textiles.' },
  { Icon: Hammer,      step: '03', title: 'Manufacturing',      desc: 'Produced in partner workshops we visit in person every quarter.' },
  { Icon: CheckSquare, step: '04', title: 'Quality Inspection', desc: '47-point quality check before any piece is approved for shipment.' },
  { Icon: Truck,       step: '05', title: 'White Glove Delivery', desc: 'Specialist two-person teams place and assemble furniture in your home.' },
]

const SUSTAINABILITY = [
  { Icon: TreePine, title: 'FSC-Certified Wood',       desc: 'Every wood product traces back to responsibly managed forests.' },
  { Icon: Recycle,  title: 'Closed-Loop Packaging',    desc: '100% recyclable or biodegradable packaging across all orders.' },
  { Icon: Wind,     title: 'Carbon-Neutral Shipping',  desc: 'All deliveries are offset through verified reforestation projects.' },
  { Icon: Package,  title: 'Zero-Waste Production',    desc: 'Off-cuts are repurposed into smaller goods or donated to local workshops.' },
]

const WHY_US = [
  { Icon: Award,        title: 'Premium Materials',          desc: 'Hand-selected hardwoods, top-grain leathers, and certified fabrics.' },
  { Icon: Hammer,       title: 'Expert Craftsmanship',        desc: 'Artisans with 10-30 years of experience in every partner workshop.' },
  { Icon: Truck,        title: 'White Glove Delivery',        desc: 'Two-person specialist teams deliver and assemble in your home.' },
  { Icon: RotateCcw,    title: '30-Day Easy Returns',         desc: 'Changed your mind? We collect and refund — no questions asked.' },
  { Icon: HeartHandshake, title: 'Dedicated Support',         desc: 'Real humans, fast replies. Rated 4.9 / 5 across 12 000+ reviews.' },
]

const TESTIMONIALS = [
  { initials: 'SA', color: '#c49a3a', name: 'Sofia Andersen',  loc: 'Copenhagen, DK', rating: 5, text: 'The Oslo Sofa arrived in perfect condition and looks even better in person. The craftsmanship detail is extraordinary — I genuinely feel I bought something that will last my lifetime.' },
  { initials: 'TR', color: '#5a80c8', name: 'Tomás Reyes',    loc: 'Barcelona, ES',  rating: 5, text: 'Ordered the Atelier dining set for our open-plan kitchen. The delivery team was professional, assembly was seamless, and the quality surpassed anything I\'ve had from other brands.' },
  { initials: 'LC', color: '#5a9a6a', name: 'Lena Christoph',  loc: 'Berlin, DE',     rating: 5, text: 'P&M Craft is the rare brand that lives up to its own photography. My home looks like a magazine shoot now, and guests ask about the furniture constantly.' },
]

const STATS = [
  { value: '15+', label: 'Years of Experience' },
  { value: '42K', label: 'Pieces Crafted' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '60+', label: 'Cities Served' },
]

// ── HeroSVG — decorative furniture silhouette ─────────────────────
function HeroIllustration() {
  return (
    <svg viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* background gradient */}
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="900" y2="600" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8ddd0" />
          <stop offset="100%" stopColor="#d4c4b0" />
        </linearGradient>
        <linearGradient id="sofa" x1="150" y1="300" x2="750" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c8b89a" />
          <stop offset="100%" stopColor="#a89278" />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#ede5d8" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#00000022" />
        </filter>
      </defs>
      <rect width="900" height="600" fill="url(#bg)" />
      {/* wall */}
      <rect x="0" y="0" width="900" height="360" fill="url(#wall)" />
      {/* floor */}
      <rect x="0" y="360" width="900" height="240" fill="#d4c0a8" />
      {/* baseboard */}
      <rect x="0" y="355" width="900" height="8" fill="#c4b098" />
      {/* large art piece on wall */}
      <rect x="320" y="50" width="260" height="200" rx="4" fill="#c8baa8" />
      <rect x="332" y="62" width="236" height="176" rx="2" fill="#d8cec0" />
      <ellipse cx="450" cy="150" rx="60" ry="45" fill="#b8a890" opacity="0.5" />
      {/* sofa */}
      <g filter="url(#shadow)">
        {/* sofa base */}
        <rect x="130" y="300" width="560" height="100" rx="12" fill="url(#sofa)" />
        {/* sofa back */}
        <rect x="130" y="240" width="560" height="75" rx="12" fill="#bba882" />
        {/* cushions */}
        <rect x="150" y="255" width="170" height="60" rx="8" fill="#c8b48e" />
        <rect x="335" y="255" width="170" height="60" rx="8" fill="#c8b48e" />
        <rect x="520" y="255" width="150" height="60" rx="8" fill="#c8b48e" />
        {/* seat cushions */}
        <rect x="148" y="308" width="172" height="58" rx="6" fill="#c4ae86" />
        <rect x="334" y="308" width="172" height="58" rx="6" fill="#c4ae86" />
        <rect x="520" y="308" width="152" height="58" rx="6" fill="#c4ae86" />
        {/* legs */}
        <rect x="155" y="390" width="18" height="28" rx="4" fill="#8a7050" />
        <rect x="660" y="390" width="18" height="28" rx="4" fill="#8a7050" />
        {/* armrests */}
        <rect x="130" y="255" width="40" height="145" rx="10" fill="#b89e78" />
        <rect x="650" y="255" width="40" height="145" rx="10" fill="#b89e78" />
      </g>
      {/* side table left */}
      <rect x="55" y="340" width="90" height="12" rx="4" fill="#a08868" />
      <rect x="92" y="352" width="16" height="60" rx="3" fill="#907858" />
      {/* lamp on table */}
      <rect x="86" y="290" width="28" height="50" rx="2" fill="#b0a090" />
      <ellipse cx="100" cy="288" rx="32" ry="18" fill="#d8cfc0" />
      {/* plant right */}
      <rect x="778" y="350" width="20" height="45" rx="3" fill="#9a8878" />
      <ellipse cx="788" cy="330" rx="28" ry="38" fill="#7a9a6a" />
      <ellipse cx="770" cy="318" rx="18" ry="26" fill="#6a8a5a" />
      <ellipse cx="808" cy="322" rx="18" ry="24" fill="#7aaa6a" />
      {/* rug */}
      <ellipse cx="450" cy="430" rx="250" ry="40" fill="#c4b498" opacity="0.45" />
      {/* pillow on sofa */}
      <rect x="478" y="265" width="80" height="50" rx="8" fill="#d4c8b0" />
      <rect x="490" y="277" width="56" height="26" rx="4" fill="#c8bca4" />
      {/* coffee table */}
      <g filter="url(#shadow)">
        <rect x="270" y="410" width="280" height="10" rx="4" fill="#a08060" />
        <rect x="296" y="420" width="14" height="40" rx="3" fill="#907050" />
        <rect x="520" y="420" width="14" height="40" rx="3" fill="#907050" />
        <rect x="270" y="455" width="280" height="6" rx="3" fill="#9a7858" />
      </g>
    </svg>
  )
}

// ── Person avatar ─────────────────────────────────────────────────
function Avatar({ initials, color, size = 80 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontFamily: 'var(--font-sans)', fontSize: size * 0.28 }}>
      {initials}
    </div>
  )
}

// ── Stars ─────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} className={i < n ? 'fill-[#c49a3a] text-[#c49a3a]' : 'fill-[#e8ddd0] text-[#e8ddd0]'} />
      ))}
    </span>
  )
}

// ── Workshop gallery SVG tiles ────────────────────────────────────
const GALLERY_TILES = [
  { bg: '#e0d4c4', label: 'Workshop floor' },
  { bg: '#d4c8b0', label: 'Wood selection' },
  { bg: '#ccc0aa', label: 'Hand finishing' },
  { bg: '#d8cebb', label: 'Upholstery' },
  { bg: '#c8bca8', label: 'Quality check' },
  { bg: '#ddd0bc', label: 'Showroom floor' },
]

function GalleryTile({ bg, label, delay }: { bg: string; label: string; delay: number }) {
  const { ref, inView } = useReveal(0.1)
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} custom={delay}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className="relative overflow-hidden rounded-2xl aspect-square group cursor-pointer"
      style={{ background: bg }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* minimal SVG furniture icon */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-30">
        <rect x="40" y="110" width="120" height="50" rx="8" fill="#8a7050" />
        <rect x="40" y="85" width="120" height="35" rx="8" fill="#a08060" />
        <rect x="40" y="92" width="35" height="28" rx="5" fill="#b09070" />
        <rect x="83" y="92" width="35" height="28" rx="5" fill="#b09070" />
        <rect x="126" y="92" width="34" height="28" rx="5" fill="#b09070" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <span className="text-white text-sm font-medium" style={{ fontFamily: 'var(--font-sans)' }}>{label}</span>
      </div>
    </motion.div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`py-24 px-6 lg:px-10 ${className}`}>{children}</section>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="section-label mb-3 block">{children}</span>
}

function SectionHeading({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className={`text-4xl lg:text-5xl font-medium leading-tight mb-5 ${light ? 'text-white' : 'text-[#1a1a1a]'}`}
      style={{ fontFamily: 'var(--font-serif)' }}>
      {children}
    </h2>
  )
}

// ═══════════════════════════════════════════════════════════════════
export default function AboutPage() {
  const navigate = useNavigate()

  // hero parallax
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <div className="bg-[#faf8f5]">

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <HeroIllustration />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/70 via-[#1a1a1a]/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-2xl"
          >
            <SectionLabel>
              <span className="text-[#c49a3a]">Our Story</span>
            </SectionLabel>
            <h1
              className="text-5xl lg:text-7xl font-medium text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}>
              Crafting Spaces<br />
              <span className="italic text-[#c49a3a]">That Feel Like Home</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl">
              Timeless furniture designed for comfort, beauty, and everyday living. Every piece is a quiet promise — to be with you for decades.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/collections')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-[#1a1a1a] bg-[#c49a3a] hover:bg-[#d4aa4a] transition-colors"
              >
                Shop Collections <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                Our Story
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: 'var(--font-sans)' }}>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ── 2. OUR STORY ─────────────────────────────────────────── */}
      <Section id="story" className="bg-[#faf8f5] max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* text */}
          <StoryText />
          {/* timeline */}
          <TimelineColumn />
        </div>
      </Section>

      {/* ── 3. PHILOSOPHY ────────────────────────────────────────── */}
      <Section className="bg-[#f0ebe3]">
        <div className="max-w-[1400px] mx-auto">
          <PhilosophySection />
        </div>
      </Section>

      {/* ── 4. MEET THE TEAM ─────────────────────────────────────── */}
      <Section className="bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto">
          <TeamSection />
        </div>
      </Section>

      {/* ── 5. CRAFTSMANSHIP PROCESS ─────────────────────────────── */}
      <Section className="bg-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto">
          <ProcessSection />
        </div>
      </Section>

      {/* ── 6. SUSTAINABILITY ────────────────────────────────────── */}
      <Section className="bg-[#f0ebe3]">
        <div className="max-w-[1400px] mx-auto">
          <SustainabilitySection />
        </div>
      </Section>

      {/* ── 7. WHY CHOOSE US ─────────────────────────────────────── */}
      <Section className="bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto">
          <WhyUsSection />
        </div>
      </Section>

      {/* ── 8. TESTIMONIALS ──────────────────────────────────────── */}
      <Section className="bg-[#2c2c2c]">
        <div className="max-w-[1400px] mx-auto">
          <TestimonialsSection />
        </div>
      </Section>

      {/* ── 9. SHOWROOM GALLERY ──────────────────────────────────── */}
      <Section className="bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto">
          <GallerySection />
        </div>
      </Section>

      {/* ── 10. STATS ────────────────────────────────────────────── */}
      <StatsSection />

      {/* ── 11. CTA ──────────────────────────────────────────────── */}
      <CtaSection navigate={navigate} />

    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Sub-sections (keep AboutPage body short)
// ═══════════════════════════════════════════════════════════════════

function StoryText() {
  const { ref, inView } = useReveal()
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
      <SectionLabel>Who We Are</SectionLabel>
      <SectionHeading>A Workshop Born from a Love of Real Materials</SectionHeading>
      <div className="space-y-5 text-[#6b6b6b] leading-relaxed text-[15px]" style={{ fontFamily: 'var(--font-sans)' }}>
        <p>
          P&M Craft began in a 400-square-foot Brooklyn workshop in 2009. Our founder, Eleanor Ashford, had spent a decade as an architect, growing frustrated that the furniture industry had traded longevity for trend cycles. She started building pieces for herself — and soon for friends, then strangers.
        </p>
        <p>
          Fifteen years on, we employ over 120 craftspeople across our New York studio and partner workshops in Portugal and Japan. The materials are different — better — but the conviction is unchanged: furniture should be honest about what it is made of and designed to outlast every trend.
        </p>
        <p>
          <strong className="text-[#2c2c2c] font-semibold">Our mission</strong> is to make genuinely durable, beautiful furniture accessible without compromising on materials, craft, or ethics. Our vision is a world where people buy fewer, better things.
        </p>
      </div>
    </motion.div>
  )
}

function TimelineColumn() {
  const { ref, inView } = useReveal(0.1)
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="relative pl-6 border-l-2 border-[#e8ddd0] space-y-10">
      {TIMELINE.map(({ year, title, desc }, i) => (
        <motion.div key={year}
          variants={fadeUp} custom={i * 0.5}
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* dot */}
          <div className="absolute -left-[29px] w-4 h-4 rounded-full border-2 border-[#8b6914] bg-[#faf8f5] top-1" />
          <span className="section-label mb-1">{year}</span>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
          <p className="text-[#6b6b6b] text-sm leading-relaxed">{desc}</p>
        </motion.div>
      ))}
    </div>
  )
}

function PhilosophySection() {
  const { ref, inView } = useReveal()
  return (
    <>
      <motion.div ref={ref as React.RefObject<HTMLDivElement>}
        variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-center mb-14">
        <SectionLabel>Our Beliefs</SectionLabel>
        <SectionHeading>Design Guided by Principle</SectionHeading>
        <p className="text-[#6b6b6b] max-w-xl mx-auto text-[15px] leading-relaxed">
          Four convictions underpin every material we source, every joint we cut, and every customer conversation we have.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PHILOSOPHY.map(({ icon: Icon, title, desc }, i) => (
          <PhilosophyCard key={title} Icon={Icon} title={title} desc={desc} delay={i} />
        ))}
      </div>
    </>
  )
}

function PhilosophyCard({ Icon, title, desc, delay }: { Icon: React.ComponentType<{ size?: number; className?: string }>; title: string; desc: string; delay: number }) {
  const { ref, inView } = useReveal(0.1)
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} custom={delay * 0.3}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -4 }}
      className="bg-[#faf8f5] rounded-2xl p-7 border border-[#e8ddd0] transition-shadow hover:shadow-lg"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#f0ebe3]">
        <Icon size={22} className="text-[#8b6914]" />
      </div>
      <h3 className="text-base font-semibold text-[#1a1a1a] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
      <p className="text-[#6b6b6b] text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function TeamSection() {
  const { ref, inView } = useReveal()
  return (
    <>
      <motion.div ref={ref as React.RefObject<HTMLDivElement>}
        variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-center mb-14">
        <SectionLabel>The People</SectionLabel>
        <SectionHeading>Meet the Team Behind P&M Craft</SectionHeading>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {TEAM.map((member, i) => <TeamCard key={member.name} {...member} delay={i} />)}
      </div>
    </>
  )
}

function TeamCard({ name, role, initials, color, bio, delay }: typeof TEAM[0] & { delay: number }) {
  const { ref, inView } = useReveal(0.1)
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} custom={delay * 0.25}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#f0ebe3] shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* photo placeholder */}
      <div className="h-52 relative overflow-hidden flex items-center justify-center" style={{ background: `${color}18` }}>
        <Avatar initials={initials} color={color} size={96} />
        {/* subtle pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 300 200">
          {Array.from({ length: 6 }, (_, r) => Array.from({ length: 8 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={c * 45 + 15} cy={r * 40 + 15} r="3" fill={color} />
          )))}
        </svg>
      </div>
      <div className="p-6">
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-0.5" style={{ fontFamily: 'var(--font-serif)' }}>{name}</h3>
        <p className="section-label mb-3">{role}</p>
        <p className="text-[#6b6b6b] text-sm leading-relaxed">{bio}</p>
      </div>
    </motion.div>
  )
}

function ProcessSection() {
  const { ref, inView } = useReveal()
  return (
    <>
      <motion.div ref={ref as React.RefObject<HTMLDivElement>}
        variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-center mb-16">
        <SectionLabel><span className="text-[#c49a3a]">How It's Made</span></SectionLabel>
        <SectionHeading light>From Sketch to Your Door</SectionHeading>
        <p className="text-white/55 max-w-xl mx-auto text-[15px] leading-relaxed">
          Every piece travels a deliberate path. Here is ours.
        </p>
      </motion.div>

      {/* desktop: horizontal, mobile: vertical */}
      <div className="relative">
        {/* connector line — desktop only */}
        <div className="hidden lg:block absolute top-10 left-[calc(10%+28px)] right-[calc(10%+28px)] h-px bg-gradient-to-r from-transparent via-[#8b6914]/40 to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {PROCESS.map(({ Icon, step, title, desc }, i) => (
            <ProcessStep key={step} Icon={Icon} step={step} title={title} desc={desc} delay={i} />
          ))}
        </div>
      </div>
    </>
  )
}

function ProcessStep({ Icon, step, title, desc, delay }: typeof PROCESS[0] & { delay: number }) {
  const { ref, inView } = useReveal(0.1)
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} custom={delay * 0.2}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className="flex flex-col items-center text-center gap-4"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full flex items-center justify-center border border-[#8b6914]/40 bg-[#8b6914]/10">
          <Icon size={22} className="text-[#c49a3a]" />
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#8b6914] text-white text-[9px] font-bold flex items-center justify-center" style={{ fontFamily: 'var(--font-sans)' }}>{step}</span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>{title}</h3>
        <p className="text-white/45 text-[13px] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

function SustainabilitySection() {
  const { ref, inView } = useReveal()
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* left: text */}
      <motion.div ref={ref as React.RefObject<HTMLDivElement>}
        variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <SectionLabel>Environment</SectionLabel>
        <SectionHeading>We Take Our Responsibility Seriously</SectionHeading>
        <p className="text-[#6b6b6b] text-[15px] leading-relaxed mb-10">
          Sustainability isn't a marketing statement for us — it's built into our supplier contracts, production methods, and packaging specs. We publish our carbon footprint annually and third-party-verify every claim.
        </p>
        <div className="space-y-5">
          {SUSTAINABILITY.map(({ Icon, title, desc }, i) => (
            <motion.div key={title}
              variants={fadeUp} custom={i * 0.2}
              initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0e8] flex-shrink-0">
                <Icon size={18} className="text-[#4a8a4a]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1a1a1a] mb-0.5">{title}</h4>
                <p className="text-[#6b6b6b] text-[13px] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* right: visual */}
      <SustainabilityVisual />
    </div>
  )
}

function SustainabilityVisual() {
  const { ref, inView } = useReveal(0.1)
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} custom={0.3}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className="relative rounded-3xl overflow-hidden aspect-square bg-gradient-to-br from-[#d4e4d4] to-[#b8d0b8] flex items-center justify-center"
    >
      <svg viewBox="0 0 400 400" className="w-4/5 h-4/5" fill="none">
        {/* central leaf */}
        <circle cx="200" cy="200" r="120" fill="#a8c8a8" opacity="0.3" />
        <circle cx="200" cy="200" r="80" fill="#8ab88a" opacity="0.3" />
        {/* tree */}
        <rect x="192" y="230" width="16" height="80" rx="4" fill="#7a6050" />
        <ellipse cx="200" cy="195" rx="60" ry="75" fill="#5a9a5a" />
        <ellipse cx="170" cy="210" rx="40" ry="50" fill="#4a8a4a" />
        <ellipse cx="230" cy="215" rx="42" ry="52" fill="#6aaa5a" />
        {/* leaves scattered */}
        {[
          [80, 120], [310, 100], [340, 280], [60, 300], [150, 330], [260, 340],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="18" ry="24"
            fill="#5a9a5a" opacity="0.5"
            transform={`rotate(${i * 35} ${x} ${y})`} />
        ))}
        {/* ring label */}
        <circle cx="200" cy="200" r="155" stroke="#4a8a4a" strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
      </svg>
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[#2a5a2a] text-sm font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Carbon Neutral Since 2021</p>
      </div>
    </motion.div>
  )
}

function WhyUsSection() {
  const { ref, inView } = useReveal()
  return (
    <>
      <motion.div ref={ref as React.RefObject<HTMLDivElement>}
        variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-center mb-14">
        <SectionLabel>Why P&M Craft</SectionLabel>
        <SectionHeading>Everything You Deserve, Nothing You Don't</SectionHeading>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {WHY_US.map(({ Icon, title, desc }, i) => (
          <WhyCard key={title} Icon={Icon} title={title} desc={desc} delay={i} />
        ))}
      </div>
    </>
  )
}

function WhyCard({ Icon, title, desc, delay }: typeof WHY_US[0] & { delay: number }) {
  const { ref, inView } = useReveal(0.1)
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} custom={delay * 0.15}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -4 }}
      className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-[#f0ebe3] border border-[#e8ddd0] hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#8b6914]/10">
        <Icon size={20} className="text-[#8b6914]" />
      </div>
      <h3 className="text-sm font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
      <p className="text-[#6b6b6b] text-[12px] leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function TestimonialsSection() {
  const { ref, inView } = useReveal()
  return (
    <>
      <motion.div ref={ref as React.RefObject<HTMLDivElement>}
        variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-center mb-14">
        <SectionLabel><span className="text-[#c49a3a]">Customer Stories</span></SectionLabel>
        <SectionHeading light>Homes Transformed</SectionHeading>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} {...t} delay={i} />)}
      </div>
    </>
  )
}

function TestimonialCard({ initials, color, name, loc, rating, text, delay }: typeof TESTIMONIALS[0] & { delay: number }) {
  const { ref, inView } = useReveal(0.1)
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>}
      variants={fadeUp} custom={delay * 0.2}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className="glass-dark rounded-2xl p-7 flex flex-col gap-5"
    >
      <Quote size={20} className="text-[#c49a3a] opacity-60" />
      <p className="text-white/75 text-[14px] leading-relaxed flex-1 italic">{text}</p>
      <div className="flex items-center gap-3">
        <Avatar initials={initials} color={color} size={42} />
        <div>
          <p className="text-white text-sm font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>{name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Stars n={rating} />
            <span className="text-white/35 text-[11px] flex items-center gap-1"><MapPin size={10} />{loc}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function GallerySection() {
  const { ref, inView } = useReveal()
  return (
    <>
      <motion.div ref={ref as React.RefObject<HTMLDivElement>}
        variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-center mb-14">
        <SectionLabel>Behind the Scenes</SectionLabel>
        <SectionHeading>Our Workshop & Showroom</SectionHeading>
        <p className="text-[#6b6b6b] max-w-lg mx-auto text-[15px] leading-relaxed">
          Peek inside the spaces where your furniture is conceived, crafted, and curated.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_TILES.map((tile, i) => (
          <GalleryTile key={tile.label} bg={tile.bg} label={tile.label} delay={i * 0.15} />
        ))}
      </div>
    </>
  )
}

function StatsSection() {
  const { ref, inView } = useReveal()
  return (
    <section className="py-20 bg-gradient-to-br from-[#1a1a1a] to-[#2c2c2c]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div ref={ref as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }, i) => (
            <motion.div key={label}
              variants={fadeUp} custom={i * 0.2}
              initial="hidden" animate={inView ? 'visible' : 'hidden'}
            >
              <p className="text-3xl sm:text-5xl lg:text-6xl font-medium gradient-text mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{value}</p>
              <p className="text-white/50 text-sm uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-sans)' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection({ navigate }: { navigate: (path: string) => void }) {
  const { ref, inView } = useReveal()
  return (
    <section className="relative py-32 px-6 lg:px-10 overflow-hidden bg-[#f0ebe3]">
      {/* subtle decorative rings */}
      <div className="absolute -right-32 -top-32 w-[600px] h-[600px] rounded-full border border-[#8b6914]/10" />
      <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full border border-[#8b6914]/10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div ref={ref as React.RefObject<HTMLDivElement>}
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="max-w-2xl"
        >
          <SectionLabel>Ready to Begin?</SectionLabel>
          <h2 className="text-5xl lg:text-6xl font-medium text-[#1a1a1a] leading-tight mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Transform Your<br /><span className="gradient-text italic">Home Today</span>
          </h2>
          <p className="text-[#6b6b6b] text-[15px] leading-relaxed mb-10 max-w-lg">
            Browse our full collection or get in touch with our design advisors for a complimentary home consultation.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/collections')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#1a1a1a] hover:bg-[#2c2c2c] transition-colors"
            >
              Shop Collection <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-[#1a1a1a] border border-[#2c2c2c]/30 hover:bg-[#e8ddd0] transition-colors"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
