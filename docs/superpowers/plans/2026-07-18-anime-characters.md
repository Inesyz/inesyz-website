# Anime veikėjų modalo įgyvendinimo planas

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Paspaudus anime kortelės pavadinimą, atidaryti modalą su pagrindiniais to anime veikėjais — nuotrauka iš Jikan API, vardas ir trumpa lietuviška biografija (spec #19, `docs/superpowers/specs/2026-07-18-quirky-features-design.md`).

**Architecture:** `src/data/anime.js` gauna `malId`; naujas `src/data/characters.js` laiko ranka rašytas LT biografijas (atpažįstamas pagal MAL id ARBA vardą); naujas `src/components/CharactersModal.jsx` (YtModal šeimos stilius) fetch'ina Jikan, cache'uoja sessionStorage ir turi offline fallback su inicialų kortelėmis; `AnimeSection.jsx` pavadinimą paverčia mygtuku virš grojimo overlay.

**Tech Stack:** React 19, Vite 6, grynas CSS, Jikan API v4 (be rakto, CORS leidžiamas). **Jokių naujų npm priklausomybių.**

## Global Constraints

- Jokių naujų npm priklausomybių; jokios testų infrastruktūros (verifikacija: `npm run build` + CDP smoke).
- Visi naudotojui matomi tekstai lietuviškai su taisyklingomis raidėmis (ą č ę ė į š ų ū ž).
- Commit žinutės lietuviškos, be prefiksų, baigiasi:
  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01LGqfHt9isV2SDUbuSVt1md
  ```
- CSS pridedamas TIKROJE `src/styles.css` pabaigoje.
- MAL ID (patikrinti per Jikan/AniList 2026-07-18): tokyo-ghoul 22319, death-note 1535, dandadan 57334, blue-lock 49596, jujutsu-kaisen 40748, hikaru 58913.
- Jikan gali būti laikinai nepasiekiamas (šiandien TG endpoint'as grąžino 504) — offline fallback yra PRIVALOMA funkcijos dalis, ne edge case.
- Kortelėje `.play::after` overlay dengia visą kortelę (styles.css) — pavadinimo mygtukas privalo turėti `position:relative` ir didesnį z-index, kad jo paspaudimas negrotų muzikos.

---

### Task 1: Duomenys — malId ir veikėjų biografijos

**Files:**
- Modify: `src/data/anime.js` (6 įrašai gauna `malId`)
- Create: `src/data/characters.js`

**Interfaces:**
- Consumes: nieko
- Produces: `anime.js` įrašai turi `malId: number`; `characters.js` eksportuoja `characterBios: Record<string, {malId: number|null, name: string, bio: string}[]>` (raktas — anime `id`; `name` — MAL formatu „Pavardė, Vardas“)

- [ ] **Step 1: Modifikuoti `src/data/anime.js`** — kiekvienam įrašui po `id` eilutės pridėti `malId`:

| id | eilutė po `id: '...',` |
|---|---|
| tokyo-ghoul | `    malId: 22319,` |
| death-note | `    malId: 1535,` |
| dandadan | `    malId: 57334,` |
| blue-lock | `    malId: 49596,` |
| jujutsu-kaisen | `    malId: 40748,` |
| hikaru | `    malId: 58913,` |

Taip pat papildyti failo viršaus komentarą nauja eilute po esamų komentarų:
```js
// malId — MyAnimeList ID (veikėjų modalui per Jikan API).
```

- [ ] **Step 2: Sukurti `src/data/characters.js`**

```js
// Pagrindinių veikėjų biografijos veikėjų modalui — trumpos, lietuviškos,
// be spoilerių. Veikėjas atpažįstamas pagal MAL id ARBA vardą (MAL formatu
// „Pavardė, Vardas") — vardas yra atsarga, jei API id nesutaptų.
export const characterBios = {
  'tokyo-ghoul': [
    {
      malId: null,
      name: 'Kaneki, Ken',
      bio: 'Knygų mylėtojas studentas, po nelemto pasimatymo tapęs pusiau gūliu. Įstrigęs tarp žmonių ir gūlių pasaulių, jis turi atsakyti sau: kas aš iš tikrųjų?',
    },
    {
      malId: null,
      name: 'Kirishima, Touka',
      bio: 'Kavinės „Anteiku" padavėja ir gūlė, išmokusi išgyventi žmonių pasaulyje. Po šiurkštumu slepia rūpestį — ir triuškinantį spyrį.',
    },
  ],
  'death-note': [
    {
      malId: 71,
      name: 'Lawliet, L',
      bio: 'Pasaulinio garso detektyvas, kurio tikro vardo nežino niekas. Sėdi keistai, minta vien saldumynais ir mąsto dešimt žingsnių į priekį.',
    },
    {
      malId: 80,
      name: 'Yagami, Light',
      bio: 'Genialus gimnazistas, radęs sąsiuvinį, kuris žudo. Įsitikinęs, kad sukurs pasaulį be nusikaltėlių — ir taps jo dievu.',
    },
    {
      malId: 75,
      name: 'Ryuk',
      bio: 'Mirties dievas, iš nuobodulio numetęs savo Death Note į žmonių pasaulį. Stebi chaosą su šypsena ir obuoliu rankoje.',
    },
  ],
  'dandadan': [
    {
      malId: 196898,
      name: 'Ayase, Momo',
      bio: 'Tiesmuka gimnazistė, paveldėjusi ekstrasensės močiutės kraują. Tikėjo vaiduokliais, bet ne ateiviais — kol viena naktis apvertė viską.',
    },
    {
      malId: 196899,
      name: 'Takakura, Ken',
      bio: 'Drovus okultikos fanatikas (visi jį vadina Okarunu), tikėjęs ateiviais, bet ne vaiduokliais. Po susidūrimo su Turbo Senele gavo prakeiksmą — ir netikėtą galią.',
    },
  ],
  'blue-lock': [
    {
      malId: 178716,
      name: 'Bachira, Meguru',
      bio: 'Driblingo genijus, nuo vaikystės žaidžiantis su „pabaisa" savo viduje. Aikštėje ieško ne pergalių, o žmogaus, matančio futbolą taip pat beprotiškai.',
    },
    {
      malId: 177491,
      name: 'Isagi, Yoichi',
      bio: 'Eilinis puolėjas, patekęs į negailestingą Blue Lock eksperimentą. Jo ginklas — ne greitis, o erdvės matymas ir šaltas protas.',
    },
    {
      malId: 178712,
      name: 'Chigiri, Hyouma',
      bio: 'Greičiausias Blue Lock žaidėjas, ilgai bijojęs savo pačio kojų. Kai nusprendžia vėl bėgti visu greičiu — jo nesustabdo niekas.',
    },
    {
      malId: 178718,
      name: 'Kunigami, Rensuke',
      bio: 'Teisingumo vedamas „herojus" su galingu kairės kojos smūgiu. Blue Lock privers jį permąstyti, ką reiškia būti geriausiu.',
    },
  ],
  'jujutsu-kaisen': [
    {
      malId: 164471,
      name: 'Gojou, Satoru',
      bio: 'Stipriausias šių laikų burtininkas — ir puikiai tai žino. Po akių raiščiu slepiasi Šešios Akys, o po šypsena — planas pakeisti visą burtininkų pasaulį.',
    },
    {
      malId: 163847,
      name: 'Itadori, Yuuji',
      bio: 'Neįtikėtinos fizinės jėgos gimnazistas, prarijęs prakeikto demono Sukunos pirštą, kad apsaugotų draugus. Dabar jo kūne gyvena du.',
    },
    {
      malId: 164470,
      name: 'Fushiguro, Megumi',
      bio: 'Santūrus burtininkas, iš savo šešėlio šaukiantis shikigami. Kalba mažai, galvoja daug.',
    },
    {
      malId: 164472,
      name: 'Kugisaki, Nobara',
      bio: 'Iš kaimo į Tokiją atvykusi burtininkė su plaktuku, vinimis ir nepajudinamu pasitikėjimu savimi. Kovoja taip pat aštriai, kaip kalba.',
    },
  ],
  'hikaru': [
    {
      malId: 206879,
      name: 'Tsujinaka, Yoshiki',
      bio: 'Tylus kaimo paauglys, žinantis baisią tiesą: jo geriausias draugas mirė. Bet tai, kas grįžo su Hikaru veidu, jam vis tiek brangu — ir tai baisiausia.',
    },
    {
      malId: 206880,
      name: 'Indou, Hikaru',
      bio: 'Kažkas, kas atsibudo kalnuose su mirusio berniuko atsiminimais ir šypsena. Nuoširdžiai prisirišęs prie Yoshiki — tik nežino, ką reiškia būti žmogumi.',
    },
  ],
}
```

- [ ] **Step 3: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 4: Commit**

```bash
git add src/data/anime.js src/data/characters.js
git commit -m "Anime MAL ID ir veikėjų biografijos veikėjų modalui"
```

---

### Task 2: CharactersModal komponentas ir kortelės pavadinimo mygtukas

**Files:**
- Create: `src/components/CharactersModal.jsx`
- Modify: `src/components/AnimeSection.jsx`
- Modify: `src/styles.css` (TIKROJE pabaigoje)

**Interfaces:**
- Consumes: `src/data/characters.js` → `characterBios`; anime objektai su `malId` iš Task 1
- Produces: `<CharactersModal anime={anime} onClose={fn} />`

- [ ] **Step 1: Sukurti `src/components/CharactersModal.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { characterBios } from '../data/characters.js'

// Veikėjų langas mangos stiliumi (kaip YtModal): pagrindiniai anime veikėjai
// iš Jikan API + ranka rašytos lietuviškos biografijos iš characters.js.
// Jei API nepasiekiamas — kortelės su inicialais ir vien lokaliomis bio.
const CACHE_PREFIX = 'inesyz-chars-'

// „Pavardė, Vardas" (MAL formatas) -> „Vardas Pavardė"
function prettyName(malName) {
  return malName.split(', ').reverse().join(' ')
}

export default function CharactersModal({ anime, onClose }) {
  const [status, setStatus] = useState('loading') // loading | ok | offline
  const [chars, setChars] = useState([])
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let alive = true
    const bios = characterBios[anime.id] || []
    const fallback = bios.map((b) => ({
      key: b.name,
      name: prettyName(b.name),
      image: null,
      bio: b.bio,
    }))

    async function load() {
      const cacheKey = CACHE_PREFIX + anime.id
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          if (alive) {
            setChars(JSON.parse(cached))
            setStatus('ok')
          }
          return
        }
      } catch {
        /* sessionStorage gali būti išjungtas — tęsiam be cache */
      }
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${anime.malId}/characters`)
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const json = await res.json()
        const loaded = (json.data || [])
          .filter((c) => c.role === 'Main')
          .sort((a, b) => (b.favorites || 0) - (a.favorites || 0))
          .slice(0, 6)
          .map((c) => ({
            key: String(c.character.mal_id),
            name: prettyName(c.character.name),
            image:
              c.character.images?.webp?.image_url ||
              c.character.images?.jpg?.image_url ||
              null,
            bio:
              bios.find(
                (b) => b.malId === c.character.mal_id || b.name === c.character.name,
              )?.bio || null,
          }))
        if (!loaded.length) throw new Error('tuščias sąrašas')
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(loaded))
        } catch {
          /* be cache */
        }
        if (alive) {
          setChars(loaded)
          setStatus('ok')
        }
      } catch {
        if (alive) {
          setChars(fallback)
          setStatus('offline')
        }
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [anime])

  return (
    <div className="yt-overlay" onClick={onClose}>
      <div
        className="chars-box"
        style={{ '--a': anime.color }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${anime.title} veikėjai`}
      >
        <div className="yt-head">
          <h3>{anime.title} — pagrindiniai veikėjai</h3>
          <button ref={closeRef} className="yt-close" onClick={onClose} aria-label="Uždaryti">✕</button>
        </div>

        {status === 'loading' && (
          <p className="chars-note">👻 Šmėkliukė ieško veikėjų...</p>
        )}

        {status === 'offline' && (
          <p className="chars-note">
            👻 Nepavyko pasiekti veikėjų archyvo — rodau, ką prisimenu pati.
          </p>
        )}

        {status !== 'loading' && (
          <ul className="char-grid">
            {chars.map((c) => (
              <li key={c.key} className="char-item">
                {c.image ? (
                  <img src={c.image} alt="" loading="lazy" />
                ) : (
                  <span className="char-init" aria-hidden="true">{c.name[0]}</span>
                )}
                <div>
                  <h4>{c.name}</h4>
                  {c.bio && <p>{c.bio}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Modifikuoti `src/components/AnimeSection.jsx`**

Pridėti importą po esamų importų:
```jsx
import CharactersModal from './CharactersModal.jsx'
```
Pridėti būseną po `const [videoAnime, setVideoAnime] = useState(null)`:
```jsx
  const [charsAnime, setCharsAnime] = useState(null)
```
Pakeisti eilutę
```jsx
            <h3>{anime.title}</h3>
```
į
```jsx
            <h3>
              <button
                className="title-btn"
                onClick={() => setCharsAnime(anime)}
                title="Rodyti pagrindinius veikėjus"
              >
                {anime.title}
              </button>
            </h3>
```
Po `{videoAnime && (...)}` bloko (prieš `</section>`) pridėti:
```jsx
      {charsAnime && (
        <CharactersModal anime={charsAnime} onClose={() => setCharsAnime(null)} />
      )}
```

- [ ] **Step 3: Papildyti `src/styles.css`** — TIKROJE failo pabaigoje pridėti:

```css
/* ---- veikėjų modalas (CharactersModal.jsx) ---- */
.title-btn{
  position:relative;z-index:2; /* virš .play::after grojimo overlay */
  background:none;border:none;padding:0;
  font:inherit;color:inherit;text-align:left;
  border-bottom:2px dotted transparent;
}
.title-btn:hover{color:var(--a,var(--accent));border-bottom-color:currentColor}
.chars-box{
  background:var(--panel);
  border:2.5px solid var(--line);
  box-shadow:8px 8px 0 var(--hard);
  width:min(720px,100%);
  max-height:min(84vh,900px);
  overflow:auto;
  padding:16px 18px 18px;
}
.chars-note{margin:8px 2px 10px;color:var(--ink-soft)}
.char-grid{
  list-style:none;margin:6px 0 0;padding:0;
  display:grid;grid-template-columns:1fr 1fr;gap:18px;
}
.char-item{display:flex;gap:14px;align-items:flex-start}
.char-item img,
.char-init{
  flex:0 0 auto;width:74px;height:104px;object-fit:cover;
  border:2px solid var(--line);
  box-shadow:3px 3px 0 var(--hard);
  background:var(--panel-alt);
}
.char-init{
  display:grid;place-items:center;
  font-size:2rem;font-weight:800;color:#fff;
  background:var(--a,var(--accent));
}
.char-item h4{margin:0 0 6px;font-size:1rem;color:var(--a,var(--accent))}
.char-item p{margin:0;font-size:.85rem;line-height:1.5;color:var(--ink-soft)}
@media (max-width:640px){
  .char-grid{grid-template-columns:1fr}
}
```

- [ ] **Step 4: Patikrinti build**

Run: `npm run build`
Expected: `✓ built in ...` be klaidų.

- [ ] **Step 5: Commit**

```bash
git add src/components/CharactersModal.jsx src/components/AnimeSection.jsx src/styles.css
git commit -m "Veikėjų modalas paspaudus anime pavadinimą"
```

---

### Task 3: Verifikacija ir publikavimas

- [ ] **Step 1:** `npm run build` — be klaidų.
- [ ] **Step 2:** CDP smoke (preview serveris): paspausti `.title-btn` → atsiranda `.chars-box`; palaukti — `status` ok (su tinklu) arba offline fallback su `.char-init`; ESC uždaro; paspaudus kortelę už pavadinimo ribų — openingo grojimas veikia kaip anksčiau (YT modalas arba audio).
- [ ] **Step 3:** Offline patikra: CDP `Network.emulateNetworkConditions offline` → modalas rodo inicialų korteles ir lokalies bio.
- [ ] **Step 4:** `git push` — GitHub Pages publikuoja automatiškai.
