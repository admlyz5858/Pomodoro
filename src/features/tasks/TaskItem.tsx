import { motion } from 'framer-motion';
import type { Task } from '../../core/types.ts';

interface TaskItemProps {
  task: Task;
  isActive: boolean;
  onToggle: () => void;
  onSetActive: () => void;
  onRemove: () => void;
}

export function TaskItem({ task, isActive, onToggle, onSetActive, onRemove }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className={`glass-light rounded-xl p-3 flex items-center gap-3 transition-all ${
        isActive ? 'ring-1 ring-accent/40 shadow-lg shadow-accent/10' : ''
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
          task.completed
            ? 'bg-accent border-accent'
            : 'border-text-muted hover:border-accent'
        }`}
      >
        {task.completed && (
          <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </button>

      {/* Content */}
      <button onClick={onSetActive} className="flex-1 text-left cursor-pointer min-w-0">
        <p className={`text-sm truncate ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-text-muted">
            {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
          </span>
          {isActive && (
            <span className="text-[10px] text-accent font-medium">ACTIVE</span>
          )}
        </div>
      </button>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="text-text-muted hover:text-danger transition-colors cursor-pointer flex-shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}
