import { useMemo, useState } from 'react';
import { ContentCard } from '../../components/ContentCard';
import { PageHeader } from '../../components/PageHeader';
import { useSite } from '../../context/SiteContext';
import type { ContentType } from '../../types';

export function CollectionPage({ type, pageSlug, detailBase, title }: { type: ContentType; pageSlug: string; detailBase?: string; title: string }) {
  const { byType, page } = useSite();
  const items = byType(type);
  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((item) => item.category || 'General')))], [items]);
  const [category, setCategory] = useState('All');
  const filtered = category === 'All' ? items : items.filter((item) => (item.category || 'General') === category);

  return <>
    <PageHeader page={page(pageSlug)} fallbackTitle={title} />
    <section className="container collection-controls">{categories.map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</section>
    <section className="container section first-section"><div className="card-grid three">{filtered.map((item, index) => <ContentCard key={item._id} item={item} index={index} detailBase={detailBase} />)}</div></section>
  </>;
}
