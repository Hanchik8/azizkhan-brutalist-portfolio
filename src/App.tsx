import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingNav from './components/FloatingNav'

export default function App() {
  return (
    <div className="noise-bg bg-background text-foreground">
      <Hero />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <FloatingNav />
    </div>
  )
}
