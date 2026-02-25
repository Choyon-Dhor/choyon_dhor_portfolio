import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToolTip = ({ children, label }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 
                       bg-slate-dark/95 border border-neon-purple/30 rounded-md
                       text-xs text-gray-200 whitespace-nowrap z-50 backdrop-blur-sm"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            {label}
            {/* Arrow */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 
                           border-4 border-transparent border-t-slate-dark" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// Keywords wrapper component for research content
export const Keyword = ({ children, term }) => {
  return (
    <ToolTip label={term}>
      <span className="text-neon-purple-light font-medium border-b border-neon-purple/30 
                     hover:border-neon-purple/60 transition-colors duration-200">
        {children}
      </span>
    </ToolTip>
  )
}

export default ToolTip
