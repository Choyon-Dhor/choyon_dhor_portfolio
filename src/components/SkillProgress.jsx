import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// -------------------- Data --------------------
// Skill levels and tooltips based on your expertise
const skillCategories = [
  {
    title: 'Programming Languages',
    icon: '💻', 
    skills: [
      { name: 'C', level: 85, proficiency: 'Advanced', tooltip: 'Systems programming, data structures' },
      { name: 'C++', level: 88, proficiency: 'Advanced', tooltip: 'OOP, STL, competitive programming' },
      { name: 'Java', level: 80, proficiency: 'Proficient', tooltip: 'Android basics, OOP concepts' },
      { name: 'Python', level: 95, proficiency: 'Advanced', tooltip: 'ML, scripting, backend (Flask)' },
      { name: 'JavaScript', level: 92, proficiency: 'Advanced', tooltip: 'ES6+, DOM, async' },
    ],
  },
  {
    title: 'Web Development',
    icon: '🌐',
    skills: [
      { name: 'HTML', level: 95, proficiency: 'Advanced', tooltip: 'Semantic markup, accessibility' },
      { name: 'CSS', level: 92, proficiency: 'Advanced', tooltip: 'Flexbox, Grid, animations' },
      { name: 'Tailwind CSS', level: 90, proficiency: 'Intermediate', tooltip: 'Utility‑first, responsive' },
      { name: 'React', level: 88, proficiency: 'Intermediate', tooltip: 'Hooks, context, custom components' },
    ],
  },
  {
    title: 'Database & Backend',
    icon: '🗄️',
    skills: [
      { name: 'MySQL', level: 85, proficiency: 'Advanced', tooltip: 'Complex queries, joins, optimization' },
      { name: 'PHP', level: 80, proficiency: 'Proficient', tooltip: 'ACID, indexing, JSONB' },
    ],
  },
  {
    title: 'Machine Learning Foundations',
    icon: '🤖',
    skills: [
    
  { name: 'Scikit-learn', level: 88, proficiency: 'Advanced', tooltip: 'Classification, regression, pipelines, model tuning' },
  { name: 'NumPy', level: 80, proficiency: 'Intermediate', tooltip: 'Array operations, linear algebra, numerical computing' },
  { name: 'Pandas', level: 85, proficiency: 'Advanced', tooltip: 'Data cleaning, preprocessing, feature engineering' },
  { name: 'Matplotlib', level: 82, proficiency: 'Advanced', tooltip: 'Data visualization, plotting, performance analysis'},{ name: 'Model Evaluation', level: 88, proficiency: 'Advanced', tooltip: 'Cross-validation, metrics, hyperparameter tuning' }],
},
]


const stats = [
  { value: '5+', label: 'Programming Languages' },
  { value: '10+', label: 'Projects Built' },
  { value: '2+', label: 'ML Research Works' },
]

// -------------------- Subcomponents --------------------
const StatCard = ({ value, label }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg px-6 py-3 text-center"
    whileHover={{ scale: 1.05, borderColor: '#c084fc' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
      {value}
    </div>
    <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
  </motion.div>
)

const SkillBar = ({ skill, index, inView }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [count, setCount] = useState(0)

  // Animated counter
  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = skill.level
    const duration = 1500 // ms
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, skill.level])

  // Proficiency color mapping
  const proficiencyColor = {
    Advanced: 'text-purple-400',
    Proficient: 'text-blue-400',
    Intermediate: 'text-green-400',
  }

  return (
    <div
      className="relative mb-5"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-300">{skill.name}</span>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${proficiencyColor[skill.proficiency] || 'text-gray-400'}`}>
            {skill.proficiency}
          </span>
          <span className="text-purple-400 font-mono w-10 text-right">{count}%</span>
        </div>
      </div>

      {/* Progress bar track */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
        {/* Animated fill */}
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)',
            boxShadow: '0 0 8px #a855f7',
          }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${skill.level}%` : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: index * 0.1 }}
        >
          {/* Glowing orb at the end */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-purple-300 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
              boxShadow: ['0 0 4px #c084fc', '0 0 12px #a855f7', '0 0 4px #c084fc'],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Subtle shimmer overlay (animated) */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          style={{ pointerEvents: 'none' }}
        />
      </div>

      {/* Tooltip on hover */}
      {showTooltip && (
        <motion.div
          className="absolute -top-8 left-0 bg-gray-900 text-xs text-purple-300 px-2 py-1 rounded border border-purple-500/50 whitespace-nowrap z-20"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          {skill.tooltip}
        </motion.div>
      )}
    </div>
  )
}

const SkillCard = ({ category, inView, index }) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 relative overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Top-right glowing icon */}
      <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
        {category.icon}
      </div>

      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
        {category.title}
      </h3>

      <div>
        {category.skills.map((skill, i) => (
          <SkillBar key={skill.name} skill={skill} index={i} inView={inView} />
        ))}
      </div>
    </motion.div>
  )
}

// -------------------- Main Component --------------------
const SkillsExpertise = () => {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-28 overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#1e1b4b]"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Soft gradient wave */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 rounded-full blur-3xl" />

        {/* Vertical dividers (desktop) */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/3 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="hidden lg:block absolute top-0 bottom-0 left-2/3 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with hashtag and animated underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-purple-400 font-mono">#skills-expertise</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">
            Skills &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Expertise
            </span>
          </h1>
          <div className="relative inline-block">
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Technologies I use to build intelligent systems and scalable applications.
            </p>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {stats.map((stat, i) => (
            <StatCard key={i} value={stat.value} label={stat.label} />
          ))}
        </motion.div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {skillCategories.map((cat, idx) => (
            <SkillCard key={cat.title} category={cat} inView={inView} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsExpertise