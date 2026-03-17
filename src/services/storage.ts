import localforage from 'localforage';
import type { TimerSettings, Session, TimerMode, TimerStatus, GameState, Task } from '../core/types.ts';

const store = localforage.createInstance({
  name: 'focus-universe',
  storeName: 'app_data',
  description: 'Focus Universe application data',
});

const KEYS = {
  SETTINGS: 'settings',
  SESSIONS: 'sessions',
  TIMER_SNAPSHOT: 'timer_snapshot',
  GAME_STATE: 'game_state',
  TASKS: 'tasks',
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
    return (await store.getItem<Session[]>(KEYS.SESSIONS)) ?? [];
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

  async saveGameState(state: GameState): Promise<void> {
    await store.setItem(KEYS.GAME_STATE, state);
  },

  async loadGameState(): Promise<GameState | null> {
    return store.getItem<GameState>(KEYS.GAME_STATE);
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    await store.setItem(KEYS.TASKS, tasks);
  },

  async loadTasks(): Promise<Task[]> {
    return (await store.getItem<Task[]>(KEYS.TASKS)) ?? [];
  },

  async exportAll(): Promise<string> {
    const data: Record<string, unknown> = {};
    await store.iterate((value, key) => {
      data[key] = value;
    });
    return JSON.stringify(data, null, 2);
  },

  async importAll(json: string): Promise<void> {
    const data = JSON.parse(json) as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      await store.setItem(key, value);
    }
  },

  async clearAll(): Promise<void> {
    await store.clear();
  },
};
