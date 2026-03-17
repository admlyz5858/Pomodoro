import { useState, useRef } from 'react';
import { useSettingsStore } from '../../store/settings-store.ts';
import { GlassCard } from '../../components/ui/GlassCard.tsx';
import { ENVIRONMENTS, SOUND_PROFILES } from '../../core/constants.ts';
import { useGameStore } from '../../store/game-store.ts';
import { StorageService } from '../../services/storage.ts';

function DurationInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const minutes = Math.round(value / 60000);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(60000, value - 300000))}
          className="w-7 h-7 rounded-lg bg-surface-light text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer press-effect"
        >
          −
        </button>
        <span className="text-sm font-medium w-10 text-center">{minutes}m</span>
        <button
          onClick={() => onChange(Math.min(5400000, value + 300000))}
          className="w-7 h-7 rounded-lg bg-surface-light text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer press-effect"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${value ? 'bg-accent' : 'bg-surface-light'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

export function SettingsView() {
  const { settings, updateSettings } = useSettingsStore();
  const level = useGameStore((s) => s.level);
  const unlockedEnvs = useGameStore((s) => s.unlockedEnvironments);
  const unlockedSounds = useGameStore((s) => s.unlockedSounds);
  const [exportMsg, setExportMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const json = await StorageService.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-universe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg('Exported!');
    setTimeout(() => setExportMsg(''), 2000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await StorageService.importAll(text);
    setExportMsg('Imported! Refreshing...');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[70vh]">
      {/* Timer */}
      <GlassCard className="p-4">
        <h3 className="text-xs text-text-muted uppercase tracking-wider mb-3">Timer</h3>
        <div className="flex flex-col gap-3">
          <DurationInput label="Focus" value={settings.focusDuration} onChange={(v) => updateSettings({ focusDuration: v })} />
          <DurationInput label="Short Break" value={settings.shortBreakDuration} onChange={(v) => updateSettings({ shortBreakDuration: v })} />
          <DurationInput label="Long Break" value={settings.longBreakDuration} onChange={(v) => updateSettings({ longBreakDuration: v })} />
          <Toggle label="Auto-start breaks" value={settings.autoStartBreaks} onChange={(v) => updateSettings({ autoStartBreaks: v })} />
          <Toggle label="Auto-start focus" value={settings.autoStartFocus} onChange={(v) => updateSettings({ autoStartFocus: v })} />
        </div>
      </GlassCard>

      {/* Environment */}
      <GlassCard className="p-4">
        <h3 className="text-xs text-text-muted uppercase tracking-wider mb-3">Environment</h3>
        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENTS.map((env) => {
            const locked = !unlockedEnvs.includes(env.id);
            const active = settings.selectedEnvironment === env.id;
            return (
              <button
                key={env.id}
                disabled={locked}
                onClick={() => updateSettings({ selectedEnvironment: env.id })}
                className={`text-left p-2 rounded-lg text-sm transition-all cursor-pointer press-effect ${
                  active ? 'bg-accent/20 ring-1 ring-accent/40' : 'bg-surface-light hover:bg-surface-lighter'
                } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span>{env.emoji} {env.name}</span>
                {locked && <span className="text-[10px] text-text-muted block">Lv.{env.unlockLevel}</span>}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Sound */}
      <GlassCard className="p-4">
        <h3 className="text-xs text-text-muted uppercase tracking-wider mb-3">Sound</h3>
        <div className="flex flex-col gap-3">
          <Toggle label="Sound enabled" value={settings.soundEnabled} onChange={(v) => updateSettings({ soundEnabled: v })} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
              className="w-24 accent-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {SOUND_PROFILES.map((s) => {
              const locked = !unlockedSounds.includes(s.id);
              const active = settings.selectedSound === s.id;
              return (
                <button
                  key={s.id}
                  disabled={locked}
                  onClick={() => updateSettings({ selectedSound: s.id })}
                  className={`text-left p-2 rounded-lg text-sm transition-all cursor-pointer press-effect ${
                    active ? 'bg-accent/20 ring-1 ring-accent/40' : 'bg-surface-light hover:bg-surface-lighter'
                  } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span>{s.emoji} {s.name}</span>
                  {locked && <span className="text-[10px] text-text-muted block">Lv.{s.unlockLevel}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Effects */}
      <GlassCard className="p-4">
        <h3 className="text-xs text-text-muted uppercase tracking-wider mb-3">Effects</h3>
        <Toggle label="Particles" value={settings.particlesEnabled} onChange={(v) => updateSettings({ particlesEnabled: v })} />
      </GlassCard>

      {/* Data */}
      <GlassCard className="p-4">
        <h3 className="text-xs text-text-muted uppercase tracking-wider mb-3">Data</h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex-1 bg-surface-light rounded-lg py-2 text-sm hover:bg-surface-lighter transition-colors cursor-pointer press-effect">
              Export Data
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-surface-light rounded-lg py-2 text-sm hover:bg-surface-lighter transition-colors cursor-pointer press-effect"
            >
              Import Data
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
          {exportMsg && <p className="text-xs text-break-accent text-center">{exportMsg}</p>}
          <p className="text-xs text-text-muted">Level: {level} • Your progress is saved locally.</p>
        </div>
      </GlassCard>
    </div>
  );
}
