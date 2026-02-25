import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Sample blog posts data
const blogPosts = [
  {
    slug: 'understanding-decision-trees',
    title: 'Understanding Decision Trees in Machine Learning',
    date: 'Feb 15, 2026',
    excerpt: 'A deep dive into how decision trees work, their advantages, and practical implementation with Scikit-learn.',
    tags: ['Machine Learning', 'Python', 'Tutorial'],
  },
  {
    slug: 'energy-load-forecasting',
    title: 'Short-Term Energy Load Forecasting: A Research Overview',
    date: 'Jan 28, 2026',
    excerpt: 'Exploring methods and challenges in predicting energy demand using time series and ML models.',
    tags: ['Research', 'Energy', 'Forecasting'],
  },
  {
    slug: 'css-grid-vs-flexbox',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    date: 'Dec 10, 2025',
    excerpt: 'A practical guide to choosing between Grid and Flexbox for modern web layouts.',
    tags: ['CSS', 'Web Development'],
  },
  {
    slug: 'getting-started-with-react',
    title: 'Getting Started with React and Vite',
    date: 'Nov 5, 2025',
    excerpt: 'Step-by-step tutorial to set up a React project with Vite and Tailwind CSS.',
    tags: ['React', 'JavaScript', 'Tutorial'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-deep-charcoal text-gray-200">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 hero-grid opacity-20" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="flex justify-start">
  <Link
    to="/"
    className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-purple-light transition-colors mb-8"
  >
    <span>←</span>
    <span>Back to Home</span>
  </Link>
</div>
            <br/>
            <span className="text-sm text-purple-400 font-mono">#blog</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">
              Thoughts &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Research
              </span>
            </h1>
            <div className="relative inline-block">
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Tutorials, research notes, and insights on machine learning, web development, and technology.
              </p>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="project-card group relative overflow-hidden"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent" />
              </div>

              <div className="relative p-6 md:p-8">
                {/* Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-3">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="project-title"
                  >
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tech-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read more link */}
                <Link
                  to={`/blog/${post.slug}`}
                  className="btn-primary group/btn"
                >
                  <span>Read more</span>
                  <span className="arrow">→</span>
                </Link>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple-light via-neon-purple to-neon-purple-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}

export default BlogPage
