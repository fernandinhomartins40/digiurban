
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { MayorOnlyRoute } from "@/components/auth/MayorOnlyRoute";

// Lazy load components
const MayorDashboard = lazy(() => import("@/pages/admin/gabinete/Dashboard"));
const DirectRequests = lazy(() => import("@/pages/admin/gabinete/DirectRequests"));
const Appointments = lazy(() => import("@/pages/admin/gabinete/Appointments"));

export const gabineteRoutes: RouteObject[] = [
  {
    path: "gabinete/dashboard",
    element: <MayorOnlyRoute><MayorDashboard /></MayorOnlyRoute>,
  },
  {
    path: "gabinete/solicitacoes",
    element: <DirectRequests />,
  },
  {
    path: "gabinete/agenda",
    element: <Appointments />,
  }
];
