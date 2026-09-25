import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../lib/api';
import { GlassCard } from './GlassCard';
import type { ContentItem } from '../types';

export function ContentCard({ item, index = 0, detailBase }: { item: ContentItem; index?: number; detailBase?: string }) {
  const link = detailBase ? `${detailBase}/${item.slug}` : undefined;
  return (
    <GlassCard className="content-card" delay={Math.min(index * 0.04, 0.2)}>
      {item.coverImage && <div className="content-card__media"><img src={mediaUrl(item.coverImage)} alt={item.coverImageAlt || item.title} /></div>}
      <div className="content-card__body">
        <div className="card-topline"><span>{item.eyebrow || item.category}</span><span className="status-dot">{item.status}</span></div>
        <h3>{item.title}</h3>
        {item.organization && <p className="organization">{item.organization}</p>}
        <p>{item.summary}</p>
        {(item.startDate || item.location) && <div className="meta-row">
          {item.startDate && <span><Calendar size={14} />{new Date(item.startDate).getFullYear()}</span>}
          {item.location && <span><MapPin size={14} />{item.location}</span>}
        </div>}
        {!!item.metrics?.length && <div className="mini-metrics">{item.metrics.slice(0, 3).map((metric) => <div key={metric.label}><strong>{metric.value}</strong><small>{metric.label}</small></div>)}</div>}
        {!!item.technologies?.length && <div className="tag-list">{item.technologies.slice(0, 6).map((tag) => <span key={tag}>{tag}</span>)}</div>}
        {link && <Link className="text-link" to={link}>Open module <ArrowUpRight size={16} /></Link>}
      </div>
    </GlassCard>
  );
}


