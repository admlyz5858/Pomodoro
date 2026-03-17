import { formatClock } from './utils'

interface ExportOptions {
  durationSeconds: number
  title: string
  mode: 'focus' | 'break'
}

export const exportTimerVideo = async ({ durationSeconds, title, mode }: ExportOptions): Promise<void> => {
  const canvas = document.createElement('canvas')
  canvas.width = 3840
  canvas.height = 2160
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Unable to create rendering context for export.')
  }

  const stream = canvas.captureStream(30)

  const audioContext = new AudioContext()
  const destination = audioContext.createMediaStreamDestination()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = mode === 'focus' ? 192 : 240
  gain.gain.value = 0.008
  oscillator.connect(gain)
  gain.connect(destination)
  oscillator.start()

  destination.stream.getAudioTracks().forEach((track) => stream.addTrack(track))

  const chunks: BlobPart[] = []
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9,opus',
    videoBitsPerSecond: 18_000_000,
  })

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data)
    }
  }

  const stopPromise = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve()
  })

  recorder.start(1000)

  const startedAt = performance.now()
  const frame = () => {
    const elapsed = (performance.now() - startedAt) / 1000
    const remaining = Math.max(0, Math.ceil(durationSeconds - elapsed))

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    if (mode === 'focus') {
      gradient.addColorStop(0, '#0a2b2b')
      gradient.addColorStop(1, '#113f56')
    } else {
      gradient.addColorStop(0, '#3b2f6b')
      gradient.addColorStop(1, '#6a4f7d')
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const pulse = Math.sin(elapsed * 0.8) * 0.08 + 0.92
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.scale(pulse, pulse)
    ctx.beginPath()
    ctx.arc(0, 0, 420, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fill()
    ctx.restore()

    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 220px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(formatClock(remaining), canvas.width / 2, canvas.height / 2 + 80)

    ctx.font = '600 84px Inter, sans-serif'
    ctx.fillStyle = 'rgba(248, 250, 252, 0.8)'
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 180)

    ctx.font = '500 56px Inter, sans-serif'
    ctx.fillStyle = 'rgba(248, 250, 252, 0.65)'
    ctx.fillText('FOCUS UNIVERSE • 4K EXPORT', canvas.width / 2, canvas.height - 120)

    if (remaining > 0) {
      requestAnimationFrame(frame)
      return
    }

    recorder.stop()
  }

  requestAnimationFrame(frame)
  await stopPromise

  oscillator.stop()
  audioContext.close()

  const blob = new Blob(chunks, { type: 'video/webm' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `focus-universe-${Date.now()}.webm`
  link.click()

  URL.revokeObjectURL(url)
}
