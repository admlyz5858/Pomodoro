import { create } from 'zustand';
import type { Session } from '../core/types.ts';
import { StorageService } from '../services/storage.ts';

interface SessionStore {
  sessions: Session[];
  totalFocusMs: number;
  totalSessions: number;
  loaded: boolean;
  addSession: (session: Session) => void;
  loadSessions: () => Promise<void>;
  clearSessions: () => void;
}

function computeTotals(sessions: Session[]) {
  const completedFocus = sessions.filter((s) => s.mode === 'focus' && s.completed);
  return {
    totalFocusMs: completedFocus.reduce((sum, s) => sum + s.durationMs, 0),
    totalSessions: completedFocus.length,
  };
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  totalFocusMs: 0,
  totalSessions: 0,
  loaded: false,

  addSession: (session) => {
    const next = [session, ...get().sessions];
    const totals = computeTotals(next);
    set({ sessions: next, ...totals });
    StorageService.saveSessions(next);
  },

  loadSessions: async () => {
    const sessions = await StorageService.loadSessions();
    const totals = computeTotals(sessions);
    set({ sessions, ...totals, loaded: true });
  },

  clearSessions: () => {
    set({ sessions: [], totalFocusMs: 0, totalSessions: 0 });
    StorageService.saveSessions([]);
  },
}));
