import { useMemo, useState } from 'react'
import { GlassCard } from './GlassCard'

interface MiniActivitiesProps {
  isBreakMode: boolean
}

const shuffle = (input: number[]) => [...input].sort(() => Math.random() - 0.5)

export const MiniActivities = ({ isBreakMode }: MiniActivitiesProps) => {
  const [water, setWater] = useState(0)
  const [beat, setBeat] = useState(0)
  const [memory, setMemory] = useState(() => shuffle([1, 2, 3, 4]))

  const memoryGoal = useMemo(() => [1, 2, 3, 4], [])
  const memorySolved = memory.every((value, index) => value === memoryGoal[index])

  if (!isBreakMode) {
    return (
      <GlassCard>
        <h3 className="text-sm uppercase tracking-[0.22em] text-white/70">Focus Companion</h3>
        <p className="mt-3 text-sm text-white/75">
          Keep this passive: your breathing orb below syncs with your pace for calm concentration.
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <h3 className="text-sm uppercase tracking-[0.22em] text-white/70">Break Mini Activities</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <button
          onClick={() => setWater((value) => Math.min(100, value + 12))}
          className="rounded-2xl border border-emerald-200/40 bg-emerald-400/20 p-3 text-left"
        >
          <p className="text-xs text-white/70">Watering Plants</p>
          <p className="mt-2 text-lg font-semibold text-white">Hydration {water}%</p>
        </button>

        <button
          onClick={() => setBeat((value) => value + 1)}
          className="rounded-2xl border border-violet-200/40 bg-violet-400/20 p-3 text-left"
        >
          <p className="text-xs text-white/70">Rhythm Tap</p>
          <p className="mt-2 text-lg font-semibold text-white">Combo x{beat}</p>
        </button>

        <button
          onClick={() => setMemory(shuffle(memory))}
          className="rounded-2xl border border-cyan-200/40 bg-cyan-400/20 p-3 text-left"
        >
          <p className="text-xs text-white/70">Memory Puzzle</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {memory.join(' ')} {memorySolved ? '✓' : ''}
          </p>
        </button>
      </div>
    </GlassCard>
  )
}
