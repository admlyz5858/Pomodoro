import type { TimerStatus } from '../../core/types.ts';
import { ControlButton } from '../../components/ui/ControlButton.tsx';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

export function TimerControls({
  status, onStart, onPause, onResume, onReset, onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <ControlButton onClick={onReset} variant="ghost" size="sm" ariaLabel="Reset timer">
        <ResetIcon />
      </ControlButton>

      {status === 'idle' && (
        <ControlButton onClick={onStart} variant="primary" size="lg" ariaLabel="Start timer">
          <PlayIcon />
          <span className="ml-2">Start</span>
        </ControlButton>
      )}

      {status === 'running' && (
        <ControlButton onClick={onPause} variant="primary" size="lg" ariaLabel="Pause timer">
          <PauseIcon />
          <span className="ml-2">Pause</span>
        </ControlButton>
      )}

      {status === 'paused' && (
        <ControlButton onClick={onResume} variant="primary" size="lg" ariaLabel="Resume timer">
          <PlayIcon />
          <span className="ml-2">Resume</span>
        </ControlButton>
      )}

      <ControlButton onClick={onSkip} variant="ghost" size="sm" ariaLabel="Skip to next">
        <SkipIcon />
      </ControlButton>
    </div>
  );
}
