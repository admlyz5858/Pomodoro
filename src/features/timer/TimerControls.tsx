import { motion } from 'framer-motion';
import type { TimerStatus } from '../../core/types.ts';
import { audioEngine } from '../../core/audio-engine.ts';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

function IconBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => { audioEngine.playClick(); onClick(); }}
      aria-label={label}
      className="glass-light flex h-11 w-11 items-center justify-center rounded-full text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
    >
      {children}
    </motion.button>
  );
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => { audioEngine.playClick(); onClick(); }}
      className="flex h-14 items-center gap-2 rounded-full bg-accent px-10 text-sm font-semibold text-white shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-shadow cursor-pointer"
    >
      {children}
    </motion.button>
  );
}

export function TimerControls({
  status, onStart, onPause, onResume, onReset, onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <IconBtn onClick={onReset} label="Reset">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </IconBtn>

      {status === 'idle' && (
        <PrimaryBtn onClick={onStart}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          Start
        </PrimaryBtn>
      )}

      {status === 'running' && (
        <PrimaryBtn onClick={onPause}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          Pause
        </PrimaryBtn>
      )}

      {status === 'paused' && (
        <PrimaryBtn onClick={onResume}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          Resume
        </PrimaryBtn>
      )}

      <IconBtn onClick={onSkip} label="Skip">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
      </IconBtn>
    </div>
  );
}
