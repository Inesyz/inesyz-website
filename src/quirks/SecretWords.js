import { useEffect } from 'react'
import { addSecret } from './memory.js'
import { play } from './sounds.js'

// Klaviatūra bet kur puslapyje surinkti burtažodžiai.
function ghostSay(text) {
  window.dispatchEvent(new CustomEvent('ghost-say', { detail: { text } }))
}

function onSakura() {
  addSecret('sakura-word')
  play('secret')
  document.body.classList.add('golden-petals')
  setTimeout(() => document.body.classList.remove('golden-petals'), 30_000)
  ghostSay('Auksiniai žiedlapiai!.. Tu žinai slaptus žodžius. Įdomu, iš kur. (◕‿◕)')
}

function onInesyz() {
  addSecret('inesyz-word')
  play('secret')
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const w = document.createElement('div')
    w.className = 'rainbow-wave'
    document.body.appendChild(w)
    setTimeout(() => w.remove(), 2300)
  }
  ghostSay('Tu ištarei šeimininkės vardą! Ji čia viską sukūrė. Šaunuolė, ar ne?')
}

export default function useSecretWords() {
  useEffect(() => {
    let buf = ''
    function onKey(e) {
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return
      buf = (buf + e.key.toLowerCase()).slice(-12)
      if (buf.endsWith('sakura')) {
        buf = ''
        onSakura()
      } else if (buf.endsWith('inesyz')) {
        buf = ''
        onInesyz()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
