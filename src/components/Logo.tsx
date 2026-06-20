import { motion } from 'framer-motion'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const SIZE = {
  sm: { pmSize: '1.15rem',  craftSize: '0.52rem', lineW: '18px', gap: '6px'  },
  md: { pmSize: '1.55rem',  craftSize: '0.6rem',  lineW: '22px', gap: '8px'  },
  lg: { pmSize: '2.8rem',   craftSize: '0.78rem', lineW: '34px', gap: '12px' },
}

export default function Logo({ variant = 'dark', size = 'md', animated = false }: LogoProps) {
  const s     = SIZE[size]
  const dark  = variant === 'dark'
  const gold  = dark ? '#8b6914' : '#c49a3a'
  const pmCol = dark ? '#1a1a1a' : '#ffffff'
  const crCol = dark ? '#6b6b6b' : 'rgba(255,255,255,0.55)'

  const content = (
    <div className="flex items-center select-none cursor-pointer" style={{ gap: s.gap }}>

      {/* P&M — serif bold, & rendered italic for elegance */}
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: s.pmSize, fontWeight: 700, color: pmCol, letterSpacing: '0.04em', lineHeight: 1 }}>
        P<span style={{ fontStyle: 'italic', fontWeight: 600 }}>&amp;</span>M
      </span>

      {/* Gold rule + CRAFT stacked */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
        <div style={{ height: '1.5px', width: s.lineW, background: gold, borderRadius: '1px' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: s.craftSize, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: crCol, lineHeight: 1 }}>
          Craft
        </span>
      </div>

    </div>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}
