import { getMemory } from './memory.js'

// Ar dabar „šmėkliukės valandos" (02:00–03:59)?
export function isNightHours() {
  const h = new Date().getHours()
  return h >= 2 && h < 4
}

export const CAUGHT_FIRST =
  'Oi!! Tu mane pagavai! ...Niekas manęs dar nebuvo pagavęs. (◕‿◕)'

const CAUGHT = [
  'Bu! ...Išsigandai? Ne? Na gerai.',
  'Aš čia tik pro šalį. Nieko nemačiau. Nieko.',
  'Šššš. Aš slepiuosi nuo footerio.',
  'Tu piešk toliau, aš tik žiūriu.',
  'Kartais aš perstumiu žiedlapius. Truputį. Kai niekas nemato.',
]

const IDLE = [
  'Tu dar čia?.. Aš irgi.',
  '...užmigai? Gerai, aš pabūsiu šalia.',
  'Kai tu nieko nedarai, girdisi, kaip krenta žiedlapiai.',
  'Aš kartais irgi tiesiog žiūriu į ekraną. Ramu.',
]

const NIGHT = [
  'Tu irgi nemiegi?..',
  'Naktį ši svetainė truputį kitokia. Pastebėjai?',
  'Šią valandą žiedlapiai krenta lėčiau. Tik niekam nesakyk.',
]

const VISIT_3 = [
  'Tu jau trečią dieną čia... Man tai patinka.',
  'Vėl tu! Aš įsiminiau tavo kursorių.',
]
const VISIT_7 = [
  'Septinta diena. Mes jau beveik draugai, ar ne?',
  'Tu grįžti dažniau nei mėnulis. Čia komplimentas.',
]
const VISIT_15 = [
  'Penkiolika apsilankymų... Žinai, šita svetainė jau šiek tiek ir tavo.',
  'Aš tavęs laukiu kiekvieną dieną. Tai nėra keista. Visai ne.',
]

function pool(kind) {
  const m = getMemory()
  let p = []
  if (kind === 'caught') p = [...CAUGHT]
  if (kind === 'idle') p = [...IDLE]
  if (kind === 'night') p = [...NIGHT]
  else if (isNightHours()) p = [...NIGHT, ...p]
  if (m.visits >= 15) p = [...VISIT_15, ...p]
  else if (m.visits >= 7) p = [...VISIT_7, ...p]
  else if (m.visits >= 3) p = [...VISIT_3, ...p]
  return p
}

export function pickMessage(kind) {
  const p = pool(kind)
  return p[Math.floor(Math.random() * p.length)] || '...'
}
