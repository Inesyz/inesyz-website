import { useRef, useState } from 'react'
import { animeList } from '../data/anime.js'

export default function AnimeSection() {
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayingId(null)
  }

  function toggle(anime) {
    if (playingId === anime.id) {
      stop()
      return
    }
    stop()
    // Bandome groti vietinį mp3 iš public/music/; jei jo nėra — atidarome YouTube
    const audio = new Audio(`${import.meta.env.BASE_URL}music/${anime.id}.mp3`)
    let fellBack = false
    const fallback = () => {
      if (fellBack) return
      fellBack = true
      stop()
      window.open(anime.youtube, '_blank', 'noopener')
    }
    audio.onerror = fallback
    audio.onended = stop
    audio
      .play()
      .then(() => {
        audioRef.current = audio
        setPlayingId(anime.id)
      })
      .catch(fallback)
  }

  return (
    <section id="anime">
      <p className="eyebrow"><span className="jp">アニメ</span> · Kolekcija</p>
      <h2 className="display">Mano anime <mark>topas</mark></h2>
      <p className="section-intro">
        Šeši serialai, kurie mane užkabino labiausiai — nuo tamsių psichologinių trilerių
        iki futbolo beprotybės. <strong>Paspausk ant kortelės</strong> — pasigirs to anime
        openingas (jei mp3 dar neįkeltas, atsidarys YouTube). ♪
      </p>
      <div className="cards">
        {animeList.map((anime) => (
          <article
            key={anime.id}
            className={`card${playingId === anime.id ? ' playing' : ''}`}
            style={{ '--a': anime.color }}
          >
            <div className="card-top">
              <span className="jp">{anime.jp}</span>
              <span className="chip">{anime.genre}</span>
            </div>
            <h3>{anime.title}</h3>
            <p>{anime.blurb}</p>
            <button className="play" onClick={() => toggle(anime)}>
              {playingId === anime.id ? '⏸ Stabdyti' : '▶ Groti openingą'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
