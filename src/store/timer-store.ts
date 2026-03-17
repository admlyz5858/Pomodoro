import { create } from 'zustand';
import type { TimerState, TimerMode, TimerStatus, TimerSettings } from '../core/types.ts';
import { getDurationForMode, getNextMode, DEFAULT_SETTINGS } from '../core/types.ts';
import { StorageService } from '../services/storage.ts';
import type { TimerSnapshot } from '../services/storage.ts';

interface TimerStore extends TimerState {
  setStatus: (status: TimerStatus) => void;
  setMode: (mode: TimerMode) => void;
  setRemainingMs: (ms: number) => void;
  incrementSessions: () => void;
  reset: (mode?: TimerMode, settings?: TimerSettings) => void;
  saveSnapshot: () => void;
  restoreSnapshot: () => Promise<boolean>;
}

const initialDuration = DEFAULT_SETTINGS.focusDuration;

export const useTimerStore = create<TimerStore>((set, get) => ({
  status: 'idle',
  mode: 'focus',
  remainingMs: initialDuration,
  totalMs: initialDuration,
  sessionsCompleted: 0,

  setStatus: (status) => {
    set({ status });
    get().saveSnapshot();
  },

  setMode: (mode) => {
    const totalMs = getDurationForMode(mode, DEFAULT_SETTINGS);
    set({ mode, remainingMs: totalMs, totalMs, status: 'idle' });
    get().saveSnapshot();
  },

  setRemainingMs: (ms) => set({ remainingMs: Math.max(0, ms) }),

  incrementSessions: () => set((s) => ({ sessionsCompleted: s.sessionsCompleted + 1 })),

  reset: (mode, settings) => {
    const m = mode ?? get().mode;
    const s = settings ?? DEFAULT_SETTINGS;
    const totalMs = getDurationForMode(m, s);
    set({ mode: m, remainingMs: totalMs, totalMs, status: 'idle' });
    StorageService.clearTimerSnapshot();
  },

  saveSnapshot: () => {
    const { status, mode, remainingMs, totalMs, sessionsCompleted } = get();
    StorageService.saveTimerSnapshot({ status, mode, remainingMs, totalMs, sessionsCompleted, savedAt: Date.now() });
  },

  restoreSnapshot: async () => {
    const snap: TimerSnapshot | null = await StorageService.loadTimerSnapshot();
    if (!snap) return false;
    if (snap.status === 'running') {
      const elapsed = Date.now() - snap.savedAt;
      const adjusted = Math.max(0, snap.remainingMs - elapsed);
      set({
        status: adjusted > 0 ? 'paused' : 'idle',
        mode: snap.mode,
        remainingMs: adjusted > 0 ? adjusted : getDurationForMode(snap.mode, DEFAULT_SETTINGS),
        totalMs: snap.totalMs,
        sessionsCompleted: snap.sessionsCompleted,
      });
    } else {
      set({
        status: snap.status,
        mode: snap.mode,
        remainingMs: snap.remainingMs,
        totalMs: snap.totalMs,
        sessionsCompleted: snap.sessionsCompleted,
      });
    }
    return true;
  },
}));

export { getNextMode, getDurationForMode };
