import Sakura from './components/Sakura.jsx'
import ScrollReveal from './components/ScrollReveal.jsx'
import Topbar from './components/Topbar.jsx'
import Hero from './components/Hero.jsx'
import Profile from './components/Profile.jsx'
import AnimeSection from './components/AnimeSection.jsx'
import Drawings from './components/Drawings.jsx'
import Games from './components/Games.jsx'
import Playlist from './components/Playlist.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Sakura />
      <ScrollReveal />
      <Topbar />
      <Hero />
      <main>
        <Profile />
        <AnimeSection />
        <Drawings />
        <Games />
        <Playlist />
      </main>
      <Footer />
    </>
  )
}
