
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Import Dashboard directly instead of lazy loading to prevent dynamic import issues
import Dashboard from "@/pages/admin/Dashboard";

// Helper for lazy-loaded components with error boundaries
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoading message="Carregando..." />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Lazy load components with explicit Suspense boundaries - preload for critical routes
const UserManagement = lazy(() => import("@/pages/admin/users/UserManagement"));

// Import route groups
import { correioRoutes } from "./correioRoutes";
import { gabineteRoutes } from "./gabineteRoutes";
import { adminChatRoutes } from "./chatRoutes";
import { rhRoutes } from "./rhRoutes";
import { comprasRoutes } from "./comprasRoutes";
import { saudeRoutes } from "./saudeRoutes";
import { educacaoRoutes } from "./educacaoRoutes";
import { assistenciaRoutes } from "./assistenciaRoutes";
import { financasRoutes } from "./financasRoutes";
import { agriculturaRoutes } from "./agriculturaRoutes";
import { esportesRoutes } from "./esportesRoutes";
import { culturaRoutes } from "./culturaRoutes";
import { turismoRoutes } from "./turismoRoutes";
import { habitacaoRoutes } from "./habitacaoRoutes";
import { segurancaRoutes } from "./segurancaRoutes";
import { otherModulesRoutes } from "./otherModulesRoutes";
import { obrasRoutes } from "./obrasRoutes";
import { servicosRoutes } from "./servicosRoutes";
import { meioAmbienteRoutes } from "./meioAmbienteRoutes";
import { ouvidoriaRoutes } from "./ouvidoriaRoutes";
import { solicitacoesRoutes } from "./solicitacoesRoutes";

// Preload critical routes for better performance
if (typeof window !== 'undefined') {
  // Preload UserManagement and other critical components
  import("@/pages/admin/users/UserManagement");
  import("@/pages/admin/gabinete/Appointments");
  import("@/pages/admin/solicitacoes/SolicitacoesDashboard");
}

export const adminRoutes: RouteObject[] = [
  {
    path: "",
    element: <AdminLayout />,
    errorElement: <ErrorBoundary><div>Erro na aplicação</div></ErrorBoundary>,
    children: [
      // General dashboard route - directly imported instead of lazy loaded
      {
        path: "dashboard",
        element: <ErrorBoundary><Dashboard /></ErrorBoundary>
      },

      {
        path: "users",
        element: <SuspenseWrapper><UserManagement /></SuspenseWrapper>,
      },
      
      // Module-specific routes
      ...solicitacoesRoutes,
      ...correioRoutes,
      ...gabineteRoutes,
      ...adminChatRoutes,
      ...rhRoutes,
      ...comprasRoutes,
      ...saudeRoutes,
      ...educacaoRoutes,
      ...assistenciaRoutes,
      ...financasRoutes,
      ...agriculturaRoutes,
      ...esportesRoutes,
      ...culturaRoutes,
      ...turismoRoutes,
      ...habitacaoRoutes,
      ...segurancaRoutes,
      ...obrasRoutes,
      ...servicosRoutes,
      ...meioAmbienteRoutes,
      ...ouvidoriaRoutes,
      ...otherModulesRoutes,
    ],
  },
];

export default adminRoutes;
