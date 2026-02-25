import { motion } from 'framer-motion'

const Quote = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto quote-glass rounded-xl p-8 md:p-12 relative"
        >
          {/* Large quotation marks */}
          <span className="absolute top-4 left-6 text-8xl text-neon-purple/10 font-serif select-none">
            "
          </span>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-center relative z-10 text-white leading-relaxed"
          >
            Code is not just syntax. It is structured thinking.
          </motion.p>
          <span className="absolute bottom-4 right-6 text-8xl text-neon-purple/10 font-serif select-none">
            "
          </span>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-6 text-neon-purple-light font-medium"
          >
            — Choyon Dhor
          </motion.p>
          
        </motion.div>
      </div>
    </section>
  )
}

export default Quote
