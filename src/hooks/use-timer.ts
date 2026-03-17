import { useEffect, useRef, useCallback } from 'react';
import { TimerEngine } from '../core/timer-engine.ts';
import { useTimerStore, getNextMode, getDurationForMode } from '../store/timer-store.ts';
import { useSettingsStore } from '../store/settings-store.ts';
import { useSessionStore } from '../store/session-store.ts';
import type { Session } from '../core/types.ts';

export function useTimer() {
  const engineRef = useRef<TimerEngine | null>(null);
  const sessionStartRef = useRef<number>(0);

  const {
    status, mode, remainingMs, totalMs, sessionsCompleted,
    setStatus, setRemainingMs, setMode, incrementSessions, reset,
  } = useTimerStore();

  const settings = useSettingsStore((s) => s.settings);
  const addSession = useSessionStore((s) => s.addSession);

  const handleComplete = useCallback(() => {
    const now = Date.now();
    const session: Session = {
      id: crypto.randomUUID(),
      mode,
      startedAt: sessionStartRef.current,
      completedAt: now,
      durationMs: totalMs,
      completed: true,
    };
    addSession(session);

    let newSessions = sessionsCompleted;
    if (mode === 'focus') {
      newSessions = sessionsCompleted + 1;
      incrementSessions();
    }

    const nextMode = getNextMode(mode, newSessions, settings.longBreakInterval);
    const nextDuration = getDurationForMode(nextMode, settings);

    useTimerStore.setState({
      mode: nextMode,
      remainingMs: nextDuration,
      totalMs: nextDuration,
      status: 'idle',
    });

    if (
      (mode === 'focus' && settings.autoStartBreaks) ||
      (mode !== 'focus' && settings.autoStartFocus)
    ) {
      setTimeout(() => {
        useTimerStore.getState().setStatus('running');
      }, 300);
    }
  }, [mode, totalMs, sessionsCompleted, settings, addSession, incrementSessions]);

  const handleTick = useCallback(
    (elapsedMs: number) => {
      const remaining = Math.max(0, totalMs - elapsedMs);
      setRemainingMs(remaining);
    },
    [totalMs, setRemainingMs],
  );

  useEffect(() => {
    const engine = new TimerEngine(handleTick, handleComplete);
    engineRef.current = engine;
    return () => engine.destroy();
  }, [handleTick, handleComplete]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (status === 'running') {
      const alreadyElapsed = totalMs - remainingMs;
      sessionStartRef.current = sessionStartRef.current || Date.now();
      engine.start(totalMs, alreadyElapsed);
    } else if (status === 'paused') {
      engine.pause();
    } else {
      engine.stop();
    }
  }, [status]);

  const start = useCallback(() => {
    sessionStartRef.current = Date.now();
    setStatus('running');
  }, [setStatus]);

  const pause = useCallback(() => {
    setStatus('paused');
  }, [setStatus]);

  const resume = useCallback(() => {
    setStatus('running');
  }, [setStatus]);

  const resetTimer = useCallback(() => {
    engineRef.current?.stop();
    sessionStartRef.current = 0;
    reset(mode);
  }, [reset, mode]);

  const skip = useCallback(() => {
    engineRef.current?.stop();
    sessionStartRef.current = 0;

    let newSessions = sessionsCompleted;
    if (mode === 'focus') {
      newSessions = sessionsCompleted + 1;
      incrementSessions();
    }

    const nextMode = getNextMode(mode, newSessions, settings.longBreakInterval);
    const nextDuration = getDurationForMode(nextMode, settings);

    useTimerStore.setState({
      mode: nextMode,
      remainingMs: nextDuration,
      totalMs: nextDuration,
      status: 'idle',
    });
  }, [mode, sessionsCompleted, settings, incrementSessions]);

  const switchMode = useCallback(
    (newMode: typeof mode) => {
      engineRef.current?.stop();
      sessionStartRef.current = 0;
      const dur = getDurationForMode(newMode, settings);
      useTimerStore.setState({
        mode: newMode,
        remainingMs: dur,
        totalMs: dur,
        status: 'idle',
      });
    },
    [settings],
  );

  return {
    status, mode, remainingMs, totalMs, sessionsCompleted,
    start, pause, resume, reset: resetTimer, skip, switchMode,
    setMode,
  };
}
