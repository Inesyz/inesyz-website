const tracks = [
  {
    n: '01',
    title: 'Unravel',
    meta: 'TK from Ling tosite sigure · Tokyo Ghoul',
    href: 'https://www.youtube.com/results?search_query=tokyo+ghoul+unravel+tk',
  },
  {
    n: '02',
    title: 'The WORLD',
    meta: 'Nightmare · Death Note',
    href: 'https://www.youtube.com/results?search_query=death+note+the+world+nightmare',
  },
  {
    n: '03',
    title: 'Otonoke',
    meta: 'Creepy Nuts · Dandadan',
    href: 'https://www.youtube.com/results?search_query=dandadan+otonoke+creepy+nuts',
  },
  {
    n: '04',
    title: 'Chaos ga Kiwamaru',
    meta: 'UNISON SQUARE GARDEN · Blue Lock',
    href: 'https://www.youtube.com/results?search_query=blue+lock+chaos+ga+kiwamaru',
  },
  {
    n: '05',
    title: 'SPECIALZ',
    meta: 'King Gnu · Jujutsu Kaisen',
    href: 'https://www.youtube.com/results?search_query=jujutsu+kaisen+specialz+king+gnu',
  },
]

export default function Playlist() {
  return (
    <section id="muzika">
      <p className="eyebrow"><span className="jp">音楽</span> · Grojaraštis</p>
      <h2 className="display">Dainos, užstrigusios <mark>galvoje</mark></h2>
      <p className="section-intro">
        Geras anime baigiasi, o jo muzika lieka visam laikui. Mano amžinasis grojaraštis
        (paspaudus atsidarys YouTube):
      </p>
      <ol className="tracklist">
        {tracks.map((track) => (
          <li key={track.n}>
            <a href={track.href} target="_blank" rel="noopener noreferrer">
              <span className="n mono">{track.n}</span>
              <span className="t">{track.title}</span>
              <span className="m">{track.meta}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="track-note">Pusę šių dainų tikriausiai rasi ir mano osu! beatmap'uose. ♪</p>
    </section>
  )
}
