import { useEffect } from 'react'
import { play } from './sounds.js'

// Švelnus „pop" ant visų mygtukų ir nuorodų — per vieną bendrą listener'į.
export default function useClickSounds() {
  useEffect(() => {
    function onClick(e) {
      if (e.target.closest('button, a')) play('pop')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
