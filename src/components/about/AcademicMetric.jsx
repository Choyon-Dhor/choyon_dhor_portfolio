import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion'

const AcademicMetric = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  
  // Animated count value
  const displayValue = useMotionValue(0)
  
  const springValue = useSpring(displayValue, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  })
  
  const roundedValue = useTransform(springValue, (latest) => latest.toFixed(2))
  
  // Progress percentage (3.96 out of 4.0 = 99%)
  const progressPercent = 99
  
  // Arc calculations for SVG
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = useTransform(
    useSpring(progressPercent, { stiffness: 100, damping: 30 }),
    [0, 100],
    [circumference, circumference * 0.01]
  )

  useEffect(() => {
    if (isInView) {
      displayValue.set(3.96)
    }
  }, [isInView, displayValue])

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center"
    >
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(168, 85, 247, 0.1)"
            strokeWidth="3"
          />
          
          {/* Progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * 0.01 }}
            transition={{ 
              duration: 2, 
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1] 
            }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>

        {/* Thin rotating arc */}
        <motion.div
          className="absolute inset-2"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius + 5}
              fill="none"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="0.5"
              strokeDasharray="4 8"
            />
          </svg>
        </motion.div>

        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-2xl font-bold text-white"
          >
            <motion.span
              className="neon-gradient-text"
            >
              {isInView ? '3.98' : '0.00'}
            </motion.span>
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <div className="text-xs font-mono text-neon-purple-light uppercase tracking-wider">
          Academic Performance
        </div>
        <div className="text-xs text-gray-500 mt-1">Index</div>
      </div>

      {/* Sub metrics */}
      <div className="flex gap-6 mt-4">
        <div className="text-center">
          <div className="text-sm font-semibold text-purple-300">Final</div>
          <div className="text-xs text-purple-500">Year</div>
        </div>
        <div className="w-px h-8 bg-neon-purple/20" />
        <div className="text-center">
          <div className="text-sm font-semibold text-purple-300">MU</div>
          <div className="text-xs text-purple-500">University</div>
        </div>
      </div>
    </div>
  )
}

export default AcademicMetric
