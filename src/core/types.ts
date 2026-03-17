export type TimerStatus = 'idle' | 'running' | 'paused' | 'break';

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
}

export interface Session {
  id: string;
  mode: TimerMode;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  completed: boolean;
}

export interface SessionHistory {
  sessions: Session[];
  totalFocusMs: number;
  totalSessions: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25 * 60 * 1000,
  shortBreakDuration: 5 * 60 * 1000,
  longBreakDuration: 15 * 60 * 1000,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
};

export function getDurationForMode(mode: TimerMode, settings: TimerSettings): number {
  switch (mode) {
    case 'focus':
      return settings.focusDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
  }
}

export function getNextMode(
  currentMode: TimerMode,
  sessionsCompleted: number,
  longBreakInterval: number,
): TimerMode {
  if (currentMode === 'focus') {
    return sessionsCompleted > 0 && sessionsCompleted % longBreakInterval === 0
      ? 'longBreak'
      : 'shortBreak';
  }
  return 'focus';
}
