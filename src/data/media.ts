import type { EnvironmentAsset, AudioTrack } from '../types'

export const ENVIRONMENTS: EnvironmentAsset[] = [
  {
    key: 'forest',
    label: 'Emerald Forest',
    query: 'forest mist sunlight',
    images: [
      'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg',
      'https://images.pexels.com/photos/418831/pexels-photo-418831.jpeg',
      'https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg',
    ],
    videos: ['https://videos.pexels.com/video-files/2038276/2038276-hd_1920_1080_30fps.mp4'],
    fallback: '/assets/fallback/forest.svg',
  },
  {
    key: 'rain',
    label: 'Rain Sanctuary',
    query: 'rain droplets window',
    images: [
      'https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg',
      'https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg',
      'https://images.pexels.com/photos/1530423/pexels-photo-1530423.jpeg',
    ],
    videos: ['https://videos.pexels.com/video-files/1755382/1755382-hd_1920_1080_25fps.mp4'],
    fallback: '/assets/fallback/rain.svg',
  },
  {
    key: 'ocean',
    label: 'Ocean Drift',
    query: 'ocean horizon sunset',
    images: [
      'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
    ],
    videos: ['https://videos.pexels.com/video-files/854190/854190-hd_1920_1080_25fps.mp4'],
    fallback: '/assets/fallback/ocean.svg',
  },
  {
    key: 'mountains',
    label: 'Alpine Echo',
    query: 'mountains clouds alpine',
    images: [
      'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg',
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
      'https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg',
    ],
    videos: ['https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_30fps.mp4'],
    fallback: '/assets/fallback/mountains.svg',
  },
  {
    key: 'night',
    label: 'Night Sky',
    query: 'night sky stars',
    images: [
      'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg',
      'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg',
      'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg',
    ],
    videos: ['https://videos.pexels.com/video-files/856993/856993-hd_1920_1080_30fps.mp4'],
    fallback: '/assets/fallback/night.svg',
  },
]

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'focus-rain',
    label: 'Rain Blanket',
    mode: 'focus',
    src: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_2f5ca5f4fb.mp3?filename=rain-ambient-9944.mp3',
    unlockLevel: 1,
  },
  {
    id: 'focus-forest',
    label: 'Forest Birds',
    mode: 'focus',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4f53ce16fb.mp3?filename=forest-ambience-110997.mp3',
    unlockLevel: 1,
  },
  {
    id: 'focus-lofi',
    label: 'Lofi Glow',
    mode: 'focus',
    src: 'https://cdn.pixabay.com/download/audio/2022/11/17/audio_6e252c47fb.mp3?filename=lofi-study-112191.mp3',
    unlockLevel: 2,
  },
  {
    id: 'break-piano',
    label: 'Soft Piano',
    mode: 'break',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_6ea392f53f.mp3?filename=calm-piano-ambient-110324.mp3',
    unlockLevel: 1,
  },
  {
    id: 'break-chill',
    label: 'Chill Wave',
    mode: 'break',
    src: 'https://cdn.pixabay.com/download/audio/2023/05/08/audio_dfc6f10895.mp3?filename=chill-ambient-145521.mp3',
    unlockLevel: 2,
  },
]

export const ENCOURAGEMENTS = [
  'One calm breath at a time.',
  'You are building your universe.',
  'Stay gentle, stay sharp.',
  'Focus is a superpower.',
  'Tiny wins compound into mastery.',
]
