import { describe, it, expect } from 'vitest';
import {
  getDurationForMode,
  getNextMode,
  getPlantStage,
  getLevelFromXp,
  getXpProgressInLevel,
  formatMs,
  DEFAULT_SETTINGS,
} from '../types.ts';

describe('getDurationForMode', () => {
  it('returns focus duration', () => {
    expect(getDurationForMode('focus', DEFAULT_SETTINGS)).toBe(25 * 60 * 1000);
  });

  it('returns short break duration', () => {
    expect(getDurationForMode('shortBreak', DEFAULT_SETTINGS)).toBe(5 * 60 * 1000);
  });

  it('returns long break duration', () => {
    expect(getDurationForMode('longBreak', DEFAULT_SETTINGS)).toBe(15 * 60 * 1000);
  });
});

describe('getNextMode', () => {
  it('returns short break after focus (not at interval)', () => {
    expect(getNextMode('focus', 1, 4)).toBe('shortBreak');
  });

  it('returns long break after focus at interval', () => {
    expect(getNextMode('focus', 4, 4)).toBe('longBreak');
  });

  it('returns focus after short break', () => {
    expect(getNextMode('shortBreak', 2, 4)).toBe('focus');
  });

  it('returns focus after long break', () => {
    expect(getNextMode('longBreak', 4, 4)).toBe('focus');
  });
});

describe('getPlantStage', () => {
  it('returns seed for 0 sessions', () => {
    expect(getPlantStage(0)).toBe('seed');
  });

  it('returns sprout for 1 session', () => {
    expect(getPlantStage(1)).toBe('sprout');
  });

  it('returns sapling for 3 sessions', () => {
    expect(getPlantStage(3)).toBe('sapling');
  });

  it('returns tree for 6 sessions', () => {
    expect(getPlantStage(6)).toBe('tree');
  });

  it('returns glowing for 10+ sessions', () => {
    expect(getPlantStage(10)).toBe('glowing');
    expect(getPlantStage(15)).toBe('glowing');
  });
});

describe('getLevelFromXp', () => {
  it('returns level 1 for 0 XP', () => {
    expect(getLevelFromXp(0)).toBe(1);
  });

  it('returns level 2 at 500 XP', () => {
    expect(getLevelFromXp(500)).toBe(2);
  });

  it('returns level 3 at 1500 XP', () => {
    expect(getLevelFromXp(1500)).toBe(3);
  });
});

describe('getXpProgressInLevel', () => {
  it('returns correct progress at start', () => {
    const p = getXpProgressInLevel(0);
    expect(p.current).toBe(0);
    expect(p.required).toBe(500);
  });

  it('returns correct progress mid-level', () => {
    const p = getXpProgressInLevel(250);
    expect(p.current).toBe(250);
    expect(p.required).toBe(500);
  });

  it('returns correct progress at level boundary', () => {
    const p = getXpProgressInLevel(500);
    expect(p.current).toBe(0);
    expect(p.required).toBe(1000);
  });
});

describe('formatMs', () => {
  it('formats 25 minutes correctly', () => {
    expect(formatMs(25 * 60 * 1000)).toBe('25:00');
  });

  it('formats 5 minutes correctly', () => {
    expect(formatMs(5 * 60 * 1000)).toBe('05:00');
  });

  it('formats with seconds correctly', () => {
    expect(formatMs(90000)).toBe('01:30');
  });

  it('formats zero', () => {
    expect(formatMs(0)).toBe('00:00');
  });

  it('rounds up partial seconds', () => {
    expect(formatMs(1500)).toBe('00:02');
  });
});
