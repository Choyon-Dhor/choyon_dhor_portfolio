import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Tags } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { ContentCard } from '../../components/ContentCard';
import { GlassCard } from '../../components/GlassCard';
import { LightboxGallery } from '../../components/LightboxGallery';
import { useSite } from '../../context/SiteContext';
import { mediaUrl } from '../../lib/api';
import { normalizeMediaCollection } from '../../lib/media';
import type { ContentItem, ContentType } from '../../types';

const detailBaseByType: Partial<Record<ContentType, string>> = {
  research: '/research',
  project: '/projects',
  publication: '/publications',
  experience: '/leadership',
  activity: '/activities',
  event: '/events',
  achievement: '/awards',
  skill: '/skills',
  education: '/education',
  blog: '/blog'
};

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item)).join(' • ');
  if (value === null || value === undefined || value === '') return 'Data coming soon';
  return String(value);
}

export function DetailPage({ type, backPath }: { type: ContentType; backPath: string }) {
  const { slug } = useParams();
  const { byType, items } = useSite();
  const item = byType(type).find((entry) => entry.slug === slug);

  if (!item) {
    return <section className="container empty-state"><h1>Module not found</h1><Link className="button" to={backPath}>Return</Link></section>;
  }

  const metadataObject = (item.metadata ?? {}) as Record<string, unknown>;
  const metadata = Object.keys(metadataObject).length > 0 ? Object.entries(metadataObject) : [];
  const galleryItems = normalizeMediaCollection(item.galleryItems?.length ? item.galleryItems : item.gallery);
  const relatedItems = (item.relatedContentIds ?? [])
    .map((id) => items.find((entry) => entry._id === id))
    .filter((entry): entry is ContentItem => Boolean(entry))
    .filter((entry) => Boolean(detailBaseByType[entry.type]));
  const showResultsPlaceholder = item.type === 'research' && !metadataObject.results && !metadataObject.resultsSummary && !metadataObject.resultsNote;

  return <article className="detail-page container">
    <Link className="back-link" to={backPath}><ArrowLeft size={16} /> Back to archive</Link>
    <header className="detail-hero detail-hero--rich">
      <div>
        <span className="eyebrow">{item.eyebrow || item.category}</span>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
        <div className="detail-meta-ribbon">
          <span><strong>Status</strong>{item.status || 'Published'}</span>
          {item.organization && <span><strong>Organization</strong>{item.organization}</span>}
          {item.location && <span><MapPin size={14} />{item.location}</span>}
          {item.publishedAt && <span><CalendarDays size={14} />{new Date(item.publishedAt).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="detail-status"><span>MODULE TYPE</span><strong>{item.type}</strong></div>
    </header>

    {item.coverImage && <>
      <img className="detail-cover" src={mediaUrl(item.coverImage)} alt={item.coverImageAlt || item.title} />
      {item.coverImageCaption && <p className="detail-cover-caption">{item.coverImageCaption}</p>}
    </>}

    <div className="detail-action-row">
      {!!item.links?.length && item.links.map((link) => <a className="button" href={link.url} key={link.label} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} /></a>)}
      <Link className="button ghost" to={backPath}>Return to archive</Link>
    </div>

    <div className="detail-layout">
      <div className="prose-block">
        <div className="prose"><ReactMarkdown>{item.content || item.summary || ''}</ReactMarkdown></div>
        {!!galleryItems.length && <section className="detail-gallery"><div className="section-heading section-heading--compact"><div><span className="eyebrow">MEDIA GALLERY</span><h2>Supporting visuals</h2></div></div><LightboxGallery items={galleryItems} /></section>}
        {showResultsPlaceholder && <GlassCard className="metadata-panel"><h3>Results status</h3><p>Results will be added as the research progresses.</p></GlassCard>}
        {!!metadata.length && <GlassCard className="metadata-panel"><h3>Mission data</h3>{metadata.map(([key, value]) => <div className="metadata-row" key={key}><b>{key.replace(/([A-Z])/g, ' $1')}</b><span>{formatValue(value)}</span></div>)}</GlassCard>}
        {!!relatedItems.length && <section className="related-section"><div className="section-heading section-heading--compact"><div><span className="eyebrow">CONNECTED MODULES</span><h2>Related portfolio areas</h2></div></div><div className="card-grid two">{relatedItems.map((relatedItem, index) => <ContentCard key={relatedItem._id} item={relatedItem} index={index} detailBase={detailBaseByType[relatedItem.type]} />)}</div></section>}
      </div>
      <aside>
        {!!item.metrics?.length && <GlassCard><span className="eyebrow">METRICS</span>{item.metrics.map((metric) => <div className="side-metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</GlassCard>}
        {!!item.technologies?.length && <GlassCard><span className="eyebrow">TECH STACK</span><div className="tag-list vertical">{item.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></GlassCard>}
        {!!item.tags?.length && <GlassCard><span className="eyebrow">KEYWORDS</span><div className="tag-list vertical">{item.tags.map((tag) => <span key={tag}><Tags size={13} /> {tag}</span>)}</div></GlassCard>}
        {!!item.links?.length && <GlassCard><span className="eyebrow">LINKS</span>{item.links.map((link) => <a className="text-link" href={link.url} key={link.label} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} /></a>)}</GlassCard>}
      </aside>
    </div>
  </article>;
}
