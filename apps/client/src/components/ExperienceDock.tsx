import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Cpu, Gauge, Palette, SlidersHorizontal, Sparkles, TerminalSquare, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useExperience } from '../context/ExperienceContext';

const DOCK_OPEN_KEY = 'nexus:control-dock-open';
const DOCK_PANEL_ID = 'nexus-control-dock-panel';

function readDockOpenPreference() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DOCK_OPEN_KEY) === 'true';
}

export function ExperienceDock() {
  const {
    progress,
    soundEnabled,
    toggleSound,
    motionIntensity,
    cycleMotion,
    lowPerformance,
    toggleLowPerformance,
    themeMode,
    cycleTheme,
    openTerminal,
    reducedMotion
  } = useExperience();
  const [open, setOpen] = useState(() => readDockOpenPreference());
  const panelRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DOCK_OPEN_KEY, String(open));
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const motionLabel = motionIntensity === 'off' ? 'Off' : motionIntensity === 'minimal' ? 'Minimal' : 'Full';
  const effectsLabel = lowPerformance ? 'Reduced' : 'Full';
  const themeLabel = themeMode === 'nexus' ? 'Nexus' : 'Violet';

  return (
    <div className={`experience-dock-shell${open ? ' is-open' : ''}`}>
      <button
        ref={toggleRef}
        type="button"
        className="experience-dock-toggle-button"
        aria-controls={DOCK_PANEL_ID}
        aria-expanded={open}
        aria-label={open ? 'Collapse Nexus Controls' : 'Open Nexus Controls'}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="experience-dock-toggle__status" aria-hidden="true" />
        <SlidersHorizontal size={18} />
        <span className="experience-dock-toggle__meta">
          <strong>{progress}%</strong>
          <small>NEXUS CTRL</small>
        </span>
        <span className="experience-dock-toggle__chip">Online</span>
      </button>

      <AnimatePresence>
        {open && <>
          <motion.button
            type="button"
            className="experience-dock-backdrop"
            aria-label="Close Nexus Controls"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={reducedMotion ? {} : { opacity: 1 }}
            exit={reducedMotion ? {} : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            id={DOCK_PANEL_ID}
            ref={panelRef}
            className="experience-dock-panel"
            role="region"
            aria-label="Nexus Control Dock"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 14 }}
            animate={reducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? {} : { opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: reducedMotion ? 0 : 0.26, ease: 'easeOut' }}
          >
            <div className="experience-dock-panel__handle" aria-hidden="true" />
            <div className="experience-dock-panel__header">
              <div>
                <span>CONTROL DOCK</span>
                <strong>NEXUS Controls</strong>
              </div>
              <button type="button" className="experience-dock-panel__close" aria-label="Minimize Nexus Controls" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="experience-dock__progress">
              <div>
                <span>NEXUS EXPLORED</span>
                <strong>{progress}%</strong>
              </div>
              <div className="experience-dock__bar"><span style={{ width: `${progress}%` }} /></div>
            </div>

            <div className="experience-dock-panel__group">
              <button type="button" className="experience-toggle" onClick={toggleSound} aria-label="Toggle sound">
                {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
                <div className="experience-toggle__copy"><strong>Sound</strong><span>{soundEnabled ? 'On' : 'Off'}</span></div>
                <ChevronDown size={16} />
              </button>

              <button type="button" className="experience-toggle" onClick={cycleMotion} aria-label="Cycle motion mode">
                <Sparkles size={17} />
                <div className="experience-toggle__copy"><strong>Motion</strong><span>{motionLabel}</span></div>
                <ChevronDown size={16} />
              </button>

              <button type="button" className="experience-toggle" onClick={toggleLowPerformance} aria-label="Toggle effects intensity">
                <Cpu size={17} />
                <div className="experience-toggle__copy"><strong>Effects</strong><span>{effectsLabel}</span></div>
                <ChevronDown size={16} />
              </button>

              <button type="button" className="experience-toggle" onClick={cycleTheme} aria-label="Cycle theme mode">
                <Palette size={17} />
                <div className="experience-toggle__copy"><strong>Theme</strong><span>{themeLabel}</span></div>
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="experience-dock__status">
              <Gauge size={17} />
              <div className="experience-toggle__copy"><strong>System status</strong><span>Ready for exploration</span></div>
              <span className="experience-dock__status-pill">Stable</span>
            </div>

            <button type="button" className="experience-toggle experience-toggle--terminal" onClick={() => { openTerminal(); setOpen(false); }} aria-label="Open terminal shortcut">
              <TerminalSquare size={17} />
              <div className="experience-toggle__copy"><strong>Terminal shortcut</strong><span>Open command console</span></div>
              <kbd>Ctrl K</kbd>
            </button>
          </motion.aside>
        </>}
      </AnimatePresence>
    </div>
  );
}
