# Scroll baras, sakuros kursorius ir žiedlapių uodegėlė

Data: 2026-07-18 · Patvirtinta pokalbyje

## Tikslas

1. Stilizuotas scroll baras akcento spalvos su storu rėmeliu (neo-brutalist stilius).
2. Pelės kursorius — rožinis sakuros žiedlapis; ant nuorodų/mygtukų — ryškesnis.
3. Judinant pelę pabyra maži žiedlapiai, kurie sukdamiesi krenta ir išnyksta.

## Scroll baras (`styles.css`)

- `::-webkit-scrollbar` (Chrome/Edge): 14px, begiukas `--accent` su `2.5px var(--line)`
  rėmeliu, takelis `--panel-alt`; hover — `--skr-core`.
- Firefox: `scrollbar-color` po `@supports not selector(::-webkit-scrollbar)`,
  kad Chrome nenaudotų standartinės savybės vietoj webkit stilių.

## Kursorius (`styles.css`)

- SVG data-URI žiedlapis (~26px, fill `#F7B2CB`, tamsus kontūras), hotspot ties smaigaliu (3 3).
- `html` — rožinis; `a, button` — tamsesnis rožinis (`#D64D78`), fallback `auto`/`pointer`.

## Uodegėlė (`MouseTrail.jsx` + `styles.css`)

- `mousemove` klausytojas su ~45 ms ribojimu; kiekvienas žiedlapis — `span.trail-petal`
  su atsitiktiniu posūkiu, dydžiu ir dreifu (CSS kintamieji), pašalinamas po `animationend`.
- Riba: max 24 žiedlapiai DOM'e vienu metu.
- Išjungta, kai `prefers-reduced-motion: reduce` arba nėra tikslios pelės (`pointer: fine`).
- Jokių papildomų bibliotekų.
