import { useEffect } from 'react'

// Bet kur spragtelėjus pabyra žvaigždutės ✦ (kaip MouseTrail, tik ant click).
export default function ClickSparkles() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function onClick(e) {
      if (document.querySelectorAll('.sparkle').length > 40) return
      const n = 5 + Math.floor(Math.random() * 4)
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span')
        s.className = 'sparkle'
        s.textContent = '✦'
        s.style.left = `${e.clientX}px`
        s.style.top = `${e.clientY}px`
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.8
        const dist = 24 + Math.random() * 26
        s.style.setProperty('--dx', `${Math.round(Math.cos(angle) * dist)}px`)
        s.style.setProperty('--dy', `${Math.round(Math.sin(angle) * dist)}px`)
        s.style.fontSize = `${8 + Math.random() * 8}px`
        document.body.appendChild(s)
        setTimeout(() => s.remove(), 750)
      }
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      document.querySelectorAll('.sparkle').forEach((el) => el.remove())
    }
  }, [])

  return null
}
