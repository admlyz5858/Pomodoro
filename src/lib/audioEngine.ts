import { Howl, Howler } from 'howler'
import { AUDIO_TRACKS } from '../data/media'
import type { TimerMode } from '../types'

export class AudioEngine {
  private activeHowl: Howl | null = null

  private context: AudioContext | null = null

  private gainNode: GainNode | null = null

  constructor() {
    Howler.autoUnlock = true
  }

  private ensureContext(): void {
    if (!this.context) {
      this.context = new AudioContext()
      this.gainNode = this.context.createGain()
      this.gainNode.gain.value = 0.15
      this.gainNode.connect(this.context.destination)
    }
  }

  async playTrack(trackId: string, mode: TimerMode): Promise<void> {
    const track = AUDIO_TRACKS.find((item) => item.id === trackId && item.mode === mode)

    if (!track) {
      return
    }

    const incoming = new Howl({
      src: [track.src],
      html5: true,
      loop: true,
      volume: mode === 'focus' ? 0 : 0,
      onloaderror: () => {
        console.warn(`Audio track failed: ${track.id}`)
      },
    })

    incoming.play()

    if (this.activeHowl) {
      const previous = this.activeHowl
      previous.fade(previous.volume(), 0, 1400)
      setTimeout(() => previous.stop(), 1500)
    }

    this.activeHowl = incoming
    incoming.fade(0, mode === 'focus' ? 0.26 : 0.32, 1400)
  }

  setMasterVolume(volume: number): void {
    Howler.volume(Math.min(1, Math.max(0, volume)))
  }

  playTick(intensity = 1): void {
    this.ensureContext()

    if (!this.context || !this.gainNode) {
      return
    }

    const now = this.context.currentTime
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.value = 720 + intensity * 35
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.06 + intensity * 0.01, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)

    oscillator.connect(gain)
    gain.connect(this.gainNode)
    oscillator.start(now)
    oscillator.stop(now + 0.14)
  }

  playBell(): void {
    this.ensureContext()

    if (!this.context || !this.gainNode) {
      return
    }

    const now = this.context.currentTime
    ;[660, 880].forEach((frequency, index) => {
      const osc = this.context!.createOscillator()
      const gain = this.context!.createGain()
      osc.type = 'sine'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03 + index * 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4)
      osc.connect(gain)
      gain.connect(this.gainNode!)
      osc.start(now)
      osc.stop(now + 1.5)
    })
  }

  stop(): void {
    if (this.activeHowl) {
      this.activeHowl.stop()
      this.activeHowl = null
    }
  }
}
