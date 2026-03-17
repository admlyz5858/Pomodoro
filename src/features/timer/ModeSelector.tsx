import type { TimerMode, TimerStatus } from '../../core/types.ts';

interface ModeSelectorProps {
  currentMode: TimerMode;
  status: TimerStatus;
  onSwitch: (mode: TimerMode) => void;
}

const modes: { key: TimerMode; label: string }[] = [
  { key: 'focus', label: 'Focus' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' },
];

export function ModeSelector({ currentMode, status, onSwitch }: ModeSelectorProps) {
  const disabled = status === 'running';

  return (
    <div className="glass-light flex items-center gap-1 rounded-full p-1">
      {modes.map(({ key, label }) => {
        const active = key === currentMode;
        return (
          <button
            key={key}
            onClick={() => onSwitch(key)}
            disabled={disabled}
            className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 cursor-pointer select-none
              ${active
                ? 'bg-surface-light text-text-primary shadow-lg shadow-accent/10'
                : 'text-text-muted hover:text-text-secondary'}
              ${disabled ? 'opacity-40 cursor-not-allowed' : 'press-effect'}
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
