
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

interface AppointmentErrorBoundaryProps {
  children: React.ReactNode;
}

export const AppointmentErrorBoundary = ({ children }: AppointmentErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center h-full p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar agendamentos</AlertTitle>
            <AlertDescription className="mb-4">
              Não foi possível carregar o módulo de agendamentos. Por favor, tente novamente.
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

export const AppointmentSuspense = ({ children }: { children: React.ReactNode }) => (
  <AppointmentErrorBoundary>
    <React.Suspense fallback={<DashboardLoading message="Carregando agendamentos..." />}>
      {children}
    </React.Suspense>
  </AppointmentErrorBoundary>
);
