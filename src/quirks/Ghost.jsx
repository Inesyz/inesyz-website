import { useEffect, useRef, useState } from 'react'
import { addSecret } from './memory.js'
import { pickMessage, isNightHours, CAUGHT_FIRST } from './messages.js'
import { play } from './sounds.js'

// Šmėkliukė-kompanionė. Būsenos:
//   hidden  — nematoma (numatytoji)
//   running — prabėga ekrano apačia (galima pagauti paspaudžiant)
//   whisper — pasirodo kamputyje su šnabždesiu (idle / naktis)
//   peeking — žvilgteli iš už apatinio krašto (scroll žemiau apačios)
//   caught  — pagauta / pakviesta per 'ghost-say' eventą, rodo burbulą
const RUN_MIN = 45_000
const RUN_MAX = 120_000
const RUN_TIME = 8_600
const IDLE_MS = 90_000
const PEEK_COOLDOWN = 30_000

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Ghost() {
  const [mode, setMode] = useState('hidden')
  const [text, setText] = useState('')
  const [left, setLeft] = useState(null)
  const modeRef = useRef(mode)
  modeRef.current = mode
  const hideTimer = useRef(null)
  const lastPeek = useRef(0)

  function show(newMode, msg, ms) {
    clearTimeout(hideTimer.current)
    setText(msg || '')
    setMode(newMode)
    if (ms) {
      hideTimer.current = setTimeout(() => {
        setLeft(null)
        setMode('hidden')
      }, ms)
    }
  }

  // Atsitiktiniai prabėgimai (naktį — dvigubai dažniau)
  useEffect(() => {
    if (mode !== 'hidden') return
    const base = RUN_MIN + Math.random() * (RUN_MAX - RUN_MIN)
    const wait = isNightHours() ? base / 2 : base
    const t = setTimeout(() => {
      if (reduced()) show('whisper', pickMessage('idle'), 6000)
      else show('running', '', RUN_TIME)
    }, wait)
    return () => clearTimeout(t)
  }, [mode])

  // Idle šnabždesys po 90 s be jokios veiklos
  useEffect(() => {
    let idleTimer = null
    function resetIdle() {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (modeRef.current === 'hidden') show('whisper', pickMessage('idle'), 7000)
      }, IDLE_MS)
    }
    const evs = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    evs.forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }))
    resetIdle()
    return () => {
      clearTimeout(idleTimer)
      evs.forEach((ev) => window.removeEventListener(ev, resetIdle))
    }
  }, [])

  // Žvilgtelėjimas paslinkus žemiau puslapio apačios
  useEffect(() => {
    function tryPeek() {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (!atBottom) return
      const now = performance.now()
      if (now - lastPeek.current < PEEK_COOLDOWN) return
      if (modeRef.current !== 'hidden') return
      lastPeek.current = now
      play('sparkle')
      show('peeking', '', 2600)
    }
    function onWheel(e) {
      if (e.deltaY > 0) tryPeek()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', tryPeek, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', tryPeek)
    }
  }, [])

  // Kiti quirk'ai gali paprašyti šmėkliukės ką nors pasakyti
  useEffect(() => {
    function onSay(e) {
      setLeft(null)
      show('caught', e.detail?.text || '...', 5600)
    }
    window.addEventListener('ghost-say', onSay)
    return () => window.removeEventListener('ghost-say', onSay)
  }, [])

  // Naktį šmėkliukė pati pasisveikina
  useEffect(() => {
    if (!isNightHours()) return
    const t = setTimeout(() => {
      if (modeRef.current === 'hidden') show('whisper', pickMessage('night'), 8000)
    }, 12_000)
    return () => clearTimeout(t)
  }, [])

  function onCatch(e) {
    if (mode === 'caught') return
    const rect = e.currentTarget.getBoundingClientRect()
    setLeft(Math.min(Math.max(rect.left, 10), window.innerWidth - 200))
    play('blyp')
    const first = addSecret('ghost-caught')
    show('caught', first ? CAUGHT_FIRST : pickMessage('caught'), 5600)
  }

  if (mode === 'hidden') return null

  return (
    <button
      type="button"
      className={`ghost ghost-${mode}`}
      style={left != null ? { left: `${left}px` } : undefined}
      onClick={onCatch}
      aria-label="Šmėkliukė"
    >
      {text && <span className="ghost-bubble">{text}</span>}
      <svg viewBox="0 0 32 32" width="46" height="46" aria-hidden="true">
        <path
          d="M4 30 V14 a12 12 0 0 1 24 0 V30 l-4-3 -4 3 -4-3 -4 3 -4-3 Z"
          fill="#FFFDF7"
          stroke="var(--line)"
          strokeWidth="2"
        />
        <circle cx="12" cy="15" r="1.8" fill="var(--line)" />
        <circle cx="20" cy="15" r="1.8" fill="var(--line)" />
        <path
          d="M13 20 q3 2.4 6 0"
          fill="none"
          stroke="var(--line)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="9.4" cy="18" r="1.6" fill="var(--skr-petal)" />
        <circle cx="22.6" cy="18" r="1.6" fill="var(--skr-petal)" />
      </svg>
    </button>
  )
}
