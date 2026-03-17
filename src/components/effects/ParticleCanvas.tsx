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
  rotation: number;
}

function createParticles(type: Environment['particleType'], count: number, w: number, h: number): Particle[] {
  const counts: Record<string, number> = {
    rain: 120, fireflies: 40, dust: 35, snow: 60, stars: 50, fog: 15, leaves: 25, embers: 30,
  };
  const n = counts[type] ?? count;

  return Array.from({ length: n }, () => {
    const base: Particle = {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0, vy: 0,
      size: 2,
      opacity: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1,
      rotation: Math.random() * 360,
    };

    switch (type) {
      case 'fireflies':
        return { ...base, size: 1.5 + Math.random() * 2, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.15 };
      case 'dust':
        return { ...base, size: 0.8 + Math.random() * 1.5, vx: 0.05 + Math.random() * 0.15, vy: -0.02 + Math.random() * 0.04, opacity: 0.2 + Math.random() * 0.3 };
      case 'snow':
        return { ...base, size: 1.5 + Math.random() * 3, vx: (Math.random() - 0.5) * 0.3, vy: 0.3 + Math.random() * 0.6, opacity: 0.3 + Math.random() * 0.4 };
      case 'rain':
        return { ...base, size: 0.8, vx: 0.3, vy: 6 + Math.random() * 3, opacity: 0.15 + Math.random() * 0.2 };
      case 'stars':
        return { ...base, size: 0.8 + Math.random() * 1.5, vx: 0, vy: 0, opacity: 0.3 + Math.random() * 0.7 };
      case 'fog':
        return { ...base, size: 80 + Math.random() * 120, vx: 0.1 + Math.random() * 0.2, vy: (Math.random() - 0.5) * 0.05, opacity: 0.03 + Math.random() * 0.06 };
      case 'leaves':
        return { ...base, size: 3 + Math.random() * 4, vx: 0.2 + Math.random() * 0.4, vy: 0.3 + Math.random() * 0.5, opacity: 0.3 + Math.random() * 0.4, speed: 0.3 + Math.random() * 0.5 };
      case 'embers':
        return { ...base, size: 1 + Math.random() * 2, vx: (Math.random() - 0.5) * 0.3, vy: -0.5 - Math.random() * 0.8, opacity: 0.4 + Math.random() * 0.5 };
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
      particlesRef.current = createParticles(env.particleType, 50, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      for (const p of particlesRef.current) {
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        switch (env.particleType) {
          case 'fireflies': {
            p.x += Math.sin(time * 1.5 + p.phase) * 0.2;
            p.y += Math.cos(time + p.phase) * 0.15;
            const glow = 0.2 + Math.sin(time * 2 + p.phase) * 0.5 + 0.3;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(180, 220, 100, 0.4)`;
            ctx.fillStyle = `rgba(180, 220, 100, ${glow * p.opacity * 0.7})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'snow': {
            p.x += Math.sin(time * 0.8 + p.phase) * 0.2;
            ctx.fillStyle = `rgba(230, 235, 245, ${p.opacity * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'rain': {
            ctx.strokeStyle = `rgba(160, 180, 220, ${p.opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.vx, p.y + p.vy * 1.5);
            ctx.stroke();
            break;
          }
          case 'stars': {
            const twinkle = 0.3 + Math.sin(time * 1.5 + p.phase) * 0.5 + 0.2;
            ctx.fillStyle = `rgba(220, 225, 240, ${twinkle * p.opacity * 0.6})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'fog': {
            const fogOp = p.opacity * (0.7 + Math.sin(time * 0.3 + p.phase) * 0.3);
            ctx.fillStyle = `rgba(200, 210, 220, ${fogOp})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'leaves': {
            p.x += Math.sin(time * 0.5 + p.phase) * 0.3;
            p.rotation += 0.5;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = `rgba(160, 120, 60, ${p.opacity})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;
          }
          case 'embers': {
            p.x += Math.sin(time * 2 + p.phase) * 0.15;
            const emberOp = p.opacity * Math.max(0, 1 - (p.y < 0 ? 1 : 0));
            ctx.shadowBlur = 4;
            ctx.shadowColor = `rgba(220, 120, 40, 0.4)`;
            ctx.fillStyle = `rgba(220, 140, 40, ${emberOp * 0.7})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          default: {
            ctx.fillStyle = `rgba(200, 200, 210, ${p.opacity * 0.2})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.shadowBlur = 0;

        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;
        if (p.y > h + 20) p.y = -20;
        if (p.y < -20) p.y = h + 20;
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
