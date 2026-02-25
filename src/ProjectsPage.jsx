import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Project data – expanded with more ML-focused projects
const projectsData = {
  completeApps: [
    {
      title: 'Portfolio Website',
    tech: ['React', 'Tailwind'],
    description: 'Fully responsive personal portfolio website.',
      links: { live: '#', github: '#' },
    },
    {
      title: 'Freelancing Website for DBMS Course project',
    tech: ['HTML', 'CSS', 'PHP', 'MYSQL'],
    description: 'FreelanceHub - A complete freelance marketplace web application connecting clients with freelancers for job posting and project management',
      links: { live: '#', github: 'https://github.com/Choyon-Dhor/Project-Freelancing_Portal' },
    },
    {
       title: 'Hand Written Digit Recognition using CNN',
    tech: ['Python', 'ML'],
    description: 'Deep Learning-based Handwritten Digit Recognition using Convolutional Neural Networks (CNN) on MNIST Dataset with performance evaluation and visualization.',
      links: { live: '#', github: 'https://github.com/Choyon-Dhor/handwritten-digit-recognition-cnn' },
    },
    {
      ttitle: 'Loan Approval Prediction & Churn Prediction',
    tech: ['Python', 'Scikit-learn'],
    description: 'Decision Tree classifier for financial approval prediction.',
      links: { live: '#', github: 'https://github.com/Choyon-Dhor/ml-algorithm-implementations/blob/main/supervised-learning/Decision-tree-classification.ipynb' },
    },
  ],
  smallProjects: [
    {
      title: 'Bot Boilerplate',
      description: 'Start creating scalable discord.js bot with TypeScript in seconds.',
      tech: ['Discord.js', 'TypeScript'],
      links: { github: '#' },
    },
    {
      title: 'My Blog',
      description: 'Front-end of my future blog website written in Vue.js.',
      tech: ['Vue.js', 'CSS', 'JavaScript'],
      links: { github: '#' },
    },
    {
      title: 'Chess Pro',
      description: 'Figma landing page about service for viewing chess tournaments.',
      tech: ['Figma', 'UI/UX'],
      links: { github: '#' },
    },
    {
      title: 'URL Shortener',
      description: 'Simple link shortener with authentication.',
      tech: ['Python', 'Quart', 'HTML'],
      links: { live: '#' },
    },
  ],
}

// Project Card Component (reusable)
const ProjectCard = ({ project, idx, showLive = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: idx * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="project-card rounded-xl p-6 flex flex-col"
    >
      {/* Project Title */}
      <h3 className="text-xl font-semibold project-title mb-3">
        {project.title}
      </h3>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech, techIdx) => (
          <span key={techIdx} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6">
        {project.description}
      </p>

      {/* Buttons */}
      <div className="flex gap-3 mt-auto">
        {showLive && project.links?.live && (
          <a 
            href={project.links.live} 
            className="btn-primary"
          >
            Live <span className="arrow">→</span>
          </a>
        )}
        {project.links?.github && (
          <a 
            href={project.links.github} 
            className="btn-secondary"
          >
            GitHub <span className="arrow">→</span>
          </a>
        )}
        {project.links?.cached && (
          <a 
            href={project.links.cached} 
            className="btn-secondary"
          >
            Cached <span className="arrow">→</span>
          </a>
        )}
      </div>
    </motion.div>
  )
}

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-deep-charcoal text-gray-200">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative projects-section-bg">
        <div className="relative z-10">
          
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Projects
            </h1>
            <p className="text-gray-400 text-lg">
              Complete collection of technical and research-based projects.
            </p>
          </motion.div>

          {/* Complete Apps / Research Projects */}
          <section className="mb-20">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-header text-2xl md:text-3xl font-semibold text-white mb-8"
            >
              Projects & Research Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData.completeApps.map((project, idx) => (
                <ProjectCard 
                  key={idx} 
                  project={project} 
                  idx={idx}
                  showLive={true}
                />
              ))}
            </div>
          </section>

          {/* Small Projects */}
          <section className="mb-16">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-header text-2xl md:text-3xl font-semibold text-white mb-8"
            >
              Small Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData.smallProjects.map((project, idx) => (
                <ProjectCard 
                  key={idx} 
                  project={project} 
                  idx={idx}
                  showLive={false}
                />
              ))}
            </div>
          </section>

          {/* Back to Home */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-12"
          >
            <Link 
              to="/" 
              className="view-all-link text-base font-medium inline-flex items-center gap-2"
            >
              ← Back to Home <span className="arrow"></span>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProjectsPage
