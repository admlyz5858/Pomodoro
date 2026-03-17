export interface TimerPreset {
  id: string;
  name: string;
  emoji: string;
  focus: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  description: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'classic',
    name: 'Classic Pomodoro',
    emoji: '🍅',
    focus: 25 * 60000,
    shortBreak: 5 * 60000,
    longBreak: 15 * 60000,
    longBreakInterval: 4,
    description: '25/5/15 — The original technique',
  },
  {
    id: 'extended',
    name: 'Extended Focus',
    emoji: '🧠',
    focus: 50 * 60000,
    shortBreak: 10 * 60000,
    longBreak: 30 * 60000,
    longBreakInterval: 4,
    description: '50/10/30 — For deep work sessions',
  },
  {
    id: '52-17',
    name: 'DeskTime Method',
    emoji: '📊',
    focus: 52 * 60000,
    shortBreak: 17 * 60000,
    longBreak: 30 * 60000,
    longBreakInterval: 3,
    description: '52/17 — Science-backed productivity',
  },
  {
    id: '90-20',
    name: 'Ultradian',
    emoji: '🌊',
    focus: 90 * 60000,
    shortBreak: 20 * 60000,
    longBreak: 30 * 60000,
    longBreakInterval: 2,
    description: '90/20 — Natural body rhythm cycles',
  },
  {
    id: 'sprint',
    name: 'Quick Sprint',
    emoji: '⚡',
    focus: 15 * 60000,
    shortBreak: 3 * 60000,
    longBreak: 10 * 60000,
    longBreakInterval: 4,
    description: '15/3/10 — Short bursts of focus',
  },
  {
    id: 'study',
    name: 'Study Session',
    emoji: '📚',
    focus: 45 * 60000,
    shortBreak: 10 * 60000,
    longBreak: 20 * 60000,
    longBreakInterval: 3,
    description: '45/10/20 — Ideal for studying',
  },
];
