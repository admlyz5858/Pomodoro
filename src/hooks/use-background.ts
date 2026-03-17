import { useState, useEffect, useCallback, useRef } from 'react';
import { ENVIRONMENTS } from '../core/constants.ts';
import { useSettingsStore } from '../store/settings-store.ts';

const ROTATE_INTERVAL = 5 * 60 * 1000;

export function useBackground() {
  const envId = useSettingsStore((s) => s.settings.selectedEnvironment);
  const env = ENVIRONMENTS.find((e) => e.id === envId) ?? ENVIRONMENTS[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1 % env.images.length);
  const [transitioning, setTransitioning] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const advanceImage = useCallback(() => {
    setTransitioning(true);
    setNextIndex((prev) => (prev + 1) % env.images.length);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % env.images.length);
      setTransitioning(false);
    }, 3000);
  }, [env.images.length]);

  useEffect(() => {
    setCurrentIndex(0);
    setNextIndex(1 % env.images.length);
    setTransitioning(false);
  }, [envId, env.images.length]);

  useEffect(() => {
    timerRef.current = setInterval(advanceImage, ROTATE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [advanceImage]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseOffset({ x: x * 8, y: y * 8 });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return {
    environment: env,
    currentImage: env.images[currentIndex % env.images.length],
    nextImage: env.images[nextIndex % env.images.length],
    transitioning,
    mouseOffset,
    advanceImage,
  };
}
