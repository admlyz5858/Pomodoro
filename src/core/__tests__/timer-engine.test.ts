import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TimerEngine } from '../timer-engine.ts';
import type { TickCallback, CompleteCallback } from '../timer-engine.ts';

describe('TimerEngine', () => {
  let onTick: TickCallback;
  let onComplete: CompleteCallback;

  beforeEach(() => {
    vi.useFakeTimers();
    onTick = vi.fn<TickCallback>();
    onComplete = vi.fn<CompleteCallback>();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes in stopped state', () => {
    const engine = new TimerEngine(onTick, onComplete);
    expect(engine.isRunning).toBe(false);
    engine.destroy();
  });

  it('starts running', () => {
    const engine = new TimerEngine(onTick, onComplete);
    engine.start(5000);
    expect(engine.isRunning).toBe(true);
    engine.destroy();
  });

  it('pauses and returns elapsed time', () => {
    const engine = new TimerEngine(onTick, onComplete);
    engine.start(10000);
    const elapsed = engine.pause();
    expect(engine.isRunning).toBe(false);
    expect(elapsed).toBeGreaterThanOrEqual(0);
    engine.destroy();
  });

  it('stops and resets', () => {
    const engine = new TimerEngine(onTick, onComplete);
    engine.start(5000);
    engine.stop();
    expect(engine.isRunning).toBe(false);
    expect(engine.getElapsedMs()).toBe(0);
    engine.destroy();
  });

  it('starts with already elapsed time', () => {
    const engine = new TimerEngine(onTick, onComplete);
    engine.start(10000, 5000);
    const elapsed = engine.getElapsedMs();
    expect(elapsed).toBeGreaterThanOrEqual(5000);
    engine.destroy();
  });
});
