# 🔥 FOCUS UNIVERSE

A premium, immersive Pomodoro experience that blends:

- 🎮 **Gamification** (XP, streaks, living plant growth, quests)
- 🧘 **Ambient calm** (nature worlds, cinematic transitions, breathing orb)
- 🧠 **AI planning** (goal-to-task breakdown + Pomodoro scheduling)
- 📊 **Analytics** (weekly bars, consistency heatmap, productivity score)
- 📱 **Mobile-ready PWA + Capacitor Android**

## Highlights

- Smooth focus-world entry (fade + blur transition)
- Auto ambient soundtrack playback with mode-based crossfade
- Last 10-second adaptive ticking + soft bell finish
- Background rotation every 5 minutes with Ken Burns style motion
- Fog + floating particle depth effects
- Break mini activities:
  - watering plants
  - rhythm taps
  - memory shuffle
- IndexedDB persistence
- 4K timer video export via MediaRecorder
- Service worker + offline cache + notifications
- Auto dark-mode friendly styling

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Howler (audio)
- IndexedDB (`idb`)
- Vitest + Testing Library
- GitHub Actions CI
- Capacitor Android

## Quick Start

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` – local dev server
- `npm run build` – typecheck + production build
- `npm run preview` – preview production build
- `npm run lint` – lint
- `npm run test` – unit tests + coverage
- `npm run test:watch` – watch mode
- `npm run assets:fetch` – download royalty-free fallback backgrounds
- `npm run android:add` – add Android platform
- `npm run android:sync` – sync web assets/plugins to Android
- `npm run android:open` – open Android Studio project

## Android Setup (Capacitor)

1. Install Android Studio + SDK
2. Build web assets:

```bash
npm run build
```

3. Initialize Android project:

```bash
npm run android:add
```

4. Sync and open:

```bash
npm run android:sync
npm run android:open
```

## PWA

- Manifest: `public/manifest.webmanifest`
- Service worker: `public/sw.js`
- Registration: `src/pwa.ts`

Install to home screen from supported browsers for standalone mode.

## AI Planner

AI planning uses an on-device heuristic planner (`src/lib/aiPlanner.ts`) to:

- parse goal duration
- split into actionable tasks
- assign Pomodoro blocks
- suggest a schedule window

## Testing

Current unit tests cover:

- AI plan generation logic
- Game progression/session outcomes

Run:

```bash
npm run test
```

## Royalty-Free Media Sources

- Pexels (images/video)
- Unsplash source endpoint (dynamic fetch)
- Pixabay CDN audio samples

Fallback local assets are bundled under `public/assets/fallback`.
