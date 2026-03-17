import { useMemo } from 'react'
import { createAiPlan } from '../lib/aiPlanner'
import { GlassCard } from './GlassCard'

interface AiPlannerPanelProps {
  goal: string
}

export const AiPlannerPanel = ({ goal }: AiPlannerPanelProps) => {
  const plan = useMemo(() => createAiPlan(goal), [goal])

  return (
    <GlassCard>
      <h3 className="text-sm uppercase tracking-[0.22em] text-white/70">AI Focus Architect</h3>
      <p className="mt-2 text-sm text-white/75">{plan.summary}</p>

      <div className="mt-4 rounded-2xl border border-white/15 bg-white/8 p-3 text-sm text-white/85">
        <p>
          <span className="text-white/60">Suggested start:</span> {plan.suggestedStart}
        </p>
        <p className="mt-1">
          <span className="text-white/60">Cadence:</span> {plan.breakCadence}
        </p>
      </div>

      <ul className="mt-4 space-y-2">
        {plan.tasks.map((task) => (
          <li key={task.label} className="rounded-xl border border-white/10 bg-black/15 p-3">
            <p className="text-sm font-medium text-white">{task.label}</p>
            <p className="text-xs text-white/65">
              {task.estimateMinutes}m • {task.pomodoros} pomodoros • {task.intent}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-white/60">Confidence: {plan.confidence}</p>
    </GlassCard>
  )
}
