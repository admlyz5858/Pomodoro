import type { ReactNode } from 'react';
import type { TimerMode } from '../../core/types.ts';
import { getThemeById } from '../../core/themes.ts';
import { useSettingsStore } from '../../store/settings-store.ts';

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
  const themeId = useSettingsStore((s) => s.settings.themeId);
  const theme = getThemeById(themeId);
  const style = theme.clockStyle;

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const center = size / 2;
  const isBreak = mode !== 'focus';
  const accent = isBreak ? 'var(--color-break-accent)' : 'var(--color-accent)';
  const accentGlow = isBreak ? 'var(--color-break-accent)' : 'var(--color-accent-glow)';

  const renderTrack = () => {
    switch (style) {
      case 'dots':
        return Array.from({ length: 60 }, (_, i) => {
          const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const r = radius;
          const filled = i / 60 <= progress;
          return (
            <circle
              key={i}
              cx={center + r * Math.cos(angle)}
              cy={center + r * Math.sin(angle)}
              r={i % 5 === 0 ? 2.5 : 1.2}
              fill={filled ? accent : 'rgba(255,255,255,0.06)'}
              style={{ transition: 'fill 0.3s ease' }}
            />
          );
        });

      case 'segments': {
        const segCount = 40;
        const gap = 0.015;
        return Array.from({ length: segCount }, (_, i) => {
          const startAngle = (i / segCount) * Math.PI * 2 - Math.PI / 2 + gap;
          const endAngle = ((i + 1) / segCount) * Math.PI * 2 - Math.PI / 2 - gap;
          const filled = i / segCount <= progress;
          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={filled ? accent : 'rgba(255,255,255,0.06)'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.3s ease' }}
            />
          );
        });
      }

      case 'dash': {
        const dashCount = 120;
        return Array.from({ length: dashCount }, (_, i) => {
          const angle = (i / dashCount) * Math.PI * 2 - Math.PI / 2;
          const len = i % 10 === 0 ? 12 : i % 5 === 0 ? 8 : 4;
          const outer = radius + 2;
          const inner = outer - len;
          const filled = i / dashCount <= progress;
          return (
            <line
              key={i}
              x1={center + inner * Math.cos(angle)}
              y1={center + inner * Math.sin(angle)}
              x2={center + outer * Math.cos(angle)}
              y2={center + outer * Math.sin(angle)}
              stroke={filled ? accent : 'rgba(255,255,255,0.05)'}
              strokeWidth={i % 10 === 0 ? 2 : 0.8}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.2s ease' }}
            />
          );
        });
      }

      case 'analog': {
        const hours = Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const outer = radius + 1;
          const inner = outer - 14;
          return (
            <line
              key={`h${i}`}
              x1={center + inner * Math.cos(angle)}
              y1={center + inner * Math.sin(angle)}
              x2={center + outer * Math.cos(angle)}
              y2={center + outer * Math.sin(angle)}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        });
        const minutes = Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const outer = radius + 1;
          const inner = outer - 6;
          return (
            <line
              key={`m${i}`}
              x1={center + inner * Math.cos(angle)}
              y1={center + inner * Math.sin(angle)}
              x2={center + outer * Math.cos(angle)}
              y2={center + outer * Math.sin(angle)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={0.8}
              strokeLinecap="round"
            />
          );
        });
        return <>{hours}{minutes}</>;
      }

      default:
        return null;
    }
  };

  const showArc = style === 'minimal' || style === 'thin' || style === 'arc' || style === 'glow' || style === 'analog';
  const arcWidth = style === 'thin' ? 2 : style === 'arc' ? strokeWidth + 2 : style === 'glow' ? strokeWidth + 1 : strokeWidth;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Subtle ambient glow */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: size + 30,
          height: size + 30,
          background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <defs>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track circle (for arc-based styles) */}
        {showArc && (
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={arcWidth}
          />
        )}

        {/* Custom track elements */}
        {renderTrack()}

        {/* Progress arc (for arc-based styles) */}
        {showArc && (
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke={accent}
            strokeWidth={arcWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={style === 'glow' ? 'url(#softGlow)' : undefined}
            style={{ transition: 'stroke-dashoffset 0.2s ease-out' }}
          />
        )}

        {/* Leading indicator */}
        {progress > 0.002 && progress < 0.998 && showArc && (
          <circle
            cx={center + radius * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
            cy={center + radius * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
            r={arcWidth / 2 + 1}
            fill={accentGlow}
            opacity={0.6}
            style={{ transition: 'cx 0.2s ease-out, cy 0.2s ease-out' }}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
