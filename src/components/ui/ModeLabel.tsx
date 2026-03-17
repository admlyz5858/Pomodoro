import type { TimerMode } from '../../core/types.ts';

interface ModeLabelProps {
  mode: TimerMode;
}

const labels: Record<TimerMode, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export function ModeLabel({ mode }: ModeLabelProps) {
  const isBreak = mode !== 'focus';

  return (
    <span
      className={`text-sm font-medium uppercase tracking-widest ${
        isBreak ? 'text-break-accent' : 'text-accent-glow'
      }`}
    >
      {labels[mode]}
    </span>
  );
}
