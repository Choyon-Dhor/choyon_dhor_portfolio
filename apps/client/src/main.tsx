import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ExperienceProvider } from './context/ExperienceContext';
import { SiteProvider } from './context/SiteContext';
import './styles.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ExperienceProvider>
          <AuthProvider>
            <SiteProvider><App /></SiteProvider>
          </AuthProvider>
        </ExperienceProvider>
        <Toaster theme="dark" position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
