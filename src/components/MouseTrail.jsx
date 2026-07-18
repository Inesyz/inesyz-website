import { useEffect } from 'react'

// Sakuros žiedlapių uodegėlė paskui pelę: judinant pelę kas ~45 ms sukuriamas
// mažas žiedlapis (.trail-petal, žr. styles.css), kuris nukrenta ir išnyksta.
export default function MouseTrail() {
  useEffect(() => {
    // Be animacijų, jei naudotojas nustatęs „sumažinti judesį"
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Telefonuose ir planšetėse pelės nėra — uodegėlės ten nereikia
    if (!window.matchMedia('(pointer: fine)').matches) return

    const MAX_PETALS = 24
    let lastTime = 0

    function onMove(e) {
      const now = performance.now()
      if (now - lastTime < 45) return
      lastTime = now
      if (document.querySelectorAll('.trail-petal').length >= MAX_PETALS) return

      const petal = document.createElement('span')
      petal.className = 'trail-petal'
      petal.style.left = `${e.clientX}px`
      petal.style.top = `${e.clientY}px`
      petal.style.setProperty('--dx', `${Math.round(Math.random() * 60 - 30)}px`)
      petal.style.setProperty('--rot', `${Math.round(Math.random() * 360)}deg`)
      petal.style.setProperty('--s', (0.5 + Math.random() * 0.6).toFixed(2))
      petal.addEventListener('animationend', () => petal.remove())
      document.body.appendChild(petal)
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.querySelectorAll('.trail-petal').forEach((el) => el.remove())
    }
  }, [])

  return null
}
