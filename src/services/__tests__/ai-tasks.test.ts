import { describe, it, expect } from 'vitest';
import { splitTaskWithAI } from '../ai-tasks.ts';

describe('splitTaskWithAI (offline fallback)', () => {
  it('splits "Study physics 3 hours" into subtasks', async () => {
    const tasks = await splitTaskWithAI('Study physics 3 hours');
    expect(tasks.length).toBeGreaterThanOrEqual(1);
    tasks.forEach((t) => {
      expect(t.title).toBeTruthy();
      expect(t.estimatedPomodoros).toBeGreaterThan(0);
      expect(t.completedPomodoros).toBe(0);
      expect(t.completed).toBe(false);
    });
  });

  it('splits a short task into single item', async () => {
    const tasks = await splitTaskWithAI('Read chapter 25 minutes');
    expect(tasks.length).toBeGreaterThanOrEqual(1);
    const total = tasks.reduce((s, t) => s + t.estimatedPomodoros, 0);
    expect(total).toBeGreaterThanOrEqual(1);
  });

  it('handles input without explicit time', async () => {
    const tasks = await splitTaskWithAI('Do homework');
    expect(tasks.length).toBeGreaterThanOrEqual(1);
  });

  it('handles pomodoro units', async () => {
    const tasks = await splitTaskWithAI('Work on project 4 pomodoros');
    const total = tasks.reduce((s, t) => s + t.estimatedPomodoros, 0);
    expect(total).toBeGreaterThanOrEqual(3);
  });
});
