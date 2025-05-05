
import { RouteObject } from "react-router-dom";
import { lazy } from "react";

// Lazy load components
const MayorDashboard = lazy(() => import("@/pages/admin/gabinete/Dashboard"));
const DirectRequests = lazy(() => import("@/pages/admin/gabinete/DirectRequests"));
const Appointments = lazy(() => import("@/pages/admin/gabinete/Appointments"));
const AllRequests = lazy(() => import("@/pages/admin/gabinete/AllRequests"));

export const gabineteRoutes: RouteObject[] = [
  {
    path: "gabinete/dashboard",
    element: <MayorDashboard />,
  },
  {
    path: "gabinete/solicitacoes",
    element: <DirectRequests />,
  },
  {
    path: "gabinete/agenda",
    element: <Appointments />,
  },
  {
    path: "gabinete/todas-solicitacoes",
    element: <AllRequests />,
  }
];
