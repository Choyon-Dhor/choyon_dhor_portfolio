import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyword } from './ToolTip'

const ResearchTabs = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { id: 'research', label: 'Research Focus' },
    { id: 'technical', label: 'Technical Foundation' },
    { id: 'leadership', label: 'Leadership & Impact' },
  ]

  const tabContent = [
    {
      title: 'Research Focus',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            My research lies at the intersection of{' '}
            <Keyword term="Machine Learning systems for real-world applications">
              Machine Learning
            </Keyword>
            {' '}and sustainable technology. I focus on building intelligent systems that operate under uncertainty—where{' '}
            <Keyword term="Mathematical optimization under constraints">
              Optimization
            </Keyword>
            {' '}, statistical reasoning, and algorithmic efficiency intersect.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Current direction centers on interpretable ML for{' '}
            <Keyword term="Green computing and sustainable infrastructure">
              Sustainability
            </Keyword>
            {' '}infrastructure and uncertainty quantification in time-series forecasting for real-world deployment.
          </p>
          <div className="mt-4 pt-4 border-t border-neon-purple/10">
            <h4 className="text-sm font-mono text-neon-purple-light mb-3">Active Research Areas</h4>
            <div className="flex flex-wrap gap-2">
              {['Interpretable ML', 'Energy Infrastructure', 'Uncertainty Quantification', 'Time-Series Analysis'].map((item, idx) => (
                <span key={idx} className="px-3 py-1 text-xs bg-gradient-to-r from-neon-purple/20 to-neon-purple-dark/20 border border-neon-purple/30 rounded-full text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Technical Foundation',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Strong theoretical grounding in computer science fundamentals with practical{' '}
            <Keyword term="Problem-solving and system design">Optimization</Keyword>
            {' '}skills. Expertise in building scalable systems and deploying{' '}
            <Keyword term="End-to-end ML pipelines">ML models</Keyword>
            {' '}in production environments.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Approach problems from a systems discipline perspective: modeling constraints, validating assumptions, and evaluating performance beyond benchmark metrics.
          </p>
          <div className="mt-4 pt-4 border-t border-neon-purple/10">
            <h4 className="text-sm font-mono text-neon-purple-light mb-3">Core Competencies</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Data Structures', 'Algorithms', 'System Design', 'Database Design', 'API Development', 'Cloud Infrastructure'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-neon-purple to-neon-purple-dark rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Leadership & Impact',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Beyond technical work, I've led high-responsibility initiatives including organizing a national-level university festival as Cultural Secretary of the CSE Society and coordinating multiple technical workshops in collaboration with industry partners.
          </p>
          <p className="text-gray-300 leading-relaxed">
            These roles strengthened my ability to manage complex{' '}
            <Keyword term="Project and team coordination">Logistics</Keyword>
            {' '}, coordinate technical teams, and deliver structured outcomes under constraints.
          </p>
          <div className="mt-4 pt-4 border-t border-neon-purple/10">
            <h4 className="text-sm font-mono text-neon-purple-light mb-3">Leadership Experience</h4>
            <div className="space-y-3">
              {[
                { role: 'Cultural Secretary', org: 'CSE Society, Metropolitan University' },
                { role: 'Technical Coordinator', org: 'Bdapps Workshop Series' },
                { role: 'Volunteer', org: 'Flood & Disaster Response Initiative' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-1.5 bg-gradient-to-r from-neon-purple to-neon-purple-dark/60 rounded-full flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-200">{item.role}</div>
                    <div className="text-xs text-gray-500">{item.org}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-neon-purple/20">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(idx)}
            className="relative px-4 py-3 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50 group"
          >
            {/* Gradient background on hover/active */}
            <div className={`absolute inset-0 rounded-t-md transition-all duration-300 ${
              activeTab === idx 
                ? 'bg-gradient-to-r from-neon-purple/20 via-neon-purple/10 to-neon-purple-dark/20 opacity-100' 
                : 'opacity-0 group-hover:opacity-50 bg-gradient-to-r from-neon-purple/10 via-transparent to-neon-purple-dark/10'
            }`} />
            
            <span className={`relative z-10 ${activeTab === idx ? 'text-gray-100' : 'text-gray-500 group-hover:text-gray-300'}`}>
              {tab.label}
            </span>
            
            {/* Active Tab Indicator with gradient */}
            {activeTab === idx && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-purple-light via-neon-purple to-neon-purple-dark"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            
            {/* Subtle border glow when active with gradient accent */}
            {activeTab === idx && (
              <div 
                className="absolute inset-0 border border-neon-purple/30 rounded-t-md -z-10" 
                style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.25), inset 0 0 30px rgba(168, 85, 247, 0.05)' }} 
              />
            )}
            
            {/* Animated dot indicator */}
            <motion.span
              className={`absolute top-1/2 -translate-y-1/2 -right-1 w-1.5 h-1.5 rounded-full ${
                activeTab === idx ? 'bg-neon-purple' : 'bg-transparent'
              }`}
              animate={activeTab === idx ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {tabContent[activeTab].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ResearchTabs
