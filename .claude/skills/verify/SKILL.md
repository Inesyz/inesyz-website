---
name: verify
description: Kaip lokaliai patikrinti šios svetainės pakeitimus naršyklėje (build, preview, headless ekrano nuotraukos)
---

# Svetainės patikra

1. **Build + serveris:**
   ```powershell
   npm run build
   npm run preview   # paleisti fone; serveris: http://localhost:4173/
   ```
   Lokaliai `base` yra `/` (GitHub Pages kelias `/inesyz-website/` taikomas tik CI).

2. **Ekrano nuotrauka** — headless Chrome (patikimai veikia; Edge headless šioje mašinoje
   nestabiliai rašo failą — naudok Chrome):
   ```powershell
   & "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu `
     --user-data-dir="<scratchpad>\chrome-profile" --window-size=1280,3800 `
     --virtual-time-budget=6000 --screenshot="<scratchpad>\full-page.png" http://localhost:4173/
   Start-Sleep -Seconds 12   # Chrome rašo failą asinchroniškai — palauk prieš tikrindamas
   ```
   - Visam puslapiui: `--window-size=1280,3800` (tada visos sekcijos patenka į viewport
     ir scroll-reveal animacijos suveikia — matosi galutinė būsena).
   - „Fold" patikrai: `--window-size=1280,900`.

3. **Ką žiūrėti:** anime kortelės (žvaigždutės, statusų ženkliukai, spalvos per `--a`),
   sekcijų matomumas (jei sekcija „dingo" — tikrink `.reveal` logiką ScrollReveal.jsx),
   tamsi tema (headless Chrome pagal nutylėjimą renderina tamsią).

Gotcha: headless naršyklė grįžta iškart, o failą įrašo vėliau — visada `Start-Sleep`
prieš `Test-Path`.
