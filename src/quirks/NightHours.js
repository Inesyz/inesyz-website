import { useEffect } from 'react'
import { isNightHours } from './messages.js'

// 02:00–03:59 svetainė tampa truputį kitokia (body.night-hours + CSS).
export default function useNightHours() {
  useEffect(() => {
    function apply() {
      document.body.classList.toggle('night-hours', isNightHours())
    }
    apply()
    const t = setInterval(apply, 60_000)
    return () => {
      clearInterval(t)
      document.body.classList.remove('night-hours')
    }
  }, [])
}
