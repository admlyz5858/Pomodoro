import type { Session } from '../../core/types.ts';

interface HeatmapProps {
  sessions: Session[];
}

function getIntensity(count: number): string {
  if (count === 0) return 'bg-surface-light';
  if (count === 1) return 'bg-accent/30';
  if (count <= 3) return 'bg-accent/50';
  if (count <= 5) return 'bg-accent/70';
  return 'bg-accent';
}

export function Heatmap({ sessions }: HeatmapProps) {
  const dayMap = new Map<string, number>();
  sessions
    .filter((s) => s.mode === 'focus' && s.completed)
    .forEach((s) => {
      const key = new Date(s.completedAt).toISOString().slice(0, 10);
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    });

  const weeks = 12;
  const today = new Date();
  const days: { date: string; count: number }[] = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: dayMap.get(key) ?? 0 });
  }

  const grid: { date: string; count: number }[][] = [];
  for (let w = 0; w < weeks; w++) {
    grid.push(days.slice(w * 7, w * 7 + 7));
  }

  return (
    <div>
      <div className="flex gap-[3px]">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors`}
                title={`${day.date}: ${day.count} sessions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-text-muted">Less</span>
        {[0, 1, 3, 5, 7].map((n) => (
          <div key={n} className={`w-3 h-3 rounded-sm ${getIntensity(n)}`} />
        ))}
        <span className="text-[10px] text-text-muted">More</span>
      </div>
    </div>
  );
}
