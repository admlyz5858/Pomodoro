import { motion } from 'framer-motion';
import type { Plant, PlantStage } from '../../core/types.ts';

const plantVisuals: Record<PlantStage, { emoji: string; scale: number; glow: boolean }> = {
  seed: { emoji: '🌱', scale: 0.6, glow: false },
  sprout: { emoji: '🌿', scale: 0.8, glow: false },
  sapling: { emoji: '🌳', scale: 1.0, glow: false },
  tree: { emoji: '🌲', scale: 1.2, glow: false },
  glowing: { emoji: '✨🌲✨', scale: 1.3, glow: true },
};

interface PlantDisplayProps {
  plant: Plant;
  size?: 'sm' | 'md' | 'lg';
}

export function PlantDisplay({ plant, size = 'md' }: PlantDisplayProps) {
  const visual = plantVisuals[plant.stage];
  const sizeMap = { sm: 'text-2xl', md: 'text-5xl', lg: 'text-7xl' };

  if (plant.dead) {
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 0.8, opacity: 0.3 }}
        className={`${sizeMap[size]} grayscale`}
      >
        🥀
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: visual.scale, opacity: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      className={`${sizeMap[size]} select-none ${visual.glow ? 'animate-pulse-glow' : ''}`}
    >
      {visual.glow && (
        <div className="absolute inset-0 rounded-full bg-xp/20 blur-xl animate-breathe" />
      )}
      {visual.emoji}
    </motion.div>
  );
}
