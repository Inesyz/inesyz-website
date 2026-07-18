import { useEffect, useRef, useState } from 'react'
import { characterBios } from '../data/characters.js'

const CACHE_PREFIX = 'inesyz-chars-'

function prettyName(malName) {
  const [surname, ...givenNames] = malName.split(',')
  return givenNames.length ? `${givenNames.join(',').trim()} ${surname.trim()}` : malName
}

export default function CharactersModal({ anime, onClose }) {
  const [status, setStatus] = useState('loading')
  const [chars, setChars] = useState([])
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let alive = true
    const bios = characterBios[anime.id] || []
    const fallback = bios.map((bio) => ({
      key: bio.name,
      name: prettyName(bio.name),
      image: null,
      bio: bio.bio,
    }))

    async function loadCharacters() {
      try {
        const cached = sessionStorage.getItem(`${CACHE_PREFIX}${anime.id}`)
        if (cached) {
          const cachedChars = JSON.parse(cached)
          if (!Array.isArray(cachedChars)) throw new Error('Sugadintas veikėjų podėlis')
          if (alive) {
            setChars(cachedChars)
            setStatus('ok')
          }
          return
        }

        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime.malId}/characters`)
        if (!response.ok) throw new Error('Nepavyko gauti veikėjų')

        const payload = await response.json()
        const mainCharacters = (payload.data || [])
          .filter(({ role }) => role === 'Main')
          .sort((a, b) => (b.favorites || 0) - (a.favorites || 0))
          .slice(0, 6)
          .map(({ character }) => {
            const bio = bios.find((entry) => entry.malId === character.mal_id || entry.name === character.name)
            return {
              key: character.mal_id,
              name: prettyName(character.name),
              image: character.images?.webp?.image_url || character.images?.jpg?.image_url || null,
              bio: bio?.bio,
            }
          })
        if (!mainCharacters.length) throw new Error('Nerasta pagrindinių veikėjų')

        sessionStorage.setItem(`${CACHE_PREFIX}${anime.id}`, JSON.stringify(mainCharacters))
        if (alive) {
          setChars(mainCharacters)
          setStatus('ok')
        }
      } catch {
        if (alive) {
          setChars(fallback)
          setStatus('offline')
        }
      }
    }

    loadCharacters()
    return () => {
      alive = false
    }
  }, [anime])

  return (
    <div className="yt-overlay" onClick={onClose}>
      <div
        className="chars-box"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label={`${anime.title} veikėjai`}
        style={{ '--a': anime.color }}
      >
        <div className="yt-head">
          <h3>{anime.title} veikėjai</h3>
          <button ref={closeRef} className="yt-close" onClick={onClose} aria-label="Uždaryti">✕</button>
        </div>
        {status === 'loading' && <p className="chars-note">👻 Šmėkliukė ieško veikėjų...</p>}
        {status === 'offline' && (
          <p className="chars-note">👻 Nepavyko pasiekti veikėjų archyvo — rodau, ką prisimenu pati.</p>
        )}
        {status !== 'loading' && (
          <ul className="char-grid">
            {chars.map((character) => (
              <li className="char-item" key={character.key}>
                {character.image ? (
                  <img src={character.image} alt="" loading="lazy" />
                ) : (
                  <span className="char-init" aria-hidden="true">{character.name.charAt(0)}</span>
                )}
                <div>
                  <h4>{character.name}</h4>
                  {character.bio && <p>{character.bio}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
