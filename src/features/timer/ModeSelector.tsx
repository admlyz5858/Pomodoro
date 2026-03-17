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
    <div className="flex items-center gap-1 rounded-full bg-surface/80 p-1 backdrop-blur-sm">
      {modes.map(({ key, label }) => {
        const active = key === currentMode;
        return (
          <button
            key={key}
            onClick={() => onSwitch(key)}
            disabled={disabled}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 cursor-pointer select-none
              ${active
                ? 'bg-surface-light text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
