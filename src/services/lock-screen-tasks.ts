import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { Task } from '../core/types.ts';

const NOTIFICATION_ID = 9999;

function buildTaskBody(tasks: Task[]): string {
  const pending = tasks.filter((t) => !t.completed);
  if (pending.length === 0) return '✅ All tasks complete!';

  return pending
    .slice(0, 8)
    .map((t, i) => `${i + 1}. ${t.title}  (${t.completedPomodoros}/${t.estimatedPomodoros} 🍅)`)
    .join('\n') + (pending.length > 8 ? `\n+${pending.length - 8} more...` : '');
}

function buildTitle(tasks: Task[]): string {
  const pending = tasks.filter((t) => !t.completed);
  if (pending.length === 0) return '✅ All tasks complete!';
  return `📋 ${pending.length} task${pending.length !== 1 ? 's' : ''} to do`;
}

export const LockScreenTasksService = {
  async syncTasks(tasks: Task[]): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    const enabled = localStorage.getItem('focus-universe-lockscreen-tasks') === 'true';
    if (!enabled) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: NOTIFICATION_ID,
            title: buildTitle(tasks),
            body: buildTaskBody(tasks),
            ongoing: true,
            autoCancel: false,
            smallIcon: 'ic_stat_focus',
            channelId: 'tasks_lockscreen',
          },
        ],
      });
    } catch {
      // Notification permission not granted or other error
    }
  },

  async setEnabled(enabled: boolean): Promise<void> {
    localStorage.setItem('focus-universe-lockscreen-tasks', enabled ? 'true' : 'false');

    if (!Capacitor.isNativePlatform()) return;

    if (enabled) {
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') return;
    } else {
      try {
        await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
      } catch {
        // ok
      }
    }
  },

  async isEnabled(): Promise<boolean> {
    return localStorage.getItem('focus-universe-lockscreen-tasks') === 'true';
  },
};
