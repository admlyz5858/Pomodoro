import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../../hooks/use-timer.ts';
import { useAudio } from '../../hooks/use-audio.ts';
import { useOrientation } from '../../hooks/use-orientation.ts';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard.ts';
import { useSettingsStore } from '../../store/settings-store.ts';
import { useSessionStore } from '../../store/session-store.ts';
import { useGameStore } from '../../store/game-store.ts';
import { CircularProgress } from '../../components/ui/CircularProgress.tsx';
import { TimerDisplay } from '../../components/ui/TimerDisplay.tsx';
import { GlassCard } from '../../components/ui/GlassCard.tsx';
import { BreathingOrb } from '../../components/effects/BreathingOrb.tsx';
import { ModeSelector } from './ModeSelector.tsx';
import { TimerControls } from './TimerControls.tsx';
import { SoundMixer } from './SoundMixer.tsx';
import { DailyGoal } from './DailyGoal.tsx';
import { ENCOURAGING_MESSAGES } from '../../core/constants.ts';
import type { TimerMode } from '../../core/types.ts';

const modeLabels: Record<TimerMode, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

function SessionDots({ count, total, isBreak }: { count: number; total: number; isBreak: boolean }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-500 ${
            i < count
              ? `w-2 h-2 sm:w-2.5 sm:h-2.5 ${isBreak ? 'bg-break-accent shadow-sm shadow-break-accent/50' : 'bg-accent shadow-sm shadow-accent/50'}`
              : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

function StatsStrip({ level, xp, streak, plant, totalSessions }: {
  level: number; xp: number; streak: number;
  plant: ReturnType<typeof useGameStore.getState>['currentPlant'];
  totalSessions: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <GlassCard className="px-3 py-1.5 flex items-center gap-1.5">
        <span className="text-xp text-xs">⚡</span>
        <span className="text-[10px] text-text-secondary">Lv.{level}</span>
        <span className="text-[10px] text-text-muted">{xp} XP</span>
      </GlassCard>

      {streak > 0 && (
        <GlassCard className="px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-xs animate-fire">🔥</span>
          <span className="text-[10px] text-streak">{streak} day{streak !== 1 ? 's' : ''}</span>
        </GlassCard>
      )}

      {plant && !plant.dead && (
        <GlassCard className="px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-xs">
            {plant.stage === 'seed' ? '🌱' : plant.stage === 'sprout' ? '🌿' : plant.stage === 'sapling' ? '🌳' : plant.stage === 'tree' ? '🌲' : '✨'}
          </span>
          <span className="text-[10px] text-text-secondary capitalize">{plant.stage}</span>
        </GlassCard>
      )}

      {totalSessions > 0 && (
        <GlassCard className="px-3 py-1.5">
          <span className="text-[10px] text-text-muted">{totalSessions} sessions</span>
        </GlassCard>
      )}
    </div>
  );
}

export function TimerView() {
  const {
    status, mode, remainingMs, totalMs, sessionsCompleted,
    start, pause, resume, reset, skip, switchMode,
  } = useTimer();

  useAudio();
  useKeyboardShortcuts({ onStart: start, onPause: pause, onResume: resume, onReset: reset, onSkip: skip });

  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  const longBreakInterval = useSettingsStore((s) => s.settings.longBreakInterval);
  const totalSessions = useSessionStore((s) => s.totalSessions);
  const xp = useGameStore((s) => s.xp);
  const level = useGameStore((s) => s.level);
  const streak = useGameStore((s) => s.currentStreak);
  const plant = useGameStore((s) => s.currentPlant);

  const [showBreathing, setShowBreathing] = useState(false);
  const [showMixer, setShowMixer] = useState(false);

  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;
  const isBreak = mode !== 'focus';

  const message = useMemo(() => {
    const msgs = isBreak ? ENCOURAGING_MESSAGES.break : ENCOURAGING_MESSAGES.focus;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, [mode, isBreak]);

  const timerRing = (size: number, sw: number) => (
    <CircularProgress progress={progress} mode={mode} size={size} strokeWidth={sw}>
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] ${isBreak ? 'text-break-accent' : 'text-accent-glow'}`}>
          {modeLabels[mode]}
        </span>
        <TimerDisplay remainingMs={remainingMs} isRunning={status === 'running'} />
        <SessionDots count={sessionsCompleted % longBreakInterval} total={longBreakInterval} isBreak={isBreak} />
      </div>
    </CircularProgress>
  );

  /* ── LANDSCAPE LAYOUT ── */
  if (isLandscape) {
    return (
      <div className="flex items-center justify-center gap-8 lg:gap-16 w-full max-w-5xl mx-auto px-4">
        {/* Left: Timer ring */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="flex-shrink-0"
        >
          {timerRing(280, 4)}
        </motion.div>

        {/* Right: Controls + info */}
        <div className="flex flex-col items-center gap-4 min-w-0">
          <ModeSelector currentMode={mode} status={status} onSwitch={switchMode} />

          <TimerControls
            status={status}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
            onSkip={skip}
          />

          <AnimatePresence mode="wait">
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-text-secondary text-center px-2"
            >
              {message}
            </motion.p>
          </AnimatePresence>

          <StatsStrip level={level} xp={xp} streak={streak} plant={plant} totalSessions={totalSessions} />

          <div className="flex items-center gap-3">
            <DailyGoal />
            <button
              onClick={() => setShowMixer((v) => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer press-effect ${
                showMixer ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-secondary glass-light'
              }`}
            >
              🎵 Mixer
            </button>
          </div>
          <SoundMixer visible={showMixer} />

          {isBreak && status === 'running' && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowBreathing((v) => !v)}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer p-2"
              >
                {showBreathing ? 'Hide' : 'Show'} breathing exercise
              </button>
              <BreathingOrb active={showBreathing} />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── PORTRAIT LAYOUT ── */
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-md mx-auto">
      <ModeSelector currentMode={mode} status={status} onSwitch={switchMode} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        <div className="block sm:hidden">
          {timerRing(260, 4)}
        </div>
        <div className="hidden sm:block">
          {timerRing(340, 5)}
        </div>
      </motion.div>

      <TimerControls
        status={status}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onSkip={skip}
      />

      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xs sm:text-sm text-text-secondary text-center px-4"
        >
          {message}
        </motion.p>
      </AnimatePresence>

      <StatsStrip level={level} xp={xp} streak={streak} plant={plant} totalSessions={totalSessions} />

      <div className="flex items-center gap-3">
        <DailyGoal />
        <button
          onClick={() => setShowMixer((v) => !v)}
          className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer press-effect ${
            showMixer ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-secondary glass-light'
          }`}
        >
          🎵 Mixer
        </button>
      </div>
      <SoundMixer visible={showMixer} />

      {isBreak && status === 'running' && (
        <div className="mt-2 sm:mt-4 flex flex-col items-center">
          <button
            onClick={() => setShowBreathing((v) => !v)}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer mb-3 p-2"
          >
            {showBreathing ? 'Hide' : 'Show'} breathing exercise
          </button>
          <BreathingOrb active={showBreathing} />
        </div>
      )}
    </div>
  );
}
