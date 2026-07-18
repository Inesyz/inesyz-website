import { useState } from 'react'
import { quotes } from '../data/quotes.js'

// Kaskart įkėlus puslapį — vis kita citata.
export default function RandomQuote() {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])
  return (
    <p className="footer-quote">
      „{quote.text}“ <span className="footer-quote-src">— {quote.anime}</span>
    </p>
  )
}


