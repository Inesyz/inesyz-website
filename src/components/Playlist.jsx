import { useState } from 'react'
import YtModal from './YtModal.jsx'

const tracks = [
  {
    n: '01',
    title: 'Unravel',
    meta: 'TK from Ling tosite sigure · Tokyo Ghoul',
    ytId: '7aMOurgDB-o',
  },
  {
    n: '02',
    title: 'The WORLD',
    meta: 'Nightmare · Death Note',
    ytId: 'lnVDIA0QIvY',
  },
  {
    n: '03',
    title: 'Otonoke',
    meta: 'Creepy Nuts · Dandadan',
    ytId: 'tRwHpyOq4P4',
  },
  {
    n: '04',
    title: 'Chaos ga Kiwamaru',
    meta: 'UNISON SQUARE GARDEN · Blue Lock',
    ytId: '5Iv3Fi8eb7w',
  },
  {
    n: '05',
    title: 'SPECIALZ',
    meta: 'King Gnu · Jujutsu Kaisen',
    ytId: 'fhzKLBZJC3w',
  },
]

export default function Playlist() {
  const [track, setTrack] = useState(null)

  return (
    <section id="muzika">
      <p className="eyebrow"><span className="jp">音楽</span> · Grojaraštis</p>
      <h2 className="display">Dainos, užstrigusios <mark>galvoje</mark></h2>
      <p className="section-intro">
        Geras anime baigiasi, o jo muzika lieka visam laikui. Mano amžinasis grojaraštis —
        paspausk ir klausyk čia pat:
      </p>
      <ol className="tracklist">
        {tracks.map((t) => (
          <li key={t.n}>
            <button onClick={() => setTrack(t)}>
              <span className="n mono">{t.n}</span>
              <span className="t">{t.title}</span>
              <span className="m">{t.meta}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="track-note">Pusę šių dainų tikriausiai rasi ir mano osu! beatmap'uose. ♪</p>

      {track && (
        <YtModal
          title={`${track.title} — ${track.meta}`}
          ytId={track.ytId}
          onClose={() => setTrack(null)}
        />
      )}
    </section>
  )
}
