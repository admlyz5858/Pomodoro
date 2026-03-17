import { addMinutes, format, set } from 'date-fns'
import { AiPlan, PlannedTask } from '../types'

const DEFAULT_FOCUS_MINUTES = 25

const extractMinutes = (goal: string): number => {
  const hoursMatch = goal.match(/(\d+(?:\.\d+)?)\s*(h|hour|hours)/i)
  const minutesMatch = goal.match(/(\d+)\s*(m|min|minute|minutes)/i)

  const hours = hoursMatch ? Number(hoursMatch[1]) * 60 : 0
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0

  const total = Math.round(hours + minutes)
  return total > 0 ? total : 90
}

const toIntent = (goal: string): string => {
  if (/study|learn|revise/i.test(goal)) {
    return 'active recall + short notes'
  }
  if (/write|essay|draft|article/i.test(goal)) {
    return 'outline -> deep writing -> revision'
  }
  if (/code|build|program/i.test(goal)) {
    return 'plan -> implement -> test'
  }

  return 'focus sprint + brief reflection'
}

const splitIntoTasks = (goal: string, totalMinutes: number): PlannedTask[] => {
  const pomodoros = Math.max(1, Math.ceil(totalMinutes / DEFAULT_FOCUS_MINUTES))
  const taskCount = Math.min(5, Math.max(2, Math.ceil(pomodoros / 2)))

  const baseMinutes = Math.round(totalMinutes / taskCount)

  return Array.from({ length: taskCount }, (_, index) => {
    const slot = index + 1
    const estimateMinutes = slot === taskCount ? totalMinutes - baseMinutes * (taskCount - 1) : baseMinutes

    return {
      label: `${goal} — Segment ${slot}`,
      estimateMinutes,
      pomodoros: Math.max(1, Math.round(estimateMinutes / DEFAULT_FOCUS_MINUTES)),
      intent: toIntent(goal),
    }
  })
}

export const createAiPlan = (
  goal: string,
  options?: { startHour?: number; startMinute?: number },
): AiPlan => {
  const trimmed = goal.trim() || 'Deep work session'
  const totalMinutes = extractMinutes(trimmed)
  const tasks = splitIntoTasks(trimmed, totalMinutes)
  const totalPomodoros = tasks.reduce((sum, task) => sum + task.pomodoros, 0)

  const now = new Date()
  const start = set(now, {
    hours: options?.startHour ?? 9,
    minutes: options?.startMinute ?? 0,
    seconds: 0,
    milliseconds: 0,
  })

  const projectedFinish = addMinutes(start, totalPomodoros * 30)

  return {
    title: `AI Plan for: ${trimmed}`,
    summary: `Break the objective into ${tasks.length} chunks with deliberate recovery cycles.`,
    suggestedStart: `${format(start, 'HH:mm')} (finish near ${format(projectedFinish, 'HH:mm')})`,
    breakCadence: 'After each focus block: 5m break, every 4 blocks: 15m long break.',
    tasks,
    totalPomodoros,
    confidence: totalMinutes >= 120 ? 'medium' : 'high',
  }
}
