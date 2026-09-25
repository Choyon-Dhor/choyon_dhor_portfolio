import { Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { useSite } from '../../context/SiteContext';

export function BlogPage() {
  const { byType, page } = useSite();
  return <>
    <PageHeader page={page('blog')} fallbackTitle="Research Logs" />
    <section className="container section first-section"><div className="log-list">{byType('blog').map((item, index) => <GlassCard key={item._id} className="log-card" delay={index * .04}><div className="log-number">LOG-{String(index + 1).padStart(3, '0')}</div><div><span className="eyebrow">{item.category}</span><h2>{item.title}</h2><p>{item.summary}</p><div className="meta-row"><span><Clock3 size={14} /> {Math.max(2, Math.ceil((item.content?.split(/\s+/).length || 300) / 180))} min read</span></div></div><Link className="button" to={`/blog/${item.slug}`}>Open log</Link></GlassCard>)}</div></section>
  </>;
}
