// Pilno ekrano žiedlapių lietus — naudoja SakuraBurst ir NESPAUSK finalas.
export function spawnPetalRain(count = 60) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i')
    p.className = 'burst-petal'
    p.style.left = `${Math.random() * 100}vw`
    p.style.animationDuration = `${2.2 + Math.random() * 2.2}s`
    p.style.animationDelay = `${Math.random() * 0.9}s`
    p.style.setProperty('--s', (0.6 + Math.random() * 0.9).toFixed(2))
    document.body.appendChild(p)
    // setTimeout, ne animationend — žr. Global Constraints apie reduced-motion
    setTimeout(() => p.remove(), 6000)
  }
}
