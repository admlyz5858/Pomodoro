import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.focusuniverse.app',
  appName: 'Focus Universe',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0a0a12',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      launchFadeOutDuration: 500,
      backgroundColor: '#0a0a12',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a12',
      overlaysWebView: true,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_focus',
      iconColor: '#8b5cf6',
      sound: 'notification.wav',
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
