import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentCard } from '../../components/ContentCard';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { useSite } from '../../context/SiteContext';

const ideaStatuses = new Set(['Idea', 'Planning', 'Literature Review']);

export function ResearchHubPage() {
  const { byType, page } = useSite();
  const research = byType('research');
  const featured = research.find((item) => item.featured) ?? research[0];
  const secondary = research.filter((item) => item._id !== featured?._id && !ideaStatuses.has(item.status || '')).slice(0, 4);
  const ideas = research.filter((item) => item._id !== featured?._id && ideaStatuses.has(item.status || '')).slice(0, 4);
  const publications = byType('publication').slice(0, 3);

  return <>
    <PageHeader page={page('research')} fallbackTitle="Research Hub" />
    {featured && <section className="container section first-section research-hub-layout">
      <GlassCard className="research-feature-card">
        <span className="eyebrow">FEATURED RESEARCH</span>
        <h2>{featured.title}</h2>
        <p>{featured.summary}</p>
        <div className="detail-meta-ribbon">
          <span><strong>Status</strong>{featured.status || 'Planning'}</span>
          <span><strong>Category</strong>{featured.category || 'Research'}</span>
          {!!featured.metrics?.[0] && <span><strong>{featured.metrics[0].label}</strong>{featured.metrics[0].value}</span>}
        </div>
        {!!featured.technologies?.length && <div className="tag-list">{featured.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>}
        <div className="hero-actions">
          <Link className="button primary" to={`/research/${featured.slug}`}>Open Research Detail <ArrowRight size={16} /></Link>
          {featured.links?.map((link) => <a className="button ghost" key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={15} /></a>)}
        </div>
      </GlassCard>
      <GlassCard className="pipeline-card">
        <span className="eyebrow">RESEARCH LANDSCAPE</span>
        <div className="pipeline-flow">
          {research.map((item, index) => <div key={item._id} className="pipeline-step"><span>{String(index + 1).padStart(2, '0')}</span><b>{item.shortTitle || item.title}</b></div>)}
        </div>
      </GlassCard>
    </section>}
    {!!secondary.length && <section className="container section">
      <div className="section-heading"><div><span className="eyebrow">CURRENT AND COMPLETED</span><h2>Research modules</h2></div></div>
      <div className="card-grid two">{secondary.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/research" />)}</div>
    </section>}
    {!!ideas.length && <section className="container section">
      <div className="section-heading"><div><span className="eyebrow">RESEARCH IDEAS</span><h2>Planned directions</h2></div></div>
      <div className="card-grid two">{ideas.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/research" />)}</div>
    </section>}
    {!!publications.length && <section className="container section">
      <div className="section-heading"><div><span className="eyebrow">RELATED OUTPUT</span><h2>Presentations and manuscripts</h2></div><Link to="/publications">Open archive <ArrowRight size={16} /></Link></div>
      <div className="card-grid three">{publications.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase="/publications" />)}</div>
    </section>}
  </>;
}
