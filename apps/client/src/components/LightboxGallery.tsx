import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../lib/media';
import type { MediaAsset } from '../types';

export function LightboxGallery({ items, className = 'detail-gallery-grid' }: { items: MediaAsset[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowLeft') setActiveIndex((current) => current === null ? current : (current - 1 + items.length) % items.length);
      if (event.key === 'ArrowRight') setActiveIndex((current) => current === null ? current : (current + 1) % items.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, items.length]);

  if (!items.length) return null;

  return <>
    <div className={className}>
      {items.map((item, index) => <button key={`${item.url}-${index}`} className="gallery-thumb" onClick={() => setActiveIndex(index)} aria-label={`Open image ${index + 1}`}>
        <img src={resolveMediaUrl(item)} alt={item.altText || item.caption || `Gallery image ${index + 1}`} />
        {(item.caption || item.date) && <span>{item.caption || item.date}</span>}
      </button>)}
    </div>
    {activeIndex !== null && <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Image gallery" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}>
      <button className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close gallery"><X size={20} /></button>
      {items.length > 1 && <button className="lightbox-nav lightbox-nav--prev" onClick={() => setActiveIndex((activeIndex - 1 + items.length) % items.length)} aria-label="Previous image"><ChevronLeft size={22} /></button>}
      <figure className="lightbox-figure">
        <img src={resolveMediaUrl(items[activeIndex])} alt={items[activeIndex].altText || items[activeIndex].caption || `Gallery image ${activeIndex + 1}`} />
        <figcaption>
          <strong>{items[activeIndex].caption || `Image ${activeIndex + 1}`}</strong>
          {(items[activeIndex].description || items[activeIndex].credit || items[activeIndex].location) && <span>{[items[activeIndex].description, items[activeIndex].location, items[activeIndex].credit].filter(Boolean).join(' • ')}</span>}
        </figcaption>
      </figure>
      {items.length > 1 && <button className="lightbox-nav lightbox-nav--next" onClick={() => setActiveIndex((activeIndex + 1) % items.length)} aria-label="Next image"><ChevronRight size={22} /></button>}
    </div>}
  </>;
}
