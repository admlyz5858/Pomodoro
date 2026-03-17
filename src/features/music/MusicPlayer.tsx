import { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard.tsx';

interface LofiStream {
  id: string;
  name: string;
  emoji: string;
  youtubeId: string;
}

const LOFI_STREAMS: LofiStream[] = [
  { id: 'chill', name: 'Lofi Hip Hop', emoji: '🎵', youtubeId: 'jfKfPfyJRdk' },
  { id: 'jazz', name: 'Jazz Lofi', emoji: '🎷', youtubeId: 'HuFYqnbVbzY' },
  { id: 'piano', name: 'Piano Ambient', emoji: '🎹', youtubeId: '4xDzrJKXOOY' },
  { id: 'synthwave', name: 'Synthwave', emoji: '🌆', youtubeId: '4xDzrJKXOOY' },
  { id: 'nature', name: 'Nature Ambient', emoji: '🌿', youtubeId: 'eKFTSSKCzWA' },
];

export function MusicPlayer() {
  const [activeStream, setActiveStream] = useState<LofiStream | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto max-h-[70vh]">
      <p className="text-xs text-text-muted">Select a lo-fi stream to play while focusing</p>

      <div className="flex flex-col gap-2">
        {LOFI_STREAMS.map((stream) => (
          <GlassCard
            key={stream.id}
            hover
            onClick={() => {
              setActiveStream(stream.id === activeStream?.id ? null : stream);
              setShowPlayer(stream.id !== activeStream?.id);
            }}
            className={`p-3 flex items-center gap-3 ${
              activeStream?.id === stream.id ? 'ring-1 ring-accent/40' : ''
            }`}
          >
            <span className="text-xl">{stream.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{stream.name}</p>
              <p className="text-[10px] text-text-muted">YouTube Live Stream</p>
            </div>
            {activeStream?.id === stream.id && (
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-accent rounded-full animate-pulse"
                    style={{
                      height: `${8 + Math.random() * 8}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {showPlayer && activeStream && (
        <GlassCard className="p-3 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-text-secondary">
              {activeStream.emoji} Now Playing: {activeStream.name}
            </p>
            <button
              onClick={() => { setActiveStream(null); setShowPlayer(false); }}
              className="text-text-muted hover:text-text-primary text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeStream.youtubeId}?autoplay=1&loop=1`}
              title={activeStream.name}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <p className="text-[9px] text-text-muted mt-2">Tip: Lower the timer ambient sound volume when using music</p>
        </GlassCard>
      )}

      <GlassCard className="p-3">
        <h4 className="text-xs text-text-secondary mb-2">Spotify Playlists</h4>
        <div className="flex flex-col gap-2">
          {[
            { name: 'Lofi Beats', url: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
            { name: 'Deep Focus', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
            { name: 'Peaceful Piano', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
          ].map((pl) => (
            <a
              key={pl.name}
              href={pl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:text-accent-glow transition-colors"
            >
              🎧 {pl.name} →
            </a>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
