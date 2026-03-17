import { useEffect, useRef } from 'react';
import { audioEngine } from '../core/audio-engine.ts';
import { useSettingsStore } from '../store/settings-store.ts';
import { useTimerStore } from '../store/timer-store.ts';

export function useAudio() {
  const { soundEnabled, volume, selectedSound } = useSettingsStore((s) => s.settings);
  const status = useTimerStore((s) => s.status);
  const remainingMs = useTimerStore((s) => s.remainingMs);
  const lastTickRef = useRef(0);

  useEffect(() => {
    audioEngine.setEnabled(soundEnabled);
    audioEngine.setVolume(volume);
  }, [soundEnabled, volume]);

  useEffect(() => {
    if (status === 'running') {
      audioEngine.playAmbient(selectedSound);
    } else {
      audioEngine.stopAmbient();
    }
  }, [status, selectedSound]);

  useEffect(() => {
    if (status !== 'running') return;
    if (remainingMs <= 10000 && remainingMs > 0) {
      const secondMark = Math.ceil(remainingMs / 1000);
      if (secondMark !== lastTickRef.current) {
        lastTickRef.current = secondMark;
        const tickVolume = 0.3 + (1 - remainingMs / 10000) * 0.7;
        audioEngine.setVolume(volume * tickVolume);
        audioEngine.playTick();
        audioEngine.setVolume(volume);
      }
    }
    if (remainingMs <= 100 && remainingMs > 0) {
      audioEngine.playBell();
    }
  }, [remainingMs, status, volume]);

  return audioEngine;
}
