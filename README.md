# Focus Universe

A production-grade Pomodoro timer application built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **IndexedDB** via localForage for persistence

## Architecture

```
src/
├── core/           # Timer engine, type definitions
├── features/       # Feature modules (timer view, controls, mode selector)
├── hooks/          # Custom React hooks (useTimer, usePersistence)
├── services/       # Storage service (IndexedDB via localForage)
├── components/ui/  # Reusable UI primitives
└── store/          # Zustand stores (timer, settings, sessions)
```

## Features

- **Drift-free timer** using `performance.now()` with dual scheduling (rAF + setInterval)
- **Three timer modes**: Focus (25 min), Short Break (5 min), Long Break (15 min)
- **Timer states**: idle, running, paused, break
- **Controls**: start, pause, resume, reset, skip
- **Session tracking** with history persisted to IndexedDB
- **Persistence** — timer state survives page refresh
- **Circular SVG progress** with gradient strokes and glow effects
- **Minimal premium dark UI** with smooth transitions

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
