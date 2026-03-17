import { useEffect } from 'react';
import { useTimerStore } from '../store/timer-store.ts';

export function useKeyboardShortcuts(handlers: {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const status = useTimerStore.getState().status;

      switch (e.code) {
        case 'Space': {
          e.preventDefault();
          if (status === 'idle') handlers.onStart();
          else if (status === 'running') handlers.onPause();
          else if (status === 'paused') handlers.onResume();
          break;
        }
        case 'KeyR': {
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handlers.onReset();
          }
          break;
        }
        case 'KeyS': {
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handlers.onSkip();
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [handlers]);
}
