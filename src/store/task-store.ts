import { create } from 'zustand';
import type { Task } from '../core/types.ts';
import { StorageService } from '../services/storage.ts';
import { splitTaskWithAI } from '../services/ai-tasks.ts';

interface TaskStore {
  tasks: Task[];
  activeTaskId: string | null;
  loaded: boolean;
  addTask: (title: string, estimatedPomodoros?: number) => void;
  addTasksFromAI: (input: string) => Promise<void>;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  incrementPomodoro: (id: string) => void;
  setActiveTask: (id: string | null) => void;
  reorderTasks: (tasks: Task[]) => void;
  loadTasks: () => Promise<void>;
  clearCompleted: () => void;
}

function persist(tasks: Task[]) {
  StorageService.saveTasks(tasks);
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  activeTaskId: null,
  loaded: false,

  addTask: (title, estimatedPomodoros = 1) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      createdAt: Date.now(),
      order: get().tasks.length,
    };
    const next = [...get().tasks, task];
    set({ tasks: next });
    persist(next);
  },

  addTasksFromAI: async (input) => {
    const subtasks = await splitTaskWithAI(input);
    const existing = get().tasks;
    const newTasks: Task[] = subtasks.map((t, i) => ({
      ...t,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      order: existing.length + i,
    }));
    const next = [...existing, ...newTasks];
    set({ tasks: next });
    persist(next);
  },

  removeTask: (id) => {
    const next = get().tasks.filter((t) => t.id !== id);
    set({ tasks: next, activeTaskId: get().activeTaskId === id ? null : get().activeTaskId });
    persist(next);
  },

  toggleTask: (id) => {
    const next = get().tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    set({ tasks: next });
    persist(next);
  },

  incrementPomodoro: (id) => {
    const next = get().tasks.map((t) => {
      if (t.id !== id) return t;
      const completedPomodoros = t.completedPomodoros + 1;
      return {
        ...t,
        completedPomodoros,
        completed: completedPomodoros >= t.estimatedPomodoros,
      };
    });
    set({ tasks: next });
    persist(next);
  },

  setActiveTask: (id) => set({ activeTaskId: id }),

  reorderTasks: (tasks) => {
    set({ tasks });
    persist(tasks);
  },

  loadTasks: async () => {
    const tasks = await StorageService.loadTasks();
    set({ tasks, loaded: true });
  },

  clearCompleted: () => {
    const next = get().tasks.filter((t) => !t.completed);
    set({ tasks: next });
    persist(next);
  },
}));
