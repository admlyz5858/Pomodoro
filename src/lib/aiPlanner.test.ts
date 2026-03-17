import { describe, expect, it } from 'vitest'
import { createAiPlan } from './aiPlanner'

describe('createAiPlan', () => {
  it('creates pomodoro plan from duration-based goal', () => {
    const plan = createAiPlan('Study physics 3 hours')

    expect(plan.totalPomodoros).toBeGreaterThan(4)
    expect(plan.tasks.length).toBeGreaterThan(1)
    expect(plan.summary).toMatch(/Break the objective/i)
  })

  it('falls back to default duration for goals without explicit time', () => {
    const plan = createAiPlan('Plan launch strategy')

    expect(plan.totalPomodoros).toBeGreaterThan(0)
    expect(plan.tasks[0].intent.length).toBeGreaterThan(5)
  })
})
