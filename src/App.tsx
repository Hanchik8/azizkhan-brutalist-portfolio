import Hero from './components/Hero'
import Stats from './components/Stats'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import Architecture from './components/Architecture'
import ServerStatus from './components/ServerStatus'
import ApiPlayground from './components/ApiPlayground'
import ProjectADR from './components/ProjectADR'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingNav from './components/FloatingNav'

export default function App() {
  return (
    <div className="noise-bg bg-background text-foreground">
      <a href="#skills" className="skip-link">Skip to content</a>
      <Hero />
      <Stats />
      <Skills />
      <Projects />
      <Timeline />
      <Architecture />
      <ServerStatus />
      <ApiPlayground />
      <ProjectADR />
      <Contact />
      <Footer />
      <FloatingNav />
    </div>
  )
}
