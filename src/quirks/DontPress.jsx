import { useState } from 'react'
import { addSecret, getMemory, updateMemory } from './memory.js'
import { play } from './sounds.js'
import { spawnPetalRain } from './petalRain.js'

// Mygtukas, kurio prašoma nespausti. 6 įspėjimai, 7-as paspaudimas — finalas.
// Skaitiklis saugomas atmintyje, tad įspėjimai tęsiasi ir kitą dieną.
const WARNINGS = [
  'Na va. Parašyta gi buvo — NESPAUSK.',
  'Rimtai, nespausk. Čia jau antras kartas.',
  'Tu... vėl? Gerai. Apsimesiu, kad nemačiau.',
  'Šmėkliukė į tave žiūri. Nusivylusi.',
  'Gerai. PASKUTINIS įspėjimas.',
  'AŠ RIMTAI!! DAUGIAU NEBESPAUSK!!',
]

export default function DontPress() {
  const [count, setCount] = useState(() => getMemory().dontPressCount)
  const [gone, setGone] = useState(false)

  function onPress() {
    const next = count + 1
    if (next <= WARNINGS.length) {
      setCount(next)
      updateMemory({ dontPressCount: next })
      play('blyp')
      return
    }
    // 7-as paspaudimas — finalas
    addSecret('dont-press')
    updateMemory({ dontPressCount: 0 })
    play('alarm')
    document.body.classList.add('screen-shake')
    setTimeout(() => document.body.classList.remove('screen-shake'), 700)
    spawnPetalRain(90)
    window.dispatchEvent(
      new CustomEvent('ghost-say', {
        detail: {
          text: 'NA IR KAM DABAR TAIP?.. ...gerai, buvo gražu. Bet daugiau taip nedaryk. (◕︿◕)',
        },
      }),
    )
    setGone(true)
  }

  if (gone) {
    return <p className="dont-press-note">Mygtukas pavargo ir išėjo namo.</p>
  }

  return (
    <p className="dont-press-wrap">
      <button type="button" className="dont-press" onClick={onPress}>NESPAUSK</button>
      {count > 0 && (
        <span className="dont-press-msg">{WARNINGS[Math.min(count, WARNINGS.length) - 1]}</span>
      )}
    </p>
  )
}
