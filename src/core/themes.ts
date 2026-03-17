export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  mode: 'dark' | 'light';
  colors: {
    midnight: string;
    surface: string;
    surfaceLight: string;
    glass: string;
    glassBorder: string;
    accent: string;
    accentGlow: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

export const THEMES: AppTheme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌌',
    mode: 'dark',
    colors: {
      midnight: '#0a0a12',
      surface: '#16132a',
      surfaceLight: '#1f1b38',
      glass: 'rgba(22, 19, 42, 0.6)',
      glassBorder: 'rgba(139, 92, 246, 0.12)',
      accent: '#8b5cf6',
      accentGlow: '#a78bfa',
      textPrimary: '#f1f0f5',
      textSecondary: '#a09cb5',
      textMuted: '#5e576e',
    },
  },
  {
    id: 'neon',
    name: 'Neon Pulse',
    emoji: '💜',
    mode: 'dark',
    colors: {
      midnight: '#0a0014',
      surface: '#140028',
      surfaceLight: '#1e003d',
      glass: 'rgba(20, 0, 40, 0.6)',
      glassBorder: 'rgba(192, 38, 211, 0.15)',
      accent: '#c026d3',
      accentGlow: '#e879f9',
      textPrimary: '#faf5ff',
      textSecondary: '#c4b5fd',
      textMuted: '#6b21a8',
    },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    emoji: '🌊',
    mode: 'dark',
    colors: {
      midnight: '#0a1628',
      surface: '#0f2035',
      surfaceLight: '#162d4a',
      glass: 'rgba(15, 32, 53, 0.6)',
      glassBorder: 'rgba(56, 189, 248, 0.12)',
      accent: '#0ea5e9',
      accentGlow: '#38bdf8',
      textPrimary: '#f0f9ff',
      textSecondary: '#7dd3fc',
      textMuted: '#1e3a5f',
    },
  },
  {
    id: 'earth',
    name: 'Earth Tone',
    emoji: '🌿',
    mode: 'dark',
    colors: {
      midnight: '#0f1209',
      surface: '#1a2010',
      surfaceLight: '#253018',
      glass: 'rgba(26, 32, 16, 0.6)',
      glassBorder: 'rgba(34, 197, 94, 0.12)',
      accent: '#22c55e',
      accentGlow: '#4ade80',
      textPrimary: '#f0fdf4',
      textSecondary: '#86efac',
      textMuted: '#2d4a1c',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    emoji: '🌅',
    mode: 'dark',
    colors: {
      midnight: '#18100a',
      surface: '#2a1a0e',
      surfaceLight: '#3d2514',
      glass: 'rgba(42, 26, 14, 0.6)',
      glassBorder: 'rgba(251, 146, 60, 0.12)',
      accent: '#f97316',
      accentGlow: '#fb923c',
      textPrimary: '#fff7ed',
      textSecondary: '#fdba74',
      textMuted: '#5c3a1e',
    },
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    emoji: '🌸',
    mode: 'dark',
    colors: {
      midnight: '#18080e',
      surface: '#2a101a',
      surfaceLight: '#3d1828',
      glass: 'rgba(42, 16, 26, 0.6)',
      glassBorder: 'rgba(244, 114, 182, 0.12)',
      accent: '#ec4899',
      accentGlow: '#f472b6',
      textPrimary: '#fdf2f8',
      textSecondary: '#f9a8d4',
      textMuted: '#5c1e3a',
    },
  },
  {
    id: 'light',
    name: 'Daylight',
    emoji: '☀️',
    mode: 'light',
    colors: {
      midnight: '#f8f9fa',
      surface: '#ffffff',
      surfaceLight: '#f1f3f5',
      glass: 'rgba(255, 255, 255, 0.7)',
      glassBorder: 'rgba(139, 92, 246, 0.15)',
      accent: '#7c3aed',
      accentGlow: '#8b5cf6',
      textPrimary: '#1a1a2e',
      textSecondary: '#4a4a6a',
      textMuted: '#9ca3af',
    },
  },
  {
    id: 'cream',
    name: 'Warm Cream',
    emoji: '🍦',
    mode: 'light',
    colors: {
      midnight: '#faf8f5',
      surface: '#fffefa',
      surfaceLight: '#f5f0e8',
      glass: 'rgba(255, 254, 250, 0.7)',
      glassBorder: 'rgba(180, 120, 60, 0.12)',
      accent: '#d97706',
      accentGlow: '#f59e0b',
      textPrimary: '#292524',
      textSecondary: '#57534e',
      textMuted: '#a8a29e',
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
  root.style.setProperty('--color-text-primary', c.textPrimary);
  root.style.setProperty('--color-text-secondary', c.textSecondary);
  root.style.setProperty('--color-text-muted', c.textMuted);

  document.body.style.backgroundColor = c.midnight;
  document.body.style.color = c.textPrimary;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', c.midnight);
}
