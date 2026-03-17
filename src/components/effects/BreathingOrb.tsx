import { useState, useEffect } from 'react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { phase: Phase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4000, label: 'Breathe in' },
  { phase: 'hold', duration: 4000, label: 'Hold' },
  { phase: 'exhale', duration: 4000, label: 'Breathe out' },
  { phase: 'rest', duration: 2000, label: 'Rest' },
];

export function BreathingOrb({ active }: { active: boolean }) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const current = PHASES[phaseIndex];
    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, current.duration);
    return () => clearTimeout(timer);
  }, [phaseIndex, active]);

  if (!active) return null;

  const current = PHASES[phaseIndex];
  const isExpanding = current.phase === 'inhale';
  const isContracting = current.phase === 'exhale';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        {/* Outer glow */}
        <div
          className="absolute rounded-full transition-all"
          style={{
            width: isExpanding ? 110 : isContracting ? 60 : 80,
            height: isExpanding ? 110 : isContracting ? 60 : 80,
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            transitionDuration: `${current.duration}ms`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />
        {/* Orb */}
        <div
          className="rounded-full transition-all"
          style={{
            width: isExpanding ? 80 : isContracting ? 40 : 60,
            height: isExpanding ? 80 : isContracting ? 40 : 60,
            background: 'radial-gradient(circle at 35% 35%, rgba(167,139,250,0.6), rgba(139,92,246,0.3))',
            boxShadow: '0 0 40px rgba(139,92,246,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
            transitionDuration: `${current.duration}ms`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />
      </div>
      <span className="text-sm text-text-secondary animate-pulse-glow">
        {current.label}
      </span>
    </div>
  );
}
