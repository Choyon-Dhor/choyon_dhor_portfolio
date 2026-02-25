import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Portfolio Website',
    tech: ['React', 'Tailwind'],
    description: 'Fully responsive personal portfolio website.',
    live: '#',
    github: '#',
  },
  
  {
    title: 'Freelancing Website for DBMS Course project',
    tech: ['HTML', 'CSS', 'PHP', 'MYSQL'],
    description: 'FreelanceHub - A complete freelance marketplace web application connecting clients with freelancers for job posting and project management',
    live: '#',
    github: 'https://github.com/Choyon-Dhor/Project-Freelancing_Portal',
  },
  {
    title: 'Hand Written Digit Recognition using CNN',
    tech: ['Python', 'ML'],
    description: 'Deep Learning-based Handwritten Digit Recognition using Convolutional Neural Networks (CNN) on MNIST Dataset with performance evaluation and visualization.',
    live: '#',
    github: 'https://github.com/Choyon-Dhor/handwritten-digit-recognition-cnn',
  },
  {
    title: 'Loan Approval Prediction & Churn Prediction',
    tech: ['Python', 'Scikit-learn'],
    description: 'Decision Tree classifier for financial approval prediction.',
    live: '#',
    github: 'https://github.com/Choyon-Dhor/ml-algorithm-implementations/blob/main/supervised-learning/Decision-tree-classification.ipynb',
  },
  
]

const Projects = () => {
  return (
    <section id="projects" className="py-24 relative projects-section-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-purple-400 font-mono">#projects</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Projects
            </span>
          </h1>
          <div className="relative inline-block">
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Selected works in machine learning and intelligent systems.
            </p>
            <motion.div 
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/projects" 
              className="view-all-link text-sm md:text-base font-medium inline-flex items-center gap-2"
            >
              View all <span className="arrow">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project, idx) => (
            <motion.div
              key={idx}
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
                {project.live && (
                  <a 
                    href={project.live} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Live <span className="arrow">→</span>
                  </a>
                )}
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    GitHub <span className="arrow">→</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects