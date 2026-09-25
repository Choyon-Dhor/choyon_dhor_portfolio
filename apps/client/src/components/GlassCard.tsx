import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function GlassCard({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.article
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -5 }}
    >
      {children}
    </motion.article>
  );
}
