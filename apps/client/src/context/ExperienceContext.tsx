import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type MotionIntensity = 'full' | 'minimal' | 'off';
type ThemeMode = 'nexus' | 'violet';
type ExplorationMilestone = 'research' | 'projects' | 'publication' | 'leadership' | 'logs' | 'game' | 'terminal';

interface ExperienceContextValue {
  bootVisible: boolean;
  dismissBoot: () => void;
  terminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  soundEnabled: boolean;
  toggleSound: () => boolean;
  motionIntensity: MotionIntensity;
  cycleMotion: () => MotionIntensity;
  lowPerformance: boolean;
  toggleLowPerformance: () => boolean;
  themeMode: ThemeMode;
  cycleTheme: () => ThemeMode;
  explored: ExplorationMilestone[];
  progress: number;
  track: (milestone: ExplorationMilestone) => void;
  reducedMotion: boolean;
}

const INTRO_KEY = 'nexus:intro-complete';
const SOUND_KEY = 'nexus:sound-enabled';
const MOTION_KEY = 'nexus:motion-intensity';
const PERFORMANCE_KEY = 'nexus:low-performance';
const THEME_KEY = 'nexus:theme-mode';
const EXPLORED_KEY = 'nexus:explored';
const milestones: ExplorationMilestone[] = ['research', 'projects', 'publication', 'leadership', 'logs', 'game', 'terminal'];

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function readBoolean(key: string, fallback: boolean) {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return value === null ? fallback : value === 'true';
}

function readString<T extends string>(key: string, fallback: T, allowed: readonly T[]) {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return value && allowed.includes(value as T) ? (value as T) : fallback;
}

function readMotionIntensity(): MotionIntensity {
  if (typeof window === 'undefined') return 'full';
  const value = window.localStorage.getItem(MOTION_KEY);
  if (value === 'full' || value === 'minimal' || value === 'off') return value;
  if (value === 'balanced') return 'minimal';
  return 'full';
}

function readExplored(): ExplorationMilestone[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(EXPLORED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return milestones.filter((item) => parsed.includes(item));
  } catch {
    return [];
  }
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [bootVisible, setBootVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.sessionStorage.getItem(INTRO_KEY) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => readBoolean(SOUND_KEY, false));
  const [motionIntensity, setMotionIntensity] = useState<MotionIntensity>(() => readMotionIntensity());
  const [lowPerformance, setLowPerformance] = useState(() => readBoolean(PERFORMANCE_KEY, false));
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => readString(THEME_KEY, 'nexus', ['nexus', 'violet']));
  const [explored, setExplored] = useState<ExplorationMilestone[]>(() => readExplored());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => setReducedMotion(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setBootVisible(false);
      if (typeof window !== 'undefined') window.sessionStorage.setItem(INTRO_KEY, 'true');
    }
  }, [reducedMotion]);

  const dismissBoot = useCallback(() => {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(INTRO_KEY, 'true');
    setBootVisible(false);
  }, []);

  const openTerminal = useCallback(() => {
    setTerminalOpen(true);
    setExplored((current) => {
      if (current.includes('terminal')) return current;
      const next: ExplorationMilestone[] = [...current, 'terminal'];
      window.localStorage.setItem(EXPLORED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const closeTerminal = useCallback(() => setTerminalOpen(false), []);
  const toggleTerminal = useCallback(() => setTerminalOpen((current) => !current), []);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(SOUND_KEY, String(next));
    return next;
  }, [soundEnabled]);

  const cycleMotion = useCallback(() => {
    const next: MotionIntensity = motionIntensity === 'full' ? 'minimal' : motionIntensity === 'minimal' ? 'off' : 'full';
    setMotionIntensity(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(MOTION_KEY, next);
    return next;
  }, [motionIntensity]);

  const toggleLowPerformance = useCallback(() => {
    const next = !lowPerformance;
    setLowPerformance(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(PERFORMANCE_KEY, String(next));
    return next;
  }, [lowPerformance]);

  const cycleTheme = useCallback(() => {
    const next: ThemeMode = themeMode === 'nexus' ? 'violet' : 'nexus';
    setThemeMode(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, next);
    return next;
  }, [themeMode]);

  const track = useCallback((milestone: ExplorationMilestone) => {
    setExplored((current) => {
      if (current.includes(milestone)) return current;
      const next: ExplorationMilestone[] = [...current, milestone];
      if (typeof window !== 'undefined') window.localStorage.setItem(EXPLORED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/research')) track('research');
    if (location.pathname.startsWith('/projects')) track('projects');
    if (location.pathname.startsWith('/publications')) track('publication');
    if (location.pathname.startsWith('/leadership') || location.pathname.startsWith('/events')) track('leadership');
    if (location.pathname.startsWith('/blog')) track('logs');
    if (location.pathname.startsWith('/game')) track('game');
  }, [location.pathname, track]);

  useEffect(() => {
    const motionScale = reducedMotion ? '0' : motionIntensity === 'full' ? '1' : motionIntensity === 'minimal' ? '0.45' : '0';
    document.documentElement.style.setProperty('--motion-scale', motionScale);
    document.documentElement.dataset.themeMode = themeMode;
    document.documentElement.dataset.performanceMode = lowPerformance ? 'low' : 'standard';
    document.documentElement.dataset.motionIntensity = reducedMotion ? 'off' : motionIntensity;
  }, [lowPerformance, motionIntensity, reducedMotion, themeMode]);

  const progress = useMemo(() => Math.round((explored.length / milestones.length) * 100), [explored]);

  const value = useMemo<ExperienceContextValue>(() => ({
    bootVisible,
    dismissBoot,
    terminalOpen,
    openTerminal,
    closeTerminal,
    toggleTerminal,
    soundEnabled,
    toggleSound,
    motionIntensity,
    cycleMotion,
    lowPerformance,
    toggleLowPerformance,
    themeMode,
    cycleTheme,
    explored,
    progress,
    track,
    reducedMotion
  }), [bootVisible, dismissBoot, terminalOpen, openTerminal, closeTerminal, toggleTerminal, soundEnabled, toggleSound, motionIntensity, cycleMotion, lowPerformance, toggleLowPerformance, themeMode, cycleTheme, explored, progress, track, reducedMotion]);

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error('useExperience must be used within ExperienceProvider');
  return context;
}
