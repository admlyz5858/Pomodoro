import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.focusuniverse.app',
  appName: 'Focus Universe',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#8b5cf6',
    },
    BackgroundRunner: {
      label: 'com.focusuniverse.background',
      src: 'background.js',
      event: 'timerTick',
      repeat: true,
      interval: 1,
      autoStart: true,
    },
  },
};

export default config;
