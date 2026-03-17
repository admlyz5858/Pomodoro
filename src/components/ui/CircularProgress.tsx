import type { ReactNode } from 'react';
import type { TimerMode } from '../../core/types.ts';

interface CircularProgressProps {
  progress: number;
  mode: TimerMode;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

export function CircularProgress({
  progress,
  mode,
  size = 340,
  strokeWidth = 5,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const center = size / 2;

  const isBreak = mode !== 'focus';
  const gradientId = isBreak ? 'breakGrad' : 'focusGrad';
  const glowColor = isBreak ? 'rgba(52, 211, 153, 0.4)' : 'rgba(139, 92, 246, 0.4)';

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer ambient glow */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: size + 40,
          height: size + 40,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <defs>
          <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="breakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
          <filter id="progressGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Track marks */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const isMajor = i % 5 === 0;
          const innerR = radius - (isMajor ? 10 : 6);
          const outerR = radius - 2;
          return (
            <line
              key={i}
              x1={center + innerR * Math.cos(angle)}
              y1={center + innerR * Math.sin(angle)}
              x2={center + outerR * Math.cos(angle)}
              y2={center + outerR * Math.sin(angle)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={isMajor ? 1.5 : 0.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#progressGlow)"
          style={{ transition: 'stroke-dashoffset 0.2s ease-out' }}
        />

        {/* Leading dot */}
        {progress > 0.001 && progress < 0.999 && (() => {
          const angle = 2 * Math.PI * progress - Math.PI / 2;
          return (
            <circle
              cx={center + radius * Math.cos(angle)}
              cy={center + radius * Math.sin(angle)}
              r={strokeWidth}
              fill={isBreak ? '#34d399' : '#a78bfa'}
              filter="url(#progressGlow)"
              style={{ transition: 'cx 0.2s ease-out, cy 0.2s ease-out' }}
            />
          );
        })()}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
