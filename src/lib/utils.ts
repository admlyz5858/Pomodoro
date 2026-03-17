import { differenceInCalendarDays, format } from 'date-fns'

export const formatClock = (seconds: number): string => {
  const safe = Math.max(0, seconds)
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const toISODate = (date = new Date()): string => format(date, 'yyyy-MM-dd')

export const isSameDay = (a?: string | null, b?: string | null): boolean => {
  if (!a || !b) {
    return false
  }

  return a === b
}

export const isConsecutiveDay = (previous: string | null, current: string): boolean => {
  if (!previous) {
    return false
  }

  return differenceInCalendarDays(new Date(current), new Date(previous)) === 1
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const randomOf = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]
