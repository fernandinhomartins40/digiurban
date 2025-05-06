
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MayorOnlyRoute } from "@/components/auth/MayorOnlyRoute";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

// Lazy load components with explicit Suspense boundaries
const MayorDashboard = lazy(() => import("@/pages/admin/gabinete/Dashboard"));
const DirectRequests = lazy(() => import("@/pages/admin/gabinete/DirectRequests"));
const Appointments = lazy(() => import("@/pages/admin/gabinete/Appointments"));

// Helper for lazy-loaded components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardLoading message="Carregando..." />}>
    {children}
  </Suspense>
);

export const gabineteRoutes: RouteObject[] = [
  {
    path: "gabinete/dashboard",
    element: <MayorOnlyRoute><SuspenseWrapper><MayorDashboard /></SuspenseWrapper></MayorOnlyRoute>,
  },
  {
    path: "gabinete/solicitacoes",
    element: <SuspenseWrapper><DirectRequests /></SuspenseWrapper>,
  },
  {
    path: "gabinete/agenda",
    element: <SuspenseWrapper><Appointments /></SuspenseWrapper>,
  }
];
