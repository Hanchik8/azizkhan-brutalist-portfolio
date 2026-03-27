import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingNav from './components/FloatingNav'

function App() {
  return (
    <div className="noise-bg">
      <Hero />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <FloatingNav />
    </div>
  )
}

export default App
