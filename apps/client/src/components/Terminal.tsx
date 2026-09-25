import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExperience } from '../context/ExperienceContext';
import { useSite } from '../context/SiteContext';

export function Terminal() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { settings, byType } = useSite();
  const {
    terminalOpen,
    openTerminal,
    closeTerminal,
    toggleSound,
    soundEnabled,
    cycleTheme,
    themeMode,
    motionIntensity,
    progress
  } = useExperience();

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Type "help" to inspect the available system commands.']);
  const [commandTrail, setCommandTrail] = useState<string[]>([]);
  const [trailIndex, setTrailIndex] = useState<number | null>(null);

  const prompt = useMemo(() => `${settings.heroTitle.toLowerCase().replace(/\s+/g, '-')}@nexus:~$`, [settings.heroTitle]);
  const featuredResearch = byType('research').find((item) => item.featured) ?? byType('research')[0];
  const featuredPublication = byType('publication').find((item) => item.featured) ?? byType('publication')[0];
  const futureMission = byType('timeline').slice(0, 3).map((item) => item.title).join(' -> ');
  const helpOutput = [
    'Core: help, about, research, projects, publications, leadership, activities, events, achievements, writing, timeline, contact, gallery',
    'Actions: download-cv, play-game, theme, motion, sound, clear',
    'Fun: whoami, why-ai, future-mission, sudo hire choyon, coffee, easter-egg, system-status'
  ];

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (terminalOpen) closeTerminal();
        else openTerminal();
      }
      if (event.key === 'Escape') closeTerminal();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [closeTerminal, openTerminal, terminalOpen]);

  useEffect(() => {
    if (!terminalOpen) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timeout);
  }, [terminalOpen]);

  const pushHistory = (raw: string, lines: string[]) => {
    setHistory((items) => [...items, `${prompt} ${raw}`, ...lines]);
    setCommandTrail((items) => [...items, raw]);
    setTrailIndex(null);
    setInput('');
  };

  const execute = (raw: string) => {
    const command = raw.trim();
    const normalized = command.toLowerCase();
    if (!normalized) return;

    if (normalized === 'clear') {
      setHistory([]);
      setInput('');
      setTrailIndex(null);
      return;
    }

    if (normalized === 'help') {
      pushHistory(command, helpOutput);
      return;
    }

    if (normalized === 'theme') {
      const nextTheme = cycleTheme();
      pushHistory(command, [`Theme switched to ${nextTheme === 'nexus' ? 'Nexus Laboratory' : 'Violet Archive'}.`]);
      return;
    }

    if (normalized === 'motion') {
      pushHistory(command, [`Motion profile is currently set to ${motionIntensity}. Change it from the Nexus Control Dock.`]);
      return;
    }

    if (normalized === 'sound') {
      const nextSound = toggleSound();
      pushHistory(command, [`Sound ${nextSound ? 'enabled' : 'muted'}.`]);
      return;
    }

    if (normalized === 'download-cv') {
      if (!settings.resumeUrl) {
        pushHistory(command, ['CV link not configured in the control room yet.']);
        return;
      }
      pushHistory(command, ['Opening CV in a new tab...']);
      window.open(settings.resumeUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const routeMap: Record<string, { output: string; path: string }> = {
      about: { output: 'Opening About page...', path: '/about' },
      research: { output: 'Routing to Research Hub...', path: '/research' },
      projects: { output: 'Routing to Project Garage...', path: '/projects' },
      publication: { output: 'Opening Publication Archive...', path: '/publications' },
      publications: { output: 'Opening Publication Archive...', path: '/publications' },
      leadership: { output: 'Opening Leadership Command...', path: '/leadership' },
      activities: { output: 'Opening Activities and Involvement...', path: '/activities' },
      events: { output: 'Entering Event Arena...', path: '/events' },
      achievements: { output: 'Opening Achievement Vault...', path: '/awards' },
      awards: { output: 'Opening Achievement Vault...', path: '/awards' },
      skills: { output: 'Opening Capability Evidence...', path: '/skills' },
      education: { output: 'Opening Academic Archive...', path: '/education' },
      writing: { output: 'Opening Research Logs...', path: '/blog' },
      blogs: { output: 'Opening Research Logs...', path: '/blog' },
      blog: { output: 'Opening Research Logs...', path: '/blog' },
      timeline: { output: 'Opening home mission map...', path: '/' },
      gallery: { output: 'Opening About photo story...', path: '/about' },
      contact: { output: 'Opening Contact Portal...', path: '/contact' },
      'play-game': { output: 'Launching Data Highway...', path: '/game' },
      game: { output: 'Launching Data Highway...', path: '/game' }
    };

    if (routeMap[normalized]) {
      const match = routeMap[normalized];
      pushHistory(command, [match.output]);
      window.setTimeout(() => {
        navigate(match.path);
        closeTerminal();
      }, 220);
      return;
    }

    const informational: Record<string, string[]> = {
      whoami: [
        `${settings.heroTitle} - ${settings.heroSubtitle}.`,
        settings.heroDescription
      ],
      'why-ai': [featuredResearch?.summary || 'Building context-aware AI systems for real-world reliability and human impact.'],
      'future-mission': [futureMission || 'Complete thesis -> expand research portfolio -> pursue graduate study.'],
      'sudo hire choyon': ['Permission granted. Opening collaboration mindset: research rigor, product craft, and leadership under pressure.'],
      coffee: ['Brewing systems fuel... research mode stabilized.'],
      'easter-egg': ['The lab remembers every curious visitor. Exploration progress is stored locally.'],
      'system-status': [
        `Theme: ${themeMode}`,
        `Sound: ${soundEnabled ? 'on' : 'off'}`,
        `Motion: ${motionIntensity}`,
        `Exploration: ${progress}%`,
        `Research modules: ${byType('research').length}`,
        `Project modules: ${byType('project').length}`,
        `Activity modules: ${byType('activity').length}`,
        `Publication modules: ${byType('publication').length}`,
        featuredPublication ? `Featured publication: ${featuredPublication.title}` : 'Featured publication: pending'
      ]
    };

    if (informational[normalized]) {
      pushHistory(command, informational[normalized]);
      return;
    }

    pushHistory(command, [`Command not found: ${normalized}. Try "help".`]);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commandTrail.length) return;
      const nextIndex = trailIndex === null ? commandTrail.length - 1 : Math.max(0, trailIndex - 1);
      setTrailIndex(nextIndex);
      setInput(commandTrail[nextIndex]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!commandTrail.length || trailIndex === null) return;
      const nextIndex = trailIndex + 1;
      if (nextIndex >= commandTrail.length) {
        setTrailIndex(null);
        setInput('');
        return;
      }
      setTrailIndex(nextIndex);
      setInput(commandTrail[nextIndex]);
    }
  };

  return <>
    <button className="terminal-trigger" onClick={openTerminal} aria-label="Open terminal"><TerminalIcon size={18} /><span>CTRL K</span></button>
    {terminalOpen && <div className="terminal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeTerminal(); }}>
      <div className="terminal-window">
        <div className="terminal-title"><span><i /> <i /> <i /></span><b>NEXUS TERMINAL</b><button onClick={closeTerminal}><X size={18} /></button></div>
        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          <p className="terminal-greeting">{settings.terminalGreeting}</p>
          {history.map((line, index) => <p key={`${line}-${index}`} className={line.startsWith(prompt) ? 'command-line' : ''}>{line}</p>)}
          <form onSubmit={(event) => { event.preventDefault(); execute(input); }} className="terminal-input-row">
            <span>{prompt}</span>
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={onKeyDown} autoComplete="off" aria-label="Terminal command" />
          </form>
        </div>
      </div>
    </div>}
  </>;
}
