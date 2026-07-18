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
      <a className="brand" href="#virsus"><span className="brand-mark" aria-hidden="true"></span> Inesyz<b>_0</b></a>
      <nav>
        <a href="#profilis">Profilis</a>
        <a href="#anime">Anime</a>
        <a href="#piesimas">Piešimas</a>
        <a href="#zaidimai">Žaidimai</a>
        <a href="#muzika">Muzika</a>
        <button
          className="theme-btn"
          onClick={toggleSound}
          aria-pressed={muted}
          title={muted ? 'Įjungti garsiukus' : 'Išjungti garsiukus'}
        >
          {muted ? '🔕' : '🔔'}
        </button>
        <button className="theme-btn" onClick={toggleTheme} title="Perjungti šviesią / tamsią temą">🌓</button>
      </nav>
    </div>
  )
}
