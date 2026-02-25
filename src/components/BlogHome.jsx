import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Sample recent blog posts – in a real project, you might import from a shared data file
const recentPosts = [
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

const BlogHome = () => {
  // Show only the first 3 posts
  const postsToShow = recentPosts.slice(0, 3)

  return (
    <section id="blog" className="py-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with "View all" link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-neon-purple-light tracking-widest uppercase">#blog</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            My <span className="neon-gradient-text">Blog</span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-neon-purple-light via-neon-purple to-neon-purple-dark mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Grid of blog cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {postsToShow.map((post, index) => (
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
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <span className="w-1.5 h-1.5 bg-neon-purple rounded-full" />
                  <span>{post.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="project-title"
                  >
                    {post.title}
                  </Link>
                </h3>

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
      </div>

      {/* Added purple animated line */}
      <motion.div 
        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </section>
  )
}

export default BlogHome