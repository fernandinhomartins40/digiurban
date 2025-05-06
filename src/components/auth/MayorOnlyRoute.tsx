
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MayorOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const MayorOnlyRoute = ({ 
  children, 
  redirectTo = '/admin/gabinete/todas-solicitacoes' 
}: MayorOnlyRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (user?.role !== 'prefeito') {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
