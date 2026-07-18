import { useRef, useState } from 'react'
import { animeList } from '../data/anime.js'
import CharactersModal from './CharactersModal.jsx'
import YtModal from './YtModal.jsx'

const statusLabels = {
  watching: 'Žiūriu dabar',
  done: 'Baigta',
  planned: 'Plane',
}

export default function AnimeSection() {
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)
  const [videoAnime, setVideoAnime] = useState(null)
  const [charsAnime, setCharsAnime] = useState(null)
  const charsTriggerRef = useRef(null)

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
    // Pirmiausia bandome groti vietinį mp3 iš public/music/;
    // jei failo nėra — atidarome YouTube grotuvą pačiame puslapyje
    const audio = new Audio(`${import.meta.env.BASE_URL}music/${anime.id}.mp3`)
    let fellBack = false
    const fallback = () => {
      if (fellBack) return
      fellBack = true
      stop()
      setVideoAnime(anime)
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
        openingas. ♪
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
            <h3>
              <button
                className="title-btn"
                onClick={(event) => {
                  charsTriggerRef.current = event.currentTarget
                  setCharsAnime(anime)
                }}
                title="Rodyti pagrindinius veikėjus"
              >
                {anime.title}
              </button>
            </h3>
            <div className="card-meta">
              {anime.rating != null && (
                <span className="rating" aria-label={`Įvertinimas: ${anime.rating} iš 10`}>
                  <span className="stars" aria-hidden="true">
                    ★★★★★
                    <span className="stars-fill" style={{ width: `${anime.rating * 10}%` }}>★★★★★</span>
                  </span>
                  <span className="score mono">{anime.rating}/10</span>
                </span>
              )}
              <span className={`status status-${anime.status}`}>{statusLabels[anime.status]}</span>
            </div>
            <p>{anime.blurb}</p>
            <button className="play" onClick={() => toggle(anime)}>
              {playingId === anime.id ? '⏸ Stabdyti' : '▶ Groti openingą'}
            </button>
          </article>
        ))}
      </div>

      {videoAnime && (
        <YtModal
          title={videoAnime.opening}
          ytId={videoAnime.ytId}
          onClose={() => setVideoAnime(null)}
        />
      )}
      {charsAnime && (
        <CharactersModal
          anime={charsAnime}
          onClose={() => setCharsAnime(null)}
          returnFocusRef={charsTriggerRef}
        />
      )}
    </section>
  )
}
