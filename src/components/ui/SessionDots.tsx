interface SessionDotsProps {
  completed: number;
  total: number;
}

export function SessionDots({ completed, total }: SessionDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i < completed
              ? 'bg-accent scale-110 shadow-sm shadow-accent/50'
              : 'bg-surface-light'
          }`}
        />
      ))}
    </div>
  );
}
