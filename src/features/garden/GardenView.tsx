import { motion } from 'framer-motion';
import { useGameStore } from '../../store/game-store.ts';
import { GlassCard } from '../../components/ui/GlassCard.tsx';
import { PlantDisplay } from './PlantDisplay.tsx';
import { getXpProgressInLevel } from '../../core/types.ts';

export function GardenView() {
  const { currentPlant, garden, xp, level, currentStreak, longestStreak } = useGameStore();
  const xpProgress = getXpProgressInLevel(xp);
  const progressPct = (xpProgress.current / xpProgress.required) * 100;

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[70vh]">
      {/* Current plant */}
      <GlassCard className="p-6 flex flex-col items-center gap-3">
        <h3 className="text-sm font-medium text-text-secondary">Current Plant</h3>
        {currentPlant ? (
          <>
            <PlantDisplay plant={currentPlant} size="lg" />
            <div className="w-full max-w-48">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span className="capitalize">{currentPlant.stage}</span>
                <span>{currentPlant.sessionsGiven}/10 sessions</span>
              </div>
              <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPlant.growthProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="text-text-muted text-sm">Start a session to plant a seed!</p>
        )}
      </GlassCard>

      {/* Level & XP */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Level {level}</span>
          <span className="text-xs text-text-muted">{xpProgress.current}/{xpProgress.required} XP</span>
        </div>
        <div className="h-2 rounded-full bg-surface-light overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-xp to-yellow-300"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">Total: {xp} XP</p>
      </GlassCard>

      {/* Streak */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium flex items-center gap-2">
            {currentStreak > 0 && <span className="animate-fire">🔥</span>}
            {currentStreak} day streak
          </p>
          <p className="text-xs text-text-muted">Best: {longestStreak} days</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${i < currentStreak ? 'bg-streak' : 'bg-surface-light'}`}
            />
          ))}
        </div>
      </GlassCard>

      {/* Garden collection */}
      {garden.length > 0 && (
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium mb-3">Garden ({garden.length} plants)</h3>
          <div className="grid grid-cols-5 gap-3">
            {garden.slice(0, 20).map((p) => (
              <motion.div
                key={p.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <PlantDisplay plant={p} size="sm" />
                <span className="text-[10px] text-text-muted capitalize">{p.species}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
