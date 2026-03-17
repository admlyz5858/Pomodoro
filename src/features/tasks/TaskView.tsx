import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../store/task-store.ts';
import { GlassCard } from '../../components/ui/GlassCard.tsx';
import { TaskItem } from './TaskItem.tsx';

export function TaskView() {
  const { tasks, activeTaskId, addTask, addTasksFromAI, removeTask, toggleTask, setActiveTask, clearCompleted } = useTaskStore();
  const [input, setInput] = useState('');
  const [isAI, setIsAI] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (isAI) {
      setLoading(true);
      await addTasksFromAI(input.trim());
      setLoading(false);
    } else {
      addTask(input.trim());
    }
    setInput('');
  };

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[70vh]">
      {/* Input */}
      <GlassCard className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isAI ? 'e.g. "Study physics 3 hours"' : 'Add a task...'}
              className="flex-1 bg-surface-light rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-accent/40 transition-shadow"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-accent px-4 py-2 rounded-lg text-sm text-white hover:bg-accent-glow transition-colors cursor-pointer disabled:opacity-40"
            >
              {loading ? '...' : isAI ? '✨ Split' : 'Add'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsAI(!isAI)}
            className="text-xs text-text-muted hover:text-accent transition-colors cursor-pointer self-start"
          >
            {isAI ? '← Simple mode' : '✨ AI Smart Split'}
          </button>
        </form>
      </GlassCard>

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs text-text-muted uppercase tracking-wider px-1">
            Tasks ({pending.length})
          </h3>
          <AnimatePresence>
            {pending.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isActive={task.id === activeTaskId}
                onToggle={() => toggleTask(task.id)}
                onSetActive={() => setActiveTask(task.id === activeTaskId ? null : task.id)}
                onRemove={() => removeTask(task.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs text-text-muted uppercase tracking-wider">
              Completed ({completed.length})
            </h3>
            <button
              onClick={clearCompleted}
              className="text-xs text-text-muted hover:text-danger transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
          <AnimatePresence>
            {completed.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isActive={false}
                onToggle={() => toggleTask(task.id)}
                onSetActive={() => {}}
                onRemove={() => removeTask(task.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {tasks.length === 0 && (
        <p className="text-center text-sm text-text-muted py-8">
          No tasks yet. Add one above to get started!
        </p>
      )}
    </div>
  );
}
