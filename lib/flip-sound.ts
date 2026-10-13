import { useSyncExternalStore } from 'react'

// A short paper "swish" synthesised with the Web Audio API, so no sound file is shipped.
let context: AudioContext | undefined

export function playFlipSound() {
  try {
    context ??= new AudioContext()
    const length = Math.round(context.sampleRate * 0.18)
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2
    const source = context.createBufferSource()
    source.buffer = buffer
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1800
    const gain = context.createGain()
    gain.gain.value = 0.2
    source.connect(filter).connect(gain).connect(context.destination)
    source.start()
  } catch {
    // Audio is a nicety; stay silent if the browser refuses.
  }
}

// The visitor's choice (off by default) shared by the flip pad and every flipbook.
const SOUND_KEY = 'elara:flip-sound'
const listeners = new Set<() => void>()
let soundOn: boolean | null = null
const readSound = () => {
  if (soundOn === null) {
    try {
      soundOn = localStorage.getItem(SOUND_KEY) === 'on'
    } catch {
      soundOn = false
    }
  }
  return soundOn
}
export function setFlipSound(on: boolean) {
  soundOn = on
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {}
  listeners.forEach((l) => l())
  if (on) playFlipSound()
}
export const useFlipSound = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    readSound,
    () => false,
  )
