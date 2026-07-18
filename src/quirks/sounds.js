import { getMemory, updateMemory } from './memory.js'

// Garsiukai sintezuojami Web Audio API — jokių mp3 failų.
// AudioContext kuriamas tik po pirmos naudotojo sąveikos (naršyklių reikalavimas).
let ctx = null

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function isMuted() {
  return getMemory().muted
}

export function setMuted(m) {
  updateMemory({ muted: m })
}

// Vienas tonas su garsumo gaubte, kad nespragsėtų.
function tone(freq, dur, type = 'sine', vol = 0.1, when = 0) {
  const c = ensureCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t = c.currentTime + when
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

const PRESETS = {
  pop: () => tone(660, 0.09, 'triangle', 0.08),
  blyp: () => {
    tone(440, 0.07, 'square', 0.05)
    tone(660, 0.07, 'square', 0.05, 0.07)
  },
  sparkle: () => {
    tone(1320, 0.12, 'sine', 0.06)
    tone(1760, 0.15, 'sine', 0.04, 0.06)
  },
  secret: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.08, i * 0.09))
  },
  alarm: () => {
    tone(196, 0.3, 'sawtooth', 0.07)
    tone(185, 0.3, 'sawtooth', 0.07, 0.3)
  },
}

export function play(name) {
  if (isMuted()) return
  PRESETS[name]?.()
}
