import { useEffect, useRef, useState } from 'react'
import { characterBios } from '../data/characters.js'

const CACHE_PREFIX = 'inesyz-chars-'

function prettyName(malName) {
  const [surname, ...givenNames] = malName.split(',')
  return givenNames.length ? `${givenNames.join(',').trim()} ${surname.trim()}` : malName
}

function isValidCachedCharacters(cachedChars) {
  return Array.isArray(cachedChars) && cachedChars.length > 0 && cachedChars.every((character) => (
    character
    && typeof character === 'object'
    && (typeof character.key === 'string' || typeof character.key === 'number')
    && typeof character.name === 'string'
    && character.name.trim()
    && (character.image === null || typeof character.image === 'string')
    && (!Object.hasOwn(character, 'bio') || character.bio === null || typeof character.bio === 'string')
  ))
}

function matchesBio(character, bio) {
  return (
    (bio.malId != null && String(character.key) === String(bio.malId))
    || character.name === prettyName(bio.name)
  )
}

// Jikan ne visus svarbius veikėjus pažymi role="Main". Todėl API sąrašą
// papildome vietinėmis biografijomis, kurioms API negrąžino kortelės.
function mergeCharactersWithBios(characters, bios) {
  const refreshed = characters.map((character) => {
    const bio = bios.find((entry) => matchesBio(character, entry))
    return { ...character, bio: bio?.bio ?? character.bio ?? null }
  })
  const missingLocalCharacters = bios
    .filter((bio) => !refreshed.some((character) => matchesBio(character, bio)))
    .map((bio) => ({
      key: bio.malId ?? `local-${bio.name}`,
      name: prettyName(bio.name),
      image: bio.image ?? null,
      bio: bio.bio,
    }))

  return [...refreshed, ...missingLocalCharacters]
}

export default function CharactersModal({ anime, onClose, returnFocusRef }) {
  const [status, setStatus] = useState('loading')
  const [chars, setChars] = useState([])
  const boxRef = useRef(null)
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(boxRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || [])
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!boxRef.current?.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus()
    }
  }, [returnFocusRef])

  useEffect(() => {
    let alive = true
    const bios = characterBios[anime.id] || []
    const fallback = bios.map((bio) => ({
      key: bio.name,
      name: prettyName(bio.name),
      image: bio.image ?? null,
      bio: bio.bio,
    }))

    async function loadCharacters() {
      let cached
      try {
        cached = sessionStorage.getItem(`${CACHE_PREFIX}${anime.id}`)
      } catch {
        cached = null
      }
      if (cached) {
        try {
          const cachedChars = JSON.parse(cached)
          if (!isValidCachedCharacters(cachedChars)) throw new Error('Sugadintas veikėjų podėlis')
          if (alive) {
            setChars(mergeCharactersWithBios(cachedChars, bios))
            setStatus('ok')
          }
          return
        } catch {
          if (alive) {
            setChars(fallback)
            setStatus('offline')
          }
          return
        }
      }

      try {
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

        try {
          sessionStorage.setItem(`${CACHE_PREFIX}${anime.id}`, JSON.stringify(mainCharacters))
        } catch {
          // Veikėjai rodomi ir tada, kai naršyklė neleidžia naudoti podėlio.
        }
        if (alive) {
          setChars(mergeCharactersWithBios(mainCharacters, bios))
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
        ref={boxRef}
        className="chars-box"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
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
