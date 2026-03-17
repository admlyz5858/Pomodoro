import type { PlantStage } from './types.ts';

export interface PlantSpecies {
  id: string;
  name: string;
  unlockLevel: number;
  stages: Record<PlantStage, string>;
}

export const PLANT_SPECIES: PlantSpecies[] = [
  {
    id: 'oak',
    name: 'Oak',
    unlockLevel: 1,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌿', tree: '🌳', glowing: '✨🌳✨' },
  },
  {
    id: 'pine',
    name: 'Pine',
    unlockLevel: 1,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌲', tree: '🌲', glowing: '✨🌲✨' },
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    unlockLevel: 2,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌸', tree: '🌸', glowing: '💮🌸💮' },
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    unlockLevel: 3,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌿', tree: '🌻', glowing: '✨🌻✨' },
  },
  {
    id: 'rose',
    name: 'Rose',
    unlockLevel: 4,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌿', tree: '🌹', glowing: '✨🌹✨' },
  },
  {
    id: 'tulip',
    name: 'Tulip',
    unlockLevel: 5,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌿', tree: '🌷', glowing: '✨🌷✨' },
  },
  {
    id: 'cactus',
    name: 'Cactus',
    unlockLevel: 6,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌵', tree: '🌵', glowing: '✨🌵✨' },
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    unlockLevel: 7,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🎋', tree: '🎋', glowing: '✨🎋✨' },
  },
  {
    id: 'mushroom',
    name: 'Mystic Mushroom',
    unlockLevel: 8,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🍄', tree: '🍄', glowing: '✨🍄✨' },
  },
  {
    id: 'palm',
    name: 'Palm Tree',
    unlockLevel: 10,
    stages: { seed: '🥥', sprout: '🌱', sapling: '🌿', tree: '🌴', glowing: '✨🌴✨' },
  },
  {
    id: 'bonsai',
    name: 'Bonsai',
    unlockLevel: 12,
    stages: { seed: '🌰', sprout: '🌱', sapling: '🌿', tree: '🪴', glowing: '✨🪴✨' },
  },
  {
    id: 'crystal',
    name: 'Crystal Flower',
    unlockLevel: 15,
    stages: { seed: '💎', sprout: '🔮', sapling: '💜', tree: '🔮', glowing: '✨💎✨' },
  },
];

export function getAvailableSpecies(level: number): PlantSpecies[] {
  return PLANT_SPECIES.filter((s) => s.unlockLevel <= level);
}

export function getSpeciesById(id: string): PlantSpecies | undefined {
  return PLANT_SPECIES.find((s) => s.id === id);
}
