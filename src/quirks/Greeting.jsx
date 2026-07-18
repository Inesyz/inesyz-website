// Pasisveikinimas pagal paros laiką — vietoj statinio „Sveiki atvykę".
const GREETINGS = [
  { from: 5, to: 11, jp: 'おはよう', lt: 'Labas rytas ☀️' },
  { from: 11, to: 17, jp: 'こんにちは', lt: 'Laba diena' },
  { from: 17, to: 22, jp: 'こんばんは', lt: 'Labas vakaras' },
  { from: 22, to: 24, jp: 'おやすみ', lt: 'Labanakt 🌙' },
  { from: 0, to: 5, jp: 'おやすみ', lt: 'Labanakt 🌙' },
]

export default function Greeting() {
  const h = new Date().getHours()
  const g = GREETINGS.find((x) => h >= x.from && h < x.to)
  return (
    <p className="eyebrow">
      <span className="jp">{g.jp}</span> · {g.lt}
    </p>
  )
}
