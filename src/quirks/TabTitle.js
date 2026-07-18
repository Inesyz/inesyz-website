import { useEffect } from 'react'

// Kai naudotojas perjungia kortelę — pavadinimas paliūdi; sugrįžus — apsidžiaugia.
const AWAY = '(◕︿◕) grįžk...'
const BACK = '✨ Yay, grįžai!'

export default function useTabTitle() {
  useEffect(() => {
    const original = document.title
    let timer = null

    function onVisibility() {
      clearTimeout(timer)
      if (document.hidden) {
        document.title = AWAY
      } else {
        document.title = BACK
        timer = setTimeout(() => {
          document.title = original
        }, 2000)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
      document.title = original
    }
  }, [])
}
