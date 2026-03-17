const TICK_INTERVAL = 100;

export type TickCallback = (elapsedMs: number) => void;
export type CompleteCallback = () => void;

export class TimerEngine {
  private animFrameId: number | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private startTime = 0;
  private pausedElapsed = 0;
  private targetMs = 0;
  private onTick: TickCallback;
  private onComplete: CompleteCallback;
  private _isRunning = false;

  constructor(onTick: TickCallback, onComplete: CompleteCallback) {
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  get isRunning(): boolean {
    return this._isRunning;
  }

  start(targetMs: number, alreadyElapsedMs = 0): void {
    this.stop();
    this.targetMs = targetMs;
    this.pausedElapsed = alreadyElapsedMs;
    this.startTime = performance.now();
    this._isRunning = true;
    this.scheduleUpdates();
  }

  resume(): void {
    if (this._isRunning) return;
    this.startTime = performance.now();
    this._isRunning = true;
    this.scheduleUpdates();
  }

  pause(): number {
    if (!this._isRunning) return this.pausedElapsed;
    this.pausedElapsed += performance.now() - this.startTime;
    this._isRunning = false;
    this.cancelUpdates();
    return this.pausedElapsed;
  }

  stop(): void {
    this._isRunning = false;
    this.pausedElapsed = 0;
    this.startTime = 0;
    this.targetMs = 0;
    this.cancelUpdates();
  }

  getElapsedMs(): number {
    if (!this._isRunning) return this.pausedElapsed;
    return this.pausedElapsed + (performance.now() - this.startTime);
  }

  private scheduleUpdates(): void {
    this.cancelUpdates();

    const tick = () => {
      if (!this._isRunning) return;
      const elapsed = this.getElapsedMs();
      if (elapsed >= this.targetMs) {
        this._isRunning = false;
        this.cancelUpdates();
        this.onTick(this.targetMs);
        this.onComplete();
        return;
      }
      this.onTick(elapsed);
    };

    this.intervalId = setInterval(tick, TICK_INTERVAL);

    const rafLoop = () => {
      if (!this._isRunning) return;
      tick();
      this.animFrameId = requestAnimationFrame(rafLoop);
    };
    this.animFrameId = requestAnimationFrame(rafLoop);
  }

  private cancelUpdates(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  destroy(): void {
    this.stop();
  }
}
