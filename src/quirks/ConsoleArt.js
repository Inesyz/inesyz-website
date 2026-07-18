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
