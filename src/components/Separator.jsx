import { motion } from 'framer-motion'

const AnimatedBar = () => {
  return (
    <motion.div
      className="w-1 h-2 bg-neon-purple rounded-full"
      animate={{ y: [0, 12, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export default AnimatedBar