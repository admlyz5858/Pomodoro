import type { PropsWithChildren } from 'react'
import clsx from 'clsx'

interface GlassCardProps extends PropsWithChildren {
  className?: string
}

export const GlassCard = ({ className, children }: GlassCardProps) => (
  <section
    className={clsx(
      'rounded-3xl border border-white/20 bg-white/8 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(4,10,26,0.35)]',
      className,
    )}
  >
    {children}
  </section>
)
