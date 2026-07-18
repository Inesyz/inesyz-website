# Quirky dalykėlių įgyvendinimo planas

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Įgyvendinti visas 18 quirky funkcijų iš spec `docs/superpowers/specs/2026-07-18-quirky-features-design.md` — gyvumo detalės, interaktyvūs žaisliukai ir Undertale-style paslaptys su šmėkliuke-kompanione.

**Architecture:** Visi quirk'ai gyvena naujame `src/quirks/` kataloge. `App.jsx` prijungia vienintelį `<Quirks />` agregatorių; `Hero.jsx`, `Footer.jsx` ir `Topbar.jsx` gauna po mažą intarpą. Bendra atmintis — vienas localStorage raktas per `memory.js`; garsai — Web Audio sintezė per `sounds.js`; šmėkliukė (`Ghost.jsx`) — būsenų mašina, kitiems quirk'ams pasiekiama per `window` CustomEvent `ghost-say`.

**Tech Stack:** React 19, Vite 6, grynas CSS (`src/styles.css`), Web Audio API. **Jokių naujų npm priklausomybių.**

## Global Constraints

- Jokių naujų npm priklausomybių — tik React + CSS + naršyklės API.
- Projekte NĖRA testų infrastruktūros ir jos nediegiame (spec sprendimas, YAGNI). Kiekvienos užduoties verifikacija: `npm run build` be klaidų + nurodyti rankiniai/naršyklės patikrinimai. TDD žingsniai šiame plane pakeisti build+verifikacijos žingsniais.
- Visi naudotojui matomi tekstai — lietuviškai su taisyklingomis lietuviškomis raidėmis (ą, č, ę, ė, į, š, ų, ū, ž).
- Commit žinutės — lietuviškos, be `feat:` prefiksų (repo stilius, žr. `git log`). Kiekviena commit žinutė baigiasi šiomis dviem eilutėmis:
  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01LGqfHt9isV2SDUbuSVt1md
  ```
- `prefers-reduced-motion: reduce` privalo išjungti/sušvelninti visus judesio efektus. DĖMESIO: `styles.css` pabaigoje yra globalus `@media (prefers-reduced-motion: reduce){*{animation:none !important}}` — todėl DOM elementų šalinimas NIEKADA nesiremia vien `animationend` (jis gali neįvykti); visada yra `setTimeout` atsarga arba JS guard'as, kuris išvis nekuria elementų.
- React 19 StrictMode dvigubai paleidžia efektus dev režime — visi efektai turi būti idempotentiški (guard'ai, cleanup'ai).
- localStorage raktas vienas: `inesyz-quirks`. Visi skaitymai/rašymai tik per `memory.js`.
- z-index žemėlapis: 45 trail-petal (esamas), 50 yt-overlay (esamas), 60 sparkle/burst-petal, 70 ghost, 80 rainbow-wave, 90 glitch-overlay, 95 secret-room.
- Slaptų paslapčių ID sąrašas (fiksuotas, 6 vnt.): `sakura-burst`, `ghost-caught`, `konami`, `sakura-word`, `inesyz-word`, `dont-press`.

---

### Task 1: Pamatai — memory.js, Quirks.jsx, App integracija, ::selection

**Files:**
- Create: `src/quirks/memory.js`
- Create: `src/quirks/Quirks.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles.css` (failo pabaigoje)

**Interfaces:**
- Consumes: nieko (pirmoji užduotis)
- Produces:
  - `memory.js`: `getMemory(): {visits:number,lastVisit:string|null,muted:boolean,dontPressCount:number,foundSecrets:string[]}`, `updateMemory(patch: object): void`, `addSecret(id: string): boolean` (true jei nauja), `countVisit(): number`, `SECRET_IDS: string[]`
  - `Quirks.jsx`: default export `<Quirks />` — vėlesnės užduotys į jį jungs savo hook'us/komponentus

- [ ] **Step 1: Sukurti `src/quirks/memory.js`**

```js
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
```

- [ ] **Step 2: Sukurti `src/quirks/Quirks.jsx`**

```jsx
import { useEffect } from 'react'
import { countVisit } from './memory.js'

// Visų quirky dalykėlių agregatorius — vienintelis dalykas, kurį importuoja App.jsx.
// Vėlesni quirk'ai jungiami čia, kad pagrindinis kodas liktų švarus.
export default function Quirks() {
  useEffect(() => {
    countVisit()
  }, [])
  return null
}
```

- [ ] **Step 3: Modifikuoti `src/App.jsx`** — pridėti importą ir komponentą:

Po eilutės `import MouseTrail from './components/MouseTrail.jsx'` pridėti:
```jsx
import Quirks from './quirks/Quirks.jsx'
```
Po eilutės `<MouseTrail />` pridėti:
```jsx
      <Quirks />
```

- [ ] **Step 4: Papildyti `src/styles.css`** — failo pabaigoje pridėti:

```css
/* ==== QUIRKY DALYKĖLIAI ==== */

/* ---- rožinis teksto žymėjimas ---- */
::selection{background:var(--skr-petal);color:var(--ink)}
```

- [ ] **Step 5: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 6: Patikrinti naršyklėje** — `npm run dev`, atsidaryti http://localhost:5173, DevTools console: `JSON.parse(localStorage.getItem('inesyz-quirks'))` → objektas su `visits: 1`. Pažymėti tekstą pele → rožinis fonas.

- [ ] **Step 7: Commit**

```bash
git add src/quirks/memory.js src/quirks/Quirks.jsx src/App.jsx src/styles.css
git commit -m "Quirks pamatai: atmintis localStorage ir rožinis teksto žymėjimas"
```

---

### Task 2: Pasisveikinimas pagal paros laiką (Hero)

**Files:**
- Create: `src/quirks/Greeting.jsx`
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: nieko
- Produces: `Greeting.jsx` default export `<Greeting />` — atvaizduoja `<p className="eyebrow">` su pasisveikinimu

- [ ] **Step 1: Sukurti `src/quirks/Greeting.jsx`**

```jsx
// Pasisveikinimas pagal paros laiką — vietoj statinio „Sveiki atvykę".
const GREETINGS = [
  { from: 5, to: 11, jp: 'おはよう', lt: 'Labas rytas ☀️' },
  { from: 11, to: 17, jp: 'こんにちは', lt: 'Laba diena' },
  { from: 17, to: 22, jp: 'こんばんは', lt: 'Labas vakaras' },
  { from: 22, to: 24, jp: 'おやすみ', lt: 'Labanakt 🌙' },
  { from: 0, to: 5, jp: 'おやすみ', lt: 'Labanakt 🌙' },
]

export default function Greeting() {
  const h = new Date().getHours()
  const g = GREETINGS.find((x) => h >= x.from && h < x.to)
  return (
    <p className="eyebrow">
      <span className="jp">{g.jp}</span> · {g.lt}
    </p>
  )
}
```

- [ ] **Step 2: Modifikuoti `src/components/Hero.jsx`**

Pridėti importą pirmoje eilutėje:
```jsx
import Greeting from '../quirks/Greeting.jsx'
```
Pakeisti eilutę
```jsx
        <p className="eyebrow"><span className="jp">ようこそ</span> · Sveiki atvykę</p>
```
į
```jsx
        <Greeting />
```

- [ ] **Step 3: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 4: Patikrinti naršyklėje** — hero sekcijoje matomas pasisveikinimas pagal dabartinį laiką (pvz., 14 val. → „こんにちは · Laba diena“).

- [ ] **Step 5: Commit**

```bash
git add src/quirks/Greeting.jsx src/components/Hero.jsx
git commit -m "Pasisveikinimas hero sekcijoje pagal paros laiką"
```

---

### Task 3: Atsitiktinė anime citata footeryje

**Files:**
- Create: `src/data/quotes.js`
- Create: `src/quirks/RandomQuote.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: nieko
- Produces: `quotes.js` eksportuoja `quotes: {text:string, anime:string}[]`; `RandomQuote.jsx` default export `<RandomQuote />`

- [ ] **Step 1: Sukurti `src/data/quotes.js`**

```js
// Citatos footeriui — laisvi vertimai iš mėgstamų anime.
export const quotes = [
  { text: 'Šitas pasaulis... supuvęs.', anime: 'Death Note' },
  { text: 'Saldumynai smegenims būtini.', anime: 'Death Note' },
  { text: 'Geriau skaudėti pačiam, nei skaudinti kitus.', anime: 'Tokyo Ghoul' },
  { text: 'Neteisus ne pasaulis — neteisūs tie, kurie jame pasiduoda.', anime: 'Tokyo Ghoul' },
  { text: 'Nesijaudink — aš juk stipriausias.', anime: 'Jujutsu Kaisen' },
  { text: 'Viršvalandžiai — irgi savotiškas prakeiksmas.', anime: 'Jujutsu Kaisen' },
  { text: 'Egoizmas — geriausio puolėjo ginklas.', anime: 'Blue Lock' },
  { text: 'Suvalgyk savo baimę anksčiau, nei ji suvalgys tave.', anime: 'Blue Lock' },
  { text: 'Ateiviai ir vaiduokliai egzistuoja. Čia net ne klausimas.', anime: 'Dandadan' },
  { text: 'Net jei tu nebe tu — aš vis tiek noriu būti šalia.', anime: 'Hikaru ga Shinda Natsu' },
]
```

- [ ] **Step 2: Sukurti `src/quirks/RandomQuote.jsx`**

```jsx
import { useState } from 'react'
import { quotes } from '../data/quotes.js'

// Kaskart įkėlus puslapį — vis kita citata.
export default function RandomQuote() {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])
  return (
    <p className="footer-quote">
      „{quote.text}“ <span className="footer-quote-src">— {quote.anime}</span>
    </p>
  )
}
```

- [ ] **Step 3: Modifikuoti `src/components/Footer.jsx`** — visas failas tampa:

```jsx
import RandomQuote from '../quirks/RandomQuote.jsx'

export default function Footer() {
  return (
    <footer>
      <span className="jp">またね</span>
      <RandomQuote />
      Ačiū, kad užsukai! Puslapis nuolat pildomas — kaip ir mano anime sąrašas.<br />
      ✦ Inesyz_0 · 2026
    </footer>
  )
}
```

- [ ] **Step 4: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- footerio citata ---- */
.footer-quote{margin:0 0 14px;font-style:italic;color:var(--ink)}
.footer-quote-src{color:var(--ink-soft);font-style:normal;font-size:.85em}
```

- [ ] **Step 5: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 6: Patikrinti naršyklėje** — footeryje matoma citata; perkrovus puslapį kelis kartus, citata keičiasi.

- [ ] **Step 7: Commit**

```bash
git add src/data/quotes.js src/quirks/RandomQuote.jsx src/components/Footer.jsx src/styles.css
git commit -m "Atsitiktinė anime citata footeryje"
```

---

### Task 4: Tab pavadinimo pokštas

**Files:**
- Create: `src/quirks/TabTitle.js`
- Modify: `src/quirks/Quirks.jsx`

**Interfaces:**
- Consumes: nieko
- Produces: `TabTitle.js` default export `useTabTitle(): void` (React hook)

- [ ] **Step 1: Sukurti `src/quirks/TabTitle.js`**

```js
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
```

- [ ] **Step 2: Modifikuoti `src/quirks/Quirks.jsx`** — pridėti importą ir hook'o kvietimą:

```jsx
import useTabTitle from './TabTitle.js'
```
Funkcijos viduje, po `useEffect` bloko:
```jsx
  useTabTitle()
```

- [ ] **Step 3: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 4: Patikrinti naršyklėje** — perjungti į kitą kortelę → pavadinimas „(◕︿◕) grįžk...“; grįžti → „✨ Yay, grįžai!“, po 2 s — originalus.

- [ ] **Step 5: Commit**

```bash
git add src/quirks/TabTitle.js src/quirks/Quirks.jsx
git commit -m "Tab pavadinimo pokštas perjungus kortelę"
```

---

### Task 5: Console žinutė smalsuoliams

**Files:**
- Create: `src/quirks/ConsoleArt.js`
- Modify: `src/quirks/Quirks.jsx`

**Interfaces:**
- Consumes: nieko
- Produces: `ConsoleArt.js` eksportuoja `initConsoleArt(): void` (idempotentiška)

- [ ] **Step 1: Sukurti `src/quirks/ConsoleArt.js`**

```js
// ASCII šmėkliukė DevTools console — su užuomina apie Konami kodą.
let shown = false // StrictMode dvigubo mount'o apsauga

export function initConsoleArt() {
  if (shown) return
  shown = true
  console.log(
    `%c
   .-"""-.
  /  o o  \\
  \\   ‿   /    Oho, tu žiūri po kapotu!
   '~~~~~'     Smalsuoliams dovana: ↑ ↑ ↓ ↓ ← → ← → B A
               P.S. šmėkliukė mėgsta, kai ją pagauna.
`,
    'color:#D64D78;font-family:monospace;font-size:13px;line-height:1.35',
  )
}
```

- [ ] **Step 2: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import { initConsoleArt } from './ConsoleArt.js'
```
`useEffect` viduje, po `countVisit()`:
```jsx
    initConsoleArt()
```

- [ ] **Step 3: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 4: Patikrinti naršyklėje** — atidaryti DevTools console → matoma rožinė ASCII šmėkliukė su užuomina (tik vieną kartą, ne dvigubai).

- [ ] **Step 5: Commit**

```bash
git add src/quirks/ConsoleArt.js src/quirks/Quirks.jsx
git commit -m "ASCII šmėkliukė ir Konami užuomina console lange"
```

---

### Task 6: Blizgučiai paspaudus

**Files:**
- Create: `src/quirks/ClickSparkles.jsx`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: nieko
- Produces: `ClickSparkles.jsx` default export `<ClickSparkles />` (renderina null, veikia per document listener)

- [ ] **Step 1: Sukurti `src/quirks/ClickSparkles.jsx`**

```jsx
import { useEffect } from 'react'

// Bet kur spragtelėjus pabyra žvaigždutės ✦ (kaip MouseTrail, tik ant click).
export default function ClickSparkles() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function onClick(e) {
      if (document.querySelectorAll('.sparkle').length > 40) return
      const n = 5 + Math.floor(Math.random() * 4)
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span')
        s.className = 'sparkle'
        s.textContent = '✦'
        s.style.left = `${e.clientX}px`
        s.style.top = `${e.clientY}px`
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.8
        const dist = 24 + Math.random() * 26
        s.style.setProperty('--dx', `${Math.round(Math.cos(angle) * dist)}px`)
        s.style.setProperty('--dy', `${Math.round(Math.sin(angle) * dist)}px`)
        s.style.fontSize = `${8 + Math.random() * 8}px`
        document.body.appendChild(s)
        setTimeout(() => s.remove(), 750)
      }
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      document.querySelectorAll('.sparkle').forEach((el) => el.remove())
    }
  }, [])

  return null
}
```

- [ ] **Step 2: Modifikuoti `src/quirks/Quirks.jsx`** — importas + komponentas. Kadangi iki šiol `Quirks` grąžino `null`, dabar keičiame į fragmentą:

```jsx
import ClickSparkles from './ClickSparkles.jsx'
```
ir `return null` pakeisti į:
```jsx
  return (
    <>
      <ClickSparkles />
    </>
  )
```

- [ ] **Step 3: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- blizgučiai paspaudus (kuria ClickSparkles.jsx) ---- */
.sparkle{
  position:fixed;z-index:60;pointer-events:none;
  color:var(--accent);line-height:1;
  animation:sparkle-fly .7s ease-out forwards;
}
@keyframes sparkle-fly{
  0%{opacity:1;transform:translate(-50%,-50%) scale(.6) rotate(0deg)}
  100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.15) rotate(90deg)}
}
```

- [ ] **Step 4: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 5: Patikrinti naršyklėje** — paspaudus bet kur, pabyra 5–8 žvaigždutės ir per ~0.7 s išnyksta.

- [ ] **Step 6: Commit**

```bash
git add src/quirks/ClickSparkles.jsx src/quirks/Quirks.jsx src/styles.css
git commit -m "Žvaigždučių blizgučiai paspaudus bet kur puslapyje"
```

---

### Task 7: Garsiukai (Web Audio) + mute mygtukas

**Files:**
- Create: `src/quirks/sounds.js`
- Create: `src/quirks/ClickSounds.js`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `src/components/Topbar.jsx`

**Interfaces:**
- Consumes: `memory.js` → `getMemory()`, `updateMemory(patch)`
- Produces: `sounds.js` eksportuoja `play(name: 'pop'|'blyp'|'sparkle'|'secret'|'alarm'): void`, `isMuted(): boolean`, `setMuted(m: boolean): void`; `ClickSounds.js` default export `useClickSounds(): void`

- [ ] **Step 1: Sukurti `src/quirks/sounds.js`**

```js
import { getMemory, updateMemory } from './memory.js'

// Garsiukai sintezuojami Web Audio API — jokių mp3 failų.
// AudioContext kuriamas tik po pirmos naudotojo sąveikos (naršyklių reikalavimas).
let ctx = null

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function isMuted() {
  return getMemory().muted
}

export function setMuted(m) {
  updateMemory({ muted: m })
}

// Vienas tonas su garsumo gaubte, kad nespragsėtų.
function tone(freq, dur, type = 'sine', vol = 0.1, when = 0) {
  const c = ensureCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t = c.currentTime + when
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

const PRESETS = {
  pop: () => tone(660, 0.09, 'triangle', 0.08),
  blyp: () => {
    tone(440, 0.07, 'square', 0.05)
    tone(660, 0.07, 'square', 0.05, 0.07)
  },
  sparkle: () => {
    tone(1320, 0.12, 'sine', 0.06)
    tone(1760, 0.15, 'sine', 0.04, 0.06)
  },
  secret: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.08, i * 0.09))
  },
  alarm: () => {
    tone(196, 0.3, 'sawtooth', 0.07)
    tone(185, 0.3, 'sawtooth', 0.07, 0.3)
  },
}

export function play(name) {
  if (isMuted()) return
  PRESETS[name]?.()
}
```

- [ ] **Step 2: Sukurti `src/quirks/ClickSounds.js`**

```js
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
```

- [ ] **Step 3: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import useClickSounds from './ClickSounds.js'
```
po `useTabTitle()`:
```jsx
  useClickSounds()
```

- [ ] **Step 4: Modifikuoti `src/components/Topbar.jsx`** — visas failas tampa:

```jsx
import { useState } from 'react'
import { isMuted, setMuted } from '../quirks/sounds.js'

function toggleTheme() {
  const root = document.documentElement
  const current =
    root.dataset.theme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  root.dataset.theme = current === 'dark' ? 'light' : 'dark'
}

export default function Topbar() {
  const [muted, setMutedState] = useState(isMuted)

  function toggleSound() {
    setMuted(!muted)
    setMutedState(!muted)
  }

  return (
    <div className="topbar">
      <a className="brand" href="#virsus">✦ Inesyz<b>_0</b></a>
      <nav>
        <a href="#profilis">Profilis</a>
        <a href="#anime">Anime</a>
        <a href="#piesimas">Piešimas</a>
        <a href="#zaidimai">Žaidimai</a>
        <a href="#muzika">Muzika</a>
        <button
          className="theme-btn"
          onClick={toggleSound}
          title={muted ? 'Įjungti garsiukus' : 'Išjungti garsiukus'}
        >
          {muted ? '🔕' : '🔔'}
        </button>
        <button className="theme-btn" onClick={toggleTheme} title="Perjungti šviesią / tamsią temą">🌓</button>
      </nav>
    </div>
  )
}
```

- [ ] **Step 5: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 6: Patikrinti naršyklėje** — paspaudus bet kurį mygtuką girdisi „pop“; 🔔 → 🔕 nutildo; perkrovus puslapį mute būsena išlieka.

- [ ] **Step 7: Commit**

```bash
git add src/quirks/sounds.js src/quirks/ClickSounds.js src/quirks/Quirks.jsx src/components/Topbar.jsx
git commit -m "Web Audio garsiukai mygtukams ir mute mygtukas topbare"
```

---

### Task 8: Žiedlapių lietus + sakurų sprogimas ant logo

**Files:**
- Create: `src/quirks/petalRain.js`
- Create: `src/quirks/SakuraBurst.jsx`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: `sounds.js` → `play(name)`; `memory.js` → `addSecret(id)`
- Produces: `petalRain.js` eksportuoja `spawnPetalRain(count?: number): void` (naudos ir Task 14); `SakuraBurst.jsx` default export `<SakuraBurst />`

- [ ] **Step 1: Sukurti `src/quirks/petalRain.js`**

```js
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
```

- [ ] **Step 2: Sukurti `src/quirks/SakuraBurst.jsx`**

```jsx
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
```

- [ ] **Step 3: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import SakuraBurst from './SakuraBurst.jsx'
```
fragmento viduje po `<ClickSparkles />`:
```jsx
      <SakuraBurst />
```

- [ ] **Step 4: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- žiedlapių lietus (kuria petalRain.js) ---- */
.burst-petal{
  position:fixed;top:-6vh;z-index:60;pointer-events:none;
  width:11px;height:15px;
  background:var(--skr-petal);
  border:1.5px solid var(--line);
  border-radius:60% 40% 55% 45% / 55% 45% 60% 40%;
  animation:burst-fall linear forwards;
}
@keyframes burst-fall{
  0%{opacity:1;transform:translate3d(0,0,0) rotate(0deg) scale(var(--s))}
  100%{opacity:.7;transform:translate3d(-4vw,115vh,0) rotate(320deg) scale(var(--s))}
}
```

- [ ] **Step 5: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 6: Patikrinti naršyklėje** — greitai paspausti logo 5 kartus → žiedlapių lietus + fanfaros garsiukas; `foundSecrets` localStorage gauna `sakura-burst`.

- [ ] **Step 7: Commit**

```bash
git add src/quirks/petalRain.js src/quirks/SakuraBurst.jsx src/quirks/Quirks.jsx src/styles.css
git commit -m "Sakurų sprogimas paspaudus logo penkis kartus"
```

---

### Task 9: Anime kortelių 3D pakrypimas

**Files:**
- Create: `src/quirks/CardTilt.js`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `docs/superpowers/specs/2026-07-18-quirky-features-design.md` (patikslinimas)

**Interfaces:**
- Consumes: nieko
- Produces: `CardTilt.js` default export `useCardTilt(): void`

- [ ] **Step 1: Sukurti `src/quirks/CardTilt.js`**

```js
import { useEffect } from 'react'

// Anime kortelės (.card) švelniai pasisuka 3D pagal pelės padėtį.
// Tik pelei (pointer: fine) — telefone tai trukdytų slinkti puslapį.
export default function useCardTilt() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    function onMove(e) {
      const card = e.target.closest?.('.card')
      if (!card) return
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      card.style.transform =
        `perspective(700px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-3px)`
    }

    function onOut(e) {
      const card = e.target.closest?.('.card')
      if (card && !card.contains(e.relatedTarget)) card.style.transform = ''
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
      document.querySelectorAll('.card').forEach((c) => {
        c.style.transform = ''
      })
    }
  }, [])
}
```

- [ ] **Step 2: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import useCardTilt from './CardTilt.js'
```
po `useClickSounds()`:
```jsx
  useCardTilt()
```

- [ ] **Step 3: Patikslinti spec** — faile `docs/superpowers/specs/2026-07-18-quirky-features-design.md` pakeisti eilutę
```
- Telefonuose: tilt ir scroll-peek veikia per touch; sparkles veikia ant tap;
```
į
```
- Telefonuose: scroll-peek veikia ir be pelės; sparkles veikia ant tap; tilt —
  tik pelei (touch metu trukdytų slinkti puslapį);
```

- [ ] **Step 4: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 5: Patikrinti naršyklėje** — vedžiojant pelę virš anime kortelės, ji pasisuka 3D; patraukus pelę — grįžta į vietą.

- [ ] **Step 6: Commit**

```bash
git add src/quirks/CardTilt.js src/quirks/Quirks.jsx docs/superpowers/specs/2026-07-18-quirky-features-design.md
git commit -m "Anime kortelių 3D pakrypimas pagal pelės padėtį"
```

---

### Task 10: Šmėkliukė-kompanionė (branduolys + idle + peek + žinutės)

Didžiausia užduotis — šmėkliukė su visomis būsenomis viename faile.

**Files:**
- Create: `src/quirks/messages.js`
- Create: `src/quirks/Ghost.jsx`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: `memory.js` → `getMemory()`, `addSecret(id)`; `sounds.js` → `play(name)`
- Produces:
  - `messages.js`: `pickMessage(kind: 'caught'|'idle'|'night'): string`, `isNightHours(): boolean`, `CAUGHT_FIRST: string`
  - `Ghost.jsx`: default export `<Ghost />`; klauso `window` CustomEvent `ghost-say` su `detail: {text: string}` — KITI QUIRK'AI (Task 13, 14) šmėkliukės burbulą iškviečia TIK per šį eventą

- [ ] **Step 1: Sukurti `src/quirks/messages.js`**

```js
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
```

- [ ] **Step 2: Sukurti `src/quirks/Ghost.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { addSecret } from './memory.js'
import { pickMessage, isNightHours, CAUGHT_FIRST } from './messages.js'
import { play } from './sounds.js'

// Šmėkliukė-kompanionė. Būsenos:
//   hidden  — nematoma (numatytoji)
//   running — prabėga ekrano apačia (galima pagauti paspaudžiant)
//   whisper — pasirodo kamputyje su šnabždesiu (idle / naktis)
//   peeking — žvilgteli iš už apatinio krašto (scroll žemiau apačios)
//   caught  — pagauta / pakviesta per 'ghost-say' eventą, rodo burbulą
const RUN_MIN = 45_000
const RUN_MAX = 120_000
const RUN_TIME = 8_600
const IDLE_MS = 90_000
const PEEK_COOLDOWN = 30_000

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Ghost() {
  const [mode, setMode] = useState('hidden')
  const [text, setText] = useState('')
  const [left, setLeft] = useState(null)
  const modeRef = useRef(mode)
  modeRef.current = mode
  const hideTimer = useRef(null)
  const lastPeek = useRef(0)

  function show(newMode, msg, ms) {
    clearTimeout(hideTimer.current)
    setText(msg || '')
    setMode(newMode)
    if (ms) {
      hideTimer.current = setTimeout(() => {
        setLeft(null)
        setMode('hidden')
      }, ms)
    }
  }

  // Atsitiktiniai prabėgimai (naktį — dvigubai dažniau)
  useEffect(() => {
    if (mode !== 'hidden') return
    const base = RUN_MIN + Math.random() * (RUN_MAX - RUN_MIN)
    const wait = isNightHours() ? base / 2 : base
    const t = setTimeout(() => {
      if (reduced()) show('whisper', pickMessage('idle'), 6000)
      else show('running', '', RUN_TIME)
    }, wait)
    return () => clearTimeout(t)
  }, [mode])

  // Idle šnabždesys po 90 s be jokios veiklos
  useEffect(() => {
    let idleTimer = null
    function resetIdle() {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (modeRef.current === 'hidden') show('whisper', pickMessage('idle'), 7000)
      }, IDLE_MS)
    }
    const evs = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    evs.forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }))
    resetIdle()
    return () => {
      clearTimeout(idleTimer)
      evs.forEach((ev) => window.removeEventListener(ev, resetIdle))
    }
  }, [])

  // Žvilgtelėjimas paslinkus žemiau puslapio apačios
  useEffect(() => {
    function tryPeek() {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (!atBottom) return
      const now = performance.now()
      if (now - lastPeek.current < PEEK_COOLDOWN) return
      if (modeRef.current !== 'hidden') return
      lastPeek.current = now
      play('sparkle')
      show('peeking', '', 2600)
    }
    function onWheel(e) {
      if (e.deltaY > 0) tryPeek()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', tryPeek, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', tryPeek)
    }
  }, [])

  // Kiti quirk'ai gali paprašyti šmėkliukės ką nors pasakyti
  useEffect(() => {
    function onSay(e) {
      setLeft(null)
      show('caught', e.detail?.text || '...', 5600)
    }
    window.addEventListener('ghost-say', onSay)
    return () => window.removeEventListener('ghost-say', onSay)
  }, [])

  // Naktį šmėkliukė pati pasisveikina
  useEffect(() => {
    if (!isNightHours()) return
    const t = setTimeout(() => {
      if (modeRef.current === 'hidden') show('whisper', pickMessage('night'), 8000)
    }, 12_000)
    return () => clearTimeout(t)
  }, [])

  function onCatch(e) {
    if (mode === 'caught') return
    const rect = e.currentTarget.getBoundingClientRect()
    setLeft(Math.min(Math.max(rect.left, 10), window.innerWidth - 200))
    play('blyp')
    const first = addSecret('ghost-caught')
    show('caught', first ? CAUGHT_FIRST : pickMessage('caught'), 5600)
  }

  if (mode === 'hidden') return null

  return (
    <button
      type="button"
      className={`ghost ghost-${mode}`}
      style={left != null ? { left: `${left}px` } : undefined}
      onClick={onCatch}
      aria-label="Šmėkliukė"
    >
      {text && <span className="ghost-bubble">{text}</span>}
      <svg viewBox="0 0 32 32" width="46" height="46" aria-hidden="true">
        <path
          d="M4 30 V14 a12 12 0 0 1 24 0 V30 l-4-3 -4 3 -4-3 -4 3 -4-3 Z"
          fill="#FFFDF7"
          stroke="var(--line)"
          strokeWidth="2"
        />
        <circle cx="12" cy="15" r="1.8" fill="var(--line)" />
        <circle cx="20" cy="15" r="1.8" fill="var(--line)" />
        <path
          d="M13 20 q3 2.4 6 0"
          fill="none"
          stroke="var(--line)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="9.4" cy="18" r="1.6" fill="var(--skr-petal)" />
        <circle cx="22.6" cy="18" r="1.6" fill="var(--skr-petal)" />
      </svg>
    </button>
  )
}
```

- [ ] **Step 3: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import Ghost from './Ghost.jsx'
```
fragmento viduje po `<SakuraBurst />`:
```jsx
      <Ghost />
```

- [ ] **Step 4: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- šmėkliukė-kompanionė (Ghost.jsx) ---- */
.ghost{
  position:fixed;bottom:4px;left:-70px;z-index:70;
  background:none;border:none;padding:6px;
  filter:drop-shadow(2px 3px 0 rgba(27,25,34,.25));
}
.ghost svg{display:block}
.ghost-running{animation:ghost-run 8.4s linear forwards}
@keyframes ghost-run{
  0%{transform:translateX(0)}
  100%{transform:translateX(calc(100vw + 140px))}
}
.ghost-running svg{animation:ghost-bob .5s ease-in-out infinite alternate}
@keyframes ghost-bob{from{transform:translateY(0)}to{transform:translateY(-7px)}}
.ghost-whisper{left:auto;right:18px;bottom:14px;animation:ghost-in .8s ease-out}
.ghost-caught{bottom:10px;animation:ghost-in .3s ease-out}
.ghost-caught:not([style]){left:50%;margin-left:-29px}
@keyframes ghost-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.ghost-peeking{left:50%;margin-left:-29px;bottom:-12px;animation:ghost-peek 2.6s ease-in-out forwards}
@keyframes ghost-peek{
  0%{transform:translateY(105%)}
  25%,75%{transform:translateY(-4px)}
  100%{transform:translateY(110%)}
}
.ghost-bubble{
  position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);
  width:max-content;max-width:250px;
  background:var(--panel);border:2px solid var(--line);
  box-shadow:3px 3px 0 var(--hard);
  padding:8px 12px;font-size:.85rem;line-height:1.45;color:var(--ink);
  text-align:center;white-space:normal;
}
.ghost-whisper .ghost-bubble{left:auto;right:-6px;transform:none}
```

- [ ] **Step 5: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 6: Patikrinti naršyklėje**:
1. Console: `window.dispatchEvent(new CustomEvent('ghost-say', {detail:{text:'Testas!'}}))` → šmėkliukė apačioje centre su burbulu „Testas!“, dingsta po ~5.6 s.
2. Palaukti 90 s nieko nedarant → šmėkliukė dešiniame kampe su šnabždesiu.
3. Nuslinkti į pačią apačią ir pasukti ratuką žemyn → šmėkliukė žvilgteli iš apačios.
4. Palaukti prabėgimo (45–120 s) ir paspausti ant jos → burbulas su CAUGHT_FIRST žinute; localStorage `foundSecrets` gauna `ghost-caught`.

- [ ] **Step 7: Commit**

```bash
git add src/quirks/messages.js src/quirks/Ghost.jsx src/quirks/Quirks.jsx src/styles.css
git commit -m "Šmėkliukė-kompanionė: prabėgimai, idle šnabždesiai ir žvilgsnis iš apačios"
```

---

### Task 11: Nakties valandos (02:00–03:59)

**Files:**
- Create: `src/quirks/NightHours.js`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `src/components/Topbar.jsx` (brand ženkliukas)
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: `messages.js` → `isNightHours()`
- Produces: `NightHours.js` default export `useNightHours(): void`; body klasė `night-hours`

- [ ] **Step 1: Sukurti `src/quirks/NightHours.js`**

```js
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
```

- [ ] **Step 2: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import useNightHours from './NightHours.js'
```
po `useCardTilt()`:
```jsx
  useNightHours()
```

- [ ] **Step 3: Modifikuoti `src/components/Topbar.jsx`** — brand eilutę

```jsx
      <a className="brand" href="#virsus">✦ Inesyz<b>_0</b></a>
```
pakeisti į
```jsx
      <a className="brand" href="#virsus"><span className="brand-mark" aria-hidden="true"></span> Inesyz<b>_0</b></a>
```

- [ ] **Step 4: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- nakties valandos (02:00–03:59, body klasę deda NightHours.js) ---- */
.brand-mark::before{content:"✦"}
.night-hours .brand-mark::before{content:"☾"}
.night-hours{--accent:#8F7BD8;--skr-petal:#B9A7E6;--skr-core:#8F7BD8}
```

- [ ] **Step 5: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 6: Patikrinti naršyklėje** — console: `document.body.classList.add('night-hours')` → akcentai tampa levandiniai, logo žvaigždutė virsta mėnuliu ☾. (Tikras įsijungimas — tik 02:00–03:59.)

- [ ] **Step 7: Commit**

```bash
git add src/quirks/NightHours.js src/quirks/Quirks.jsx src/components/Topbar.jsx src/styles.css
git commit -m "Nakties valandų režimas: levandinės spalvos ir mėnulis logotipe"
```

---

### Task 12: Konami kodas → glitch → slaptas kambarys

**Files:**
- Create: `src/quirks/KonamiSecret.jsx`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: `memory.js` → `addSecret(id)`, `getMemory()`, `SECRET_IDS`; `sounds.js` → `play(name)`
- Produces: `KonamiSecret.jsx` default export `<KonamiSecret />`

- [ ] **Step 1: Sukurti `src/quirks/KonamiSecret.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { addSecret, getMemory, SECRET_IDS } from './memory.js'
import { play } from './sounds.js'

// ↑↑↓↓←→←→BA — ekranas „sugenda", tada atsiveria slaptas kambarys.
// Telefonams: 7 paspaudimai ant „またね" footeryje daro tą patį.
const SEQ = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
  'b', 'a',
]

// Užuominos dar nerastoms paslaptims — rodomos slaptame kambaryje.
const HINTS = {
  'sakura-burst': 'Logo mėgsta dėmesį. Daug dėmesio. Iš eilės.',
  'ghost-caught': 'Kažkas kartais prabėga pačia apačia. Pabandyk suspėti.',
  'sakura-word': 'Parašyk gėlės vardą. Tiesiog... parašyk. Bet kur.',
  'inesyz-word': 'O kieno čia svetainė? Jos vardas irgi burtažodis.',
  'dont-press': 'Footeryje yra mygtukas. Jis tavimi netiki.',
}

export default function KonamiSecret() {
  const [phase, setPhase] = useState('off') // off | glitch | open

  useEffect(() => {
    if (phase !== 'off') return

    function trigger() {
      addSecret('konami')
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        play('secret')
        setPhase('open')
        return
      }
      play('alarm')
      setPhase('glitch')
      setTimeout(() => {
        play('secret')
        setPhase('open')
      }, 1500)
    }

    let i = 0
    function onKey(e) {
      const k = e.key.toLowerCase()
      i = k === SEQ[i] ? i + 1 : k === SEQ[0] ? 1 : 0
      if (i === SEQ.length) {
        i = 0
        trigger()
      }
    }

    let taps = 0
    let last = 0
    function onClick(e) {
      if (!e.target.closest('footer .jp')) return
      const now = performance.now()
      taps = now - last <= 2500 ? taps + 1 : 1
      last = now
      if (taps >= 7) {
        taps = 0
        trigger()
      }
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'open') return
    function onEsc(e) {
      if (e.key === 'Escape') setPhase('off')
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [phase])

  if (phase === 'off') return null
  if (phase === 'glitch') return <div className="glitch-overlay" aria-hidden="true" />

  const found = getMemory().foundSecrets
  const missing = SECRET_IDS.filter((id) => !found.includes(id) && HINTS[id])

  return (
    <div className="secret-room" role="dialog" aria-label="Slaptas kambarys">
      <div className="secret-inner">
        <svg viewBox="0 0 32 32" width="90" height="90" aria-hidden="true">
          <path
            d="M4 30 V14 a12 12 0 0 1 24 0 V30 l-4-3 -4 3 -4-3 -4 3 -4-3 Z"
            fill="#FFFDF7"
            stroke="var(--line)"
            strokeWidth="2"
          />
          <circle cx="12" cy="15" r="1.8" fill="var(--line)" />
          <circle cx="20" cy="15" r="1.8" fill="var(--line)" />
          <path d="M13 20 q3 2.4 6 0" fill="none" stroke="var(--line)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="9.4" cy="18" r="1.6" fill="var(--skr-petal)" />
          <circle cx="22.6" cy="18" r="1.6" fill="var(--skr-petal)" />
        </svg>
        <h2 className="display">Slaptas kambarys</h2>
        <p className="jp secret-jp">ひみつ</p>
        <p>
          Radai mano namus. Čia tylu, šilta ir niekada nesibaigia žiedlapiai.<br />
          Ačiū, kad taip atidžiai tyrinėji. (◕‿◕)
        </p>
        <p className="mono secret-count">Rasta paslapčių: {found.length} / {SECRET_IDS.length}</p>
        {missing.length > 0 && (
          <>
            <p className="secret-hints-title">Užuominos dar nerastoms:</p>
            <ul className="secret-hints">
              {missing.map((id) => (
                <li key={id}>{HINTS[id]}</li>
              ))}
            </ul>
          </>
        )}
        <button className="theme-btn" onClick={() => setPhase('off')}>Grįžti ↩</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import KonamiSecret from './KonamiSecret.jsx'
```
fragmento viduje po `<Ghost />`:
```jsx
      <KonamiSecret />
```

- [ ] **Step 3: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- Konami glitch ir slaptas kambarys ---- */
.glitch-overlay{
  position:fixed;inset:0;z-index:90;pointer-events:none;
  background:repeating-linear-gradient(
    0deg,
    rgba(255,85,112,.28) 0 3px,
    transparent 3px 7px,
    rgba(90,200,250,.22) 7px 9px,
    transparent 9px 16px
  );
  mix-blend-mode:difference;
  animation:glitch-jump .12s steps(2) infinite;
}
@keyframes glitch-jump{
  0%{transform:translate(0,0)}
  25%{transform:translate(-8px,4px) skewX(2deg)}
  50%{transform:translate(6px,-6px)}
  75%{transform:translate(-4px,-3px) skewX(-3deg)}
  100%{transform:translate(0,3px)}
}
.secret-room{
  position:fixed;inset:0;z-index:95;
  background:var(--bg);
  display:flex;align-items:center;justify-content:center;
  padding:24px;text-align:center;overflow:auto;
}
.secret-inner{max-width:540px}
.secret-inner svg{margin:0 auto 10px}
.secret-inner h2{margin:0 0 4px;font-size:clamp(1.9rem,4.5vw,2.7rem)}
.secret-jp{letter-spacing:.4em;color:var(--accent);margin:0 0 18px}
.secret-count{font-weight:700;color:var(--accent);margin:18px 0}
.secret-hints-title{font-size:.85rem;color:var(--ink-soft);margin:0 0 6px}
.secret-hints{
  list-style:'✦  ';margin:0 0 22px;padding-left:1.4em;
  text-align:left;color:var(--ink-soft);font-size:.9rem;
  display:inline-block;
}
.secret-hints li{margin-bottom:4px}
```

- [ ] **Step 4: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 5: Patikrinti naršyklėje** — surinkti ↑↑↓↓←→←→BA → glitch ~1.5 s, tada slaptas kambarys su skaitikliu ir užuominomis; ESC uždaro. Paspausti „またね“ footeryje 7 kartus → tas pats.

- [ ] **Step 6: Commit**

```bash
git add src/quirks/KonamiSecret.jsx src/quirks/Quirks.jsx src/styles.css
git commit -m "Konami kodas: glitch efektas ir slaptas kambarys su užuominomis"
```

---

### Task 13: Slapti žodžiai „sakura“ ir „inesyz“

**Files:**
- Create: `src/quirks/SecretWords.js`
- Modify: `src/quirks/Quirks.jsx`
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: `memory.js` → `addSecret(id)`; `sounds.js` → `play(name)`; Ghost per `ghost-say` CustomEvent
- Produces: `SecretWords.js` default export `useSecretWords(): void`; body klasė `golden-petals`

- [ ] **Step 1: Sukurti `src/quirks/SecretWords.js`**

```js
import { useEffect } from 'react'
import { addSecret } from './memory.js'
import { play } from './sounds.js'

// Klaviatūra bet kur puslapyje surinkti burtažodžiai.
function ghostSay(text) {
  window.dispatchEvent(new CustomEvent('ghost-say', { detail: { text } }))
}

function onSakura() {
  addSecret('sakura-word')
  play('secret')
  document.body.classList.add('golden-petals')
  setTimeout(() => document.body.classList.remove('golden-petals'), 30_000)
  ghostSay('Auksiniai žiedlapiai!.. Tu žinai slaptus žodžius. Įdomu, iš kur. (◕‿◕)')
}

function onInesyz() {
  addSecret('inesyz-word')
  play('secret')
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const w = document.createElement('div')
    w.className = 'rainbow-wave'
    document.body.appendChild(w)
    setTimeout(() => w.remove(), 2300)
  }
  ghostSay('Tu ištarei šeimininkės vardą! Ji čia viską sukūrė. Šaunuolė, ar ne?')
}

export default function useSecretWords() {
  useEffect(() => {
    let buf = ''
    function onKey(e) {
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return
      buf = (buf + e.key.toLowerCase()).slice(-12)
      if (buf.endsWith('sakura')) {
        buf = ''
        onSakura()
      } else if (buf.endsWith('inesyz')) {
        buf = ''
        onInesyz()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
```

- [ ] **Step 2: Modifikuoti `src/quirks/Quirks.jsx`**:

```jsx
import useSecretWords from './SecretWords.js'
```
po `useNightHours()`:
```jsx
  useSecretWords()
```

- [ ] **Step 3: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- slapti žodžiai ---- */
.golden-petals .fall,
.golden-petals .trail-petal,
.golden-petals .burst-petal{background:#F5C76E}
.rainbow-wave{
  position:fixed;inset:0;z-index:80;pointer-events:none;
  opacity:0;
  background:linear-gradient(100deg,#FF5570,#F5C76E,#7ED957,#5AC8FA,#8F7BD8,#FF5570);
  background-size:300% 100%;
  animation:rainbow-sweep 2.1s ease-in-out forwards;
}
@keyframes rainbow-sweep{
  0%{opacity:0;background-position:0% 0}
  30%{opacity:.32}
  100%{opacity:0;background-position:100% 0}
}
```

- [ ] **Step 4: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 5: Patikrinti naršyklėje** — surinkti klaviatūra `sakura` → krentantys žiedlapiai patampa auksiniai, šmėkliukė pagiria; surinkti `inesyz` → vaivorykštės banga + šmėkliukės komplimentas.

- [ ] **Step 6: Commit**

```bash
git add src/quirks/SecretWords.js src/quirks/Quirks.jsx src/styles.css
git commit -m "Slapti žodžiai: auksiniai žiedlapiai ir vaivorykštės banga"
```

---

### Task 14: „NESPAUSK“ mygtukas footeryje

**Files:**
- Create: `src/quirks/DontPress.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/styles.css` (pabaigoje)

**Interfaces:**
- Consumes: `memory.js` → `addSecret(id)`, `getMemory()`, `updateMemory(patch)`; `sounds.js` → `play(name)`; `petalRain.js` → `spawnPetalRain(count)`; Ghost per `ghost-say` CustomEvent
- Produces: `DontPress.jsx` default export `<DontPress />`

- [ ] **Step 1: Sukurti `src/quirks/DontPress.jsx`**

```jsx
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
```

- [ ] **Step 2: Modifikuoti `src/components/Footer.jsx`** — visas failas tampa:

```jsx
import RandomQuote from '../quirks/RandomQuote.jsx'
import DontPress from '../quirks/DontPress.jsx'

export default function Footer() {
  return (
    <footer>
      <span className="jp">またね</span>
      <RandomQuote />
      Ačiū, kad užsukai! Puslapis nuolat pildomas — kaip ir mano anime sąrašas.<br />
      ✦ Inesyz_0 · 2026
      <DontPress />
    </footer>
  )
}
```

- [ ] **Step 3: Papildyti `src/styles.css`** — pabaigoje pridėti:

```css
/* ---- NESPAUSK mygtukas ---- */
.dont-press-wrap{margin:20px 0 0;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap}
.dont-press{
  border:2px solid var(--line);background:var(--panel);color:var(--ink-soft);
  font:inherit;font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  padding:5px 12px;box-shadow:2px 2px 0 var(--hard);
}
.dont-press:hover{color:var(--accent)}
.dont-press-msg{font-size:.85rem;color:var(--accent);font-weight:600}
.dont-press-note{margin:20px 0 0;font-size:.85rem;color:var(--ink-soft);font-style:italic}
.screen-shake{animation:screen-shake .6s ease-in-out}
@keyframes screen-shake{
  0%,100%{transform:translate(0,0)}
  20%{transform:translate(-7px,3px) rotate(-.4deg)}
  40%{transform:translate(6px,-4px) rotate(.4deg)}
  60%{transform:translate(-5px,-3px)}
  80%{transform:translate(4px,3px)}
}
```

- [ ] **Step 4: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 5: Patikrinti naršyklėje** — spausti NESPAUSK: 6 vis piktesni įspėjimai; 7-as paspaudimas → purtymas + žiedlapių audra + šmėkliukės bariukas + mygtukas „išeina namo“. Perkrovus puslapį mygtukas grįžta su nuliniu skaitikliu.

- [ ] **Step 6: Commit**

```bash
git add src/quirks/DontPress.jsx src/components/Footer.jsx src/styles.css
git commit -m "NESPAUSK mygtukas su eskaluojančiais įspėjimais ir finalu"
```

---

### Task 15: 404 puslapis su šmėkliuke

**Files:**
- Create: `public/404.html`

**Interfaces:**
- Consumes: nieko (savarankiškas statinis failas)
- Produces: GitHub Pages 404 puslapį

- [ ] **Step 1: Sukurti `public/404.html`**

```html
<!doctype html>
<html lang="lt">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>404 — pasiklydai? · Inesyz_0</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👻</text></svg>" />
<style>
  :root{
    --bg:#FAF8F3;--panel:#FFFFFF;--ink:#1B1922;--ink-soft:#5C5766;
    --line:#1B1922;--hard:#1B1922;--accent:#C9203E;--skr-petal:#F7B2CB;
  }
  @media (prefers-color-scheme: dark){
    :root{
      --bg:#131218;--panel:#1C1B23;--ink:#EDEAE2;--ink-soft:#A7A3B2;
      --line:#524E5C;--hard:#000000;--accent:#FF5570;--skr-petal:#CF7FA0;
    }
  }
  *{box-sizing:border-box}
  body{
    margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:var(--bg);color:var(--ink);
    font-family:"Segoe UI",system-ui,-apple-system,sans-serif;
    text-align:center;padding:24px;
  }
  .box{
    background:var(--panel);border:2.5px solid var(--line);
    box-shadow:8px 8px 0 var(--hard);padding:40px 34px;max-width:430px;
  }
  h1{
    font-family:"Bahnschrift SemiBold Condensed","Bahnschrift","Arial Narrow",sans-serif;
    font-stretch:condensed;text-transform:uppercase;
    font-size:3.4rem;margin:14px 0 6px;line-height:1;
  }
  h1 span{color:var(--accent)}
  p{color:var(--ink-soft);margin:0 0 24px;line-height:1.6}
  a{
    display:inline-block;color:var(--accent);font-weight:700;
    text-transform:uppercase;letter-spacing:.1em;font-size:.85rem;
    text-decoration:none;border:2px solid var(--line);
    padding:10px 18px;box-shadow:3px 3px 0 var(--hard);
  }
  a:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--hard)}
  svg{animation:float 2.6s ease-in-out infinite alternate}
  @keyframes float{from{transform:translateY(0)}to{transform:translateY(-10px)}}
  @media (prefers-reduced-motion: reduce){svg{animation:none}}
</style>
</head>
<body>
<div class="box">
  <svg viewBox="0 0 32 32" width="86" height="86" aria-hidden="true">
    <path d="M4 30 V14 a12 12 0 0 1 24 0 V30 l-4-3 -4 3 -4-3 -4 3 -4-3 Z"
          fill="#FFFDF7" stroke="var(--line)" stroke-width="2"/>
    <circle cx="12" cy="15" r="1.8" fill="var(--line)"/>
    <circle cx="20" cy="15" r="1.8" fill="var(--line)"/>
    <path d="M12.6 20.6 q3.4 -2.4 6.8 0" fill="none" stroke="var(--line)" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="9.4" cy="18" r="1.6" fill="var(--skr-petal)"/>
    <circle cx="22.6" cy="18" r="1.6" fill="var(--skr-petal)"/>
  </svg>
  <h1>4<span>0</span>4</h1>
  <p>Pasiklydai?.. Nieko tokio, čia tik aš gyvenu.<br />Eime, parodysiu kelią namo.</p>
  <!-- GitHub Pages svetainę talpina /inesyz-website/ kelyje, todėl nuoroda absoliuti -->
  <a href="/inesyz-website/">↩ Namo</a>
</div>
</body>
</html>
```

- [ ] **Step 2: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...`; kataloge `dist/` atsiranda `404.html` (Vite kopijuoja `public/` turinį).

- [ ] **Step 3: Commit**

```bash
git add public/404.html
git commit -m "404 puslapis su liūdna šmėkliuke pasiklydusiems"
```

---

### Task 16: Galutinė verifikacija

**Files:** jokių naujų — tik patikrinimai.

- [ ] **Step 1: Pilnas build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų ir be įspėjimų apie neegzistuojančius importus.

- [ ] **Step 2: Verify skill** — paleisti projekto `verify` skill'ą (build + preview + headless ekrano nuotraukos šviesia ir tamsia tema). Patikrinti, kad nuotraukose nesimato sulūžusio layout'o.

- [ ] **Step 3: Headless smoke patikrinimai** (per verify skill arba rankiniu būdu naršyklėje):
1. Hero rodo pasisveikinimą pagal laiką.
2. Footer rodo citatą + NESPAUSK mygtuką.
3. `localStorage['inesyz-quirks']` sukuriamas su `visits >= 1`.
4. Konami seka atidaro slaptą kambarį; ESC uždaro.
5. `sakura` / `inesyz` žodžiai suveikia.
6. Console — ASCII šmėkliukė be klaidų (raudonų error'ų console'ėje nėra).
7. `document.body.classList.add('night-hours')` perspalvina akcentus.

- [ ] **Step 4: Reduced-motion patikrinimas** — DevTools → Rendering → „Emulate CSS media feature prefers-reduced-motion: reduce“: paspaudimai nekuria sparkle elementų, logo 5 paspaudimai nekuria žiedlapių, Konami veikia be glitch (iškart atidaro kambarį).

- [ ] **Step 5: Galutinis commit (jei buvo pataisymų) ir push**

```bash
git status
git push
```
Expected: `master -> master`; GitHub Actions automatiškai publikuoja į GitHub Pages.
