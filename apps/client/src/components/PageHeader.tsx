import type { PageData } from '../types';

export function PageHeader({ page, fallbackTitle }: { page?: PageData; fallbackTitle: string }) {
  return (
    <header className="page-header container">
      <div className="eyebrow">{page?.eyebrow || 'NEXUS MODULE'}</div>
      <h1>{page?.title || fallbackTitle}</h1>
      <p className="page-subtitle">{page?.subtitle}</p>
      {page?.intro && <p className="page-intro">{page.intro}</p>}
    </header>
  );
}
