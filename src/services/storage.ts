import localforage from 'localforage';
import type { TimerSettings, Session, TimerMode, TimerStatus } from '../core/types.ts';

const store = localforage.createInstance({
  name: 'focus-universe',
  storeName: 'app_data',
  description: 'Focus Universe application data',
});

const KEYS = {
  SETTINGS: 'settings',
  SESSIONS: 'sessions',
  TIMER_SNAPSHOT: 'timer_snapshot',
} as const;

export interface TimerSnapshot {
  status: TimerStatus;
  mode: TimerMode;
  remainingMs: number;
  totalMs: number;
  sessionsCompleted: number;
  savedAt: number;
}

export const StorageService = {
  async saveSettings(settings: TimerSettings): Promise<void> {
    await store.setItem(KEYS.SETTINGS, settings);
  },

  async loadSettings(): Promise<TimerSettings | null> {
    return store.getItem<TimerSettings>(KEYS.SETTINGS);
  },

  async saveSessions(sessions: Session[]): Promise<void> {
    await store.setItem(KEYS.SESSIONS, sessions);
  },

  async loadSessions(): Promise<Session[]> {
    const sessions = await store.getItem<Session[]>(KEYS.SESSIONS);
    return sessions ?? [];
  },

  async saveTimerSnapshot(snapshot: TimerSnapshot): Promise<void> {
    await store.setItem(KEYS.TIMER_SNAPSHOT, snapshot);
  },

  async loadTimerSnapshot(): Promise<TimerSnapshot | null> {
    return store.getItem<TimerSnapshot>(KEYS.TIMER_SNAPSHOT);
  },

  async clearTimerSnapshot(): Promise<void> {
    await store.removeItem(KEYS.TIMER_SNAPSHOT);
  },
};
