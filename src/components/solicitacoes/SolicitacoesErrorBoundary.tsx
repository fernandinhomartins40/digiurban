
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

interface SolicitacoesErrorBoundaryProps {
  children: React.ReactNode;
}

export const SolicitacoesErrorBoundary = ({ children }: SolicitacoesErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center h-full p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar solicitações</AlertTitle>
            <AlertDescription className="mb-4">
              Não foi possível carregar o módulo de solicitações. Por favor, tente novamente.
            </AlertDescription>
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Recarregar página
            </Button>
          </Alert>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export const SolicitacoesSuspense = ({ children }: { children: React.ReactNode }) => (
  <SolicitacoesErrorBoundary>
    <React.Suspense fallback={<DashboardLoading message="Carregando solicitações..." />}>
      {children}
    </React.Suspense>
  </SolicitacoesErrorBoundary>
);
