import { useCallback, useRef, useState } from 'react';
import { useSessionStore } from '../../store/session-store.ts';
import { useGameStore } from '../../store/game-store.ts';

function formatDuration(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function ShareStats() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { totalSessions, totalFocusMs, sessions } = useSessionStore();
  const { level, xp, currentStreak, garden } = useGameStore();

  const todaySessions = sessions.filter((s) => {
    const today = new Date().toISOString().slice(0, 10);
    return s.mode === 'focus' && s.completed && new Date(s.completedAt).toISOString().slice(0, 10) === today;
  });
  const todayMs = todaySessions.reduce((sum, s) => sum + s.durationMs, 0);

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, '#0a0a12');
    grad.addColorStop(1, '#16132a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 24px system-ui';
    ctx.fillText('Focus', 30, 45);
    ctx.fillStyle = '#f1f0f5';
    ctx.fillText(' Universe', 30 + ctx.measureText('Focus').width, 45);

    ctx.fillStyle = '#5e576e';
    ctx.font = '12px system-ui';
    ctx.fillText('Weekly Focus Report', 30, 70);

    const stats = [
      { label: 'Today', value: `${todaySessions.length} sessions · ${formatDuration(todayMs)}` },
      { label: 'Total Sessions', value: `${totalSessions}` },
      { label: 'Total Focus', value: formatDuration(totalFocusMs) },
      { label: 'Level', value: `${level} (${xp} XP)` },
      { label: 'Streak', value: `${currentStreak} days 🔥` },
      { label: 'Garden', value: `${garden.length} plants 🌱` },
    ];

    stats.forEach((stat, i) => {
      const y = 110 + i * 45;
      ctx.fillStyle = 'rgba(31, 27, 56, 0.6)';
      ctx.beginPath();
      ctx.roundRect(30, y - 15, 540, 38, 8);
      ctx.fill();

      ctx.fillStyle = '#a09cb5';
      ctx.font = '12px system-ui';
      ctx.fillText(stat.label, 45, y + 5);

      ctx.fillStyle = '#f1f0f5';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(stat.value, 555, y + 5);
      ctx.textAlign = 'left';
    });

    ctx.fillStyle = '#5e576e';
    ctx.font = '10px system-ui';
    ctx.fillText('focusuniverse.app', 30, 385);

    const url = canvas.toDataURL('image/png');
    setImageUrl(url);
  }, [todaySessions, todayMs, totalSessions, totalFocusMs, level, xp, currentStreak, garden]);

  const shareImage = useCallback(async () => {
    if (!imageUrl) return;

    if (navigator.share) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], 'focus-universe-stats.png', { type: 'image/png' });
        await navigator.share({
          title: 'My Focus Universe Stats',
          text: `Level ${level} · ${totalSessions} sessions · ${currentStreak} day streak 🔥`,
          files: [file],
        });
        return;
      } catch { /* fallback below */ }
    }

    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'focus-universe-stats.png';
    a.click();
  }, [imageUrl, level, totalSessions, currentStreak]);

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <canvas ref={canvasRef} className="hidden" />

      {!imageUrl ? (
        <button
          onClick={generateImage}
          className="bg-accent text-white px-4 py-2 rounded-lg text-sm hover:bg-accent-glow transition-colors cursor-pointer press-effect"
        >
          📸 Generate Stats Card
        </button>
      ) : (
        <>
          <img src={imageUrl} alt="Stats" className="w-full max-w-sm rounded-lg shadow-lg" />
          <div className="flex gap-2">
            <button
              onClick={shareImage}
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm hover:bg-accent-glow transition-colors cursor-pointer press-effect"
            >
              📤 Share / Download
            </button>
            <button
              onClick={() => setImageUrl(null)}
              className="bg-surface-light text-text-secondary px-4 py-2 rounded-lg text-sm hover:text-text-primary transition-colors cursor-pointer press-effect"
            >
              ✕ Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}
