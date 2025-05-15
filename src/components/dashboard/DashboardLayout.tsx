
// Atualize o DashboardLayout.tsx para adicionar logs de diagnóstico
// Este componente é read-only, então vamos criar um wrapper para debug

import React, { useEffect } from 'react';
import { DashboardLoading } from './common/DashboardLoading';
import { DashboardError } from './common/DashboardError';

interface DashboardLayoutProps {
  title: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRetry?: () => void;
  header?: React.ReactNode;
  metrics?: React.ReactNode;
  charts?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardLayout({
  title,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  header,
  metrics,
  charts,
  sidebar,
  children
}: DashboardLayoutProps) {
  console.log('[DashboardLayout] Rendering with props:', { 
    title, 
    isLoading, 
    isError, 
    hasError: !!error,
    hasHeader: !!header,
    hasMetrics: !!metrics,
    hasCharts: !!charts,
    hasSidebar: !!sidebar,
    hasChildren: !!children
  });
  
  useEffect(() => {
    console.log('[DashboardLayout] Component mounted');
    return () => {
      console.log('[DashboardLayout] Component unmounted');
    };
  }, []);

  // Loading state
  if (isLoading) {
    console.log('[DashboardLayout] Showing loading state');
    return <DashboardLoading />;
  }

  // Error state
  if (isError) {
    console.log('[DashboardLayout] Showing error state:', error);
    return <DashboardError error={error || new Error('Erro desconhecido')} onRetry={onRetry} />;
  }

  // Layout structure with optional sidebar
  const mainContent = (
    <div className="flex flex-col space-y-6 w-full">
      {header && <div>{header}</div>}
      
      {metrics && (
        <section>
          {metrics}
        </section>
      )}
      
      {charts && (
        <section>
          {charts}
        </section>
      )}
      
      {children}
    </div>
  );

  return (
    <div className="w-full">
      <div className="sr-only">{title}</div>
      
      {sidebar ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">{mainContent}</div>
          <div className="w-full md:w-80 flex-shrink-0">{sidebar}</div>
        </div>
      ) : (
        mainContent
      )}
    </div>
  );
}
