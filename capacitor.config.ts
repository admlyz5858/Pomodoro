import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.focusuniverse.app',
  appName: 'Focus Universe',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: '#020617',
      showSpinner: false,
    },
  },
}

export default config
