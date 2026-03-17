import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../../hooks/use-timer.ts';
import { useAudio } from '../../hooks/use-audio.ts';
import { useSettingsStore } from '../../store/settings-store.ts';
import { useSessionStore } from '../../store/session-store.ts';
import { useGameStore } from '../../store/game-store.ts';
import { CircularProgress } from '../../components/ui/CircularProgress.tsx';
import { TimerDisplay } from '../../components/ui/TimerDisplay.tsx';
import { GlassCard } from '../../components/ui/GlassCard.tsx';
import { BreathingOrb } from '../../components/effects/BreathingOrb.tsx';
import { ModeSelector } from './ModeSelector.tsx';
import { TimerControls } from './TimerControls.tsx';
import { ENCOURAGING_MESSAGES } from '../../core/constants.ts';
import type { TimerMode } from '../../core/types.ts';

const modeLabels: Record<TimerMode, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export function TimerView() {
  const {
    status, mode, remainingMs, totalMs, sessionsCompleted,
    start, pause, resume, reset, skip, switchMode,
  } = useTimer();

  useAudio();

  const longBreakInterval = useSettingsStore((s) => s.settings.longBreakInterval);
  const totalSessions = useSessionStore((s) => s.totalSessions);
  const xp = useGameStore((s) => s.xp);
  const level = useGameStore((s) => s.level);
  const streak = useGameStore((s) => s.currentStreak);
  const plant = useGameStore((s) => s.currentPlant);

  const [showBreathing, setShowBreathing] = useState(false);

  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;
  const isBreak = mode !== 'focus';

  const message = useMemo(() => {
    const msgs = isBreak ? ENCOURAGING_MESSAGES.break : ENCOURAGING_MESSAGES.focus;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, [mode, isBreak]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <ModeSelector currentMode={mode} status={status} onSwitch={switchMode} />

      {/* Timer ring */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        <CircularProgress progress={progress} mode={mode} size={340} strokeWidth={5}>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isBreak ? 'text-break-accent' : 'text-accent-glow'}`}>
              {modeLabels[mode]}
            </span>
            <TimerDisplay remainingMs={remainingMs} isRunning={status === 'running'} />
            {/* Session dots */}
            <div className="flex items-center gap-2 mt-1">
              {Array.from({ length: longBreakInterval }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-500 ${
                    i < sessionsCompleted % longBreakInterval
                      ? `w-2.5 h-2.5 ${isBreak ? 'bg-break-accent shadow-sm shadow-break-accent/50' : 'bg-accent shadow-sm shadow-accent/50'}`
                      : 'w-2 h-2 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </CircularProgress>
      </motion.div>

      {/* Controls */}
      <TimerControls
        status={status}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onSkip={skip}
      />

      {/* Encouraging message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-text-secondary text-center"
        >
          {message}
        </motion.p>
      </AnimatePresence>

      {/* Stats strip */}
      <div className="flex items-center gap-4 mt-2">
        <GlassCard className="px-4 py-2 flex items-center gap-2">
          <span className="text-xp text-sm">⚡</span>
          <span className="text-xs text-text-secondary">Lv.{level}</span>
          <span className="text-xs text-text-muted">{xp} XP</span>
        </GlassCard>

        {streak > 0 && (
          <GlassCard className="px-4 py-2 flex items-center gap-2">
            <span className="text-sm animate-fire">🔥</span>
            <span className="text-xs text-streak">{streak} day{streak !== 1 ? 's' : ''}</span>
          </GlassCard>
        )}

        {plant && !plant.dead && (
          <GlassCard className="px-4 py-2 flex items-center gap-2">
            <span className="text-sm">
              {plant.stage === 'seed' ? '🌱' : plant.stage === 'sprout' ? '🌿' : plant.stage === 'sapling' ? '🌳' : plant.stage === 'tree' ? '🌲' : '✨'}
            </span>
            <span className="text-xs text-text-secondary capitalize">{plant.stage}</span>
          </GlassCard>
        )}

        {totalSessions > 0 && (
          <GlassCard className="px-4 py-2">
            <span className="text-xs text-text-muted">{totalSessions} sessions</span>
          </GlassCard>
        )}
      </div>

      {/* Breathing orb (break mode) */}
      {isBreak && status === 'running' && (
        <div className="mt-4">
          <button
            onClick={() => setShowBreathing((v) => !v)}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer mb-3"
          >
            {showBreathing ? 'Hide' : 'Show'} breathing exercise
          </button>
          <BreathingOrb active={showBreathing} />
        </div>
      )}
    </div>
  );
}
