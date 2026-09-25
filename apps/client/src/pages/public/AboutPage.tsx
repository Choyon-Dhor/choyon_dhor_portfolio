import { Download, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { LightboxGallery } from '../../components/LightboxGallery';
import { GlassCard } from '../../components/GlassCard';
import { useSite } from '../../context/SiteContext';
import { mediaUrl } from '../../lib/api';
import { normalizeMediaCollection } from '../../lib/media';

export function AboutPage() {
  const { settings, page } = useSite();
  const gallery = normalizeMediaCollection(settings.aboutGallery);
  const milestones = settings.aboutMilestones || [];
  const portrait = settings.alternateProfileImage || settings.profileImage;

  return <>
    <PageHeader page={page('about')} fallbackTitle="About the Researcher" />
    <section className="container section first-section about-grid">
      <GlassCard className="about-portrait-card">
        <div className="about-portrait">
          {portrait ? <img src={mediaUrl(portrait)} alt={settings.profileImageAlt || `${settings.heroTitle} portrait`} /> : <div className="about-portrait__fallback">{settings.heroTitle.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>}
        </div>
        <div className="about-portrait-copy">
          <span className="eyebrow">IDENTITY</span>
          <h2>{settings.heroTitle}</h2>
          <p>{settings.heroSecondaryTitle}</p>
          {settings.profileImageCaption && <small>{settings.profileImageCaption}</small>}
          {settings.resumeUrl && <a className="button primary" href={settings.resumeUrl} target="_blank" rel="noreferrer"><Download size={16} /> Download CV</a>}
        </div>
      </GlassCard>
      <div className="about-story-stack">
        <GlassCard className="about-section-card"><span className="eyebrow">ABOUT</span><h2>{settings.aboutTitle || 'Behind the profile'}</h2><p>{settings.aboutStory}</p></GlassCard>
        <div className="card-grid two">
          <GlassCard className="about-section-card"><span className="eyebrow">ACADEMIC BACKGROUND</span><p>{settings.academicBackground}</p></GlassCard>
          <GlassCard className="about-section-card"><span className="eyebrow">RESEARCH MOTIVATION</span><p>{settings.researchMotivation}</p></GlassCard>
          <GlassCard className="about-section-card"><span className="eyebrow">DEVELOPMENT INTERESTS</span><p>{settings.developmentInterests}</p></GlassCard>
          <GlassCard className="about-section-card"><span className="eyebrow">LEADERSHIP PHILOSOPHY</span><p>{settings.leadershipPhilosophy}</p></GlassCard>
          <GlassCard className="about-section-card"><span className="eyebrow">COMMUNITY VISION</span><p>{settings.communityVision}</p></GlassCard>
          <GlassCard className="about-section-card"><span className="eyebrow">PERSONAL GOALS</span><p>{settings.personalGoals}</p></GlassCard>
        </div>
      </div>
    </section>
    {!!milestones.length && <section className="container section">
      <div className="section-heading"><div><span className="eyebrow">PERSONAL MILESTONES</span><h2>Journey markers</h2></div></div>
      <div className="vault-grid">{milestones.map((milestone, index) => <GlassCard className="vault-card" key={index}><h3>{String(milestone.title || `Milestone ${index + 1}`)}</h3><p>{String(milestone.detail || milestone.description || '')}</p></GlassCard>)}</div>
    </section>}
    {!!gallery.length && <section className="container section">
      <div className="section-heading"><div><span className="eyebrow">BEHIND THE PROFILE</span><h2>Photo story</h2></div></div>
      <LightboxGallery items={gallery} className="editorial-gallery" />
    </section>}
    <section className="container section">
      <GlassCard className="live-status-card">
        <div className="section-heading section-heading--compact"><div><span className="eyebrow">CURRENTLY WORKING ON</span><h2>Live focus panel</h2></div></div>
        <div className="card-grid two">
          {Object.entries(settings.liveStatus || {}).map(([key, value]) => <div key={key} className="live-status-item"><strong>{key.replace(/([A-Z])/g, ' $1')}</strong><p>{String(value)}</p></div>)}
        </div>
      </GlassCard>
    </section>
  </>;
}
