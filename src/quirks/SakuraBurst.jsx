import { useEffect } from 'react'
import { spawnPetalRain } from './petalRain.js'
import { play } from './sounds.js'
import { addSecret } from './memory.js'

// 5 paspaudimai ant „✦ Inesyz_0" logo per ≤3 s tarpus — žiedlapių lietus.
export default function SakuraBurst() {
  useEffect(() => {
    let count = 0
    let last = 0

    function onClick(e) {
      if (!e.target.closest('.brand')) return
      const now = performance.now()
      count = now - last <= 3000 ? count + 1 : 1
      last = now
      if (count >= 5) {
        count = 0
        addSecret('sakura-burst')
        play('secret')
        spawnPetalRain(60)
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
