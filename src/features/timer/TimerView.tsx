import { useTimer } from '../../hooks/use-timer.ts';
import { useSettingsStore } from '../../store/settings-store.ts';
import { useSessionStore } from '../../store/session-store.ts';
import { CircularProgress } from '../../components/ui/CircularProgress.tsx';
import { TimerDisplay } from '../../components/ui/TimerDisplay.tsx';
import { ModeLabel } from '../../components/ui/ModeLabel.tsx';
import { SessionDots } from '../../components/ui/SessionDots.tsx';
import { ModeSelector } from './ModeSelector.tsx';
import { TimerControls } from './TimerControls.tsx';

export function TimerView() {
  const {
    status, mode, remainingMs, totalMs, sessionsCompleted,
    start, pause, resume, reset, skip, switchMode,
  } = useTimer();

  const longBreakInterval = useSettingsStore((s) => s.settings.longBreakInterval);
  const totalSessions = useSessionStore((s) => s.totalSessions);

  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <ModeSelector currentMode={mode} status={status} onSwitch={switchMode} />

      <CircularProgress progress={progress} mode={mode} size={320} strokeWidth={6}>
        <div className="flex flex-col items-center gap-3">
          <ModeLabel mode={mode} />
          <TimerDisplay remainingMs={remainingMs} />
          <SessionDots
            completed={sessionsCompleted % longBreakInterval}
            total={longBreakInterval}
          />
        </div>
      </CircularProgress>

      <TimerControls
        status={status}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onSkip={skip}
      />

      {totalSessions > 0 && (
        <p className="text-xs text-text-muted">
          {totalSessions} focus session{totalSessions !== 1 ? 's' : ''} completed today
        </p>
      )}
    </div>
  );
}
