interface TimerDisplayProps {
  remainingMs: number;
}

function padTwo(n: number): string {
  return n.toString().padStart(2, '0');
}

export function TimerDisplay({ remainingMs }: TimerDisplayProps) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-7xl font-light tracking-tight text-text-primary tabular-nums select-none"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {padTwo(minutes)}:{padTwo(seconds)}
      </span>
    </div>
  );
}
