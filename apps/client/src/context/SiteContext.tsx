import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { BootstrapData, ContentItem, ContentType, PageData } from '../types';

interface SiteContextValue extends BootstrapData {
  byType: (type: ContentType) => ContentItem[];
  page: (slug: string) => PageData | undefined;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ['bootstrap'],
    queryFn: async () => (await api.get<BootstrapData>('/public/bootstrap')).data,
    staleTime: 60_000
  });

  if (query.isLoading) return <LoadingScreen />;
  if (query.error || !query.data) return <ErrorScreen message={query.error?.message || 'Unable to load the portfolio.'} />;

  const value: SiteContextValue = {
    ...query.data,
    byType: (type) => query.data.items.filter((item) => item.type === type),
    page: (slug) => query.data.pages.find((item) => item.slug === slug)
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within SiteProvider');
  return context;
}

function LoadingScreen() {
  return <div className="boot-screen"><div className="boot-mark">N//</div><p>INITIALIZING RESEARCH NEXUS...</p><div className="boot-line"><span /></div></div>;
}

function ErrorScreen({ message }: { message: string }) {
  return <div className="boot-screen"><div className="boot-mark">!</div><p>{message}</p><button className="button" onClick={() => location.reload()}>Retry connection</button></div>;
}
