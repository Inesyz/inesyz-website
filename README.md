# Inesyz_0 svetainė 🌸

Asmeninė svetainė apie anime, piešimą ir žaidimus. Sukurta su React + Vite.

## Kaip paleisti

```bash
npm install     # tik pirmą kartą
npm run dev     # paleidžia svetainę adresu http://localhost:5173
```

## Kur ką dėti

- **Muzika (anime openingai):** mp3 failus dėk į `public/music/` — failų pavadinimai
  surašyti `public/music/SKAITYK.txt`. Paspaudus anime kortelę, muzika gros puslapyje.
- **Piešiniai:** nuotraukas dėk į `public/piesiniai/`.
- **Tekstai ir anime sąrašas:** `src/data/anime.js` — ten gali keisti aprašymus,
  pridėti naujų anime (nauja kortelė atsiras automatiškai).

## Struktūra

- `src/components/` — svetainės dalys (Hero, Anime, Žaidimai, Sakuros ir t. t.)
- `src/styles.css` — visas dizainas (spalvos, mangos stilius, sakurų animacijos)
- `public/` — muzika, piešiniai ir kiti failai
