import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'about-me', label: 'About' },
  { id: 'activities', label: 'Activities', path: '/activities' },
  { id: 'blog', label: 'Blog', path: '/blog' },
  { id: 'contacts', label: 'Contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  const handleNavClick = (item) => {
    setIsOpen(false)
    if (item.path) {
      navigate(item.path)
    } else {
      if (location.pathname === '/') {
        const element = document.getElementById(item.id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        navigate(`/#${item.id}`)
      }
    }
  }

  const isActive = (item) => {
    if (item.path) {
      return location.pathname === item.path
    }
    if (location.pathname === '/') {
      return location.hash === `#${item.id}`
    }
    return false
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-deep-charcoal/90 backdrop-blur-xl shadow-lg shadow-neon-purple/5 py-2'
            : 'bg-deep-charcoal/70 backdrop-blur-md py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-neon-purple-light group-hover:to-neon-purple transition-all duration-300">
                  Choyon
                </span>
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-purple-light" />
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                item.path ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`nav-link relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                      isActive(item)
                        ? 'text-neon-purple-light'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                    {isActive(item) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-neon-purple-light to-neon-purple rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`nav-link relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                      isActive(item)
                        ? 'text-neon-purple-light'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive(item) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-neon-purple-light to-neon-purple rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-300 hover:text-neon-purple-light transition-colors"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple-light to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ width: '50%' }}
          />
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-deep-charcoal/95 backdrop-blur-xl z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-dark-blue/80 backdrop-blur-2xl border-l border-neon-purple/20 z-50"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-neon-purple-dark/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 flex flex-col h-full pt-24 px-8">
                <div className="flex items-center gap-2 mb-12">
                  <span className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Choyon
                    </span>
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-purple-light" />
                  </span>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' }}
                    >
                      {item.path ? (
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`group flex items-center justify-between py-4 px-4 text-lg font-medium tracking-wide transition-all duration-300 ${
                            isActive(item) ? 'text-neon-purple-light' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive(item) && (
                            <span className="w-2 h-2 bg-neon-purple-light rounded-full animate-pulse" />
                          )}
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleNavClick(item)}
                          className={`group flex items-center justify-between py-4 px-4 text-lg font-medium tracking-wide transition-all duration-300 w-full text-left ${
                            isActive(item) ? 'text-neon-purple-light' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive(item) && (
                            <span className="w-2 h-2 bg-neon-purple-light rounded-full animate-pulse" />
                          )}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
