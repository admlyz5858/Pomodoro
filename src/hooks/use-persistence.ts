import { useEffect, useState } from 'react';
import { useTimerStore } from '../store/timer-store.ts';
import { useSettingsStore } from '../store/settings-store.ts';
import { useSessionStore } from '../store/session-store.ts';
import { useGameStore } from '../store/game-store.ts';
import { useTaskStore } from '../store/task-store.ts';

export function usePersistence() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function hydrate() {
      await Promise.all([
        useSettingsStore.getState().loadSettings(),
        useSessionStore.getState().loadSessions(),
        useGameStore.getState().loadGameState(),
        useTaskStore.getState().loadTasks(),
        useTimerStore.getState().restoreSnapshot(),
      ]);
      setReady(true);
    }
    hydrate();
  }, []);

  return ready;
}
