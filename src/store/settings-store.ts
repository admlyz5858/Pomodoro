import { create } from 'zustand';
import type { TimerSettings } from '../core/types.ts';
import { DEFAULT_SETTINGS } from '../core/types.ts';
import { StorageService } from '../services/storage.ts';

interface SettingsStore {
  settings: TimerSettings;
  loaded: boolean;
  updateSettings: (partial: Partial<TimerSettings>) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,

  updateSettings: (partial) => {
    const next = { ...get().settings, ...partial };
    set({ settings: next });
    StorageService.saveSettings(next);
  },

  loadSettings: async () => {
    const saved = await StorageService.loadSettings();
    if (saved) {
      set({ settings: { ...DEFAULT_SETTINGS, ...saved }, loaded: true });
    } else {
      set({ loaded: true });
    }
  },
}));
