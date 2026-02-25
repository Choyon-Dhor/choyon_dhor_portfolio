import { useMemo, useRef } from 'react'
import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion'

const NeuralBackground = () => {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Generate particle nodes with connections
  const { particles, connections } = useMemo(() => {
    const nodes = []
    const links = []
    const nodeCount = 18
    const connectionDistance = 120

    // Create nodes in a scattered pattern
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
      })
    }

    // Create connections between close nodes
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < connectionDistance / 10) {
          links.push({
            id: `${i}-${j}`,
            from: nodes[i],
            to: nodes[j],
            opacity: (1 - distance / (connectionDistance / 10)) * 0.15,
          })
        }
      }
    }

    return { particles: nodes, connections: links }
  }, [])

  // Parallax effect on mouse move
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    
    mouseX.set(x * 20)
    mouseY.set(y * 20)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="w-full h-full"
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <svg
          className="w-full h-full opacity-[0.06]"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Render connections first (behind nodes) */}
          {connections.map((conn) => (
            <motion.line
              key={conn.id}
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              stroke="rgba(168, 85, 247, 1)"
              strokeWidth="0.15"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [conn.opacity * 0.5, conn.opacity, conn.opacity * 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Render nodes */}
          {particles.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill="rgba(168, 85, 247, 0.8)"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}

export default NeuralBackground
