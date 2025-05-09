
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MayorOnlyRoute } from "@/components/auth/MayorOnlyRoute";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Import components directly for reliability
import MayorDashboard from "@/pages/admin/gabinete/Dashboard";
import Appointments from "@/pages/admin/gabinete/Appointments";

// Lazy load non-critical components with error boundaries
const CitizenServices = lazy(() => import("@/pages/admin/gabinete/CitizenServices"));

// Helper for lazy-loaded components with error boundaries
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoading message="Carregando..." />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Preload components for better reliability
if (typeof window !== 'undefined') {
  // Preload critical components
  import("@/pages/admin/gabinete/Dashboard");
  import("@/pages/admin/gabinete/Appointments");
}

export const gabineteRoutes: RouteObject[] = [
  {
    path: "gabinete/dashboard",
    element: <MayorOnlyRoute><ErrorBoundary><MayorDashboard /></ErrorBoundary></MayorOnlyRoute>,
  },
  {
    path: "gabinete/agenda",
    element: <ErrorBoundary><Appointments /></ErrorBoundary>,
  },
  {
    path: "gabinete/cidadaos",
    element: <SuspenseWrapper><CitizenServices /></SuspenseWrapper>,
  }
];
