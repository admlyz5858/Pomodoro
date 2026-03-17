type NoiseType = 'white' | 'pink' | 'brown';

interface ActiveSound {
  sources: AudioNode[];
  gain: GainNode;
}

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function createNoiseBuffer(ctx: AudioContext, type: NoiseType, seconds = 4): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (type === 'white') {
      data[i] = white * 0.5;
    } else if (type === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    } else {
      b0 = (b0 + (0.02 * white)) / 1.02;
      data[i] = b0 * 3.5;
    }
  }
  return buffer;
}

function createAmbientSound(ctx: AudioContext, soundId: string, destination: GainNode): ActiveSound {
  const sources: AudioNode[] = [];

  if (soundId === 'rain') {
    const noiseBuffer = createNoiseBuffer(ctx, 'pink', 4);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 800;
    bp.Q.value = 0.5;
    source.connect(bp).connect(destination);
    source.start();
    sources.push(source);

    const dropsBuffer = createNoiseBuffer(ctx, 'white', 4);
    const drops = ctx.createBufferSource();
    drops.buffer = dropsBuffer;
    drops.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4000;
    const dropGain = ctx.createGain();
    dropGain.gain.value = 0.15;
    drops.connect(hp).connect(dropGain).connect(destination);
    drops.start();
    sources.push(drops);
  } else if (soundId === 'forest') {
    const noiseBuffer = createNoiseBuffer(ctx, 'pink', 4);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 500;
    const forestGain = ctx.createGain();
    forestGain.gain.value = 0.4;
    source.connect(lp).connect(forestGain).connect(destination);
    source.start();
    sources.push(source);

    const chirpOsc = ctx.createOscillator();
    chirpOsc.type = 'sine';
    chirpOsc.frequency.value = 2400;
    const chirpGain = ctx.createGain();
    chirpGain.gain.value = 0;
    const chirpLfo = ctx.createOscillator();
    chirpLfo.frequency.value = 0.3;
    const chirpLfoGain = ctx.createGain();
    chirpLfoGain.gain.value = 0.05;
    chirpLfo.connect(chirpLfoGain).connect(chirpGain.gain);
    chirpOsc.connect(chirpGain).connect(destination);
    chirpOsc.start();
    chirpLfo.start();
    sources.push(chirpOsc, chirpLfo);
  } else if (soundId === 'wind') {
    const noiseBuffer = createNoiseBuffer(ctx, 'brown', 4);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 400;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    source.connect(lp).connect(destination);
    source.start();
    sources.push(source, lfo);
  } else if (soundId === 'waves') {
    const noiseBuffer = createNoiseBuffer(ctx, 'brown', 4);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 300;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.8;
    source.connect(lp).connect(waveGain).connect(destination);
    source.start();
    sources.push(source, lfo);
  } else if (soundId === 'fire') {
    const noiseBuffer = createNoiseBuffer(ctx, 'brown', 4);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 600;
    bp.Q.value = 1;
    const crackleLfo = ctx.createOscillator();
    crackleLfo.frequency.value = 3;
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.3;
    crackleLfo.connect(crackleGain).connect(bp.frequency);
    crackleLfo.start();
    source.connect(bp).connect(destination);
    source.start();
    sources.push(source, crackleLfo);
  } else {
    const noiseBuffer = createNoiseBuffer(ctx, 'pink', 4);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    const g = ctx.createGain();
    g.gain.value = 0.3;
    source.connect(lp).connect(g).connect(destination);
    source.start();
    sources.push(source);
  }

  return { sources, gain: destination };
}

export class AudioEngine {
  private masterGain: GainNode | null = null;
  private currentSound: ActiveSound | null = null;
  private _volume = 0.5;
  private _enabled = true;
  private _currentSoundId = '';

  get volume(): number { return this._volume; }
  get enabled(): boolean { return this._enabled; }
  get currentSoundId(): string { return this._currentSoundId; }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this._volume, getContext().currentTime, 0.1);
    }
  }

  setEnabled(e: boolean): void {
    this._enabled = e;
    if (!e) this.stopAmbient();
  }

  playAmbient(soundId: string): void {
    if (!this._enabled) return;
    if (this._currentSoundId === soundId && this.currentSound) return;
    this.stopAmbient();
    const ctx = getContext();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    this.masterGain = gain;
    this.currentSound = createAmbientSound(ctx, soundId, gain);
    this._currentSoundId = soundId;
    gain.gain.setTargetAtTime(this._volume, ctx.currentTime, 1.5);
  }

  stopAmbient(): void {
    if (this.masterGain) {
      const ctx = getContext();
      const gain = this.masterGain;
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      const sound = this.currentSound;
      setTimeout(() => {
        sound?.sources.forEach((s) => {
          try { (s as AudioScheduledSourceNode).stop(); } catch { /* already stopped */ }
        });
        try { gain.disconnect(); } catch { /* ok */ }
      }, 2000);
    }
    this.currentSound = null;
    this.masterGain = null;
    this._currentSoundId = '';
  }

  playTick(): void {
    if (!this._enabled) return;
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;
    const gain = ctx.createGain();
    gain.gain.value = this._volume * 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  playBell(): void {
    if (!this._enabled) return;
    const ctx = getContext();
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = this._volume * 0.25;
      gain.gain.setTargetAtTime(0, ctx.currentTime + 0.5 + i * 0.15, 0.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + 3 + i * 0.15);
    });
  }

  playClick(): void {
    if (!this._enabled) return;
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1000;
    const gain = ctx.createGain();
    gain.gain.value = this._volume * 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  playLevelUp(): void {
    if (!this._enabled) return;
    const ctx = getContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = this._volume * 0.2;
      gain.gain.setTargetAtTime(0, ctx.currentTime + 0.2 + i * 0.12, 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + 1 + i * 0.12);
    });
  }

  destroy(): void {
    this.stopAmbient();
    audioCtx = null;
  }
}

export const audioEngine = new AudioEngine();
