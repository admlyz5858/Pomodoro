import { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard.tsx';

interface MusicStream {
  id: string;
  name: string;
  emoji: string;
  category: string;
  youtubeId: string;
}

const MUSIC_STREAMS: MusicStream[] = [
  // Lo-fi & Chill
  { id: 'lofi-hiphop', name: 'Lofi Hip Hop Radio', emoji: '🎵', category: 'Lo-fi', youtubeId: 'jfKfPfyJRdk' },
  { id: 'lofi-girl-sleep', name: 'Lofi Chill Sleep', emoji: '😴', category: 'Lo-fi', youtubeId: 'rUxyKA_-grg' },
  { id: 'chillhop', name: 'Chillhop Radio', emoji: '☕', category: 'Lo-fi', youtubeId: '5yx6BWlEVcY' },

  // Jazz
  { id: 'jazz-cafe', name: 'Coffee Shop Jazz', emoji: '☕', category: 'Jazz', youtubeId: 'HuFYqnbVbzY' },
  { id: 'jazz-rain', name: 'Rainy Jazz', emoji: '🌧️', category: 'Jazz', youtubeId: 'DSGyEsJ17cI' },
  { id: 'jazz-night', name: 'Late Night Jazz', emoji: '🌙', category: 'Jazz', youtubeId: 'neV3EPgvZ3g' },

  // Piano & Classical
  { id: 'piano-study', name: 'Study Piano', emoji: '🎹', category: 'Piano', youtubeId: '4xDzrJKXOOY' },
  { id: 'piano-rain', name: 'Piano in the Rain', emoji: '🌧️', category: 'Piano', youtubeId: 'wAPCSnAhhC8' },
  { id: 'classical-focus', name: 'Classical Focus', emoji: '🎻', category: 'Piano', youtubeId: 'jgpJVI3tDbY' },

  // Nature & Ambient
  { id: 'nature-sounds', name: 'Nature Sounds', emoji: '🌿', category: 'Nature', youtubeId: 'eKFTSSKCzWA' },
  { id: 'rain-window', name: 'Rain on Window', emoji: '🪟', category: 'Nature', youtubeId: 'mPZkdNFkNps' },
  { id: 'ocean-waves', name: 'Ocean Waves', emoji: '🌊', category: 'Nature', youtubeId: 'WHPEKLQID4U' },
  { id: 'thunderstorm', name: 'Thunderstorm', emoji: '⛈️', category: 'Nature', youtubeId: 'nDq6TstdEi8' },
  { id: 'fireplace', name: 'Crackling Fireplace', emoji: '🔥', category: 'Nature', youtubeId: 'L_LUpnjgPso' },
  { id: 'forest-birds', name: 'Forest Birdsong', emoji: '🐦', category: 'Nature', youtubeId: 'xNN7iTA57jM' },
  { id: 'creek', name: 'Gentle Creek', emoji: '💧', category: 'Nature', youtubeId: 'IvjMgVS6kng' },

  // Synthwave & Electronic
  { id: 'synthwave', name: 'Synthwave', emoji: '🌆', category: 'Electronic', youtubeId: '4xDzrJKXOOY' },
  { id: 'ambient-space', name: 'Space Ambient', emoji: '🌌', category: 'Electronic', youtubeId: 'S_MOd40zlYU' },
  { id: 'deep-focus-beats', name: 'Deep Focus Beats', emoji: '🎧', category: 'Electronic', youtubeId: 'lTRiuFIWV54' },

  // Meditation
  { id: 'tibetan-bowls', name: 'Tibetan Bowls', emoji: '🔔', category: 'Meditation', youtubeId: 'D8vFnJSjRIo' },
  { id: 'meditation-flute', name: 'Meditation Flute', emoji: '🎶', category: 'Meditation', youtubeId: '1ZYbU82GVz4' },
];

const SPOTIFY_PLAYLISTS = [
  { name: 'Lofi Beats', emoji: '🎵', url: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
  { name: 'Deep Focus', emoji: '🧠', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { name: 'Peaceful Piano', emoji: '🎹', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
  { name: 'Nature Sounds', emoji: '🌿', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8' },
  { name: 'Jazz in the Background', emoji: '🎷', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT' },
  { name: 'Classical Focus', emoji: '🎻', url: 'https://open.spotify.com/playlist/37i9dQZF1DWWEJlAGA9gs0' },
  { name: 'Brain Food', emoji: '🧠', url: 'https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7' },
  { name: 'Ambient Relaxation', emoji: '✨', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY' },
];

const categories = [...new Set(MUSIC_STREAMS.map((s) => s.category))];

export function MusicPlayer() {
  const [activeStream, setActiveStream] = useState<MusicStream | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? MUSIC_STREAMS.filter((s) => s.category === activeCategory)
    : MUSIC_STREAMS;

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto max-h-[70vh]">
      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer press-effect ${!activeCategory ? 'bg-accent/20 text-accent' : 'bg-surface-light text-text-muted hover:text-text-secondary'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer press-effect ${activeCategory === cat ? 'bg-accent/20 text-accent' : 'bg-surface-light text-text-muted hover:text-text-secondary'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Streams */}
      <div className="flex flex-col gap-1.5">
        {filtered.map((stream) => (
          <button
            key={stream.id}
            onClick={() => {
              const next = stream.id === activeStream?.id ? null : stream;
              setActiveStream(next);
              setShowPlayer(next !== null);
            }}
            className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer press-effect ${
              activeStream?.id === stream.id ? 'glass ring-1 ring-accent/20' : 'hover:bg-surface-light/50'
            }`}
          >
            <span className="text-base w-7 text-center">{stream.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{stream.name}</p>
              <p className="text-[10px] text-text-muted">{stream.category}</p>
            </div>
            {activeStream?.id === stream.id && (
              <div className="flex gap-[2px] items-end h-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-accent/60 rounded-full"
                    style={{
                      height: `${6 + Math.random() * 10}px`,
                      animation: `pulse-glow ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Player */}
      {showPlayer && activeStream && (
        <GlassCard className="p-3 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-text-secondary">
              {activeStream.emoji} {activeStream.name}
            </p>
            <button
              onClick={() => { setActiveStream(null); setShowPlayer(false); }}
              className="text-text-muted hover:text-text-primary text-xs cursor-pointer p-1"
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
        </GlassCard>
      )}

      {/* Spotify */}
      <GlassCard className="p-3">
        <h4 className="text-xs text-text-secondary mb-2">Spotify Playlists</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {SPOTIFY_PLAYLISTS.map((pl) => (
            <a
              key={pl.name}
              href={pl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-light/30 hover:bg-surface-light text-xs text-text-secondary hover:text-text-primary transition-all"
            >
              <span>{pl.emoji}</span>
              <span className="truncate">{pl.name}</span>
            </a>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
