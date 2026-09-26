import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { BootstrapData, ContentItem, ContentType, PageData } from '../types';

import { fallbackBootstrapData } from '../data/starterData';

interface SiteContextValue extends BootstrapData {
  byType: (type: ContentType) => ContentItem[];
  page: (slug: string) => PageData | undefined;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ['bootstrap'],
    queryFn: async () => {
      let baseData = fallbackBootstrapData;
      try {
        const res = await api.get<BootstrapData>('/public/bootstrap');
        if (res.data && res.data.settings) {
          baseData = res.data;
        }
      } catch (err) {
        console.warn('API bootstrap call failed, using bundled starter data:', err);
      }

      // Merge local settings cache if present
      try {
        const local = localStorage.getItem('nexus_custom_settings');
        if (local) {
          const parsed = JSON.parse(local);
          baseData = {
            ...baseData,
            settings: { ...baseData.settings, ...parsed }
          };
        }
      } catch {}

      return baseData;
    },
    staleTime: 5_000
  });

  const data: BootstrapData = query.data || fallbackBootstrapData;

  const value: SiteContextValue = {
    ...data,
    byType: (type) => data.items.filter((item) => item.type === type),
    page: (slug) => data.pages.find((item) => item.slug === slug)
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
