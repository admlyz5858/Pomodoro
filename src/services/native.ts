import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

const isNative = Capacitor.isNativePlatform();

export const NativeService = {
  get isNative() {
    return isNative;
  },

  async initialize(): Promise<void> {
    if (!isNative) return;

    await SplashScreen.hide();

    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0a0a12' });
    await StatusBar.setOverlaysWebView({ overlay: true });

    await LocalNotifications.requestPermissions();

    try {
      await LocalNotifications.createChannel({
        id: 'tasks_lockscreen',
        name: 'Lock Screen Tasks',
        description: 'Shows your to-do list on the lock screen',
        importance: 4,
        visibility: 1,
        vibration: false,
        sound: '',
      });
    } catch {
      // Channel might already exist
    }

    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.minimizeApp();
      }
    });
  },

  async vibrate(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'medium'): Promise<void> {
    if (!isNative) {
      if ('vibrate' in navigator) navigator.vibrate(type === 'light' ? 10 : type === 'heavy' ? 50 : 25);
      return;
    }

    switch (type) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case 'warning':
        await Haptics.notification({ type: NotificationType.Warning });
        break;
    }
  },

  async showTimerNotification(title: string, body: string): Promise<void> {
    if (!isNative) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1001,
          title,
          body,
          ongoing: true,
          autoCancel: false,
          smallIcon: 'ic_stat_focus',
          largeIcon: 'ic_launcher',
          channelId: 'timer',
        },
      ],
    });
  },

  async showCompletionNotification(title: string, body: string): Promise<void> {
    const useNative = isNative;

    if (useNative) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1002,
            title,
            body,
            smallIcon: 'ic_stat_focus',
            largeIcon: 'ic_launcher',
            channelId: 'timer',
            sound: 'notification.wav',
          },
        ],
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: './favicon.svg' });
    } else if ('Notification' in window && Notification.permission === 'default') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification(title, { body, icon: './favicon.svg' });
      }
    }
  },

  async cancelTimerNotification(): Promise<void> {
    if (!isNative) return;
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
  },

  async requestWakeLock(): Promise<WakeLockSentinel | null> {
    if ('wakeLock' in navigator) {
      try {
        return await navigator.wakeLock.request('screen');
      } catch {
        return null;
      }
    }
    return null;
  },

  async keepScreenOn(on: boolean): Promise<void> {
    if (!isNative && 'wakeLock' in navigator) {
      if (on) {
        (globalThis as Record<string, unknown>).__wakeLock = await this.requestWakeLock();
      } else {
        const lock = (globalThis as Record<string, unknown>).__wakeLock as WakeLockSentinel | undefined;
        if (lock) {
          await lock.release();
          (globalThis as Record<string, unknown>).__wakeLock = null;
        }
      }
    }
  },
};
