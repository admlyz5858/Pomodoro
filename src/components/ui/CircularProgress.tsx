import type { TimerMode } from '../../core/types.ts';

interface CircularProgressProps {
  progress: number;
  mode: TimerMode;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function CircularProgress({
  progress,
  mode,
  size = 320,
  strokeWidth = 6,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const center = size / 2;

  const isBreak = mode !== 'focus';
  const strokeColor = isBreak ? 'url(#breakGradient)' : 'url(#focusGradient)';
  const glowColor = isBreak ? 'rgba(52, 211, 153, 0.3)' : 'rgba(139, 92, 246, 0.3)';
  const glowId = isBreak ? 'breakGlow' : 'focusGlow';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-light"
          opacity={0.4}
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#${glowId})`}
          style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
        />

        {progress > 0 && progress < 1 && (
          <circle
            cx={center + radius * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
            cy={center + radius * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
            r={strokeWidth / 2 + 2}
            fill={glowColor}
            style={{ transition: 'cx 0.15s ease-out, cy 0.15s ease-out' }}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
