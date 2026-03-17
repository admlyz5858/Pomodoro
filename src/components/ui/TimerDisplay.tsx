import { formatMs } from '../../core/types.ts';

interface TimerDisplayProps {
  remainingMs: number;
  isRunning: boolean;
}

export function TimerDisplay({ remainingMs, isRunning }: TimerDisplayProps) {
  const display = formatMs(remainingMs);
  const isLast10 = remainingMs <= 10000 && remainingMs > 0 && isRunning;

  return (
    <span
      className={`text-[5rem] leading-none font-extralight tracking-tight text-text-primary tabular-nums select-none transition-all duration-300 ${
        isLast10 ? 'text-glow-accent scale-105' : ''
      }`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {display}
    </span>
  );
}
