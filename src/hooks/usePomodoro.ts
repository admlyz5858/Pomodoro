import { useEffect, useRef, useState } from 'react'
import { TimerMode } from '../types'

interface PomodoroOptions {
  focusSeconds: number
  breakSeconds: number
  autoStartBreak: boolean
  onModeSwitch?: (mode: TimerMode) => void
  onFinished?: (mode: TimerMode) => void
  onSecond?: (secondsLeft: number, totalSeconds: number, mode: TimerMode) => void
}

export const usePomodoro = ({
  focusSeconds,
  breakSeconds,
  autoStartBreak,
  onModeSwitch,
  onFinished,
  onSecond,
}: PomodoroOptions) => {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [isRunning, setIsRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(focusSeconds)

  const totalRef = useRef(focusSeconds)

  useEffect(() => {
    if (mode === 'focus') {
      totalRef.current = focusSeconds
      if (!isRunning) {
        setSecondsLeft(focusSeconds)
      }
    }
  }, [focusSeconds, isRunning, mode])

  useEffect(() => {
    if (mode === 'break') {
      totalRef.current = breakSeconds
      if (!isRunning) {
        setSecondsLeft(breakSeconds)
      }
    }
  }, [breakSeconds, isRunning, mode])

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((previous) => {
        const next = previous - 1
        const resolved = Math.max(0, next)
        onSecond?.(resolved, totalRef.current, mode)

        if (next <= 0) {
          onFinished?.(mode)
          const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus'
          const nextTotal = nextMode === 'focus' ? focusSeconds : breakSeconds
          totalRef.current = nextTotal
          setMode(nextMode)
          onModeSwitch?.(nextMode)

          if (nextMode === 'break') {
            setIsRunning(autoStartBreak)
          }

          return nextTotal
        }

        return resolved
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [autoStartBreak, breakSeconds, focusSeconds, isRunning, mode, onFinished, onModeSwitch, onSecond])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)

  const reset = (nextMode: TimerMode = mode) => {
    setMode(nextMode)
    const total = nextMode === 'focus' ? focusSeconds : breakSeconds
    totalRef.current = total
    setSecondsLeft(total)
    setIsRunning(false)
  }

  const skip = () => {
    const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus'
    setMode(nextMode)
    const total = nextMode === 'focus' ? focusSeconds : breakSeconds
    totalRef.current = total
    setSecondsLeft(total)
    onModeSwitch?.(nextMode)
  }

  const setModeManually = (nextMode: TimerMode) => {
    setMode(nextMode)
    const total = nextMode === 'focus' ? focusSeconds : breakSeconds
    totalRef.current = total
    setSecondsLeft(total)
    onModeSwitch?.(nextMode)
  }

  return {
    mode,
    isRunning,
    secondsLeft,
    totalSeconds: totalRef.current,
    start,
    pause,
    reset,
    skip,
    setMode: setModeManually,
  }
}
