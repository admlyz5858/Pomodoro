import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns'
import type { FocusSession } from '../types'
import { GlassCard } from './GlassCard'
import { Heatmap } from './Heatmap'

interface StatsPanelProps {
  sessions: FocusSession[]
  productivityScore: number
}

const aggregateDailyMinutes = (sessions: FocusSession[]) => {
  const map = new Map<string, number>()

  for (const session of sessions) {
    if (!session.completed || session.mode !== 'focus') continue

    const day = format(new Date(session.endedAt), 'yyyy-MM-dd')
    map.set(day, (map.get(day) ?? 0) + session.durationMinutes)
  }

  return map
}

export const StatsPanel = ({ sessions, productivityScore }: StatsPanelProps) => {
  const dailyMinutes = aggregateDailyMinutes(sessions)
  const today = startOfDay(new Date())

  const weeklyDays = eachDayOfInterval({ start: subDays(today, 6), end: today })
  const weeklyBars = weeklyDays.map((date) => {
    const key = format(date, 'yyyy-MM-dd')
    const minutes = dailyMinutes.get(key) ?? 0

    return { label: format(date, 'EEE'), minutes }
  })

  const heatmapDays = eachDayOfInterval({ start: subDays(today, 89), end: today })
  const heatmapValues = heatmapDays.map((date) => {
    const minutes = dailyMinutes.get(format(date, 'yyyy-MM-dd')) ?? 0
    return Math.min(4, Math.floor(minutes / 25))
  })

  return (
    <GlassCard>
      <h3 className="text-sm uppercase tracking-[0.22em] text-white/70">Focus Analytics</h3>

      <div className="mt-4 flex items-end gap-2">
        {weeklyBars.map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative h-24 w-full rounded-lg bg-white/8">
              <div
                className="absolute inset-x-0 bottom-0 rounded-lg bg-gradient-to-t from-cyan-400 to-emerald-300"
                style={{ height: `${Math.min(100, (bar.minutes / 120) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-white/70">{bar.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-white/70">90-day consistency heatmap</p>
      <div className="mt-3 overflow-x-auto pb-1">
        <Heatmap values={heatmapValues} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/15 bg-white/8 p-3">
        <p className="text-xs text-white/60">Productivity score</p>
        <p className="text-2xl font-semibold text-white">{productivityScore}/100</p>
      </div>
    </GlassCard>
  )
}
