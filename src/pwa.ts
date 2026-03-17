import { Workbox } from 'workbox-window'

export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  const wb = new Workbox('/sw.js')
  wb.register().catch((error) => {
    console.warn('Service worker registration failed', error)
  })
}
