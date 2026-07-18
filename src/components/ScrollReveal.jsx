import { useEffect } from 'react'

// Sekcijų „įplaukimo" animacija slenkant puslapį: kai sekcija pasirodo ekrane,
// jai pridedama .reveal-in klasė (stiliai — styles.css, skiltis „scroll reveal").
export default function ScrollReveal() {
  useEffect(() => {
    // Jei naudotojas nustatęs „sumažinti judesį" — animacijų visai nedarome
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const sections = document.querySelectorAll('main section')
    sections.forEach((el) => el.classList.add('reveal'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    sections.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
