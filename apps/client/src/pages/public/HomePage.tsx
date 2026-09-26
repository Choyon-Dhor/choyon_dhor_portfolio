import { ArrowRight, BookOpen, Copy, Download, ExternalLink, Gamepad2, MapPin, Sparkles, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ContentCard } from '../../components/ContentCard';
import { GlassCard } from '../../components/GlassCard';
import { useExperience } from '../../context/ExperienceContext';
import { useSite } from '../../context/SiteContext';
import { mediaUrl } from '../../lib/api';

function asText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function readInitials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}

function parseMetricValue(value: string) {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const numeric = match[1];
  return {
    amount: Number(numeric),
    decimals: (numeric.split('.')[1] || '').length,
    suffix: match[2] || ''
  };
}

function formatMetricValue(amount: number, decimals: number, suffix: string) {
  return `${amount.toFixed(decimals)}${suffix}`;
}

function AnimatedMetric({ label, value, play, animate, delayMs = 0 }: { label: string; value: string; play: boolean; animate: boolean; delayMs?: number }) {
  const parsed = useMemo(() => parseMetricValue(value), [value]);
  const [display, setDisplay] = useState(() => (!parsed || !animate ? value : formatMetricValue(0, parsed.decimals, parsed.suffix)));
  const [complete, setComplete] = useState(() => !parsed || !animate);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!parsed) {
      setDisplay(value);
      setComplete(true);
      return;
    }

    if (!animate) {
      setDisplay(value);
      setComplete(true);
      return;
    }

    if (!play || animatedRef.current) return;
    animatedRef.current = true;
    setComplete(false);

    let frame = 0;
    let timeout = 0;
    const duration = 1100;
    const startAnimation = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(formatMetricValue(parsed.amount * eased, parsed.decimals, parsed.suffix));
        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
          return;
        }
        setDisplay(value);
        setComplete(true);
      };

      frame = window.requestAnimationFrame(tick);
    };

    timeout = window.setTimeout(startAnimation, delayMs);
    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [animate, delayMs, parsed, play, value]);

  return <div className={complete ? 'is-complete' : ''}><strong>{display}</strong><span>{label}</span></div>;
}

export function HomePage() {
  const { settings, byType } = useSite();
  const { openTerminal, progress, lowPerformance, motionIntensity, reducedMotion } = useExperience();
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [identityActivated, setIdentityActivated] = useState(false);
  const identityStageRef = useRef<HTMLDivElement>(null);

  const research = byType('research');
  const featuredResearch = research.find((item) => item.featured) ?? research[0];
  const featuredProjects = byType('project').filter((item) => item.featured).slice(0, 6);
  const featuredPublication = byType('publication').find((item) => item.featured) ?? byType('publication')[0];
  const featuredEvent = byType('event').find((item) => item.featured) ?? byType('event')[0];
  const leadership = byType('experience').slice(0, 2);
  const activities = byType('activity').slice(0, 3);
  const achievements = byType('achievement').slice(0, 4);
  const logs = byType('blog').slice(0, 2);
  const timeline = byType('timeline').slice(0, 4);
  const stats = useMemo(() => settings.stats.map((entry) => ({ label: String(entry.label || ''), value: String(entry.value || '') })).filter((entry) => entry.label && entry.value), [settings.stats]);
  const socials = useMemo(() => settings.socials.map((entry) => ({ label: String(entry.label || ''), url: String(entry.url || '') })).filter((entry) => entry.label && entry.url), [settings.socials]);
  const orbitLabels = settings.heroOrbitLabels?.length ? settings.heroOrbitLabels.slice(0, 6) : ['Research', 'Projects', 'Leadership', 'Community', 'AI/ML', 'Systems'];
  const compactOrbitLabels = orbitLabels.slice(0, 4);
  const liveStatus = Object.entries(settings.liveStatus || {}).slice(0, 4);
  const identityStats = stats.slice(0, 4);
  const citation = String((featuredPublication?.metadata as Record<string, unknown> | undefined)?.citation || featuredPublication?.title || '');
  const problem = asText((featuredResearch?.metadata as Record<string, unknown> | undefined)?.problem) || featuredResearch?.summary || 'Research directions, experiments and future ideas are curated from the admin panel.';
  const objectives = asList((featuredResearch?.metadata as Record<string, unknown> | undefined)?.objectives);
  const motionEnabled = !reducedMotion && motionIntensity !== 'off';
  const showAmbientNodes = motionIntensity === 'full' && !reducedMotion && !lowPerformance;
  const hasResumeAsset = Boolean(settings.resumeUrl);
  const resumeHref = settings.resumeUrl || `mailto:${settings.email}?subject=CV%20or%20Resume%20Request`;
  const resumeTarget = hasResumeAsset ? '_blank' : undefined;
  const resumeRel = hasResumeAsset ? 'noreferrer' : undefined;
  const resumeLabel = hasResumeAsset ? 'View CV / Resume' : 'Request CV / Resume';

  useEffect(() => {
    const node = identityStageRef.current;
    if (!node || identityActivated || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIdentityActivated(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [identityActivated]);

  useEffect(() => {
    const node = identityStageRef.current;
    if (!node || !motionEnabled || lowPerformance || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches || !window.matchMedia('(hover: hover)').matches) return;

    let frame = 0;

    const applyValues = (clientX: number, clientY: number) => {
      const bounds = node.getBoundingClientRect();
      const x = (clientX - bounds.left) / bounds.width;
      const y = (clientY - bounds.top) / bounds.height;
      const tiltY = (x - 0.5) * 4;
      const tiltX = (0.5 - y) * 4;

      node.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      node.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      node.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`);
      node.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`);
    };

    const onPointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => applyValues(event.clientX, event.clientY));
    };

    const reset = () => {
      node.style.setProperty('--tilt-x', '0deg');
      node.style.setProperty('--tilt-y', '0deg');
      node.style.setProperty('--pointer-x', '50%');
      node.style.setProperty('--pointer-y', '50%');
    };

    reset();
    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      window.cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [lowPerformance, motionEnabled]);

  const copyPublicationCitation = async () => {
    if (!citation) return;
    await navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    window.setTimeout(() => setCopiedCitation(false), 1800);
  };

  return <>
    <section className="hero hero--lab container">
      <div className="hero-ambient" aria-hidden="true">
        <span className="hero-ambient__glow hero-ambient__glow--violet" />
        <span className="hero-ambient__glow hero-ambient__glow--cyan" />
        <span className="hero-ambient__grid-fade" />
        {showAmbientNodes && <>
          <span className="hero-ambient__point hero-ambient__point--one" />
          <span className="hero-ambient__point hero-ambient__point--two" />
          <span className="hero-ambient__point hero-ambient__point--three" />
          <span className="hero-ambient__point hero-ambient__point--four" />
          <span className="hero-ambient__line hero-ambient__line--one" />
          <span className="hero-ambient__line hero-ambient__line--two" />
        </>}
      </div>
      <div className="hero-copy">
        <motion.div className="system-chip" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span /> RESEARCHER OS ONLINE</motion.div>
        <motion.p className="hero-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>{settings.tagline}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {settings.heroTitle}
          <em>{settings.heroSubtitle}</em>
        </motion.h1>
        <motion.p className="hero-description" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>{settings.heroDescription}</motion.p>
        <div className="hero-focus-panel"><strong>Current focus</strong><p>{settings.currentFocus || settings.availabilityStatus}</p></div>
        <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
          <Link className="button primary" to={settings.heroPrimaryCtaUrl || '/research'}>{settings.heroPrimaryCtaLabel || 'Enter Research Lab'} <ArrowRight size={17} /></Link>
          <Link className="button" to={settings.heroSecondaryCtaUrl || '/projects'}>{settings.heroSecondaryCtaLabel || 'Explore Projects'} <ArrowRight size={17} /></Link>

          <button className="button" onClick={openTerminal}><TerminalSquare size={17} /> Open Terminal</button>
          <Link className="button ghost" to="/game"><Gamepad2 size={17} /> Play Data Highway</Link>
          <a className="button ghost" href={resumeHref} target={resumeTarget} rel={resumeRel}><ExternalLink size={17} /> {resumeLabel}</a>
        </motion.div>
        <div className="hero-meta hero-meta--expanded">
          <span><MapPin size={15} /> {settings.location}</span>
          <span><i /> {settings.availabilityStatus || settings.availability}</span>
          <span><Sparkles size={15} /> NEXUS EXPLORED: {progress}%</span>
        </div>
      </div>
      <motion.div
        ref={identityStageRef}
        className={`identity-orbit identity-orbit--advanced${identityActivated ? ' is-activated' : ''}`}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.12 }}
      >
        <div className="identity-halo" />
        <div className="identity-energy-pulse" />
        <div className="identity-orbit-ring identity-orbit-ring--outer" aria-hidden="true" />
        <div className="identity-orbit-ring identity-orbit-ring--middle" aria-hidden="true" />
        <div className="identity-orbit-ring identity-orbit-ring--inner" aria-hidden="true" />
        {orbitLabels.map((label, index) => {
          const angle = (360 / orbitLabels.length) * index;
          return <span key={label} className="orbit-label orbit-label--advanced" style={{ '--label-angle': `${angle}deg`, '--label-delay': `${0.32 + index * 0.08}s` } as CSSProperties}>{label}</span>;
        })}
        <div className="identity-core-frame">
          <div className="identity-core-highlight" aria-hidden="true" />
          <div className="identity-scanline" aria-hidden="true" />
          <div className="identity-core identity-core--advanced">
            <div className="identity-portrait">
              {settings.profileImage ? <img src={mediaUrl(settings.profileImage)} alt={settings.profileImageAlt || `${settings.heroTitle} portrait`} style={{ objectPosition: `${settings.profileImageFocalX || 50}% ${settings.profileImageFocalY || 50}%` }} /> : <span>{readInitials(settings.heroTitle)}</span>}
            </div>
            <small>RESEARCH IDENTITY CORE</small>
            <strong>{settings.heroTitle}</strong>
            <b>{settings.heroSecondaryTitle || settings.heroSubtitle}</b>
            <p>{settings.location}</p>
          </div>
        </div>
        {!!identityStats.length && <div className="identity-status-grid">{identityStats.map((stat, index) => <AnimatedMetric key={stat.label} label={stat.label} value={stat.value} play={identityActivated} animate={motionEnabled} delayMs={index * 130} />)}</div>}
        {!!compactOrbitLabels.length && <div className="identity-label-ribbon" aria-hidden="true">{compactOrbitLabels.map((label) => <span key={label}>{label}</span>)}</div>}
      </motion.div>
    </section>

    {!!stats.length && <section className="stats-strip container">{stats.slice(0, 6).map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</section>}

    <section className="section container">
      <div className="section-heading"><div><span className="eyebrow">SELECTED HIGHLIGHTS</span><h2>Multiple roles, one coherent journey</h2></div></div>
      <div className="card-grid three">
        <GlassCard className="about-section-card"><span className="eyebrow">ACADEMIC</span><h3>Consistent academic performance</h3><p>Strong undergraduate performance, merit recognition and disciplined study across computer science fundamentals and AI.</p></GlassCard>
        <GlassCard className="about-section-card"><span className="eyebrow">RESEARCH</span><h3>Research in progress</h3><p>Current work in context-aware forecasting, future ideas in explainable and trustworthy AI, and growing academic communication.</p></GlassCard>
        <GlassCard className="about-section-card"><span className="eyebrow">COMMUNITY</span><h3>Leadership and contribution</h3><p>Large event coordination, student engagement, volunteer work and campus-level organizational involvement.</p></GlassCard>
      </div>
    </section>

    <section className="section container split-section--balanced">
      <GlassCard className="about-section-card"><span className="eyebrow">ABOUT AND PERSONAL STORY</span><h2>{settings.aboutTitle || 'Behind the profile'}</h2><p>{settings.aboutStory}</p><div className="hero-actions"><Link className="button primary" to="/about">Open About Page <ArrowRight size={16} /></Link>{settings.resumeUrl && <a className="button ghost" href={settings.resumeUrl} target="_blank" rel="noreferrer"><Download size={16} /> CV</a>}</div></GlassCard>
      <GlassCard className="live-status-card"><span className="eyebrow">CURRENTLY WORKING ON</span><div className="card-grid two">{liveStatus.map(([key, value]) => <div key={key} className="live-status-item"><strong>{key.replace(/([A-Z])/g, ' $1')}</strong><p>{String(value)}</p></div>)}</div></GlassCard>
    </section>

    <section className="section container">
      <div className="section-heading"><div><span className="eyebrow">RESEARCH HUB PREVIEW</span><h2>Current work and future directions</h2></div><Link to="/research">Open full hub <ArrowRight size={16} /></Link></div>
      <div className="research-lab-grid">
        <GlassCard className="research-lab-card"><span className="eyebrow">FEATURED RESEARCH</span><h3>{featuredResearch?.title || 'Research module coming soon'}</h3><p>{problem}</p>{!!objectives.length && <div className="objective-list">{objectives.slice(0, 4).map((objective) => <span key={objective}>{objective}</span>)}</div>}{featuredResearch && <Link className="text-link" to={`/research/${featuredResearch.slug}`}>Inspect research detail <ArrowRight size={16} /></Link>}</GlassCard>
        <div className="card-grid two">{research.filter((item) => item._id !== featuredResearch?._id).slice(0, 2).map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/research" />)}</div>
      </div>
    </section>

    {featuredPublication && <section className="section container split-section split-section--balanced">
      <GlassCard className="publication-spotlight"><span className="eyebrow">PUBLICATION AND PRESENTATION</span><h2>{featuredPublication.title}</h2><p>{featuredPublication.summary || featuredPublication.content}</p><div className="tag-list">{(featuredPublication.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="hero-actions"><button className="button" onClick={copyPublicationCitation}><Copy size={16} /> {copiedCitation ? 'Citation Copied' : 'Copy Citation'}</button><Link className="button primary" to={`/publications/${featuredPublication.slug}`}>Open Archive <BookOpen size={16} /></Link>{featuredPublication.links?.map((link) => <a className="button ghost" href={link.url} key={link.label} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={15} /></a>)}</div></GlassCard>
      <div className="card-grid two">{byType('publication').slice(0, 2).map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/publications" />)}</div>
    </section>}

    <section className="section container">
      <div className="section-heading"><div><span className="eyebrow">FEATURED PROJECTS</span><h2>Research-driven and product-minded builds</h2></div><Link to="/projects">Explore projects <ArrowRight size={16} /></Link></div>
      <div className={`card-grid ${featuredProjects.length % 2 === 0 ? 'two' : 'three'}`}>{featuredProjects.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/projects" />)}</div>
    </section>

    <section className="section container split-section split-section--balanced">
      <GlassCard className="leadership-spotlight"><span className="eyebrow">LEADERSHIP HIGHLIGHTS</span><h2>{leadership[0]?.title || 'Leadership Command Center'}</h2><p>{leadership[0]?.summary || 'Leadership stories, responsibility, impact and growth.'}</p><div className="hero-actions"><Link className="button primary" to="/leadership">Open leadership <ArrowRight size={16} /></Link></div></GlassCard>
      <div className="card-grid two">{leadership.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/leadership" />)}</div>
    </section>

    <section className="section container split-section split-section--balanced">
      <div>
        <div className="section-heading section-heading--compact"><div><span className="eyebrow">EVENT AND COMMUNITY STORIES</span><h2>Activities and involvement</h2></div><Link to="/activities">View all activity <ArrowRight size={16} /></Link></div>
        <div className="card-grid two">{activities.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/activities" />)}</div>
      </div>
      {featuredEvent && <GlassCard className="game-preview-card"><span className="eyebrow">FEATURED EVENT</span><h2>{featuredEvent.title}</h2><p>{featuredEvent.summary}</p><div className="tag-list">{(featuredEvent.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div><Link className="button primary" to={`/events/${featuredEvent.slug}`}>View event story <ArrowRight size={16} /></Link></GlassCard>}
    </section>

    <section className="section container">
      <div className="section-heading"><div><span className="eyebrow">ACHIEVEMENTS</span><h2>Evidence and credentials</h2></div><Link to="/awards">Open vault <ArrowRight size={16} /></Link></div>
      <div className="vault-grid">{achievements.map((item, index) => <GlassCard key={item._id} className="vault-card" delay={index * 0.05}><Sparkles size={20} /><h3>{item.title}</h3><p>{item.summary}</p></GlassCard>)}</div>
    </section>

    <section className="section container split-section split-section--balanced">
      <GlassCard className="game-preview-card"><span className="eyebrow">INTERACTIVE EXPLORATION</span><h2>Data Highway</h2><p>A lightweight game chapter that reveals real portfolio facts and encourages exploration without blocking content.</p><div className="tag-list"><span>Optional</span><span>Lazy Loaded</span><span>Portfolio Linked</span></div><Link className="button primary" to="/game"><Gamepad2 size={16} /> Play mission</Link></GlassCard>
      <div>
        <div className="section-heading section-heading--compact"><div><span className="eyebrow">RECENT WRITING</span><h2>Research Logs</h2></div><Link to="/blog">Open logs <ArrowRight size={16} /></Link></div>
        <div className="card-grid two">{logs.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/blog" />)}</div>
      </div>
    </section>

    <section className="section container split-section split-section--balanced">
      <div>
        <div className="section-heading"><div><span className="eyebrow">ACADEMIC AND CAREER ROADMAP</span><h2>Mission map</h2></div></div>
        <div className="mission-track">{timeline.map((item, index) => <div className="mission-node" key={item._id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.summary}</p></div></div>)}</div>
      </div>
      <GlassCard className="contact-preview-card"><span className="eyebrow">CONTACT PORTAL</span><h2>Open for research, collaboration and growth opportunities</h2><p>Use the contact portal for research collaboration, graduate opportunities, AI/ML work, workshops, speaking and community initiatives.</p><div className="contact-links">{socials.slice(0, 5).map((entry) => <a key={entry.label} href={entry.url} target="_blank" rel="noreferrer">{entry.label}<ExternalLink size={15} /></a>)}</div><Link className="button primary" to="/contact">Open contact portal <ArrowRight size={16} /></Link></GlassCard>
    </section>
  </>;
}



