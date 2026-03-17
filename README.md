# Focus Universe

An immersive, gamified Pomodoro application that transforms focused work into a rich sensory experience. Built with React, TypeScript, and a carefully crafted design system.

Focus Universe is not just a timer — it is a focus environment that combines ambient visuals, procedural audio, game mechanics, and intelligent task management to make deep work addictive.

## Features

### Timer Engine
- **Drift-free** timing via `performance.now()` with dual scheduling (rAF + setInterval)
- Three modes: Focus (25m), Short Break (5m), Long Break (15m) — all configurable
- States: idle, running, paused with full keyboard and button controls
- Timer state persists across page refreshes via IndexedDB snapshot

### Immersive Background Engine
- High-quality Unsplash imagery with smooth crossfade transitions every 5 minutes
- Ken Burns (slow zoom/pan) animation on all backgrounds
- Parallax mouse-tracking for depth
- Multi-layer compositing: image → color overlay → fog → vignette → particles
- 7 unlockable environments: Forest, Rain, Ocean, Mountains, Night Sky, Sunset, Snowfall

### Procedural Audio Engine
- Built entirely on the Web Audio API — no external audio files required
- Ambient soundscapes generated from filtered noise: rain, forest, wind, ocean waves, campfire
- Tick sounds in the last 10 seconds with crescendo volume
- Soft bell chord on timer completion
- UI click sounds with micro-interaction feedback
- Level-up arpeggio on XP milestone

### Game System
- **Plant Growth**: Each focus session grows your plant through 5 stages (seed → sprout → sapling → tree → glowing tree). Quitting kills the plant.
- **XP & Levels**: 100 XP per focus session + streak bonuses. Leveling unlocks new environments and sounds.
- **Streak Tracking**: Daily streak with fire animation. Breaking streak triggers dramatic fade.
- **Quest System**: 3 daily and 2 weekly missions with XP rewards. Auto-refreshes each day.
- **Garden Collection**: Completed plants are preserved in a permanent garden display.

### AI Task System
- Natural language input: "Study physics 3 hours" is automatically split into focused subtasks
- OpenAI GPT integration when `VITE_OPENAI_API_KEY` environment variable is set
- Intelligent offline fallback with time parsing and phase-based splitting
- Active task tracking — pomodoros auto-increment on the selected task

### Statistics
- Today/weekly/all-time session counts and focus time
- GitHub-style activity heatmap (12 weeks)
- Daily average calculation
- Streak and plant collection stats

### Glassmorphism UI
- Frosted glass cards with backdrop blur and subtle borders
- Gradient glow effects on timer progress ring
- Spring physics via framer-motion for button presses and panel transitions
- SVG circular progress with 60 tick marks, gradient stroke, and leading glow dot
- Floating animations, shimmer effects, and micro-interactions
- Dark theme optimized for long focus sessions

### Persistence & Data
- All data stored in IndexedDB via localForage
- JSON export/import for backup and migration
- Settings, sessions, game state, and tasks all persisted independently

### Psychology System
- Calming violet palette during focus; emerald accents during breaks
- Contextual encouraging messages
- Breathing exercise orb during breaks (4-4-4-2 box breathing)
- Minimal UI during focus to reduce distraction

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 |
| Storage | localForage (IndexedDB) |
| Animation | framer-motion + CSS |
| Audio | Web Audio API |
| Particles | Canvas 2D |
| Testing | Vitest + Testing Library |
| CI | GitHub Actions |
| Mobile | Capacitor (config included) |

## Architecture

```
src/
├── core/                   # Engine layer
│   ├── types.ts            # All TypeScript types, constants, utility functions
│   ├── timer-engine.ts     # Drift-free timer with performance.now()
│   ├── audio-engine.ts     # Procedural Web Audio API sound system
│   └── constants.ts        # Environments, sounds, messages, quest templates
│
├── services/               # Data layer
│   ├── storage.ts          # IndexedDB via localForage (CRUD for all entities)
│   └── ai-tasks.ts         # AI task splitting (OpenAI + offline fallback)
│
├── store/                  # State layer (Zustand)
│   ├── timer-store.ts      # Timer state + snapshot persistence
│   ├── settings-store.ts   # User preferences
│   ├── session-store.ts    # Session history + computed totals
│   ├── game-store.ts       # Plants, XP, levels, streaks, quests
│   └── task-store.ts       # Task CRUD + AI integration
│
├── hooks/                  # React hooks
│   ├── use-timer.ts        # Wires engine ↔ stores ↔ game logic
│   ├── use-audio.ts        # Ambient sound lifecycle + tick/bell triggers
│   ├── use-background.ts   # Image rotation, crossfade, parallax
│   └── use-persistence.ts  # Hydrates all stores from IndexedDB on mount
│
├── components/
│   ├── effects/            # Visual effects
│   │   ├── AnimatedBackground.tsx  # Multi-layer background compositor
│   │   ├── ParticleCanvas.tsx      # Canvas particle system
│   │   └── BreathingOrb.tsx        # Guided breathing animation
│   └── ui/                 # Reusable UI primitives
│       ├── GlassCard.tsx
│       ├── CircularProgress.tsx
│       ├── TimerDisplay.tsx
│       └── Modal.tsx
│
├── features/               # Feature modules
│   ├── timer/              # Timer view, controls, mode selector
│   ├── garden/             # Plant display, garden collection
│   ├── stats/              # Stats dashboard, heatmap
│   ├── tasks/              # Task management, AI splitting
│   ├── quests/             # Daily/weekly quest panel
│   └── settings/           # All configuration options
│
├── App.tsx                 # Root layout with navigation and panels
└── main.tsx                # Entry point
```

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Type check
npm run typecheck

# Run tests
npm test -- --run

# Production build
npm run build

# Preview production build
npm run preview
```

### AI Task Splitting (Optional)

To enable OpenAI-powered task splitting, set the environment variable:

```bash
VITE_OPENAI_API_KEY=your-key-here npm run dev
```

The app works fully without it — the offline fallback parses natural language and creates sensible task breakdowns automatically.

### Mobile (Capacitor)

A `capacitor.config.ts` is included for Android/iOS builds:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npm run build
npx cap sync
npx cap open android
```

## Testing

```bash
# Run all tests
npm test -- --run

# Watch mode
npm test

# Coverage
npx vitest run --coverage
```

## License

MIT
