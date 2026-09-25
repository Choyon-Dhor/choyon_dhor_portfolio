import { ContentCard } from '../../components/ContentCard';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { useSite } from '../../context/SiteContext';

export function LeadershipPage() {
  const { byType, page } = useSite();
  const experiences = byType('experience');
  const flagship = byType('event').find((item) => item.featured);
  return <>
    <PageHeader page={page('leadership')} fallbackTitle="Leadership Command" />
    {flagship && <section className="container flagship-section"><GlassCard className="flagship-card"><div><span className="eyebrow">FLAGSHIP OPERATION</span><h2>{flagship.title}</h2><p>{flagship.content || flagship.summary}</p><div className="tag-list">{flagship.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="flagship-metrics">{flagship.metrics?.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div></GlassCard></section>}
    <section className="container section"><div className="timeline-stack">{experiences.map((item, index) => <div className="timeline-row" key={item._id}><div className="timeline-index">{String(index + 1).padStart(2, '0')}</div><ContentCard item={item} index={index} detailBase="/leadership" /></div>)}</div></section>
  </>;
}
