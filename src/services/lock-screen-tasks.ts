import { Capacitor, registerPlugin } from '@capacitor/core';
import type { Task } from '../core/types.ts';

interface LockScreenTasksPlugin {
  syncTasks(options: { tasksJson: string }): Promise<void>;
  setEnabled(options: { enabled: boolean }): Promise<void>;
  isEnabled(): Promise<{ enabled: boolean }>;
}

const LockScreenTasks = Capacitor.isNativePlatform()
  ? registerPlugin<LockScreenTasksPlugin>('LockScreenTasks')
  : null;

export const LockScreenTasksService = {
  async syncTasks(tasks: Task[]): Promise<void> {
    if (!LockScreenTasks) return;
    try {
      const simplified = tasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        estimatedPomodoros: t.estimatedPomodoros,
        completedPomodoros: t.completedPomodoros,
      }));
      await LockScreenTasks.syncTasks({ tasksJson: JSON.stringify(simplified) });
    } catch {
      // Bridge not available
    }
  },

  async setEnabled(enabled: boolean): Promise<void> {
    if (!LockScreenTasks) return;
    try {
      await LockScreenTasks.setEnabled({ enabled });
    } catch {
      // Bridge not available
    }
  },

  async isEnabled(): Promise<boolean> {
    if (!LockScreenTasks) return false;
    try {
      const result = await LockScreenTasks.isEnabled();
      return result.enabled;
    } catch {
      return false;
    }
  },
};
