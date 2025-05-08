
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

// Lazy load components with explicit Suspense boundaries
const SolicitacoesDashboard = lazy(() => import("@/pages/admin/solicitacoes/SolicitacoesDashboard"));
const SolicitacoesDetalhes = lazy(() => import("@/pages/admin/solicitacoes/SolicitacoesDetalhes"));

// Helper for lazy-loaded components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardLoading message="Carregando..." />}>
    {children}
  </Suspense>
);

export const solicitacoesRoutes: RouteObject[] = [
  {
    path: "solicitacoes",
    element: (
      <SuspenseWrapper>
        <SolicitacoesDashboard />
      </SuspenseWrapper>
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
