# FOCUS UNIVERSE — Complete Application Blueprint Prompt

Use this prompt to recreate the entire Focus Universe application from scratch.

---

## PROMPT

Create a production-ready, immersive, gamified Pomodoro application called **"Focus Universe"**.

---

### TECH STACK

- React 19 + TypeScript (strict mode)
- Vite 8 (bundler)
- Tailwind CSS v4 (@tailwindcss/vite plugin)
- Zustand 5 (state management)
- localForage (IndexedDB persistence)
- framer-motion (animations)
- Capacitor 8 (Android mobile app)
- Web Audio API (procedural sound)
- Canvas 2D (particle effects)
- Vitest + Testing Library (tests)

---

### PROJECT STRUCTURE (54 source files)

```
src/
├── core/                              # Engine layer (pure logic, no React)
│   ├── types.ts                       # All TypeScript types, interfaces, enums, utility functions
│   ├── timer-engine.ts                # Drift-free timer class using performance.now()
│   ├── audio-engine.ts                # Web Audio API procedural sound system
│   ├── constants.ts                   # Environments, sound profiles, messages, quest templates
│   ├── themes.ts                      # 10 visual themes with CSS variable injection
│   ├── presets.ts                     # 6 timer presets (25/5, 52/17, 90/20, etc.)
│   ├── plants.ts                      # 12 plant species with level-gated unlocking
│   └── i18n.ts                        # Turkish + English translation system (Zustand store)
│
├── services/                          # Data & external integrations
│   ├── storage.ts                     # IndexedDB via localForage (CRUD for all entities + export/import)
│   ├── ai-tasks.ts                    # AI task splitting (OpenAI + offline heuristic fallback)
│   └── native.ts                      # Capacitor bridge (haptics, status bar, notifications, wake lock)
│
├── store/                             # Zustand state stores
│   ├── timer-store.ts                 # Timer state (status, mode, remainingMs, sessionsCompleted) + snapshot
│   ├── settings-store.ts              # User settings with defaults + persistence
│   ├── session-store.ts               # Session history + computed totals
│   ├── game-store.ts                  # Plants, XP, levels, streaks, quests, unlocks
│   └── task-store.ts                  # Task CRUD + AI splitting integration
│
├── hooks/                             # Custom React hooks
│   ├── use-timer.ts                   # Wires TimerEngine ↔ stores ↔ game logic ↔ native
│   ├── use-audio.ts                   # Ambient sound lifecycle + tick/bell triggers
│   ├── use-background.ts              # Image rotation, crossfade timing, parallax mouse tracking
│   ├── use-persistence.ts             # Hydrates all 5 stores from IndexedDB on mount
│   ├── use-orientation.ts             # Real-time portrait/landscape detection
│   └── use-keyboard.ts               # Keyboard shortcuts (Space, R, S)
│
├── components/
│   ├── effects/                       # Visual effects
│   │   ├── AnimatedBackground.tsx     # Multi-layer background: Ken Burns + crossfade + fog + vignette
│   │   ├── ParticleCanvas.tsx         # Canvas 2D particle system (8 types)
│   │   └── BreathingOrb.tsx           # Guided 4-4-4-2 box breathing animation
│   └── ui/                            # Reusable UI primitives
│       ├── GlassCard.tsx              # Glassmorphism card with backdrop blur
│       ├── CircularProgress.tsx       # SVG timer ring with 8 clock face styles per theme
│       ├── TimerDisplay.tsx           # Large tabular-nums time display (responsive)
│       └── Modal.tsx                  # Bottom sheet (mobile) / center modal (desktop)
│
├── features/                          # Feature modules
│   ├── timer/
│   │   ├── TimerView.tsx              # Main timer screen (portrait + landscape layouts)
│   │   ├── TimerControls.tsx          # Start/Pause/Resume/Reset/Skip buttons with spring physics
│   │   ├── ModeSelector.tsx           # Focus/Short Break/Long Break tab switcher
│   │   ├── SoundMixer.tsx             # Multi-channel ambient sound mixer with sliders
│   │   └── DailyGoal.tsx              # Mini circular progress ring for daily session target
│   ├── garden/
│   │   ├── GardenView.tsx             # Garden dashboard: current plant, XP, streak, collection
│   │   └── PlantDisplay.tsx           # Animated plant emoji with growth stages
│   ├── stats/
│   │   ├── StatsView.tsx              # Stats dashboard: today/weekly/all-time metrics
│   │   ├── Heatmap.tsx                # GitHub-style 12-week activity heatmap (SVG)
│   │   └── ShareStats.tsx             # Canvas-to-PNG stats card + Web Share API
│   ├── tasks/
│   │   ├── TaskView.tsx               # Task management with AI smart split
│   │   └── TaskItem.tsx               # Draggable task item with pomodoro counter
│   ├── quests/
│   │   └── QuestPanel.tsx             # Daily/weekly quests with progress bars
│   ├── achievements/
│   │   └── AchievementsView.tsx       # 20 achievement badges (unlocked/locked grid)
│   ├── music/
│   │   └── MusicPlayer.tsx            # 21 YouTube streams + 8 Spotify playlists with category tabs
│   └── settings/
│       └── SettingsView.tsx           # All settings: language, theme, presets, plants, env, sound, data
│
├── App.tsx                            # Root shell: background + particles + header nav + timer + modal panels
├── main.tsx                           # Entry point: React root + NativeService.initialize()
├── index.css                          # Tailwind + glassmorphism + animations + landscape utilities
└── vite-env.d.ts                      # Vite type reference

public/
├── favicon.svg                        # Clock icon SVG
├── manifest.json                      # PWA manifest with icons
├── sw.js                              # Service worker (cache-first + network-update)
└── icons/                             # App icons (72-512px SVG)

android/                               # Capacitor Android project
├── app/src/main/
│   ├── AndroidManifest.xml            # Permissions, widget, fullUser orientation
│   ├── java/.../MainActivity.java     # Notification channel + keep screen on
│   ├── java/.../TimerWidget.java      # Home screen timer widget
│   └── res/                           # Layouts, drawables, styles, strings
```

---

### CORE ENGINE: TIMER (src/core/timer-engine.ts)

```
class TimerEngine:
  - Uses performance.now() for drift-free timing
  - Dual scheduling: requestAnimationFrame (smooth UI) + setInterval (background tab)
  - API: start(targetMs, alreadyElapsedMs), pause() → elapsed, resume(), stop(), destroy()
  - Callbacks: onTick(elapsedMs), onComplete()
  - Tick interval: 100ms
```

Timer states: `idle | running | paused`
Timer modes: `focus | shortBreak | longBreak`

Default durations: focus 25min, short break 5min, long break 15min
Long break triggers every 4 focus sessions.

**Persistence:** On every status change, save a snapshot to IndexedDB:
`{ status, mode, remainingMs, totalMs, sessionsCompleted, savedAt }`
On reload, if status was "running", calculate elapsed = Date.now() - savedAt, adjust remaining.

---

### CORE ENGINE: AUDIO (src/core/audio-engine.ts)

All sounds generated procedurally with Web Audio API — zero external audio files:

| Sound | Method |
|-------|--------|
| Rain | Pink noise → bandpass 800Hz + white noise → highpass 4kHz |
| Forest | Pink noise → lowpass 500Hz + sine oscillator 2.4kHz with LFO |
| Wind | Brown noise → lowpass 400Hz with LFO on cutoff (0.1Hz) |
| Waves | Brown noise → lowpass 300Hz with slow LFO (0.07Hz) |
| Fire | Brown noise → bandpass 600Hz with crackling LFO (3Hz) |
| Tick | Sine 800Hz, 80ms exponential decay |
| Bell | 3 sine waves (C5, E5, G5) staggered 150ms, long decay |
| Click | Sine 1kHz, 30ms |
| Level Up | 4 triangle waves (C5→C6) staggered 120ms |

Master gain with fade-in (1.5s) and fade-out (0.5s) for ambient transitions.
Last 10 seconds: tick sound on each second with increasing volume.

---

### SOUND MIXER (src/features/timer/SoundMixer.tsx)

Independent from the main audio engine. Creates its own AudioContext.
Each channel: noise buffer → filter → individual GainNode → destination.
5 mixable channels: rain, forest, wind, waves, fire.
Individual volume sliders per channel. Multiple can play simultaneously.

---

### VISUAL SYSTEM

**Animated Background (5 layers stacked):**
1. Background image (Ken Burns animation: 30s scale 1.0→1.08→1.0, CSS)
2. Next image (opacity crossfade over 3s, rotates every 5 min)
3. Color overlay (per-environment rgba)
4. Fog layer (radial gradients, CSS drift animation 20s)
5. Vignette (radial gradient, dark edges)

Mouse parallax: translate images ±8px based on cursor position.

**14 Environments:**
Forest, Rain, Rainy Forest, Ocean, Misty Lake, Mountains, Autumn Path, Cozy Cabin, Night Sky, Sunset, Snowfall, Japanese Garden, Northern Lights.
Each has: 3 Unsplash images (1920px), particle type, overlay color, unlock level.

**8 Particle Types (Canvas 2D):**
- fireflies: glowing dots with sine/cosine movement, green glow
- dust: tiny slow-moving dots, low opacity
- snow: falling circles with horizontal sine wobble
- rain: short angled lines moving down fast
- stars: stationary twinkling dots
- fog: large semi-transparent circles drifting slowly
- leaves: rotating falling ellipses, brown/amber
- embers: small rising glowing dots, orange

---

### THEME SYSTEM (src/core/themes.ts)

10 themes, each with a unique clock face style:

| Theme | Mode | Clock Style | Palette |
|-------|------|-------------|---------|
| Midnight | dark | minimal | Muted purple-gray |
| Lavender Mist | dark | thin | Soft lavender |
| Deep Sea | dark | dots | Steel blue |
| Mossy Forest | dark | arc | Sage green |
| Warm Amber | dark | analog | Warm gold-brown |
| Dusty Rose | dark | segments | Dusty pink |
| Slate | dark | dash | Neutral gray-blue |
| Morning Light | light | thin | Soft white-purple |
| Desert Sand | light | analog | Cream-amber |
| Soft Paper | light | minimal | Pure neutral |

All colors are desaturated and muted. No neon, no vibrant tones.

CSS variables injected at runtime via `document.documentElement.style.setProperty()`:
`--color-midnight, --color-surface, --color-surface-light, --color-glass, --color-glass-border, --color-accent, --color-accent-glow, --color-break-accent, --color-text-primary, --color-text-secondary, --color-text-muted`

**8 Clock Face Styles (CircularProgress.tsx):**
- minimal: single smooth arc
- thin: 2px ultra-thin arc
- dots: 60 dots around ring, fill as progress advances
- arc: thick arc with leading glow dot
- analog: 12-hour markers + 60-minute ticks (like a real clock)
- segments: 40 discrete arc segments
- dash: 120 graduated dash marks (major every 10)
- glow: arc with gaussian blur filter

---

### GAME SYSTEM (src/store/game-store.ts)

**XP:** 100 XP per focus session + (streak × 10) bonus.
**Levels:** Level N requires N×500 XP. getLevelFromXp() calculates iteratively.

**Plant Growth (5 stages):**
| Stage | Sessions Required |
|-------|-------------------|
| seed | 0 |
| sprout | 1 |
| sapling | 3 |
| tree | 6 |
| glowing | 10 (complete → moves to garden, new seed planted) |

**12 Plant Species** (unlocked by level):
Oak (1), Pine (1), Cherry Blossom (2), Sunflower (3), Rose (4), Tulip (5), Cactus (6), Bamboo (7), Mushroom (8), Palm (10), Bonsai (12), Crystal Flower (15).
Each has unique emoji per growth stage.

**Streak:** Compare lastActiveDate with today/yesterday. Consecutive days increment. Gap resets to 1.

**Quests:** 3 daily + 2 weekly, auto-generated from templates, XP rewards, auto-refresh.

**20 Achievements:** Milestones for sessions (1/10/50/100/500), streaks (3/7/30/100), levels (5/10/25), garden (1/5/20), focus time (1h/10h/100h), XP (1k/10k).

---

### TASK SYSTEM (src/store/task-store.ts + src/services/ai-tasks.ts)

**AI Smart Split:** Input "Study physics 3 hours" →
1. If VITE_OPENAI_API_KEY exists: call GPT-3.5-turbo to split into subtasks with estimated pomodoros
2. Offline fallback: regex parse time units → calculate total pomodoros → split into 3 phases (review 20%, deep work 50%, practice 30%)

Active task auto-increments completedPomodoros when a focus session completes.

---

### i18n (src/core/i18n.ts)

Zustand store with `locale: 'en' | 'tr'`, `setLocale()`, `t(key)`.
80+ translated strings. Auto-detects browser language. Persists to localStorage.

---

### TIMER PRESETS (src/core/presets.ts)

6 presets: Classic (25/5/15), Extended (50/10/30), DeskTime (52/17/30), Ultradian (90/20/30), Sprint (15/3/10), Study (45/10/20).
One-tap apply overwrites focusDuration, shortBreakDuration, longBreakDuration, longBreakInterval.

---

### STATS (src/features/stats/)

- Today: session count + focus time
- This week: sessions + focus time + daily average
- All time: total sessions, total focus, level, XP, best streak, plants
- Heatmap: 12-week GitHub-style grid, 5 intensity levels
- Share: Canvas 600×400 branded image → Web Share API (mobile) or PNG download

---

### MUSIC PLAYER (src/features/music/MusicPlayer.tsx)

21 YouTube live streams in 6 categories:
- Lo-fi (3): Hip Hop Radio, Chill Sleep, Chillhop
- Jazz (3): Coffee Shop, Rainy Jazz, Late Night
- Piano (3): Study Piano, Piano in Rain, Classical Focus
- Nature (7): Rain Window, Ocean Waves, Thunderstorm, Fireplace, Birdsong, Creek, Nature Sounds
- Electronic (3): Synthwave, Space Ambient, Deep Focus Beats
- Meditation (2): Tibetan Bowls, Flute

8 Spotify playlist links. Category filter tabs. Embedded YouTube iframe with autoplay.

---

### MOBILE (Capacitor 8 + Android)

**Native features via src/services/native.ts:**
- Haptics: light/medium/heavy impact + success/warning notification
- StatusBar: dark style, translucent, #0a0a12 background
- LocalNotifications: timer running (ongoing) + completion alerts
- SplashScreen: auto-hide after 2s
- App: back button minimizes instead of closing
- WakeLock: screen stays on during running timer

**Android specifics:**
- screenOrientation="fullUser" (supports tablet rotation)
- Notification channel "timer" created in MainActivity.onCreate()
- FLAG_KEEP_SCREEN_ON
- TimerWidget: home screen widget showing mode + time + "tap to open"
- Permissions: INTERNET, POST_NOTIFICATIONS, VIBRATE, WAKE_LOCK, FOREGROUND_SERVICE

**PWA:** Service worker with cache-first strategy, precaches core assets.

---

### RESPONSIVE DESIGN

**Portrait (phone):** Vertical stack — mode selector → timer ring (260px) → controls → message → stats → mixer/breathing
**Landscape (tablet):** Horizontal split — timer ring (280px) on left, controls + info on right
**Desktop:** Centered timer ring (340px) with modal panels

useOrientation() hook detects via window resize + screen.orientation events.

Modal: bottom sheet on mobile (slides up from bottom with drag handle), centered on desktop.

---

### CSS DESIGN SYSTEM (src/index.css)

**Glassmorphism:**
```css
.glass { backdrop-filter: blur(20px) saturate(1.3); border: 1px solid var(--color-glass-border); }
```

**Animations:** ken-burns (30s), float (4s), pulse-glow (3s), breathe (4s), fog-drift (20s), slide-up (0.5s), grow-in (0.4s), fire-flicker (0.8s)

**Mobile:** safe-area-inset padding, -webkit-tap-highlight-color: transparent, touch-action: manipulation, user-select: none, 100dvh height

---

### SETTINGS (src/features/settings/SettingsView.tsx)

Sections: Language → Theme → Presets → Timer (durations, daily goal, auto-start) → Plant Species → Environment → Sound (enabled, volume, profile) → Effects (particles) → Data (export/import JSON)

---

### STATE PERSISTENCE

All data in IndexedDB via localForage instance "focus-universe":
- settings: TimerSettings
- sessions: Session[]
- timer_snapshot: TimerSnapshot
- game_state: GameState
- tasks: Task[]

On app mount, usePersistence() hydrates all 5 stores in parallel with Promise.all().

---

### TESTING

Vitest + jsdom + @testing-library/react.
Tests cover: types utility functions (formatMs, getPlantStage, getLevelFromXp, getNextMode, getDurationForMode), TimerEngine lifecycle, AI task splitting offline fallback.

---

### BUILD & DEPLOY

```bash
npm install --legacy-peer-deps
npm run dev          # Development
npm run build        # Production web build
npm run test         # Run 32 tests
npm run android      # Build + sync + open Android Studio
```

APK: `cd android && ./gradlew assembleDebug` → 4.5MB debug APK

---

### DESIGN PRINCIPLES

1. **Muted, elegant colors** — no neon, no vibrant. Desaturated, sophisticated.
2. **60fps animations** — CSS animations on compositor thread, framer-motion for layout.
3. **Glassmorphism everywhere** — frosted glass with subtle borders and shadows.
4. **Procedural audio** — no external files, everything generated from noise + oscillators.
5. **Offline-first** — all data local, service worker caching, works without internet.
6. **Gamification without distraction** — rewards feel earned, UI stays minimal during focus.
7. **Mobile-first responsive** — touch targets ≥44px, safe areas, bottom sheet modals.
