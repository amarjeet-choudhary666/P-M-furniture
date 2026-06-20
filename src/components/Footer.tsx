import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react'
import Logo from './Logo'

// Social icon SVGs (lucide-react v0.x doesn't export Instagram/Twitter/Youtube by those names)
const Instagram = ({ size = 15 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
)
const TwitterX = ({ size = 15 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const Youtube = ({ size = 15 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
)

const LINKS = {
  'Collections': ['Sofas & Seating', 'Beds & Bedroom', 'Dining & Kitchen', 'Home Office', 'Décor & Lighting', 'New Arrivals'],
  'Company':     ['Our Story', 'Sustainability', 'Careers', 'Press', 'Wholesale', 'Affiliates'],
  'Support':     ['FAQ', 'Shipping Info', 'Returns', 'Track Order', 'Care Guide', 'Contact Us'],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-dark)' }}>
      {/* Newsletter strip */}
      <div className="relative overflow-hidden" style={{ background: 'var(--color-charcoal)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, #8b6914, transparent 70%)' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
              First to know, first to love
            </h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Subscribe for new arrivals, exclusive offers, and interior inspiration.
            </p>
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 lg:w-72 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white flex-shrink-0"
              style={{ background: 'var(--color-wood)' }}
            >
              Subscribe
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <Logo variant="light" size="md" />
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Premium furniture crafted by master artisans for those who believe their home
              is the most important place in the world.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: TwitterX,  label: 'Twitter/X' },
                { Icon: Youtube,   label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
                  aria-label={label}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-5 text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="border-t pt-8 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          {[
            { Icon: MapPin, text: '45 Design District, New York, NY 10014' },
            { Icon: Mail,   text: 'hello@pmcraft.com' },
            { Icon: Phone,  text: '+1 (800) 586-4621' },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon size={14} style={{ color: 'var(--color-wood)', flexShrink: 0 }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2025 P&M Craft. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map((t) => (
              <a key={t} href="#" className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
