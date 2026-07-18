# Quirky dalykėlių dizainas — Inesyz svetainė

**Data:** 2026-07-18
**Statusas:** patvirtinta naudotojos
**Tonas:** mielas + truputį paslaptingas (Undertale įkvėpimas — šilta, bet su mystery sluoksniu)

## Tikslas

Pridėti į svetainę 18 žaismingų / paslaptingų dalykėlių, kurie padaro ją gyvą ir
skatina lankytojus tyrinėti. Dauguma paslapčių jungiasi per vieną personažą —
pikselinę šmėkliukę, kuri tampa svetainės „paslapčių šeimininke“.

## Funkcijų sąrašas

### Etapas A — gyvumo detalės

| # | Funkcija | Aprašymas |
|---|----------|-----------|
| 1 | Pasisveikinimas pagal paros laiką | Hero sekcijos eilutė „ようこそ · Sveiki atvykę“ tampa dinamiška: rytą „おはよう · Labas rytas ☀️“, dieną „こんにちは · Laba diena“, vakare „こんばんは · Labas vakaras“, naktį „おやすみ · Labanakt 🌙“ |
| 2 | Tab pavadinimo pokštas | Perjungus naršyklės kortelę, `document.title` tampa „(◕︿◕) grįžk...“; sugrįžus — trumpam „✨ Yay, grįžai!“, po ~2 s grįžta originalus pavadinimas |
| 3 | Atsitiktinė anime citata | Footeryje kaskart įkėlus puslapį rodoma atsitiktinė citata iš `src/data/quotes.js` (citata + anime pavadinimas, lietuviškai) |
| 4 | Console žinutė | Atsidarius DevTools console — ASCII šmėkliukė + užuomina apie Konami kodą |
| 5 | Rožinis teksto žymėjimas | `::selection` stilius: sakura rožinis fonas (grynas CSS) |

### Etapas B — interaktyvūs žaisliukai

| # | Funkcija | Aprašymas |
|---|----------|-----------|
| 6 | Blizgučiai paspaudus | Bet kur spragtelėjus pabyra 5–8 mažos žvaigždutės ✦, kurios išsisklaido ir išnyksta (~0.7 s). Limitas ekrane, kad neapkrautų |
| 7 | Garsiukai + mute | Švelnūs „pop“/„blyp“ garsai ant mygtukų ir specialių įvykių, sintezuojami Web Audio API (jokių failų). Mute mygtukas 🔔/🔕 topbare, būsena įsimenama |
| 8 | Sakurų sprogimas | Paspaudus „✦ Inesyz_0“ logo 5 kartus iš eilės (per ≤3 s tarpus) — visas ekranas užpilamas žiedlapių lietumi ~4 s |
| 9 | Anime kortelių 3D pakrypimas | Vedžiojant pelę virš anime kortelės, ji švelniai pasisuka 3D (perspective + rotateX/Y pagal pelės padėtį) |
| 10 | Šmėkliukė-kompanionė (branduolys) | Maža CSS/SVG pikselinė šmėkliukė retkarčiais (kas 45–120 s, atsitiktinai) prabėga ekrano apačia. Suspėjus ją paspausti — burbulas su žinute. Žinutės sukasi ir priklauso nuo konteksto |

### Etapas C — Undertale-style paslaptys

| # | Funkcija | Aprašymas |
|---|----------|-----------|
| 11 | Svetainė tave prisimena | `localStorage` skaičiuoja apsilankymus. Po 3, 7 ir 15 apsilankymų šmėkliukės žinutės tampa asmeniškesnės („Tu vėl čia... jau 7 kartą. Man tai patinka.“) |
| 12 | Idle šnabždesys | ~90 s be pelės/klaviatūros/scroll — šmėkliukė atsibunda ir sušnabžda ką nors keisto/mielo, tada pasislepia |
| 13 | Konami kodas | ↑↑↓↓←→←→BA: ekranas ~1.5 s „sugenda“ (glitch overlay: RGB poslinkiai, triukšmo juostos), tada atsiveria slapta pilno ekrano sekcija su šmėkliukės „namais“, padėka ir paslapčių skaitikliu (kiek easter eggų rasta). Uždaroma ESC / mygtuku |
| 14 | Slapti žodžiai | Klaviatūra bet kur puslapyje surinkus „sakura“ — krentantys žiedlapiai 30 s tampa auksiniai; surinkus „inesyz“ — trumpa vaivorykštės banga per puslapį + šmėkliukės komplimentas |
| 15 | Nakties režimas | 02:00–03:59 vietos laiku: body gauna klasę `night-hours` (blankesnės spalvos, mėnulis vietoj ✦), šmėkliukė pasirodo dažniau ir komentuoja („Tu irgi nemiegi?..“) |
| 16 | „NESPAUSK“ mygtukas | Mažas mygtukas footeryje. Kiekvienas paspaudimas — vis dramatiškesnis įspėjimas (7 žingsniai). Paskutinis: ekrano purtymas + žiedlapių audra + šmėkliukė švelniai pabara. Skaitiklis išlieka tarp apsilankymų |
| 17 | Scroll žemiau apačios | Nuslinkus iki pat apačios ir sukant ratuką toliau — šmėkliukė žvilgteli iš už apatinio ekrano krašto ir pasislepia |
| 18 | 404 puslapis | `public/404.html` — savarankiškas statinis puslapis (inline CSS, be React): šmėkliukė, „Pasiklydai?..“ ir nuoroda namo. Kelias namo — `/inesyz-website/` (GitHub Pages), su komentaru kode kodėl |

## Architektūra

### Failų struktūra

```
src/quirks/
  Quirks.jsx          — agregatorius; vienintelis dalykas, kurį importuoja App.jsx
  memory.js           — localStorage sluoksnis (žr. „Atmintis“)
  sounds.js           — Web Audio sintezė + mute būsena
  messages.js         — visos šmėkliukės žinutės ir jų parinkimo logika
  Greeting.jsx        — (1) naudojamas Hero.jsx viduje
  RandomQuote.jsx     — (3) naudojamas Footer.jsx viduje
  TabTitle.js         — (2) hook
  ConsoleArt.js       — (4) modulis, paleidžiamas vieną kartą
  ClickSparkles.jsx   — (6)
  SakuraBurst.jsx     — (8) klauso logo paspaudimų per event delegation
  CardTilt.js         — (9) hook su event delegation ant anime kortelių
  Ghost.jsx           — (10, 11, 12, 15, 17) šmėkliukė ir visos jos būsenos
  KonamiSecret.jsx    — (13) klaviatūros seka + glitch + slapta sekcija
  SecretWords.js      — (14) hook
  NightHours.js       — (15) hook, uždeda/nuima body klasę
  DontPress.jsx       — (16) naudojamas Footer.jsx viduje
src/data/quotes.js    — (3) citatos
public/404.html       — (18) statinis
```

### Integracijos taškai (esamų failų pakeitimai)

- `App.jsx` — pridedama `<Quirks />` (viena eilutė)
- `Hero.jsx` — eyebrow eilutė keičiama į `<Greeting />`
- `Footer.jsx` — pridedama `<RandomQuote />` (iš Quirks) ir `<DontPress />`
- `Topbar.jsx` — pridedamas mute mygtukas šalia temos mygtuko
- `styles.css` — nauji stiliai (::selection, šmėkliukė, glitch, sparkles, night-hours ir kt.)

Visa kita — nauji failai. Esami komponentai (Sakura, MouseTrail, ScrollReveal,
Playlist...) nekeičiami.

### Šmėkliukė (Ghost.jsx)

Viena būsenos mašina su būsenomis: `hidden` (numatytoji) → `running` (prabėga) /
`whisper` (idle) / `peeking` (scroll apačioje) / `caught` (pagauta, rodo burbulą).
Žinutę parenka `messages.js` pagal kontekstą: apsilankymų skaičius, ar naktis,
kiek paslapčių rasta. Piešiama SVG (pikselinė šmėkliukė, ~24×24 tinklelis,
`image-rendering: pixelated` dvasia per stačiakampius SVG kvadratėlius).

### Atmintis (memory.js)

Vienas `localStorage` raktas `inesyz-quirks`:

```json
{
  "visits": 7,
  "lastVisit": "2026-07-18",
  "muted": false,
  "dontPressCount": 3,
  "foundSecrets": ["konami", "sakura-word", "ghost-caught"]
}
```

- Apsilankymas skaičiuojamas vieną kartą per dieną (pagal `lastVisit` datą).
- API: `getMemory()`, `updateMemory(patch)`, `addSecret(id)` — visi kviečiantys
  komponentai eina tik per šį modulį.
- Jei `localStorage` neprieinamas (privatus režimas) — tyliai veikia be atminties.

### Garsai (sounds.js)

- Web Audio API oscillator + gain envelope; keli presetai: `pop`, `blyp`,
  `sparkle`, `secret`, `alarm` (NESPAUSK finalui).
- AudioContext kuriamas tik po pirmos naudotojo sąveikos (naršyklių reikalavimas).
- `muted` skaitomas iš memory.js; mute mygtukas jį keičia.

## Prieinamumas ir saugikliai

- `prefers-reduced-motion: reduce` — išjungiami: sparkles, burst, tilt, glitch
  purtymas (glitch keičiamas švelniu fade), šmėkliukės bėgimas (ji tik atsiranda
  ir išnyksta per opacity). Žinutės ir paslaptys lieka veikti.
- Visi dekoratyviniai elementai — `aria-hidden="true"`; šmėkliukės burbulo
  tekstas paliekamas skaitomas.
- Garsai niekada nepaleidžiami automatiškai prieš pirmą sąveiką; mute įsimenamas.
- Telefonuose: tilt ir scroll-peek veikia per touch; sparkles veikia ant tap;
  Konami kodas telefone neprieinamas — vietoj jo slaptą sekciją atidaro
  7 paspaudimai ant footerio „またね“ užrašo (tas pats efektas).
- Visi interval/listener'iai išvalomi unmount metu; StrictMode dvigubas
  mount'as nekuria dublikatų (console žinutė — su module-level guard).

## Verifikacija

Projekte nėra testų infrastruktūros — jos nediegiame (YAGNI). Kiekvieno etapo
pabaigoje:

1. `npm run build` — be klaidų.
2. `verify` skill: preview + headless ekrano nuotraukos (šviesi/tamsi tema).
3. Scenarijų checklist'as rankiniam patikrinimui naršyklėje (pateikiamas
   naudotojai po kiekvieno etapo — ką paspausti ir ko tikėtis).
4. Automatizuoti headless patikrinimai per Playwright žingsnius verify skill'e,
   kur įmanoma (pvz., Konami seka, slapti žodžiai, tab title).

## Etapų tvarka

1. **Etapas A** (1–5): mažiausiai rizikos, iškart matomi.
2. **Etapas B** (6–10): šmėkliukės branduolys + žaisliukai.
3. **Etapas C** (11–18): paslaptys, kurios remiasi A ir B pamatais.

Po kiekvieno etapo — commit, naudotoja peržiūri naršyklėje ir patvirtina.

## Ne šio darbo dalis

- Jokių naujų npm priklausomybių (viskas — React + CSS + Web Audio).
- Jokio backend'o; visa atmintis — localStorage.
- Mini-žaidimas slaptoje sekcijoje — galima ateityje, ne dabar.
