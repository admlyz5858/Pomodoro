import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersistence } from './hooks/use-persistence.ts';
import { AnimatedBackground } from './components/effects/AnimatedBackground.tsx';
import { ParticleCanvas } from './components/effects/ParticleCanvas.tsx';
import { TimerView } from './features/timer/TimerView.tsx';
import { GardenView } from './features/garden/GardenView.tsx';
import { StatsView } from './features/stats/StatsView.tsx';
import { TaskView } from './features/tasks/TaskView.tsx';
import { QuestPanel } from './features/quests/QuestPanel.tsx';
import { AchievementsView } from './features/achievements/AchievementsView.tsx';
import { MusicPlayer } from './features/music/MusicPlayer.tsx';
import { SettingsView } from './features/settings/SettingsView.tsx';
import { Modal } from './components/ui/Modal.tsx';
import { audioEngine } from './core/audio-engine.ts';
import { NativeService } from './services/native.ts';
import { getThemeById, applyTheme } from './core/themes.ts';
import { useSettingsStore } from './store/settings-store.ts';

type Panel = 'tasks' | 'garden' | 'stats' | 'quests' | 'achievements' | 'music' | 'settings' | null;

const navItems: { id: Panel; label: string; icon: string }[] = [
  { id: 'tasks', label: 'Tasks', icon: '📋' },
  { id: 'garden', label: 'Garden', icon: '🌿' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'quests', label: 'Quests', icon: '🏆' },
  { id: 'achievements', label: 'Achievements', icon: '🎖️' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const panelTitles: Record<string, string> = {
  tasks: 'Tasks',
  garden: 'Garden',
  stats: 'Statistics',
  quests: 'Quests',
  achievements: 'Achievements',
  music: 'Lo-fi Music',
  settings: 'Settings',
};

function LoadingScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-midnight">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-accent/30 animate-spin border-t-accent" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🌌</div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-lg font-semibold tracking-wide">
            <span className="text-accent">Focus</span> Universe
          </h1>
          <span className="text-xs text-text-muted animate-pulse">Entering your universe...</span>
        </div>
      </div>
    </div>
  );
}

function PanelContent({ panel }: { panel: Panel }) {
  switch (panel) {
    case 'tasks': return <TaskView />;
    case 'garden': return <GardenView />;
    case 'stats': return <StatsView />;
    case 'quests': return <QuestPanel />;
    case 'achievements': return <AchievementsView />;
    case 'music': return <MusicPlayer />;
    case 'settings': return <SettingsView />;
    default: return null;
  }
}

export default function App() {
  const ready = usePersistence();
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const themeId = useSettingsStore((s) => s.settings.themeId);

  useEffect(() => {
    const theme = getThemeById(themeId);
    applyTheme(theme);
  }, [themeId]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }, []);

  const togglePanel = useCallback((panel: Panel) => {
    audioEngine.playClick();
    NativeService.vibrate('light');
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  if (!ready) return <LoadingScreen />;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <AnimatedBackground />
      <ParticleCanvas />

      <div className="relative flex flex-col h-full" style={{ zIndex: 2 }}>
        <header className="flex items-center justify-between px-4 sm:px-6 pt-3 sm:pt-5 pb-1 sm:pb-2">
          <h1 className="text-sm sm:text-base font-semibold tracking-wide">
            <span className="text-accent text-glow-accent">Focus</span>{' '}
            <span className="text-text-primary">Universe</span>
          </h1>
          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.85 }}
                onClick={() => togglePanel(item.id)}
                className={`relative p-2 sm:p-2 rounded-xl text-sm transition-all cursor-pointer active:bg-accent/10 ${
                  activePanel === item.id ? 'bg-accent/20' : ''
                }`}
                aria-label={item.label}
              >
                {item.icon}
                {activePanel === item.id && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-accent rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </header>

        <main className="flex flex-1 items-center justify-center px-3 sm:px-4 pb-2 sm:pb-4 landscape:pb-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="w-full"
          >
            <TimerView />
          </motion.div>
        </main>
      </div>

      <Modal
        open={activePanel !== null}
        onClose={() => setActivePanel(null)}
        title={activePanel ? panelTitles[activePanel] : ''}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <PanelContent panel={activePanel} />
          </motion.div>
        </AnimatePresence>
      </Modal>
    </div>
  );
}
