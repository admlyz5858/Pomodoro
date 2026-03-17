import { useBackground } from '../../hooks/use-background.ts';

export function AnimatedBackground() {
  const { currentImage, nextImage, transitioning, mouseOffset, environment } =
    useBackground();

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* Current image */}
      <div
        className="absolute inset-0 ken-burns bg-cover bg-center transition-opacity duration-[3000ms]"
        style={{
          backgroundImage: `url(${currentImage})`,
          opacity: transitioning ? 0 : 1,
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) scale(1.1)`,
          transition: 'opacity 3s ease-in-out, transform 0.3s ease-out',
        }}
      />

      {/* Next image (crossfade) */}
      <div
        className="absolute inset-0 ken-burns bg-cover bg-center transition-opacity duration-[3000ms]"
        style={{
          backgroundImage: `url(${nextImage})`,
          opacity: transitioning ? 1 : 0,
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) scale(1.1)`,
          transition: 'opacity 3s ease-in-out, transform 0.3s ease-out',
          animationDelay: '-15s',
        }}
      />

      {/* Depth overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: environment.overlayColor }}
      />

      {/* Fog layer */}
      <div
        className="absolute inset-0 animate-fog opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(52,211,153,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,18,0.7) 100%)',
        }}
      />

      {/* Bottom gradient for readability */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,18,0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
