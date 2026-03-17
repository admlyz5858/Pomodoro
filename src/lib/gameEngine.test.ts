import { describe, expect, it } from 'vitest'
import { applySessionResult, createInitialState } from './gameEngine'

describe('gameEngine', () => {
  it('increments xp and sessions after completed focus', () => {
    const initial = createInitialState()

    const updated = applySessionResult(initial, {
      id: '1',
      goal: 'Write proposal',
      mode: 'focus',
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationMinutes: 25,
      completed: true,
    })

    expect(updated.game.xp).toBeGreaterThan(initial.game.xp)
    expect(updated.game.sessionsCompleted).toBe(1)
    expect(updated.game.plantStage).toMatch(/sprout|tree|magical-tree/)
  })

  it('wither plant and reset streak on abandonment', () => {
    const initial = createInitialState()

    const updated = applySessionResult(
      initial,
      {
        id: '2',
        goal: 'Practice math',
        mode: 'focus',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes: 10,
        completed: false,
      },
      true,
    )

    expect(updated.game.plantStage).toBe('withered')
    expect(updated.game.streak).toBe(0)
  })
})
