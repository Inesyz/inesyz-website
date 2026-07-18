const PETALS = [
  { x: '8vw', d: '17s', delay: '-3s', s: 0.85 },
  { x: '26vw', d: '21s', delay: '-11s', s: 0.7 },
  { x: '52vw', d: '15s', delay: '-6s', s: 1 },
  { x: '71vw', d: '23s', delay: '-15s', s: 0.6 },
  { x: '88vw', d: '19s', delay: '-9s', s: 0.8 },
]

export default function Sakura() {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <g id="skr-flower">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse
                key={r}
                cx="0"
                cy="-19"
                rx="10.5"
                ry="16"
                fill="var(--skr-petal)"
                stroke="var(--line)"
                strokeWidth="2"
                transform={`rotate(${r})`}
              />
            ))}
            <circle r="6.5" fill="var(--skr-core)" stroke="var(--line)" strokeWidth="2" />
          </g>
          <g id="skr-petal-s">
            <ellipse rx="5.5" ry="9" fill="var(--skr-petal)" stroke="var(--line)" strokeWidth="1.8" />
          </g>
        </defs>
      </svg>

      <div className="sakura tl" aria-hidden="true">
        <svg viewBox="0 0 200 200" width="180" height="180">
          <use href="#skr-flower" transform="translate(46 48) scale(1.2) rotate(-12)" />
          <use href="#skr-flower" transform="translate(128 34) scale(.8) rotate(24)" />
          <use href="#skr-flower" transform="translate(48 132) scale(.72) rotate(48)" />
          <use href="#skr-petal-s" transform="translate(150 96) rotate(35)" />
          <use href="#skr-petal-s" transform="translate(102 168) rotate(-25)" />
        </svg>
      </div>
      <div className="sakura tr" aria-hidden="true">
        <svg viewBox="0 0 200 200" width="180" height="180">
          <use href="#skr-flower" transform="translate(46 48) scale(1.1) rotate(10)" />
          <use href="#skr-flower" transform="translate(126 40) scale(.75) rotate(-18)" />
          <use href="#skr-petal-s" transform="translate(60 130) rotate(50)" />
          <use href="#skr-petal-s" transform="translate(140 110) rotate(-40)" />
        </svg>
      </div>
      <div className="sakura bl" aria-hidden="true">
        <svg viewBox="0 0 200 200" width="170" height="170">
          <use href="#skr-flower" transform="translate(48 50) scale(1.05) rotate(16)" />
          <use href="#skr-flower" transform="translate(122 44) scale(.7) rotate(-30)" />
          <use href="#skr-petal-s" transform="translate(66 132) rotate(-45)" />
          <use href="#skr-petal-s" transform="translate(144 104) rotate(30)" />
        </svg>
      </div>
      <div className="sakura br" aria-hidden="true">
        <svg viewBox="0 0 200 200" width="180" height="180">
          <use href="#skr-flower" transform="translate(46 48) scale(1.18) rotate(-8)" />
          <use href="#skr-flower" transform="translate(128 36) scale(.78) rotate(30)" />
          <use href="#skr-flower" transform="translate(50 130) scale(.68) rotate(-40)" />
          <use href="#skr-petal-s" transform="translate(148 100) rotate(-30)" />
        </svg>
      </div>

      {PETALS.map((p, i) => (
        <i
          key={i}
          className="fall"
          aria-hidden="true"
          style={{ '--x': p.x, '--d': p.d, '--delay': p.delay, '--s': p.s }}
        />
      ))}
    </>
  )
}
