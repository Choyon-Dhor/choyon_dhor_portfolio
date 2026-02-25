import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import aboutchoyon from '../../assets/about.jpeg'

const InteractiveAvatar = () => {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Mouse position tracking for 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])
  
  // Add spring for smooth tilt
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Glowing background circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-neon-purple/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Geometric decorations - Outer rotating ring */}
      <motion.div
        className="absolute -top-4 -right-4 w-24 h-24 border border-neon-purple/30 rounded-lg"
        style={{ rotate: 12 }}
        animate={{ rotate: [12, 372] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Second geometric shape - rotating ring */}
      <motion.div
        className="absolute -bottom-6 -left-6 w-32 h-32 border border-neon-purple-light/20 rounded-full"
        animate={{ rotate: [0, -360] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-neon-purple/40 rounded-tl-lg" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-purple/40 rounded-br-lg" />

      {/* Image container with glow ring */}
      <div className="relative z-10 flex justify-center">
        <div className="relative w-72 h-72 md:w-80 md:h-80">
          {/* Outer glow ring with pulse */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-neon-purple/30"
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.2)',
                '0 0 40px rgba(168, 85, 247, 0.4)',
                '0 0 20px rgba(168, 85, 247, 0.2)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border border-neon-purple-light/20" />

          <img
            src={aboutchoyon}
            alt="Choyon"
            className="w-full h-full object-cover rounded-full border-4 border-dark/50"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-deep-charcoal/30" />
        </div>
      </div>

      {/* Floating badge - shows on hover */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          x: isHovered ? 0 : 20,
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1] 
        }}
        className="absolute -right-4 md:right-8 top-1/4 glass-dark border border-neon-purple/30 px-4 py-2 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 bg-neon-purple rounded-full"
            animate={{ 
              opacity: [1, 0.4, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className="text-xs text-gray-300">Research Mode: Active</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default InteractiveAvatar
