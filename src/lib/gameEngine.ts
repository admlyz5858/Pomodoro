import { addDays, formatISO } from 'date-fns'
import type { AppState, FocusSession, GameState, Quest } from '../types'
import { isConsecutiveDay, isSameDay, toISODate } from './utils'

export const createDailyQuests = (seed = new Date()): Quest[] => [
  {
    id: `daily-3-sessions-${formatISO(seed, { representation: 'date' })}`,
    title: 'Complete 3 focus sessions',
    target: 3,
    progress: 0,
    period: 'daily',
    rewardXp: 90,
    completed: false,
  },
  {
    id: `daily-60-min-${formatISO(seed, { representation: 'date' })}`,
    title: 'Reach 60 focused minutes',
    target: 60,
    progress: 0,
    period: 'daily',
    rewardXp: 120,
    completed: false,
  },
  {
    id: `weekly-10-${formatISO(addDays(seed, 7), { representation: 'date' })}`,
    title: 'Weekly mission: 10 completed sessions',
    target: 10,
    progress: 0,
    period: 'weekly',
    rewardXp: 320,
    completed: false,
  },
]

const calculateLevel = (xp: number): number => Math.floor(Math.sqrt(xp / 100)) + 1

const unlockEnvironment = (level: number): GameState['unlockedEnvironments'] => {
  const unlocked: GameState['unlockedEnvironments'] = ['forest']

  if (level >= 2) unlocked.push('rain')
  if (level >= 3) unlocked.push('ocean')
  if (level >= 4) unlocked.push('mountains')
  if (level >= 5) unlocked.push('night')

  return unlocked
}

const plantStageForSessions = (sessionsCompleted: number): GameState['plantStage'] => {
  if (sessionsCompleted <= 0) return 'seed'
  if (sessionsCompleted <= 3) return 'sprout'
  if (sessionsCompleted <= 10) return 'tree'
  return 'magical-tree'
}

const updateQuests = (
  quests: Quest[],
  completedSessionCount: number,
  focusedMinutes: number,
): { quests: Quest[]; bonusXp: number } => {
  let bonusXp = 0

  const next = quests.map((quest) => {
    let progress = quest.progress

    if (/3 focus sessions/i.test(quest.title)) {
      progress = Math.min(quest.target, completedSessionCount)
    }

    if (/60 focused minutes/i.test(quest.title)) {
      progress = Math.min(quest.target, focusedMinutes)
    }

    if (/10 completed sessions/i.test(quest.title)) {
      progress = Math.min(quest.target, completedSessionCount)
    }

    const nowCompleted = progress >= quest.target

    if (nowCompleted && !quest.completed) {
      bonusXp += quest.rewardXp
    }

    return {
      ...quest,
      progress,
      completed: nowCompleted,
    }
  })

  return { quests: next, bonusXp }
}

export const createInitialState = (): AppState => ({
  game: {
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastFocusDate: null,
    sessionsCompleted: 0,
    minutesFocused: 0,
    plantStage: 'seed',
    unlockedEnvironments: ['forest'],
    unlockedTracks: ['focus-rain', 'focus-forest', 'break-piano'],
    productivityScore: 0,
  },
  sessions: [],
  goals: [],
  quests: createDailyQuests(),
  settings: {
    focusMinutes: 25,
    breakMinutes: 5,
    autoStartBreak: true,
    selectedEnvironment: 'forest',
    selectedFocusTrack: 'focus-rain',
    selectedBreakTrack: 'break-piano',
    notificationsEnabled: false,
    vibrationsEnabled: true,
  },
})

export const applySessionResult = (
  previous: AppState,
  session: FocusSession,
  abandoned = false,
): AppState => {
  const completedFocusSessions = previous.sessions.filter(
    (item) => item.completed && item.mode === 'focus',
  ).length
  const focusedMinutes = previous.sessions
    .filter((item) => item.completed && item.mode === 'focus')
    .reduce((sum, item) => sum + item.durationMinutes, 0)

  const nextSessions = [session, ...previous.sessions].slice(0, 400)

  if (abandoned && session.mode === 'focus') {
    return {
      ...previous,
      sessions: nextSessions,
      game: {
        ...previous.game,
        plantStage: 'withered',
        streak: 0,
      },
    }
  }

  let xpGain = session.completed ? session.durationMinutes * 3 : session.durationMinutes

  const today = toISODate(new Date(session.endedAt))
  const lastDay = previous.game.lastFocusDate

  let streak = previous.game.streak
  if (session.mode === 'focus' && session.completed) {
    if (isSameDay(lastDay, today)) {
      streak = previous.game.streak
    } else if (isConsecutiveDay(lastDay, today)) {
      streak = previous.game.streak + 1
      xpGain += 40
    } else {
      streak = 1
    }
  }

  const completedCount = completedFocusSessions + (session.mode === 'focus' && session.completed ? 1 : 0)
  const totalMinutes = focusedMinutes + (session.mode === 'focus' && session.completed ? session.durationMinutes : 0)

  const questResults = updateQuests(previous.quests, completedCount, totalMinutes)
  const xp = previous.game.xp + xpGain + questResults.bonusXp
  const level = calculateLevel(xp)

  return {
    ...previous,
    sessions: nextSessions,
    quests: questResults.quests,
    goals: session.goal ? [session.goal, ...previous.goals].slice(0, 12) : previous.goals,
    game: {
      ...previous.game,
      xp,
      level,
      streak,
      longestStreak: Math.max(previous.game.longestStreak, streak),
      lastFocusDate: session.mode === 'focus' && session.completed ? today : previous.game.lastFocusDate,
      sessionsCompleted: completedCount,
      minutesFocused: totalMinutes,
      plantStage: plantStageForSessions(completedCount),
      unlockedEnvironments: unlockEnvironment(level),
      unlockedTracks: level >= 2
        ? ['focus-rain', 'focus-forest', 'break-piano', 'focus-lofi', 'break-chill']
        : ['focus-rain', 'focus-forest', 'break-piano'],
      productivityScore: Math.min(100, Math.round((totalMinutes / 900) * 100 + streak * 4)),
    },
  }
}
