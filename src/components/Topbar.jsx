function toggleTheme() {
  const root = document.documentElement
  const current =
    root.dataset.theme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  root.dataset.theme = current === 'dark' ? 'light' : 'dark'
}

export default function Topbar() {
  return (
    <div className="topbar">
      <a className="brand" href="#virsus">✦ Inesyz<b>_0</b></a>
      <nav>
        <a href="#profilis">Profilis</a>
        <a href="#anime">Anime</a>
        <a href="#piesimas">Piešimas</a>
        <a href="#zaidimai">Žaidimai</a>
        <a href="#muzika">Muzika</a>
        <button className="theme-btn" onClick={toggleTheme} title="Perjungti šviesią / tamsią temą">🌓</button>
      </nav>
    </div>
  )
}
