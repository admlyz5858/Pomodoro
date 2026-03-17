export type ClockStyle = 'minimal' | 'analog' | 'dots' | 'arc' | 'thin' | 'segments' | 'dash' | 'glow';

export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  mode: 'dark' | 'light';
  clockStyle: ClockStyle;
  colors: {
    midnight: string;
    surface: string;
    surfaceLight: string;
    glass: string;
    glassBorder: string;
    accent: string;
    accentGlow: string;
    breakAccent: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

export const THEMES: AppTheme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌙',
    mode: 'dark',
    clockStyle: 'minimal',
    colors: {
      midnight: '#0c0b14',
      surface: '#141222',
      surfaceLight: '#1c1930',
      glass: 'rgba(20, 18, 34, 0.55)',
      glassBorder: 'rgba(120, 100, 180, 0.08)',
      accent: '#7c6fae',
      accentGlow: '#9b8ec4',
      breakAccent: '#6ba89a',
      textPrimary: '#e8e6ef',
      textSecondary: '#8a85a0',
      textMuted: '#4e4968',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    emoji: '💜',
    mode: 'dark',
    clockStyle: 'thin',
    colors: {
      midnight: '#0e0b16',
      surface: '#171225',
      surfaceLight: '#201a35',
      glass: 'rgba(23, 18, 37, 0.55)',
      glassBorder: 'rgba(150, 120, 200, 0.08)',
      accent: '#9678b8',
      accentGlow: '#b09ad0',
      breakAccent: '#7aad9a',
      textPrimary: '#ece8f4',
      textSecondary: '#9088a8',
      textMuted: '#554d70',
    },
  },
  {
    id: 'ocean',
    name: 'Deep Sea',
    emoji: '🐚',
    mode: 'dark',
    clockStyle: 'dots',
    colors: {
      midnight: '#0a1018',
      surface: '#101a26',
      surfaceLight: '#172434',
      glass: 'rgba(16, 26, 38, 0.55)',
      glassBorder: 'rgba(80, 140, 180, 0.08)',
      accent: '#5a8fa8',
      accentGlow: '#78aec5',
      breakAccent: '#6b9a7a',
      textPrimary: '#e4ecf2',
      textSecondary: '#7e98ac',
      textMuted: '#3d5568',
    },
  },
  {
    id: 'forest',
    name: 'Mossy Forest',
    emoji: '🌿',
    mode: 'dark',
    clockStyle: 'arc',
    colors: {
      midnight: '#0a100c',
      surface: '#121e16',
      surfaceLight: '#1a2c20',
      glass: 'rgba(18, 30, 22, 0.55)',
      glassBorder: 'rgba(90, 150, 100, 0.08)',
      accent: '#6a9e78',
      accentGlow: '#88ba96',
      breakAccent: '#8a9a6a',
      textPrimary: '#e6f0ea',
      textSecondary: '#829a8a',
      textMuted: '#3e5a46',
    },
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    emoji: '🕯️',
    mode: 'dark',
    clockStyle: 'analog',
    colors: {
      midnight: '#12100a',
      surface: '#1e1a10',
      surfaceLight: '#2c2618',
      glass: 'rgba(30, 26, 16, 0.55)',
      glassBorder: 'rgba(180, 140, 80, 0.08)',
      accent: '#b09060',
      accentGlow: '#c8a878',
      breakAccent: '#8a9a70',
      textPrimary: '#f0ece4',
      textSecondary: '#a09480',
      textMuted: '#5c5040',
    },
  },
  {
    id: 'rose',
    name: 'Dusty Rose',
    emoji: '🌷',
    mode: 'dark',
    clockStyle: 'segments',
    colors: {
      midnight: '#12090e',
      surface: '#1e1018',
      surfaceLight: '#2c1a24',
      glass: 'rgba(30, 16, 24, 0.55)',
      glassBorder: 'rgba(180, 110, 140, 0.08)',
      accent: '#a87890',
      accentGlow: '#c090a8',
      breakAccent: '#8a9a80',
      textPrimary: '#f0e8ec',
      textSecondary: '#a08898',
      textMuted: '#5c4450',
    },
  },
  {
    id: 'slate',
    name: 'Slate',
    emoji: '🪨',
    mode: 'dark',
    clockStyle: 'dash',
    colors: {
      midnight: '#0e1012',
      surface: '#181c20',
      surfaceLight: '#22282e',
      glass: 'rgba(24, 28, 32, 0.55)',
      glassBorder: 'rgba(140, 150, 170, 0.06)',
      accent: '#8090a8',
      accentGlow: '#98a8be',
      breakAccent: '#80a090',
      textPrimary: '#e6eaef',
      textSecondary: '#8892a0',
      textMuted: '#464e58',
    },
  },
  {
    id: 'light',
    name: 'Morning Light',
    emoji: '☁️',
    mode: 'light',
    clockStyle: 'thin',
    colors: {
      midnight: '#f5f4f8',
      surface: '#ffffff',
      surfaceLight: '#eeedf3',
      glass: 'rgba(255, 255, 255, 0.65)',
      glassBorder: 'rgba(100, 80, 140, 0.08)',
      accent: '#6b5c8a',
      accentGlow: '#8070a0',
      breakAccent: '#5a8a70',
      textPrimary: '#1e1a28',
      textSecondary: '#585068',
      textMuted: '#a8a0b8',
    },
  },
  {
    id: 'sand',
    name: 'Desert Sand',
    emoji: '🏜️',
    mode: 'light',
    clockStyle: 'analog',
    colors: {
      midnight: '#f8f5f0',
      surface: '#fefcf8',
      surfaceLight: '#f0ece4',
      glass: 'rgba(254, 252, 248, 0.65)',
      glassBorder: 'rgba(140, 110, 70, 0.08)',
      accent: '#8a7050',
      accentGlow: '#a08868',
      breakAccent: '#6a8a60',
      textPrimary: '#2a2418',
      textSecondary: '#685e4e',
      textMuted: '#b0a898',
    },
  },
  {
    id: 'paper',
    name: 'Soft Paper',
    emoji: '📄',
    mode: 'light',
    clockStyle: 'minimal',
    colors: {
      midnight: '#f6f6f4',
      surface: '#fefefe',
      surfaceLight: '#ededeb',
      glass: 'rgba(254, 254, 254, 0.65)',
      glassBorder: 'rgba(100, 100, 100, 0.06)',
      accent: '#606068',
      accentGlow: '#787880',
      breakAccent: '#608068',
      textPrimary: '#202024',
      textSecondary: '#58585e',
      textMuted: '#a8a8ae',
    },
  },
];

export function applyTheme(theme: AppTheme): void {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty('--color-midnight', c.midnight);
  root.style.setProperty('--color-surface', c.surface);
  root.style.setProperty('--color-surface-light', c.surfaceLight);
  root.style.setProperty('--color-glass', c.glass);
  root.style.setProperty('--color-glass-border', c.glassBorder);
  root.style.setProperty('--color-accent', c.accent);
  root.style.setProperty('--color-accent-glow', c.accentGlow);
  root.style.setProperty('--color-break-accent', c.breakAccent);
  root.style.setProperty('--color-text-primary', c.textPrimary);
  root.style.setProperty('--color-text-secondary', c.textSecondary);
  root.style.setProperty('--color-text-muted', c.textMuted);

  document.body.style.backgroundColor = c.midnight;
  document.body.style.color = c.textPrimary;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', c.midnight);
}

export function getThemeById(id: string): AppTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
