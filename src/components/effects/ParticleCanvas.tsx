import { useEffect, useRef } from 'react';
import type { Environment } from '../../core/constants.ts';
import { useSettingsStore } from '../../store/settings-store.ts';
import { ENVIRONMENTS } from '../../core/constants.ts';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
  speed: number;
}

function createParticles(type: Environment['particleType'], count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => {
    const base: Particle = {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      size: 2,
      opacity: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1,
    };

    switch (type) {
      case 'fireflies':
        return { ...base, size: 2 + Math.random() * 3, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.2 };
      case 'dust':
        return { ...base, size: 1 + Math.random() * 2, vx: 0.1 + Math.random() * 0.3, vy: -0.05 + Math.random() * 0.1 };
      case 'snow':
        return { ...base, size: 2 + Math.random() * 4, vx: (Math.random() - 0.5) * 0.5, vy: 0.5 + Math.random() * 1 };
      case 'rain':
        return { ...base, size: 1, vx: 0.5, vy: 8 + Math.random() * 4, opacity: 0.2 + Math.random() * 0.3 };
      case 'stars':
        return { ...base, size: 1 + Math.random() * 2, vx: 0, vy: 0 };
    }
  });
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const envId = useSettingsStore((s) => s.settings.selectedEnvironment);
  const enabled = useSettingsStore((s) => s.settings.particlesEnabled);
  const env = ENVIRONMENTS.find((e) => e.id === envId) ?? ENVIRONMENTS[0];

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = createParticles(env.particleType, env.particleType === 'rain' ? 150 : 50, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const w = canvas.width;
      const h = canvas.height;

      for (const p of particles) {
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        if (env.particleType === 'fireflies') {
          p.x += Math.sin(time * 2 + p.phase) * 0.3;
          p.y += Math.cos(time * 1.5 + p.phase) * 0.2;
          const glow = 0.3 + Math.sin(time * 3 + p.phase) * 0.7;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(200, 255, 100, 0.6)';
          ctx.fillStyle = `rgba(200, 255, 100, ${glow * p.opacity})`;
        } else if (env.particleType === 'snow') {
          p.x += Math.sin(time + p.phase) * 0.3;
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        } else if (env.particleType === 'rain') {
          ctx.strokeStyle = `rgba(180, 200, 255, ${p.opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
          ctx.stroke();
        } else if (env.particleType === 'stars') {
          const twinkle = 0.3 + Math.sin(time * 2 + p.phase) * 0.7;
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * p.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.3})`;
          ctx.shadowBlur = 0;
        }

        if (env.particleType !== 'rain') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;

        if (p.x > w + 10) p.x = -10;
        if (p.x < -10) p.x = w + 10;
        if (p.y > h + 10) p.y = -10;
        if (p.y < -10) p.y = h + 10;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [env, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
