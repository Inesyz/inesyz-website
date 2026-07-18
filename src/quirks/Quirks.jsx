import { useEffect } from 'react'
import { countVisit } from './memory.js'

// Visų quirky dalykėlių agregatorius — vienintelis dalykas, kurį importuoja App.jsx.
// Vėlesni quirk'ai jungiami čia, kad pagrindinis kodas liktų švarus.
export default function Quirks() {
  useEffect(() => {
    countVisit()
  }, [])
  return null
}
