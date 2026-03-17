import { motion } from 'framer-motion';
import { useGameStore } from '../../store/game-store.ts';
import { GlassCard } from '../../components/ui/GlassCard.tsx';

export function QuestPanel() {
  const quests = useGameStore((s) => s.quests);
  const daily = quests.filter((q) => q.type === 'daily');
  const weekly = quests.filter((q) => q.type === 'weekly');

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[70vh]">
      <QuestSection title="Daily Quests" quests={daily} />
      <QuestSection title="Weekly Quests" quests={weekly} />
    </div>
  );
}

function QuestSection({ title, quests }: { title: string; quests: ReturnType<typeof useGameStore.getState>['quests'] }) {
  return (
    <div>
      <h3 className="text-xs text-text-muted uppercase tracking-wider mb-2 px-1">{title}</h3>
      <div className="flex flex-col gap-2">
        {quests.map((q) => {
          const pct = Math.min(100, (q.progress / q.target) * 100);
          return (
            <GlassCard key={q.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${q.completed ? 'text-break-accent' : ''}`}>
                    {q.completed ? '✅ ' : ''}{q.title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{q.description}</p>
                </div>
                <span className="text-xs text-xp flex-shrink-0">+{q.rewardXp} XP</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-text-muted mb-1">
                  <span>{q.progress}/{q.target}</span>
                  <span>{Math.round(pct)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-light overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${q.completed ? 'bg-break-accent' : 'bg-accent'}`}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
