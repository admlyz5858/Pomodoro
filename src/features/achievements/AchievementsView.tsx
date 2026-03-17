import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/game-store.ts';
import { useSessionStore } from '../../store/session-store.ts';
import { GlassCard } from '../../components/ui/GlassCard.tsx';

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  check: (stats: AchievementStats) => boolean;
}

interface AchievementStats {
  totalSessions: number;
  totalFocusMs: number;
  level: number;
  streak: number;
  longestStreak: number;
  gardenSize: number;
  xp: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-focus', emoji: '🌅', title: 'First Light', description: 'Complete your first focus session', check: (s) => s.totalSessions >= 1 },
  { id: '10-sessions', emoji: '🔟', title: 'Getting Started', description: 'Complete 10 focus sessions', check: (s) => s.totalSessions >= 10 },
  { id: '50-sessions', emoji: '💪', title: 'Dedicated', description: 'Complete 50 focus sessions', check: (s) => s.totalSessions >= 50 },
  { id: '100-sessions', emoji: '💎', title: 'Diamond Focus', description: 'Complete 100 focus sessions', check: (s) => s.totalSessions >= 100 },
  { id: '500-sessions', emoji: '👑', title: 'Focus Royalty', description: 'Complete 500 focus sessions', check: (s) => s.totalSessions >= 500 },
  { id: 'streak-3', emoji: '🔥', title: 'On Fire', description: 'Reach a 3-day streak', check: (s) => s.longestStreak >= 3 },
  { id: 'streak-7', emoji: '🌟', title: 'Weekly Warrior', description: 'Reach a 7-day streak', check: (s) => s.longestStreak >= 7 },
  { id: 'streak-30', emoji: '🏆', title: 'Monthly Master', description: 'Reach a 30-day streak', check: (s) => s.longestStreak >= 30 },
  { id: 'streak-100', emoji: '⚡', title: 'Legendary', description: 'Reach a 100-day streak', check: (s) => s.longestStreak >= 100 },
  { id: 'level-5', emoji: '⭐', title: 'Rising Star', description: 'Reach Level 5', check: (s) => s.level >= 5 },
  { id: 'level-10', emoji: '🌙', title: 'Night Owl', description: 'Reach Level 10', check: (s) => s.level >= 10 },
  { id: 'level-25', emoji: '☀️', title: 'Supernova', description: 'Reach Level 25', check: (s) => s.level >= 25 },
  { id: 'garden-1', emoji: '🌱', title: 'First Bloom', description: 'Grow your first plant to completion', check: (s) => s.gardenSize >= 1 },
  { id: 'garden-5', emoji: '🌳', title: 'Gardener', description: 'Grow 5 plants to completion', check: (s) => s.gardenSize >= 5 },
  { id: 'garden-20', emoji: '🌲', title: 'Forest Keeper', description: 'Grow 20 plants to completion', check: (s) => s.gardenSize >= 20 },
  { id: 'focus-1h', emoji: '⏰', title: 'Hour of Power', description: 'Accumulate 1 hour of focus time', check: (s) => s.totalFocusMs >= 3600000 },
  { id: 'focus-10h', emoji: '🧠', title: 'Deep Thinker', description: 'Accumulate 10 hours of focus time', check: (s) => s.totalFocusMs >= 36000000 },
  { id: 'focus-100h', emoji: '🚀', title: 'Centurion', description: 'Accumulate 100 hours of focus time', check: (s) => s.totalFocusMs >= 360000000 },
  { id: 'xp-1000', emoji: '✨', title: 'XP Hunter', description: 'Earn 1,000 XP total', check: (s) => s.xp >= 1000 },
  { id: 'xp-10000', emoji: '💫', title: 'XP Legend', description: 'Earn 10,000 XP total', check: (s) => s.xp >= 10000 },
];

export function AchievementsView() {
  const { level, xp, currentStreak, longestStreak, garden } = useGameStore();
  const { totalSessions, totalFocusMs } = useSessionStore();

  const stats: AchievementStats = useMemo(() => ({
    totalSessions, totalFocusMs, level, xp,
    streak: currentStreak, longestStreak,
    gardenSize: garden.length,
  }), [totalSessions, totalFocusMs, level, xp, currentStreak, longestStreak, garden.length]);

  const unlocked = ACHIEVEMENTS.filter((a) => a.check(stats));
  const locked = ACHIEVEMENTS.filter((a) => !a.check(stats));

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[70vh]">
      <div className="text-center mb-1">
        <p className="text-2xl font-light">{unlocked.length}<span className="text-text-muted text-sm">/{ACHIEVEMENTS.length}</span></p>
        <p className="text-xs text-text-muted">Achievements Unlocked</p>
      </div>

      {unlocked.length > 0 && (
        <div>
          <h3 className="text-xs text-text-muted uppercase tracking-wider mb-2 px-1">Unlocked</h3>
          <div className="grid grid-cols-2 gap-2">
            {unlocked.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <GlassCard className="p-3 flex items-start gap-2">
                  <span className="text-xl">{a.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{a.title}</p>
                    <p className="text-[10px] text-text-muted">{a.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className="text-xs text-text-muted uppercase tracking-wider mb-2 px-1">Locked</h3>
          <div className="grid grid-cols-2 gap-2">
            {locked.map((a) => (
              <GlassCard key={a.id} className="p-3 flex items-start gap-2 opacity-40">
                <span className="text-xl grayscale">🔒</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-muted truncate">{a.title}</p>
                  <p className="text-[10px] text-text-muted">{a.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
