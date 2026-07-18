import { useEffect } from 'react'
import { countVisit } from './memory.js'
import { initConsoleArt } from './ConsoleArt.js'
import useTabTitle from './TabTitle.js'
import useClickSounds from './ClickSounds.js'
import useCardTilt from './CardTilt.js'
import useNightHours from './NightHours.js'
import useSecretWords from './SecretWords.js'
import ClickSparkles from './ClickSparkles.jsx'
import SakuraBurst from './SakuraBurst.jsx'
import Ghost from './Ghost.jsx'
import KonamiSecret from './KonamiSecret.jsx'

// Visų quirky dalykėlių agregatorius — vienintelis dalykas, kurį importuoja App.jsx.
// Vėlesni quirk'ai jungiami čia, kad pagrindinis kodas liktų švarus.
export default function Quirks() {
  useEffect(() => {
    countVisit()
    initConsoleArt()
  }, [])
  useTabTitle()
  useClickSounds()
  useCardTilt()
  useNightHours()
  useSecretWords()
  return (
    <>
      <ClickSparkles />
      <SakuraBurst />
      <Ghost />
      <KonamiSecret />
    </>
  )
}
