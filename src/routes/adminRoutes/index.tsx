
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

// Lazy load components with explicit Suspense boundaries
const UserManagement = lazy(() => import("@/pages/admin/users/UserManagement"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));

// Import route groups
import { correioRoutes } from "./correioRoutes";
import { gabineteRoutes } from "./gabineteRoutes";
import { adminChatRoutes } from "./chatRoutes";
import { administracaoRoutes } from "./administracaoRoutes";
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
import { executivoRoutes } from "./executivoRoutes";

// Helper for lazy-loaded components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardLoading message="Carregando..." />}>
    {children}
  </Suspense>
);

export const adminRoutes: RouteObject[] = [
  {
    path: "",
    element: <AdminLayout />,
    children: [
      // General dashboard route
      {
        path: "dashboard",
        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>,
      },

      {
        path: "users",
        element: <SuspenseWrapper><UserManagement /></SuspenseWrapper>,
      },
      
      // Module-specific routes
      ...correioRoutes,
      ...gabineteRoutes,
      ...adminChatRoutes,
      ...administracaoRoutes,
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
      ...executivoRoutes,
      ...otherModulesRoutes,
    ],
  },
];

export default adminRoutes;
