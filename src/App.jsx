import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LeftSocialBar from './components/LeftSocialBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Quote from './components/Quote'
import Projects from './components/Projects'
import Skills from './components/Skills'              // Original inline skills
import SkillsProgress from './components/SkillProgress' // Fixed filename
import About from './components/About'
import Activities from './components/Activities'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BlogHome from './components/BlogHome'
import AnimatedBar from './components/AnimatedBar'
import Separator from './components/Separator'

// Page components (now from pages folder)
import ProjectsPage from './ProjectsPage'
import ActivitiesPage from './components/ActivitiesPage'
import BlogPage from './components/BlogPage'
import BlogPostPage from './components/BlogPostPage'

function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <Separator />
        <Quote />
        <Separator />
        <Projects />
        <Separator />
        {/* If you want both skills sections, keep both; otherwise remove one */}
        {/*<Skills /> */}
        <SkillsProgress />
        <Separator />
        <About />
        <Separator />
        <Activities />
        <Separator />
        <BlogHome />
        <Separator />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
    <LeftSocialBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App