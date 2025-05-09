import { RouteObject } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

// Direct import for the main dashboard component to prevent dynamic import issues
import SolicitacoesDashboard from "@/pages/admin/solicitacoes/SolicitacoesDashboard";

// Keep lazy loading for less critical components
import { lazy, Suspense } from "react";
const SolicitacoesDetalhes = lazy(() => import("@/pages/admin/solicitacoes/SolicitacoesDetalhes"));

// Helper for lazy-loaded components with error boundaries
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoading message="Carregando..." />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Preload SolicitacoesDetalhes for better reliability
if (typeof window !== 'undefined') {
  import("@/pages/admin/solicitacoes/SolicitacoesDetalhes");
}

export const solicitacoesRoutes: RouteObject[] = [
  {
    path: "solicitacoes",
    element: (
      <ErrorBoundary>
        <SolicitacoesDashboard />
      </ErrorBoundary>
    ),
  },
  {
    path: "solicitacoes/:id",
    element: (
      <SuspenseWrapper>
        <SolicitacoesDetalhes />
      </SuspenseWrapper>
    ),
  },
];
