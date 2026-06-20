import { motion } from 'framer-motion'
import Logo from './Logo'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1a1a1a]"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Logo variant="light" size="lg" animated />
      </motion.div>

      {/* Loading spinner */}
      <motion.div
        className="w-16 h-16 border-2 border-white/20 border-t-[#c49a3a] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-white/50 text-sm tracking-wider uppercase"
      >
        Loading Experience...
      </motion.p>

      {/* Progress bar */}
      <motion.div
        className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-4"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#8b6914] to-[#c49a3a]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
