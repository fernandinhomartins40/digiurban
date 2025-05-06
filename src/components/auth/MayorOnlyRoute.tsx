
import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLoading } from '@/components/dashboard/common/DashboardLoading';

interface MayorOnlyRouteProps {
  children: React.ReactNode;
}

export const MayorOnlyRoute = ({ children }: MayorOnlyRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // If not mayor, redirect to a different page
  if (user && user.role !== 'prefeito') {
    return <Navigate to="/admin/gabinete/solicitacoes" replace state={{ from: location }} />;
  }

  // Wrap the children in Suspense to handle lazy loading
  return (
    <Suspense fallback={<DashboardLoading message="Carregando dashboard..." />}>
      {children}
    </Suspense>
  );
};
