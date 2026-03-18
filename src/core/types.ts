export type TimerStatus = 'idle' | 'running' | 'paused';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  remainingMs: number;
  totalMs: number;
  sessionsCompleted: number;
}

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  selectedEnvironment: string;
  selectedSound: string;
  volume: number;
  soundEnabled: boolean;
  particlesEnabled: boolean;
  dailyGoal: number;
  themeId: string;
  selectedPlantSpecies: string;
  lockScreenTasks: boolean;
}

export interface Session {
  id: string;
  mode: TimerMode;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  completed: boolean;
  xpEarned: number;
}

export type PlantStage = 'seed' | 'sprout' | 'sapling' | 'tree' | 'glowing';

export interface Plant {
  id: string;
  species: string;
  stage: PlantStage;
  growthProgress: number;
  plantedAt: number;
  completedAt: number | null;
  dead: boolean;
  sessionsGiven: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardXp: number;
  type: 'daily' | 'weekly';
  createdAt: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: number;
  order: number;
}

export interface GameState {
  xp: number;
  level: number;
  currentPlant: Plant | null;
  garden: Plant[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  unlockedEnvironments: string[];
  unlockedSounds: string[];
  quests: Quest[];
}

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25 * 60 * 1000,
  shortBreakDuration: 5 * 60 * 1000,
  longBreakDuration: 15 * 60 * 1000,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  selectedEnvironment: 'forest',
  selectedSound: 'rain',
  volume: 0.5,
  soundEnabled: true,
  particlesEnabled: true,
  dailyGoal: 8,
  themeId: 'midnight',
  selectedPlantSpecies: 'oak',
  lockScreenTasks: false,
};

export const PLANT_STAGE_THRESHOLDS: Record<PlantStage, number> = {
  seed: 0,
  sprout: 1,
  sapling: 3,
  tree: 6,
  glowing: 10,
};

export const STAGE_ORDER: PlantStage[] = ['seed', 'sprout', 'sapling', 'tree', 'glowing'];

export function getPlantStage(sessions: number): PlantStage {
  if (sessions >= 10) return 'glowing';
  if (sessions >= 6) return 'tree';
  if (sessions >= 3) return 'sapling';
  if (sessions >= 1) return 'sprout';
  return 'seed';
}

export function getXpForLevel(level: number): number {
  return level * 500;
}

export function getLevelFromXp(xp: number): number {
  let level = 1;
  let required = 500;
  let total = 0;
  while (total + required <= xp) {
    total += required;
    level++;
    required = level * 500;
  }
  return level;
}

export function getXpProgressInLevel(xp: number): { current: number; required: number } {
  let level = 1;
  let required = 500;
  let total = 0;
  while (total + required <= xp) {
    total += required;
    level++;
    required = level * 500;
  }
  return { current: xp - total, required };
}

export function getDurationForMode(mode: TimerMode, settings: TimerSettings): number {
  switch (mode) {
    case 'focus': return settings.focusDuration;
    case 'shortBreak': return settings.shortBreakDuration;
    case 'longBreak': return settings.longBreakDuration;
  }
}

export function getNextMode(
  currentMode: TimerMode,
  sessionsCompleted: number,
  longBreakInterval: number,
): TimerMode {
  if (currentMode === 'focus') {
    return sessionsCompleted > 0 && sessionsCompleted % longBreakInterval === 0
      ? 'longBreak' : 'shortBreak';
  }
  return 'focus';
}

export function formatMs(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
