import { motion } from 'framer-motion'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function Logo({ variant = 'dark', size = 'md', animated = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-5xl'
  }

  const colorClasses = {
    light: 'text-white',
    dark: 'text-[#1a1a1a]'
  }

  const LogoContent = () => (
    <div className="flex items-center gap-1">
      <span 
        className={`font-serif font-bold tracking-[0.15em] ${sizeClasses[size]} ${colorClasses[variant]}`}
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        P&M
      </span>
      <div className="flex flex-col justify-center gap-0.5 ml-1">
        <div className={`h-px w-6 ${variant === 'light' ? 'bg-[#c49a3a]' : 'bg-[#8b6914]'}`} />
        <span
          className={`text-[10px] tracking-[0.3em] uppercase ${variant === 'light' ? 'text-white/60' : 'text-[#6b6b6b]'}`}
        >
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
        className="cursor-pointer"
      >
        <LogoContent />
      </motion.div>
    )
  }

  return (
    <div className="cursor-pointer">
      <LogoContent />
    </div>
  )
}
