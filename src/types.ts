export type TimerMode = 'focus' | 'break'

export type EnvironmentKey = 'forest' | 'rain' | 'ocean' | 'mountains' | 'night'

export type PlantStage = 'seed' | 'sprout' | 'tree' | 'magical-tree' | 'withered'

export interface EnvironmentAsset {
  key: EnvironmentKey
  label: string
  query: string
  images: string[]
  videos: string[]
  fallback: string
}

export interface AudioTrack {
  id: string
  label: string
  mode: TimerMode
  src: string
  unlockLevel: number
}

export interface FocusSession {
  id: string
  goal: string
  mode: TimerMode
  startedAt: string
  endedAt: string
  durationMinutes: number
  completed: boolean
}

export interface Quest {
  id: string
  title: string
  target: number
  progress: number
  period: 'daily' | 'weekly'
  rewardXp: number
  completed: boolean
}

export interface GameState {
  xp: number
  level: number
  streak: number
  longestStreak: number
  lastFocusDate: string | null
  sessionsCompleted: number
  minutesFocused: number
  plantStage: PlantStage
  unlockedEnvironments: EnvironmentKey[]
  unlockedTracks: string[]
  productivityScore: number
}

export interface SettingsState {
  focusMinutes: number
  breakMinutes: number
  autoStartBreak: boolean
  selectedEnvironment: EnvironmentKey
  selectedFocusTrack: string
  selectedBreakTrack: string
  notificationsEnabled: boolean
  vibrationsEnabled: boolean
}

export interface AppState {
  game: GameState
  quests: Quest[]
  sessions: FocusSession[]
  goals: string[]
  settings: SettingsState
}

export interface PlannedTask {
  label: string
  estimateMinutes: number
  pomodoros: number
  intent: string
}

export interface AiPlan {
  title: string
  summary: string
  suggestedStart: string
  breakCadence: string
  tasks: PlannedTask[]
  totalPomodoros: number
  confidence: 'high' | 'medium'
}
