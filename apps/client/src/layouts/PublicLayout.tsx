import { AnimatePresence, motion } from 'framer-motion';
import { Activity, FlaskConical, Home, Mail, Menu, TerminalSquare, UserRound, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BootSequence } from '../components/BootSequence';
import { ExperienceDock } from '../components/ExperienceDock';
import { Terminal } from '../components/Terminal';
import { useExperience } from '../context/ExperienceContext';
import { useSite } from '../context/SiteContext';
import { mediaUrl } from '../lib/api';
import type { ContentItem, ContentType, PageData, SiteSettings } from '../types';

const nav = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/research', 'Research'],
  ['/projects', 'Projects'],
  ['/publications', 'Publications'],
  ['/leadership', 'Leadership'],
  ['/activities', 'Activities'],
  ['/events', 'Events'],
  ['/blog', 'Logs'],
  ['/contact', 'Contact']
] as const;

const mobileNav = [
  ['/', 'Home', Home],
  ['/about', 'About', UserRound],
  ['/research', 'Research', FlaskConical],
  ['/activities', 'Activity', Activity],
  ['/contact', 'Contact', Mail]
] as const;

const detailRouteMap: Record<string, ContentType> = {
  research: 'research',
  projects: 'project',
  publications: 'publication',
  leadership: 'experience',
  activities: 'activity',
  events: 'event',
  awards: 'achievement',
  skills: 'skill',
  education: 'education',
  blog: 'blog'
};

interface RouteMeta {
  title: string;
  description: string;
  image: string;
}

export function PublicLayout() {
  const location = useLocation();
  const { settings, items, page } = useSite();
  const { soundEnabled, toggleSound, openTerminal, reducedMotion } = useExperience();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', settings.accent || '#8f7cff');
    document.documentElement.style.setProperty('--accent-2', settings.secondaryAccent || '#65d9ff');
  }, [settings]);

  useEffect(() => {
    const meta = resolveRouteMeta(location.pathname, settings, items, page);
    document.title = meta.title;
    applyMetaTag('description', meta.description);
    applyMetaTag('og:title', meta.title, 'property');
    applyMetaTag('og:description', meta.description, 'property');
    applyMetaTag('og:url', window.location.href, 'property');
    applyMetaTag('og:image', meta.image, 'property');
    applyMetaTag('twitter:card', meta.image ? 'summary_large_image' : 'summary');
    applyMetaTag('twitter:title', meta.title);
    applyMetaTag('twitter:description', meta.description);
    applyMetaTag('twitter:image', meta.image);
    ensureCanonical(window.location.href);
  }, [items, location.pathname, page, settings]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const socials = useMemo(() => settings.socials.filter((entry) => typeof entry.url === 'string' && entry.url), [settings.socials]);

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="ambient-grid" />
    <BootSequence />
    <header className="topbar topbar--refined">
      <NavLink to="/" className="brand"><span>N//</span><div><b>{settings.siteName}</b><small>{settings.tagline}</small></div></NavLink>
      <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
        {nav.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
      </nav>
      <div className="top-actions">
        <button className="icon-button" onClick={toggleSound} aria-label="Toggle sound">{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
        <button className="topbar-terminal" onClick={openTerminal}><TerminalSquare size={16} /> Open Terminal</button>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    <ExperienceDock />
    <main id="main-content">
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} className="route-shell" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={reducedMotion ? {} : { opacity: 1, y: 0 }} exit={reducedMotion ? {} : { opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </main>
    <footer className="footer footer--rich container">
      <div><span className="status-light" /> SYSTEM ONLINE</div>
      <p>{settings.footerText}</p>
      <div className="footer-links">
        {socials.slice(0, 5).map((entry, index) => <a href={String(entry.url)} key={`${String(entry.label || 'social')}-${index}`} target="_blank" rel="noreferrer">{String(entry.label || 'Link')}</a>)}
        <NavLink to="/admin/login">Admin access</NavLink>
      </div>
    </footer>
    <div className="mobile-dock" aria-label="Primary navigation">
      {mobileNav.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'}><Icon size={18} /><span>{label}</span></NavLink>)}
      <button type="button" onClick={openTerminal}><TerminalSquare size={18} /><span>Terminal</span></button>
    </div>
    <Terminal />
  </div>;
}

function resolveRouteMeta(pathname: string, settings: SiteSettings, items: ContentItem[], page: (slug: string) => PageData | undefined): RouteMeta {
  const defaultImage = settings.profileImage ? mediaUrl(settings.profileImage) : '';
  const defaultMeta: RouteMeta = {
    title: settings.seoTitle || 'Choyon Dhor',
    description: settings.seoDescription || settings.heroDescription || settings.tagline,
    image: defaultImage
  };

  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return defaultMeta;

  if (segments.length === 1) {
    if (segments[0] === 'game') {
      return {
        title: `Data Highway | ${settings.siteName}`,
        description: 'Optional interactive mission revealing real portfolio milestones from MongoDB-backed content.',
        image: defaultImage
      };
    }

    const currentPage = page(segments[0]);
    if (currentPage) {
      return {
        title: currentPage.seoTitle || `${currentPage.title} | ${settings.siteName}`,
        description: currentPage.seoDescription || currentPage.intro || currentPage.subtitle || defaultMeta.description,
        image: defaultImage
      };
    }

    return defaultMeta;
  }

  const routeType = detailRouteMap[segments[0]];
  if (!routeType || !segments[1]) return defaultMeta;

  const currentItem = items.find((entry) => entry.type === routeType && entry.slug === segments[1]);
  if (!currentItem) return defaultMeta;

  return {
    title: currentItem.seoTitle || `${currentItem.title} | ${settings.siteName}`,
    description: currentItem.seoDescription || currentItem.summary || defaultMeta.description,
    image: currentItem.coverImage ? mediaUrl(currentItem.coverImage) : defaultImage
  };
}

function applyMetaTag(key: string, value: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value || '');
}

function ensureCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}
