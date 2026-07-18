import { useEffect, useState } from 'react'
import { addSecret, getMemory, SECRET_IDS } from './memory.js'
import { play } from './sounds.js'

// ↑↑↓↓←→←→BA — ekranas „sugenda", tada atsiveria slaptas kambarys.
// Telefonams: 7 paspaudimai ant „またね" footeryje daro tą patį.
const SEQ = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
  'b', 'a',
]

// Užuominos dar nerastoms paslaptims — rodomos slaptame kambaryje.
const HINTS = {
  'sakura-burst': 'Logo mėgsta dėmesį. Daug dėmesio. Iš eilės.',
  'ghost-caught': 'Kažkas kartais prabėga pačia apačia. Pabandyk suspėti.',
  'sakura-word': 'Parašyk gėlės vardą. Tiesiog... parašyk. Bet kur.',
  'inesyz-word': 'O kieno čia svetainė? Jos vardas irgi burtažodis.',
  'dont-press': 'Footeryje yra mygtukas. Jis tavimi netiki.',
}

export default function KonamiSecret() {
  const [phase, setPhase] = useState('off') // off | glitch | open

  useEffect(() => {
    if (phase !== 'off') return

    function trigger() {
      addSecret('konami')
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        play('secret')
        setPhase('open')
        return
      }
      play('alarm')
      setPhase('glitch')
      setTimeout(() => {
        play('secret')
        setPhase('open')
      }, 1500)
    }

    let i = 0
    function onKey(e) {
      const k = e.key.toLowerCase()
      i = k === SEQ[i] ? i + 1 : k === SEQ[0] ? 1 : 0
      if (i === SEQ.length) {
        i = 0
        trigger()
      }
    }

    let taps = 0
    let last = 0
    function onClick(e) {
      if (!e.target.closest('footer .jp')) return
      const now = performance.now()
      taps = now - last <= 2500 ? taps + 1 : 1
      last = now
      if (taps >= 7) {
        taps = 0
        trigger()
      }
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'open') return
    function onEsc(e) {
      if (e.key === 'Escape') setPhase('off')
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [phase])

  if (phase === 'off') return null
  if (phase === 'glitch') return <div className="glitch-overlay" aria-hidden="true" />

  const found = getMemory().foundSecrets
  const missing = SECRET_IDS.filter((id) => !found.includes(id) && HINTS[id])

  return (
    <div className="secret-room" role="dialog" aria-label="Slaptas kambarys">
      <div className="secret-inner">
        <svg viewBox="0 0 32 32" width="90" height="90" aria-hidden="true">
          <path
            d="M4 30 V14 a12 12 0 0 1 24 0 V30 l-4-3 -4 3 -4-3 -4 3 -4-3 Z"
            fill="#FFFDF7"
            stroke="var(--line)"
            strokeWidth="2"
          />
          <circle cx="12" cy="15" r="1.8" fill="var(--line)" />
          <circle cx="20" cy="15" r="1.8" fill="var(--line)" />
          <path d="M13 20 q3 2.4 6 0" fill="none" stroke="var(--line)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="9.4" cy="18" r="1.6" fill="var(--skr-petal)" />
          <circle cx="22.6" cy="18" r="1.6" fill="var(--skr-petal)" />
        </svg>
        <h2 className="display">Slaptas kambarys</h2>
        <p className="jp secret-jp">ひみつ</p>
        <p>
          Radai mano namus. Čia tylu, šilta ir niekada nesibaigia žiedlapiai.<br />
          Ačiū, kad taip atidžiai tyrinėji. (◕‿◕)
        </p>
        <p className="mono secret-count">Rasta paslapčių: {found.length} / {SECRET_IDS.length}</p>
        {missing.length > 0 && (
          <>
            <p className="secret-hints-title">Užuominos dar nerastoms:</p>
            <ul className="secret-hints">
              {missing.map((id) => (
                <li key={id}>{HINTS[id]}</li>
              ))}
            </ul>
          </>
        )}
        <button className="theme-btn" onClick={() => setPhase('off')}>Grįžti ↩</button>
      </div>
    </div>
  )
}
