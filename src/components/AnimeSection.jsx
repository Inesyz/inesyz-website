import { useEffect, useRef, useState } from 'react'
import { animeList } from '../data/anime.js'

export default function AnimeSection() {
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)
  const [videoAnime, setVideoAnime] = useState(null)

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

  useEffect(() => {
    if (!videoAnime) return
    const onKey = (e) => {
      if (e.key === 'Escape') setVideoAnime(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [videoAnime])

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
            <h3>{anime.title}</h3>
            <p>{anime.blurb}</p>
            <button className="play" onClick={() => toggle(anime)}>
              {playingId === anime.id ? '⏸ Stabdyti' : '▶ Groti openingą'}
            </button>
          </article>
        ))}
      </div>

      {videoAnime && (
        <div className="yt-overlay" onClick={() => setVideoAnime(null)}>
          <div className="yt-box" onClick={(e) => e.stopPropagation()}>
            <div className="yt-head">
              <h3>♪ {videoAnime.opening}</h3>
              <button className="yt-close" onClick={() => setVideoAnime(null)} aria-label="Uždaryti">✕</button>
            </div>
            <div className="yt-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoAnime.ytId}?autoplay=1`}
                title={`${videoAnime.title} — openingas`}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
