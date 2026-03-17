import { useEffect, useRef, useCallback } from 'react';
import { TimerEngine } from '../core/timer-engine.ts';
import { useTimerStore, getNextMode, getDurationForMode } from '../store/timer-store.ts';
import { useSettingsStore } from '../store/settings-store.ts';
import { useSessionStore } from '../store/session-store.ts';
import { useGameStore } from '../store/game-store.ts';
import { useTaskStore } from '../store/task-store.ts';
import { NativeService } from '../services/native.ts';
import { formatMs } from '../core/types.ts';
import type { Session, TimerMode } from '../core/types.ts';

export function useTimer() {
  const engineRef = useRef<TimerEngine | null>(null);
  const sessionStartRef = useRef<number>(0);

  const {
    status, mode, remainingMs, totalMs, sessionsCompleted,
    setStatus, setRemainingMs, incrementSessions, reset,
  } = useTimerStore();

  const settings = useSettingsStore((s) => s.settings);
  const addSession = useSessionStore((s) => s.addSession);
  const completeFocusSession = useGameStore((s) => s.completeFocusSession);
  const activeTaskId = useTaskStore((s) => s.activeTaskId);
  const incrementPomodoro = useTaskStore((s) => s.incrementPomodoro);

  const handleComplete = useCallback(() => {
    const now = Date.now();
    const xpEarned = mode === 'focus' ? 100 + useGameStore.getState().currentStreak * 10 : 0;
    const session: Session = {
      id: crypto.randomUUID(),
      mode,
      startedAt: sessionStartRef.current,
      completedAt: now,
      durationMs: totalMs,
      completed: true,
      xpEarned,
    };
    addSession(session);

    let newSessions = sessionsCompleted;
    if (mode === 'focus') {
      newSessions = sessionsCompleted + 1;
      incrementSessions();
      completeFocusSession();
      if (activeTaskId) incrementPomodoro(activeTaskId);
    }

    const nextMode = getNextMode(mode, newSessions, settings.longBreakInterval);
    const nextDuration = getDurationForMode(nextMode, settings);

    useTimerStore.setState({
      mode: nextMode,
      remainingMs: nextDuration,
      totalMs: nextDuration,
      status: 'idle',
    });

    NativeService.vibrate('success');
    NativeService.cancelTimerNotification();
    NativeService.keepScreenOn(false);

    const label = mode === 'focus' ? 'Focus session complete!' : 'Break is over!';
    const body = mode === 'focus'
      ? `Great work! +${xpEarned} XP earned. Time for a break.`
      : 'Ready to focus again?';
    NativeService.showCompletionNotification(label, body);

    if (
      (mode === 'focus' && settings.autoStartBreaks) ||
      (mode !== 'focus' && settings.autoStartFocus)
    ) {
      setTimeout(() => useTimerStore.getState().setStatus('running'), 500);
    }
  }, [mode, totalMs, sessionsCompleted, settings, addSession, completeFocusSession, activeTaskId, incrementPomodoro, incrementSessions]);

  const handleTick = useCallback(
    (elapsedMs: number) => {
      setRemainingMs(Math.max(0, totalMs - elapsedMs));
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
      NativeService.keepScreenOn(true);
      const modeLabel = mode === 'focus' ? 'Focusing' : 'Break';
      NativeService.showTimerNotification(
        `${modeLabel} — ${formatMs(remainingMs)}`,
        'Focus Universe is running',
      );
    } else if (status === 'paused') {
      engine.pause();
      NativeService.cancelTimerNotification();
      NativeService.keepScreenOn(false);
    } else {
      engine.stop();
      NativeService.cancelTimerNotification();
      NativeService.keepScreenOn(false);
    }
  }, [status]);

  const start = useCallback(() => {
    sessionStartRef.current = Date.now();
    NativeService.vibrate('light');
    setStatus('running');
  }, [setStatus]);

  const pause = useCallback(() => {
    NativeService.vibrate('light');
    setStatus('paused');
  }, [setStatus]);

  const resume = useCallback(() => {
    NativeService.vibrate('light');
    setStatus('running');
  }, [setStatus]);

  const resetTimer = useCallback(() => {
    engineRef.current?.stop();
    sessionStartRef.current = 0;
    NativeService.vibrate('light');
    NativeService.cancelTimerNotification();
    NativeService.keepScreenOn(false);
    reset(mode, settings);
  }, [reset, mode, settings]);

  const skip = useCallback(() => {
    engineRef.current?.stop();
    sessionStartRef.current = 0;
    NativeService.vibrate('medium');
    NativeService.cancelTimerNotification();
    NativeService.keepScreenOn(false);
    let newSessions = sessionsCompleted;
    if (mode === 'focus') {
      newSessions = sessionsCompleted + 1;
      incrementSessions();
    }
    const nextMode = getNextMode(mode, newSessions, settings.longBreakInterval);
    const nextDuration = getDurationForMode(nextMode, settings);
    useTimerStore.setState({ mode: nextMode, remainingMs: nextDuration, totalMs: nextDuration, status: 'idle' });
  }, [mode, sessionsCompleted, settings, incrementSessions]);

  const switchMode = useCallback((newMode: TimerMode) => {
    engineRef.current?.stop();
    sessionStartRef.current = 0;
    NativeService.vibrate('light');
    const dur = getDurationForMode(newMode, settings);
    useTimerStore.setState({ mode: newMode, remainingMs: dur, totalMs: dur, status: 'idle' });
  }, [settings]);

  return {
    status, mode, remainingMs, totalMs, sessionsCompleted,
    start, pause, resume, reset: resetTimer, skip, switchMode,
  };
}
