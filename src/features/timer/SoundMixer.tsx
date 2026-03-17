import { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard.tsx';
import { useSettingsStore } from '../../store/settings-store.ts';
import { SOUND_PROFILES } from '../../core/constants.ts';
import { useGameStore } from '../../store/game-store.ts';

interface MixerChannel {
  id: string;
  volume: number;
  active: boolean;
}

type NoiseType = 'white' | 'pink' | 'brown';

function createNoiseBuffer(ctx: AudioContext, type: NoiseType, seconds = 4): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = sr * seconds;
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (type === 'white') { d[i] = w * 0.5; }
    else if (type === 'pink') {
      b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
      b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
      d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.06; b6 = w*0.115926;
    } else { b0 = (b0 + 0.02*w)/1.02; d[i] = b0*3.5; }
  }
  return buf;
}

const MIXER_SOUNDS: Record<string, { noise: NoiseType; filterType: BiquadFilterType; freq: number; q: number }> = {
  rain:   { noise: 'pink',  filterType: 'bandpass', freq: 800,  q: 0.5 },
  forest: { noise: 'pink',  filterType: 'lowpass',  freq: 500,  q: 1 },
  wind:   { noise: 'brown', filterType: 'lowpass',  freq: 400,  q: 1 },
  waves:  { noise: 'brown', filterType: 'lowpass',  freq: 300,  q: 1 },
  fire:   { noise: 'brown', filterType: 'bandpass', freq: 600,  q: 1 },
};

export function SoundMixer({ visible }: { visible: boolean }) {
  const globalVolume = useSettingsStore((s) => s.settings.volume);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);
  const unlockedSounds = useGameStore((s) => s.unlockedSounds);

  const [channels, setChannels] = useState<MixerChannel[]>(() =>
    Object.keys(MIXER_SOUNDS).map((id) => ({ id, volume: 0, active: false })),
  );

  const ctxRef = useRef<AudioContext | null>(null);
  const gainsRef = useRef<Map<string, GainNode>>(new Map());
  const sourcesRef = useRef<Map<string, AudioBufferSourceNode>>(new Map());

  useEffect(() => {
    return () => {
      sourcesRef.current.forEach((s) => { try { s.stop(); } catch { /* ok */ } });
      ctxRef.current?.close();
    };
  }, []);

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  };

  const toggleChannel = (id: string) => {
    if (!soundEnabled) return;
    const ch = channels.find((c) => c.id === id);
    if (!ch) return;

    if (ch.active) {
      const gain = gainsRef.current.get(id);
      if (gain) {
        const ctx = getCtx();
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
        setTimeout(() => {
          const src = sourcesRef.current.get(id);
          try { src?.stop(); } catch { /* ok */ }
          sourcesRef.current.delete(id);
          gainsRef.current.delete(id);
        }, 1000);
      }
      setChannels((prev) => prev.map((c) => c.id === id ? { ...c, active: false, volume: 0 } : c));
    } else {
      const ctx = getCtx();
      const config = MIXER_SOUNDS[id];
      const buf = createNoiseBuffer(ctx, config.noise, 4);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = config.filterType;
      filter.frequency.value = config.freq;
      filter.Q.value = config.q;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.5 * globalVolume, ctx.currentTime, 0.5);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      sourcesRef.current.set(id, src);
      gainsRef.current.set(id, gain);
      setChannels((prev) => prev.map((c) => c.id === id ? { ...c, active: true, volume: 0.5 } : c));
    }
  };

  const setVolume = (id: string, vol: number) => {
    const gain = gainsRef.current.get(id);
    if (gain) {
      const ctx = getCtx();
      gain.gain.setTargetAtTime(vol * globalVolume, ctx.currentTime, 0.1);
    }
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, volume: vol } : c));
  };

  if (!visible) return null;

  return (
    <GlassCard className="p-3 mt-2 animate-slide-up">
      <h4 className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Sound Mixer</h4>
      <div className="flex flex-col gap-2">
        {channels.map((ch) => {
          const profile = SOUND_PROFILES.find((s) => s.id === ch.id);
          const locked = !unlockedSounds.includes(ch.id);
          return (
            <div key={ch.id} className="flex items-center gap-2">
              <button
                onClick={() => toggleChannel(ch.id)}
                disabled={locked}
                className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer press-effect ${
                  ch.active ? 'bg-accent/30 ring-1 ring-accent/40' : 'bg-surface-light'
                } ${locked ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {profile?.emoji ?? '🎵'}
              </button>
              <span className="text-xs text-text-secondary w-14 truncate">{profile?.name ?? ch.id}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ch.volume}
                onChange={(e) => setVolume(ch.id, parseFloat(e.target.value))}
                disabled={!ch.active}
                className="flex-1 accent-accent h-1 disabled:opacity-30"
              />
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-text-muted mt-2">Mix multiple ambient sounds together</p>
    </GlassCard>
  );
}
