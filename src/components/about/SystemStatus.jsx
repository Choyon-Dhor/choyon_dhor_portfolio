import { motion } from 'framer-motion'

const SystemStatus = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="absolute top-0 right-0 glass-dark border border-neon-purple/20 px-3 py-2 rounded-md"
    >
      <div className="flex items-center gap-2">
        {/* Blinking dot */}
        <motion.span
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{
            opacity: [1, 0.4, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Status text */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
            System Status
          </span>
          <span className="text-xs text-neon-purple-light font-mono">
            AI Research Mode: Active
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default SystemStatus
