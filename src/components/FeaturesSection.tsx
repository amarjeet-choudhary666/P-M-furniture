import { motion } from 'framer-motion'
import { Leaf, Shield, Truck, RotateCcw, Hammer, Star, type LucideIcon } from 'lucide-react'

const FEATURES = [
  { icon: Leaf,     title: 'Sustainably Sourced',   desc: 'Every piece is crafted from FSC-certified wood and recycled materials, carbon-offset delivery included.',             color: '#5a9a5a', bg: '#f0f7f0' },
  { icon: Hammer,   title: 'Master Craftsmanship',  desc: 'Our furniture is hand-finished by artisans with 20+ years experience in traditional joinery.',                     color: '#8b6914', bg: '#fdf6e8' },
  { icon: Shield,   title: '10-Year Warranty',       desc: 'Every structural component is backed by a decade-long guarantee — no questions asked.',                            color: '#5a80c8', bg: '#f0f2fc' },
  { icon: Truck,    title: 'White Glove Delivery',   desc: 'Our delivery team assembles your furniture in-room, removes packaging, and cleans up after.',                     color: '#9a5aaa', bg: '#f7f0fc' },
  { icon: RotateCcw,title: '30-Day Free Returns',    desc: "Not in love? We'll pick it up for free and refund you within 3 business days.",                                   color: '#c4605a', bg: '#fdf0f0' },
  { icon: Star,     title: '4.9 Rated',               desc: 'Over 50,000 happy customers and a 4.9-star average across 12,000+ verified reviews.',                             color: '#c49a3a', bg: '#fdf8ec' },
]

const STATS: { value: string; label: string; icon?: LucideIcon }[] = [
  { value: '50K+',   label: 'Happy Customers' },
  { value: '2,400+', label: 'Products' },
  { value: '10yr',   label: 'Warranty' },
  { value: '4.9',    label: 'Average Rating', icon: Star },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#f0ebe3]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Heading */}
        <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}
          className="text-center mb-16">
          <span className="section-label mb-4">Why P&M Craft</span>
          <h2 className="max-w-2xl mx-auto font-semibold leading-tight text-[#1a1a1a]"
            style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(2rem,5vw,3.6rem)' }}>
            Every Detail,<br /><span className="gradient-text">Considered</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed text-[#6b6b6b]">
            We believe great furniture should last a lifetime. That's why every P&M Craft piece
            is built with obsessive attention to quality, sustainability, and design.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div key={feat.title}
                initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
                transition={{ duration:0.7, delay:i*0.08 }}
                whileHover={{ y:-6 }}
                className="rounded-2xl p-7 bg-white shadow-[0_2px_12px_rgba(44,44,44,0.08)] cursor-default"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: feat.bg }}>
                  <Icon size={22} style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#1a1a1a]" style={{ fontFamily:'var(--font-serif)' }}>
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6b6b6b]">{feat.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Banner */}
        <motion.div initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          transition={{ duration:0.8 }}
          className="rounded-3xl overflow-hidden relative bg-[#1a1a1a]"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 70% 50%, #8b6914 0%, transparent 65%)' }} />
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.1 }}
                className={`flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center border-white/[0.08] ${
                  [
                    'border-r border-b lg:border-b-0',
                    'border-b border-white/[0.08] lg:border-b-0 lg:border-r',
                    'border-r',
                    '',
                  ][i]
                }`}
              >
                <span className="text-3xl sm:text-4xl font-semibold text-white mb-2 flex items-center gap-1.5" style={{ fontFamily:'var(--font-serif)' }}>
                  {stat.value}
                  {stat.icon && <stat.icon size={22} className="fill-[#c49a3a] text-[#c49a3a]" />}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-white/45">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
