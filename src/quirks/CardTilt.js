import { useEffect } from 'react'

// Anime kortelės (.card) švelniai pasisuka 3D pagal pelės padėtį.
// Tik pelei (pointer: fine) — telefone tai trukdytų slinkti puslapį.
export default function useCardTilt() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    function onMove(e) {
      const card = e.target.closest?.('.card')
      if (!card) return
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      card.style.transform =
        `perspective(700px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-3px)`
    }

    function onOut(e) {
      const card = e.target.closest?.('.card')
      if (card && !card.contains(e.relatedTarget)) card.style.transform = ''
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
      document.querySelectorAll('.card').forEach((c) => {
        c.style.transform = ''
      })
    }
  }, [])
}
