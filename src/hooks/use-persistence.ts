import { useEffect, useState } from 'react';
import { useTimerStore } from '../store/timer-store.ts';
import { useSettingsStore } from '../store/settings-store.ts';
import { useSessionStore } from '../store/session-store.ts';

export function usePersistence() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function hydrate() {
      await Promise.all([
        useSettingsStore.getState().loadSettings(),
        useSessionStore.getState().loadSessions(),
        useTimerStore.getState().restoreSnapshot(),
      ]);
      setReady(true);
    }
    hydrate();
  }, []);

  return ready;
}
