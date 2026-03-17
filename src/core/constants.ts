export interface Environment {
  id: string;
  name: string;
  emoji: string;
  images: string[];
  unlockLevel: number;
  particleType: 'fireflies' | 'dust' | 'snow' | 'rain' | 'stars';
  overlayColor: string;
}

export interface SoundProfile {
  id: string;
  name: string;
  emoji: string;
  category: 'focus' | 'break';
  unlockLevel: number;
}

export const ENVIRONMENTS: Environment[] = [
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
      'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1920&q=80',
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80',
    ],
    unlockLevel: 1,
    particleType: 'fireflies',
    overlayColor: 'rgba(0, 30, 10, 0.5)',
  },
  {
    id: 'rain',
    name: 'Rainy Day',
    emoji: '🌧️',
    images: [
      'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1920&q=80',
      'https://images.unsplash.com/photo-1501691223387-dd0500403074?w=1920&q=80',
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920&q=80',
    ],
    unlockLevel: 1,
    particleType: 'rain',
    overlayColor: 'rgba(10, 15, 30, 0.55)',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80',
    ],
    unlockLevel: 2,
    particleType: 'dust',
    overlayColor: 'rgba(5, 15, 30, 0.5)',
  },
  {
    id: 'mountains',
    name: 'Mountains',
    emoji: '🏔️',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
    ],
    unlockLevel: 3,
    particleType: 'dust',
    overlayColor: 'rgba(10, 10, 25, 0.45)',
  },
  {
    id: 'night',
    name: 'Night Sky',
    emoji: '🌌',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
      'https://images.unsplash.com/photo-1475274047050-1d0c55b0b264?w=1920&q=80',
      'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80',
    ],
    unlockLevel: 4,
    particleType: 'stars',
    overlayColor: 'rgba(5, 5, 20, 0.4)',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    images: [
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80',
      'https://images.unsplash.com/photo-1472120435266-95c21981df5b?w=1920&q=80',
    ],
    unlockLevel: 5,
    particleType: 'dust',
    overlayColor: 'rgba(30, 10, 5, 0.4)',
  },
  {
    id: 'snow',
    name: 'Snowfall',
    emoji: '❄️',
    images: [
      'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80',
      'https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1920&q=80',
      'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&q=80',
    ],
    unlockLevel: 6,
    particleType: 'snow',
    overlayColor: 'rgba(15, 20, 35, 0.4)',
  },
];

export const SOUND_PROFILES: SoundProfile[] = [
  { id: 'rain', name: 'Rain', emoji: '🌧️', category: 'focus', unlockLevel: 1 },
  { id: 'forest', name: 'Forest', emoji: '🌲', category: 'focus', unlockLevel: 1 },
  { id: 'wind', name: 'Wind', emoji: '💨', category: 'focus', unlockLevel: 2 },
  { id: 'waves', name: 'Ocean Waves', emoji: '🌊', category: 'focus', unlockLevel: 3 },
  { id: 'fire', name: 'Campfire', emoji: '🔥', category: 'focus', unlockLevel: 4 },
  { id: 'piano', name: 'Soft Piano', emoji: '🎹', category: 'break', unlockLevel: 1 },
  { id: 'lofi', name: 'Lo-fi', emoji: '🎵', category: 'break', unlockLevel: 2 },
  { id: 'ambient', name: 'Ambient', emoji: '✨', category: 'break', unlockLevel: 3 },
];

export const ENCOURAGING_MESSAGES = {
  focus: [
    "Deep work unlocks deep results ✨",
    "You're building something amazing 🚀",
    "Stay in the zone. You've got this 💪",
    "Every minute of focus compounds 📈",
    "Your future self will thank you 🌟",
    "Embrace the flow state 🌊",
    "Great things take focused effort ⭐",
    "You're making real progress 🎯",
  ],
  break: [
    "You earned this rest 🌿",
    "Breathe. Recharge. Come back stronger 🧘",
    "A rested mind is a powerful mind 🧠",
    "Take a moment to appreciate your work 🌸",
    "Stretch, breathe, smile 😊",
    "Your brain is consolidating what you learned 💡",
  ],
  streak: [
    "🔥 Unstoppable! {n} day streak!",
    "🔥 On fire! {n} days and counting!",
    "🔥 Legendary focus! {n} day streak!",
  ],
  levelUp: [
    "⚡ Level {n}! New horizons unlocked!",
    "🌟 Level {n}! You're evolving!",
    "✨ Level {n}! The universe expands!",
  ],
};

export const DAILY_QUEST_TEMPLATES = [
  { title: 'Early Bird', description: 'Complete a session before 10am', target: 1 },
  { title: 'Focus Sprint', description: 'Complete {n} focus sessions', target: 4 },
  { title: 'Consistency', description: 'Complete {n} sessions total', target: 6 },
  { title: 'Deep Work', description: 'Accumulate {n} minutes of focus', target: 90 },
  { title: 'Gardener', description: 'Grow a plant to sprout stage', target: 1 },
];

export const WEEKLY_QUEST_TEMPLATES = [
  { title: 'Weekly Warrior', description: 'Complete {n} focus sessions this week', target: 20 },
  { title: 'Time Master', description: 'Accumulate {n} hours of focus', target: 10 },
  { title: 'Streak Builder', description: 'Maintain a {n}-day streak', target: 5 },
  { title: 'Forest Keeper', description: 'Grow {n} plants to tree stage', target: 3 },
];
