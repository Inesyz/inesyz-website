import { useEffect } from 'react'
import { play } from './sounds.js'

// Švelnus „pop" ant visų mygtukų ir nuorodų — per vieną bendrą listener'į.
export default function useClickSounds() {
  useEffect(() => {
    function onClick(e) {
      // Šmėkliukė ir NESPAUSK groja savus garsus — jiems „pop" nedubliuojam
      if (e.target.closest('.ghost, .dont-press')) return
      if (e.target.closest('button, a')) play('pop')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
