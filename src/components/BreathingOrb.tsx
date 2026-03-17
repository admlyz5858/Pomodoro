import { motion } from 'framer-motion'

interface BreathingOrbProps {
  mode: 'focus' | 'break'
}

export const BreathingOrb = ({ mode }: BreathingOrbProps) => (
  <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
    <motion.div
      className="absolute h-36 w-36 rounded-full bg-gradient-to-tr from-cyan-300/50 to-violet-300/35 blur-2xl"
      animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.3, 0.55, 0.3] }}
      transition={{
        duration: mode === 'focus' ? 8 : 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      }}
    />
    <motion.div
      className="relative h-24 w-24 rounded-full border border-white/40 bg-white/20"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{
        duration: mode === 'focus' ? 8 : 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      }}
    />
  </div>
)
