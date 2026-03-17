import { motion, AnimatePresence } from 'framer-motion'

interface ImmersiveBackgroundProps {
  src: string
  overlayTone: 'focus' | 'break'
}

const particles = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 8 + Math.random() * 10,
  delay: Math.random() * 6,
}))

export const ImmersiveBackground = ({ src, overlayTone }: ImmersiveBackgroundProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        key={src}
        initial={{ opacity: 0, filter: 'blur(16px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1.08 }}
        exit={{ opacity: 0, filter: 'blur(14px)' }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </AnimatePresence>

    <motion.div
      className="absolute inset-0"
      animate={{ opacity: [0.35, 0.45, 0.35] }}
      transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
      style={{
        background:
          overlayTone === 'focus'
            ? 'linear-gradient(150deg, rgba(7, 17, 30, 0.78), rgba(7, 40, 39, 0.63))'
            : 'linear-gradient(150deg, rgba(21, 8, 40, 0.72), rgba(65, 26, 91, 0.58))',
      }}
    />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),rgba(255,255,255,0)_45%)] opacity-50" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.14),rgba(255,255,255,0)_52%)] opacity-55" />

    {particles.map((particle) => (
      <motion.span
        key={particle.id}
        className="absolute h-1.5 w-1.5 rounded-full bg-white/40"
        style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
        animate={{ y: [-8, 18, -8], opacity: [0.2, 0.6, 0.2], scale: [0.7, 1.3, 0.7] }}
        transition={{
          duration: particle.duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: particle.delay,
        }}
      />
    ))}
  </div>
)
