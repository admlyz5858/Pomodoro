import { useEffect, useRef } from 'react'

export const useWakeLock = (enabled: boolean): void => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) {
      return
    }

    let cancelled = false

    const requestLock = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      } catch (error) {
        if (!cancelled) {
          console.warn('Wake Lock could not be activated', error)
        }
      }
    }

    requestLock()

    return () => {
      cancelled = true
      wakeLockRef.current?.release()
      wakeLockRef.current = null
    }
  }, [enabled])
}
