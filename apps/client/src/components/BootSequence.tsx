import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperience } from '../context/ExperienceContext';

const lines = [
  'INITIALIZING CHOYON//NEXUS...',
  'Loading Research Profile...',
  'Connecting Publication Archive...',
  'Calibrating AI Laboratory...',
  'System Online.'
];

export function BootSequence() {
  const { bootVisible, dismissBoot, reducedMotion } = useExperience();

  useEffect(() => {
    if (!bootVisible || reducedMotion) return undefined;
    const timeout = window.setTimeout(dismissBoot, 2350);
    return () => window.clearTimeout(timeout);
  }, [bootVisible, dismissBoot, reducedMotion]);

  return (
    <AnimatePresence>
      {bootVisible && (
        <motion.div
          className="boot-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          aria-live="polite"
        >
          <div className="boot-overlay__scan" />
          <div className="boot-overlay__panel">
            <span className="boot-overlay__brand">N//</span>
            <div className="boot-sequence">
              {lines.map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.25 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <div className="boot-overlay__footer">
              <div>
                <strong>CHOYON DHOR</strong>
                <span>AI &amp; Machine Learning Research Aspirant</span>
              </div>
              <button className="button ghost" onClick={dismissBoot}>Skip Intro</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
