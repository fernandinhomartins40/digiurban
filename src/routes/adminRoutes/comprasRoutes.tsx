
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

// Main index page becomes a router
import ComprasIndex from "@/pages/admin/compras/index";

// Import fornecedores page directly to avoid dynamic import issues
import FornecedoresPage from "@/pages/admin/compras/fornecedores/index";

// Lazy load other components with proper suspense boundaries
const FornecedorCadastroPage = lazy(() => import("@/pages/admin/compras/fornecedores/cadastro"));
const FornecedorDetalhesPage = lazy(() => import("@/pages/admin/compras/fornecedores/[id]"));
const ContratosPage = lazy(() => import("@/pages/admin/compras/contratos"));
const ContratoCadastroPage = lazy(() => import("@/pages/admin/compras/contratos/cadastro"));
const ContratoDetalhesPage = lazy(() => import("@/pages/admin/compras/contratos/[id]"));

// Helper for suspense wrapper
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoading message="Carregando..." />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const comprasRoutes: RouteObject[] = [
  {
    path: "compras",
    element: <ComprasIndex />,
    children: [
      {
        index: true,
        element: <FornecedoresPage />, // Direct reference without SuspenseWrapper
      },
      {
        path: "fornecedores",
        children: [
          {
            index: true,
            element: <FornecedoresPage />, // Direct reference without SuspenseWrapper
          },
          {
            path: "cadastro",
            element: <SuspenseWrapper><FornecedorCadastroPage /></SuspenseWrapper>,
          },
          {
            path: ":id",
            element: <SuspenseWrapper><FornecedorDetalhesPage /></SuspenseWrapper>,
          },
        ]
      },
      {
        path: "contratos",
        children: [
          {
            index: true,
            element: <SuspenseWrapper><ContratosPage /></SuspenseWrapper>,
          },
          {
            path: "cadastro",
            element: <SuspenseWrapper><ContratoCadastroPage /></SuspenseWrapper>,
          },
          {
            path: ":id",
            element: <SuspenseWrapper><ContratoDetalhesPage /></SuspenseWrapper>,
          },
        ]
      },
    ],
  },
];
