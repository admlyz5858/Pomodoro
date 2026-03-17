import { create } from 'zustand';
import type { GameState, Plant, Quest } from '../core/types.ts';
import { getPlantStage, getLevelFromXp, todayKey } from '../core/types.ts';
import { StorageService } from '../services/storage.ts';
import { DAILY_QUEST_TEMPLATES, WEEKLY_QUEST_TEMPLATES } from '../core/constants.ts';

function createPlant(): Plant {
  return {
    id: crypto.randomUUID(),
    species: ['oak', 'pine', 'cherry', 'willow', 'maple'][Math.floor(Math.random() * 5)],
    stage: 'seed',
    growthProgress: 0,
    plantedAt: Date.now(),
    completedAt: null,
    dead: false,
    sessionsGiven: 0,
  };
}

function generateQuests(type: 'daily' | 'weekly'): Quest[] {
  const templates = type === 'daily' ? DAILY_QUEST_TEMPLATES : WEEKLY_QUEST_TEMPLATES;
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const count = type === 'daily' ? 3 : 2;

  return shuffled.slice(0, count).map((t) => ({
    id: crypto.randomUUID(),
    title: t.title,
    description: t.description.replace('{n}', String(t.target)),
    target: t.target,
    progress: 0,
    rewardXp: type === 'daily' ? 150 : 500,
    type,
    createdAt: Date.now(),
    completed: false,
  }));
}

const initialState: GameState = {
  xp: 0,
  level: 1,
  currentPlant: createPlant(),
  garden: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  unlockedEnvironments: ['forest', 'rain'],
  unlockedSounds: ['rain', 'forest', 'piano'],
  quests: [...generateQuests('daily'), ...generateQuests('weekly')],
};

interface GameStore extends GameState {
  loaded: boolean;
  addXp: (amount: number) => void;
  completeFocusSession: () => void;
  killCurrentPlant: () => void;
  updateStreak: () => void;
  updateQuestProgress: (type: string, amount: number) => void;
  refreshQuests: () => void;
  unlock: (category: 'environments' | 'sounds', id: string) => void;
  loadGameState: () => Promise<void>;
}

function persist(state: GameState) {
  StorageService.saveGameState(state);
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  loaded: false,

  addXp: (amount) => {
    const prev = get();
    const newXp = prev.xp + amount;
    const newLevel = getLevelFromXp(newXp);
    set({ xp: newXp, level: newLevel });
    persist(get());
  },

  completeFocusSession: () => {
    const state = get();
    let { currentPlant } = state;
    const xpBase = 100;
    const streakBonus = state.currentStreak * 10;
    const totalXp = xpBase + streakBonus;

    if (currentPlant && !currentPlant.dead) {
      const newSessions = currentPlant.sessionsGiven + 1;
      const newStage = getPlantStage(newSessions);
      const isComplete = newStage === 'glowing';
      currentPlant = {
        ...currentPlant,
        sessionsGiven: newSessions,
        stage: newStage,
        growthProgress: Math.min(100, (newSessions / 10) * 100),
        completedAt: isComplete ? Date.now() : null,
      };

      let garden = state.garden;
      if (isComplete) {
        garden = [...garden, currentPlant];
        currentPlant = createPlant();
      }

      set({ currentPlant, garden });
    }

    get().addXp(totalXp);
    get().updateStreak();
    get().updateQuestProgress('session', 1);
    persist(get());
  },

  killCurrentPlant: () => {
    const { currentPlant } = get();
    if (currentPlant) {
      set({ currentPlant: { ...currentPlant, dead: true } });
      setTimeout(() => {
        set({ currentPlant: createPlant() });
        persist(get());
      }, 3000);
      persist(get());
    }
  },

  updateStreak: () => {
    const state = get();
    const today = todayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let streak = state.currentStreak;
    if (state.lastActiveDate === today) {
      // Already active today
    } else if (state.lastActiveDate === yesterday) {
      streak += 1;
    } else if (state.lastActiveDate === '') {
      streak = 1;
    } else {
      streak = 1;
    }

    set({
      currentStreak: streak,
      longestStreak: Math.max(state.longestStreak, streak),
      lastActiveDate: today,
    });
    persist(get());
  },

  updateQuestProgress: (_type, amount) => {
    const quests = get().quests.map((q) => {
      if (q.completed) return q;
      const newProgress = Math.min(q.target, q.progress + amount);
      const completed = newProgress >= q.target;
      if (completed) {
        setTimeout(() => get().addXp(q.rewardXp), 100);
      }
      return { ...q, progress: newProgress, completed };
    });
    set({ quests });
    persist(get());
  },

  refreshQuests: () => {
    const state = get();
    const now = Date.now();
    const needsRefresh = state.quests.some(
      (q) => q.type === 'daily' && new Date(q.createdAt).toDateString() !== new Date().toDateString(),
    );
    if (needsRefresh || state.quests.length === 0) {
      const daily = generateQuests('daily');
      const weekly = state.quests.filter((q) => q.type === 'weekly' && now - q.createdAt < 7 * 86400000);
      const newWeekly = weekly.length < 2 ? generateQuests('weekly') : weekly;
      set({ quests: [...daily, ...newWeekly] });
      persist(get());
    }
  },

  unlock: (category, id) => {
    const key = category === 'environments' ? 'unlockedEnvironments' : 'unlockedSounds';
    const current = get()[key];
    if (!current.includes(id)) {
      set({ [key]: [...current, id] });
      persist(get());
    }
  },

  loadGameState: async () => {
    const saved = await StorageService.loadGameState();
    if (saved) {
      set({ ...saved, loaded: true });
      get().refreshQuests();
    } else {
      set({ loaded: true });
    }
  },
}));
