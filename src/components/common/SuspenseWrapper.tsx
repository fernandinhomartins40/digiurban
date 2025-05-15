
import React, { Suspense } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  loadingMessage?: string;
}

export const SuspenseWrapper = ({ 
  children, 
  loadingMessage = "Carregando..." 
}: SuspenseWrapperProps) => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoading message={loadingMessage} />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);
