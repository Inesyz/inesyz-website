import { useEffect } from 'react'

// Bendras YouTube grotuvo langelis mangos stiliumi — naudojamas
// ir anime kortelėse, ir muzikos grojaraštyje
export default function YtModal({ title, ytId, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="yt-overlay" onClick={onClose}>
      <div className="yt-box" onClick={(e) => e.stopPropagation()}>
        <div className="yt-head">
          <h3>♪ {title}</h3>
          <button className="yt-close" onClick={onClose} aria-label="Uždaryti">✕</button>
        </div>
        <div className="yt-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`}
            title={title}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
