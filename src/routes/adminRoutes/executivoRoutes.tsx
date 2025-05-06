
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MayorOnlyRoute } from "@/components/auth/MayorOnlyRoute";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

const ExecutiveDashboard = lazy(() => import("@/pages/admin/executivo/Dashboard"));
const AlertsPage = lazy(() => import("@/pages/admin/alertas/index"));

// Helper for lazy-loaded components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardLoading message="Carregando..." />}>
    {children}
  </Suspense>
);

export const executivoRoutes: RouteObject[] = [
  {
    path: "executivo/dashboard",
    element: <MayorOnlyRoute><SuspenseWrapper><ExecutiveDashboard /></SuspenseWrapper></MayorOnlyRoute>,
  },
  {
    path: "alertas",
    element: <MayorOnlyRoute><SuspenseWrapper><AlertsPage /></SuspenseWrapper></MayorOnlyRoute>,
  }
];
