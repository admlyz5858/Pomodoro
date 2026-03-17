import { useMemo } from 'react';
import { useSessionStore } from '../../store/session-store.ts';
import { useSettingsStore } from '../../store/settings-store.ts';

export function DailyGoal() {
  const sessions = useSessionStore((s) => s.sessions);
  const dailyGoal = useSettingsStore((s) => s.settings.dailyGoal ?? 8);

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return sessions.filter(
      (s) => s.mode === 'focus' && s.completed && new Date(s.completedAt).toISOString().slice(0, 10) === today,
    ).length;
  }, [sessions]);

  const pct = Math.min(100, (todayCount / dailyGoal) * 100);
  const done = todayCount >= dailyGoal;

  return (
    <div className="flex items-center gap-2 w-full max-w-[160px]">
      <div className="relative w-9 h-9 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none"
            stroke={done ? '#34d399' : '#8b5cf6'}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${pct * 0.9425} 94.25`}
            style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
          {done ? '✓' : `${todayCount}`}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-text-secondary truncate">
          {done ? 'Goal reached!' : `${todayCount}/${dailyGoal} sessions`}
        </p>
        <p className="text-[9px] text-text-muted">Daily goal</p>
      </div>
    </div>
  );
}
