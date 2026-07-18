const games = [
  {
    glyph: 'o!',
    color: '#E8467C',
    title: 'osu!',
    blurb: 'Ritmo žaidimas, kuriame susitinka dvi mano meilės: anime muzika ir greiti refleksai. Mėgstamiausi openingai + aim treniruotė = tobula kombinacija.',
  },
  {
    glyph: '+',
    color: '#6E7F3E',
    title: 'Counter-Strike',
    blurb: 'Klasika. Vienas raundas nepastebimai pavirsta valanda „dar vieno paskutinio" — ir visi puikiai žinome, kaip tai baigiasi.',
  },
  {
    glyph: '▦',
    color: '#C43131',
    title: 'Roblox',
    blurb: 'Milijonas mažų žaidimų viename — nuo obby iki tycoon’ų. Geriausia vieta pabūti su draugais, kai norisi tiesiog pasijuokti.',
  },
  {
    glyph: '⛏',
    color: '#3F9E3F',
    title: 'Minecraft',
    blurb: 'Kvadratinis pasaulis, kuriame gali viską. Pradedi „tik pasistatysiu namelį", atsipeikėji po penkių valandų kasykloje.',
  },
]

export default function Games() {
  return (
    <section id="zaidimai">
      <p className="eyebrow"><span className="jp">ゲーム</span> · Arsenalas</p>
      <h2 className="display">Ką <mark>žaidžiu</mark></h2>
      <p className="section-intro">Keturi žaidimai, prie kurių „dar penkios minutės" virsta valandomis.</p>
      <div className="games">
        {games.map((game) => (
          <div className="panel game" key={game.title}>
            <div className="glyph" style={{ '--g': game.color }}>{game.glyph}</div>
            <div>
              <h3>{game.title}</h3>
              <p>{game.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
