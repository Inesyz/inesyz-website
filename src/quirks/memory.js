// Šmėkliukės atmintis: viskas viename localStorage rakte.
// Jei localStorage neprieinamas (privatus režimas) — tyliai veikiam be atminties.
const KEY = 'inesyz-quirks'

export const SECRET_IDS = [
  'sakura-burst',
  'ghost-caught',
  'konami',
  'sakura-word',
  'inesyz-word',
  'dont-press',
]

const DEFAULTS = {
  visits: 0,
  lastVisit: null,
  muted: false,
  dontPressCount: 0,
  foundSecrets: [],
}

export function getMemory() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...DEFAULTS }
  }
}

export function updateMemory(patch) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...getMemory(), ...patch }))
  } catch {
    /* be atminties — nieko baisaus */
  }
}

export function addSecret(id) {
  const m = getMemory()
  if (m.foundSecrets.includes(id)) return false
  updateMemory({ foundSecrets: [...m.foundSecrets, id] })
  return true
}

// Apsilankymas skaičiuojamas ne dažniau nei kartą per dieną,
// todėl StrictMode dvigubas mount'as jo nepadvigubina.
export function countVisit() {
  const m = getMemory()
  const today = new Date().toISOString().slice(0, 10)
  if (m.lastVisit === today) return m.visits
  updateMemory({ visits: m.visits + 1, lastVisit: today })
  return m.visits + 1
}
