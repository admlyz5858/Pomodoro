import { useMemo } from 'react';
import { useSessionStore } from '../../store/session-store.ts';
import { useGameStore } from '../../store/game-store.ts';
import { GlassCard } from '../../components/ui/GlassCard.tsx';
import { Heatmap } from './Heatmap.tsx';

function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function StatsView() {
  const { sessions, totalFocusMs, totalSessions } = useSessionStore();
  const { level, xp, currentStreak, longestStreak, garden } = useGameStore();

  const todaySessions = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return sessions.filter(
      (s) => s.mode === 'focus' && s.completed && new Date(s.completedAt).toISOString().slice(0, 10) === today,
    );
  }, [sessions]);

  const todayFocusMs = todaySessions.reduce((sum, s) => sum + s.durationMs, 0);

  const weekSessions = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    return sessions.filter((s) => s.mode === 'focus' && s.completed && s.completedAt > weekAgo);
  }, [sessions]);

  const weekFocusMs = weekSessions.reduce((sum, s) => sum + s.durationMs, 0);

  const dailyAvg = weekSessions.length > 0 ? weekFocusMs / 7 : 0;

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[70vh]">
      {/* Today */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Today</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-light">{todaySessions.length}</p>
            <p className="text-xs text-text-muted">Sessions</p>
          </div>
          <div>
            <p className="text-2xl font-light">{formatDuration(todayFocusMs)}</p>
            <p className="text-xs text-text-muted">Focus time</p>
          </div>
        </div>
      </GlassCard>

      {/* Weekly */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-3">This Week</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-light">{weekSessions.length}</p>
            <p className="text-xs text-text-muted">Sessions</p>
          </div>
          <div>
            <p className="text-2xl font-light">{formatDuration(weekFocusMs)}</p>
            <p className="text-xs text-text-muted">Focus time</p>
          </div>
          <div>
            <p className="text-2xl font-light">{formatDuration(dailyAvg)}</p>
            <p className="text-xs text-text-muted">Daily avg</p>
          </div>
        </div>
      </GlassCard>

      {/* Heatmap */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Activity (12 weeks)</h3>
        <Heatmap sessions={sessions} />
      </GlassCard>

      {/* All time */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-3">All Time</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-light">{totalSessions}</p>
            <p className="text-xs text-text-muted">Total sessions</p>
          </div>
          <div>
            <p className="text-2xl font-light">{formatDuration(totalFocusMs)}</p>
            <p className="text-xs text-text-muted">Total focus</p>
          </div>
          <div>
            <p className="text-2xl font-light">Lv.{level}</p>
            <p className="text-xs text-text-muted">{xp} XP</p>
          </div>
          <div>
            <p className="text-2xl font-light flex items-center gap-1">
              {currentStreak > 0 && <span className="animate-fire text-base">🔥</span>}
              {longestStreak}
            </p>
            <p className="text-xs text-text-muted">Best streak</p>
          </div>
          <div>
            <p className="text-2xl font-light">{garden.length}</p>
            <p className="text-xs text-text-muted">Plants grown</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
