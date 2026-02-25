import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import NeuralBackground from './about/NeuralBackground'
import ResearchTabs from './about/ResearchTabs'
import AcademicMetric from './about/AcademicMetric'
import InteractiveAvatar from './about/InteractiveAvatar'
import SystemStatus from './about/SystemStatus'

const About = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Section entrance animation
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      filter: 'blur(6px)',
      y: 40 
    },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  }

  return (
    <section id="about-me" className="relative py-28 overflow-hidden">
      {/* Neural Background Layer */}
      <NeuralBackground />

      {/* Background Effects - keeping existing subtle effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-neon-purple-dark/5 rounded-full blur-[80px]" />
      </div>

      {/* System Status Indicator */}
      <SystemStatus />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Entrance Animation */}
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="text-center mb-14"
        >
          <motion.div variants={itemVariants}>
            <span className="text-sm text-purple-400 font-mono">
              #about-me
            </span>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">
              Get to know{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Choyon
              </span>
            </h1>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="relative inline-block">
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                A Final year CSE student passionate about building intelligent systems.
              </p>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            {/* Introduction */}
            <motion.div variants={itemVariants} className="mb-6">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Hello, I'm <span className="text-neon-purple-light font-semibold">Choyon</span> — a Final year CSE student at Metropolitan University with a strong academic record.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <p className="text-gray-400 leading-relaxed">
                I'm passionate about building intelligent systems that solve real-world problems. My research focus lies at the intersection of machine learning and sustainable technology.
              </p>
            </motion.div>

            {/* Tab-Based Research Panels */}
            <motion.div variants={itemVariants} className="mb-8">
              <ResearchTabs />
            </motion.div>

            {/* Academic Metric */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mt-8">
              <AcademicMetric />
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Avatar */}
          <InteractiveAvatar />
        </div>
      </div>
    </section>
  )
}

export default About
