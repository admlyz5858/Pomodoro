import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Leaf, Play, Pause, RotateCcw, SkipForward, Sparkles, Volume2, Download } from 'lucide-react'
import { ENVIRONMENTS, ENCOURAGEMENTS, AUDIO_TRACKS } from './data/media'
import { AiPlannerPanel } from './components/AiPlannerPanel'
import { BreathingOrb } from './components/BreathingOrb'
import { GlassCard } from './components/GlassCard'
import { ImmersiveBackground } from './components/ImmersiveBackground'
import { MiniActivities } from './components/MiniActivities'
import { StatsPanel } from './components/StatsPanel'
import { usePomodoro } from './hooks/usePomodoro'
import { useWakeLock } from './hooks/useWakeLock'
import { AudioEngine } from './lib/audioEngine'
import { loadState, saveState } from './lib/db'
import { applySessionResult, createInitialState } from './lib/gameEngine'
import { formatClock, randomOf } from './lib/utils'
import { exportTimerVideo } from './lib/videoExport'
import { AppState, FocusSession, TimerMode } from './types'

const FIVE_MINUTES = 5 * 60 * 1000

const notifyModeSwitch = async (nextMode: TimerMode) => {
  if (typeof Notification === 'undefined') {
    return
  }

  if (Notification.permission !== 'granted') {
    return
  }

  const registration = await navigator.serviceWorker?.getRegistration()
  const title = nextMode === 'focus' ? 'Focus mode started' : 'Break mode started'

  if (registration) {
    await registration.showNotification(title, {
      body:
        nextMode === 'focus'
          ? 'Your focus world is ready. Keep momentum.'
          : 'Recharge and complete a quick mini activity.',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'focus-universe-mode-switch',
      renotify: true,
    })
  } else {
    new Notification(title)
  }
}

const resolvePlantLabel = (stage: AppState['game']['plantStage']): string => {
  switch (stage) {
    case 'seed':
      return '🌰 Seed'
    case 'sprout':
      return '🌱 Sprout'
    case 'tree':
      return '🌳 Tree'
    case 'magical-tree':
      return '🌌 Magical Tree'
    case 'withered':
      return '🥀 Withered'
    default:
      return '🌱 Sprout'
  }
}

const preload = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(src)
    image.onerror = () => reject(new Error(`failed: ${src}`))
    image.src = src
  })

const pickBackground = async (environmentKey: AppState['settings']['selectedEnvironment']) => {
  const environment = ENVIRONMENTS.find((item) => item.key === environmentKey) ?? ENVIRONMENTS[0]

  const candidates = [
    `https://source.unsplash.com/1920x1080/?${encodeURIComponent(environment.query)}&sig=${Date.now()}`,
    ...environment.images,
    environment.fallback,
  ]

  for (const candidate of candidates) {
    try {
      return await preload(candidate)
    } catch {
      continue
    }
  }

  return environment.fallback
}

function App() {
  const [state, setState] = useState<AppState>(createInitialState)
  const [bootstrapped, setBootstrapped] = useState(false)
  const [goal, setGoal] = useState('Study physics 3 hours')
  const [currentMessage, setCurrentMessage] = useState(randomOf(ENCOURAGEMENTS))
  const [backgroundSrc, setBackgroundSrc] = useState('/assets/fallback/forest.svg')
  const [isExporting, setIsExporting] = useState(false)

  const audioRef = useRef(new AudioEngine())
  const sessionStartedAtRef = useRef<string | null>(null)

  const { mode, isRunning, secondsLeft, totalSeconds, start, pause, reset, skip, setMode } = usePomodoro({
    focusSeconds: state.settings.focusMinutes * 60,
    breakSeconds: state.settings.breakMinutes * 60,
    autoStartBreak: state.settings.autoStartBreak,
    onSecond: (left, total, modeNow) => {
      if (modeNow === 'focus' && left <= 10 && left > 0) {
        const intensity = 11 - left
        audioRef.current.playTick(intensity)
      }

      if (left === Math.floor(total / 2)) {
        setCurrentMessage(randomOf(ENCOURAGEMENTS))
      }
    },
    onFinished: (endedMode) => {
      const completedSession: FocusSession = {
        id: crypto.randomUUID(),
        goal,
        mode: endedMode,
        startedAt:
          sessionStartedAtRef.current ??
          new Date(Date.now() - (endedMode === 'focus' ? state.settings.focusMinutes : state.settings.breakMinutes) * 60_000).toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes: endedMode === 'focus' ? state.settings.focusMinutes : state.settings.breakMinutes,
        completed: true,
      }

      setState((previous) => applySessionResult(previous, completedSession, false))
      sessionStartedAtRef.current = null

      audioRef.current.playBell()
      if (state.settings.vibrationsEnabled && 'vibrate' in navigator) {
        navigator.vibrate([25, 30, 45])
      }
    },
    onModeSwitch: (nextMode) => {
      const trackId = nextMode === 'focus' ? state.settings.selectedFocusTrack : state.settings.selectedBreakTrack
      audioRef.current.playTrack(trackId, nextMode)

      if (state.settings.notificationsEnabled) {
        notifyModeSwitch(nextMode)
      }

      if (state.settings.vibrationsEnabled && 'vibrate' in navigator) {
        navigator.vibrate(24)
      }
    },
  })

  useWakeLock(isRunning)

  useEffect(() => {
    loadState().then((loaded) => {
      setState(loaded)
      setBootstrapped(true)
    })
  }, [])

  useEffect(() => {
    if (!bootstrapped) {
      return
    }

    saveState(state)
  }, [bootstrapped, state])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const nextBackground = await pickBackground(state.settings.selectedEnvironment)
      if (!cancelled) {
        setBackgroundSrc(nextBackground)
      }
    }

    run()
    const interval = window.setInterval(run, FIVE_MINUTES)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [state.settings.selectedEnvironment])

  useEffect(
    () => () => {
      audioRef.current.stop()
    },
    [],
  )

  const focusTrackOptions = useMemo(
    () =>
      AUDIO_TRACKS.filter((track) => track.mode === 'focus' && state.game.unlockedTracks.includes(track.id)),
    [state.game.unlockedTracks],
  )

  const breakTrackOptions = useMemo(
    () =>
      AUDIO_TRACKS.filter((track) => track.mode === 'break' && state.game.unlockedTracks.includes(track.id)),
    [state.game.unlockedTracks],
  )

  const startSession = async () => {
    if (!sessionStartedAtRef.current) {
      sessionStartedAtRef.current = new Date().toISOString()
    }

    const trackId = mode === 'focus' ? state.settings.selectedFocusTrack : state.settings.selectedBreakTrack
    await audioRef.current.playTrack(trackId, mode)
    start()
  }

  const abandonFocus = () => {
    if (!isRunning || mode !== 'focus' || secondsLeft === totalSeconds) {
      return
    }

    const spent = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60))
    const abandonedSession: FocusSession = {
      id: crypto.randomUUID(),
      goal,
      mode: 'focus',
      startedAt: sessionStartedAtRef.current ?? new Date(Date.now() - spent * 60_000).toISOString(),
      endedAt: new Date().toISOString(),
      durationMinutes: spent,
      completed: false,
    }

    setState((previous) => applySessionResult(previous, abandonedSession, true))
    sessionStartedAtRef.current = null
  }

  const handlePause = () => {
    abandonFocus()
    pause()
    audioRef.current.stop()
  }

  const handleReset = () => {
    abandonFocus()
    reset(mode)
    audioRef.current.stop()
    sessionStartedAtRef.current = null
  }

  const handleSkip = () => {
    abandonFocus()
    skip()
    sessionStartedAtRef.current = null
  }

  const requestNotifications = async () => {
    if (typeof Notification === 'undefined') {
      return
    }

    const permission = await Notification.requestPermission()
    setState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        notificationsEnabled: permission === 'granted',
      },
    }))
  }

  const exportCurrentTimer = async () => {
    try {
      setIsExporting(true)
      await exportTimerVideo({
        durationSeconds: Math.min(secondsLeft, 120),
        title: goal,
        mode,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const xpToNextLevel = state.game.level * state.game.level * 100 - state.game.xp

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <ImmersiveBackground src={backgroundSrc} overlayTone={mode} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <motion.header
          className="mb-6 rounded-3xl border border-white/20 bg-white/8 p-4 backdrop-blur-xl md:p-6"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-cyan-200/80">Focus Universe</p>
              <h1 className="mt-2 text-2xl font-semibold md:text-4xl">Game + Meditation + Productivity</h1>
              <p className="mt-2 text-sm text-white/75">{currentMessage}</p>
            </div>
            <div className="rounded-2xl border border-orange-300/40 bg-orange-500/20 px-4 py-2 text-sm">
              <span className="inline-flex items-center gap-2 font-medium">
                <Flame size={15} /> {state.game.streak} day streak
              </span>
            </div>
          </div>
        </motion.header>

        <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <GlassCard className="p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setMode('focus')}
                className={`rounded-full px-4 py-2 text-sm ${
                  mode === 'focus' ? 'bg-cyan-400/35 text-cyan-100' : 'bg-white/10 text-white/70'
                }`}
              >
                Focus Mode
              </button>
              <button
                onClick={() => setMode('break')}
                className={`rounded-full px-4 py-2 text-sm ${
                  mode === 'break' ? 'bg-fuchsia-400/35 text-fuchsia-100' : 'bg-white/10 text-white/70'
                }`}
              >
                Break Mode
              </button>
              <span className="ml-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                <Leaf size={14} /> {resolvePlantLabel(state.game.plantStage)}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${isRunning}`}
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.01, filter: 'blur(5px)' }}
                transition={{ duration: 0.5 }}
                className="mt-7 text-center"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-white/60">
                  {mode === 'focus' ? 'Deep Focus' : 'Recovery'}
                </p>
                <p className="mt-2 text-6xl font-semibold md:text-8xl">{formatClock(secondsLeft)}</p>
                <BreathingOrb mode={mode} />
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {!isRunning ? (
                <button
                  onClick={startSession}
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400/80 px-5 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300"
                >
                  <Play size={18} /> Start
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/30"
                >
                  <Pause size={18} /> Pause
                </button>
              )}

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 font-medium text-white/90 transition hover:bg-white/25"
              >
                <RotateCcw size={18} /> Reset
              </button>
              <button
                onClick={handleSkip}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 font-medium text-white/90 transition hover:bg-white/25"
              >
                <SkipForward size={18} /> Skip
              </button>
              <button
                onClick={exportCurrentTimer}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-400/35 px-5 py-3 font-medium text-white transition hover:bg-violet-300/45 disabled:opacity-40"
              >
                <Download size={18} /> {isExporting ? 'Exporting...' : 'Export 4K Video'}
              </button>
            </div>

            <label className="mt-6 block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Mission Goal</span>
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                rows={2}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-cyan-200/60 focus:outline-none"
              />
            </label>
          </GlassCard>

          <div className="space-y-5">
            <GlassCard>
              <h3 className="text-sm uppercase tracking-[0.22em] text-white/70">Progression</h3>
              <p className="mt-3 text-lg font-semibold">Level {state.game.level}</p>
              <p className="text-sm text-white/70">XP {state.game.xp} • {Math.max(0, xpToNextLevel)} to next level</p>

              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
                  style={{ width: `${Math.min(100, (state.game.xp % 100) || 8)}%` }}
                />
              </div>

              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {state.quests.map((quest) => (
                  <li key={quest.id} className="rounded-xl border border-white/10 bg-black/15 p-3">
                    <p>{quest.title}</p>
                    <p className="text-xs text-white/55">
                      {quest.progress}/{quest.target} • {quest.rewardXp} XP
                    </p>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm uppercase tracking-[0.22em] text-white/70">Sensory Settings</h3>

              <div className="mt-3 space-y-3 text-sm">
                <label className="block">
                  <span className="text-white/65">Environment</span>
                  <select
                    value={state.settings.selectedEnvironment}
                    onChange={(event) =>
                      setState((previous) => ({
                        ...previous,
                        settings: {
                          ...previous.settings,
                          selectedEnvironment: event.target.value as AppState['settings']['selectedEnvironment'],
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2"
                  >
                    {ENVIRONMENTS.filter((item) =>
                      state.game.unlockedEnvironments.includes(item.key),
                    ).map((environment) => (
                      <option key={environment.key} value={environment.key}>
                        {environment.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-white/65">Focus audio</span>
                  <select
                    value={state.settings.selectedFocusTrack}
                    onChange={(event) =>
                      setState((previous) => ({
                        ...previous,
                        settings: {
                          ...previous.settings,
                          selectedFocusTrack: event.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2"
                  >
                    {focusTrackOptions.map((track) => (
                      <option key={track.id} value={track.id}>
                        {track.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-white/65">Break audio</span>
                  <select
                    value={state.settings.selectedBreakTrack}
                    onChange={(event) =>
                      setState((previous) => ({
                        ...previous,
                        settings: {
                          ...previous.settings,
                          selectedBreakTrack: event.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2"
                  >
                    {breakTrackOptions.map((track) => (
                      <option key={track.id} value={track.id}>
                        {track.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={requestNotifications}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white/80"
                >
                  Enable Notifications
                </button>
                <button
                  onClick={() =>
                    setState((previous) => ({
                      ...previous,
                      settings: {
                        ...previous.settings,
                        vibrationsEnabled: !previous.settings.vibrationsEnabled,
                      },
                    }))
                  }
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white/80"
                >
                  Vibrations: {state.settings.vibrationsEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <p className="mt-4 inline-flex items-center gap-2 text-xs text-white/60">
                <Volume2 size={14} /> Audio crossfades automatically between modes.
              </p>
            </GlassCard>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <AiPlannerPanel goal={goal} />
          <StatsPanel sessions={state.sessions} productivityScore={state.game.productivityScore} />
          <MiniActivities isBreakMode={mode === 'break'} />
          <GlassCard>
            <h3 className="text-sm uppercase tracking-[0.22em] text-white/70">Universe Milestones</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/8 p-3">
                <p className="text-xs text-white/60">Completed sessions</p>
                <p className="mt-1 text-2xl font-semibold">{state.game.sessionsCompleted}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-3">
                <p className="text-xs text-white/60">Focused minutes</p>
                <p className="mt-1 text-2xl font-semibold">{state.game.minutesFocused}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-3">
                <p className="text-xs text-white/60">Longest streak</p>
                <p className="mt-1 text-2xl font-semibold">{state.game.longestStreak} days</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-3">
                <p className="text-xs text-white/60">Mood note</p>
                <p className="mt-1 text-sm text-white/85">Gentle progress beats perfect intensity.</p>
              </div>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-white/60">
              <Sparkles size={14} /> Keep sessions consistent to unlock more worlds and tracks.
            </p>
          </GlassCard>
        </section>
      </main>
    </div>
  )
}

export default App
