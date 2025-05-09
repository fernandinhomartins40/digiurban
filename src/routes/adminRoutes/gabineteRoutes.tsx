
import { RouteObject } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLoading } from "@/components/dashboard/common/DashboardLoading";

// Import components directly for reliability
import MayorDashboard from "@/pages/admin/gabinete/Dashboard";
import Appointments from "@/pages/admin/gabinete/Appointments";
import CitizenServices from "@/pages/admin/gabinete/CitizenServices";

// Import MayorOnlyRoute for protected routes
import { MayorOnlyRoute } from "@/components/auth/MayorOnlyRoute";

// Preload critical components for better reliability
if (typeof window !== 'undefined') {
  // Preload all components explicitly to prevent loading errors
  import("@/pages/admin/gabinete/Dashboard");
  import("@/pages/admin/gabinete/Appointments");
  import("@/pages/admin/gabinete/CitizenServices");
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
    element: <ErrorBoundary><CitizenServices /></ErrorBoundary>,
  }
];
