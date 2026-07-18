# Anime kortelių įvertinimai + scroll animacijos

Data: 2026-07-18 · Patvirtinta pokalbyje

## Tikslas

1. Anime kortelėse rodyti asmeninį įvertinimą (žvaigždutės, X/10) ir žiūrėjimo statusą.
2. Sekcijos švelniai „įplaukia" (fade + pakilimas) slenkant puslapį žemyn.

## Duomenys (`src/data/anime.js`)

Kiekvienas įrašas gauna du naujus laukus:

- `rating` — skaičius 1–10 arba `null` (jei dar nežiūrėta)
- `status` — `'watching'` | `'done'` | `'planned'`

Reikšmės: Tokyo Ghoul 9/watching, Death Note 10/done, Dandadan 10/done,
Blue Lock 8/done, Jujutsu Kaisen null/planned, Hikaru 7/done.

## Kortelės UI (`AnimeSection.jsx` + `styles.css`)

- Po pavadinimu — `card-meta` eilutė: 5 žvaigždutės (užpildymas = rating×10 %,
  per absoliučiai pozicionuotą `stars-fill` sluoksnį) + `9/10` tekstas + statuso ženkliukas.
- Statusai: „Žiūriu dabar" (užpildytas kortelės akcento spalva), „Baigta" (ramus),
  „Plane" (punktyrinis kontūras). Kai `rating == null` — tik ženkliukas, be žvaigždučių.

## Scroll animacijos (`ScrollReveal.jsx` + `styles.css`)

- Naujas komponentas be UI: `IntersectionObserver` stebi `main section` elementus,
  prideda `.reveal` klasę, o pasirodžius ekrane — `.reveal-in`.
- CSS: `opacity: 0` + `translateY(26px)` → `opacity: 1`, perėjimas ~0.6 s.
- `prefers-reduced-motion: reduce` — JS iš viso nieko nedaro, animacijų nėra.
- Jokių papildomų bibliotekų.
