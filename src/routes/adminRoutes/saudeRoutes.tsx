
import { RouteObject } from "react-router-dom";
import { lazy } from "react";

// Lazy load components
const HealthDashboard = lazy(() => import("@/pages/admin/saude/Dashboard"));
const Appointments = lazy(() => import("@/pages/admin/saude/atendimentos"));
const TFDManagement = lazy(() => import("@/pages/admin/saude/tfd"));
const HealthPrograms = lazy(() => import("@/pages/admin/saude/programas"));
const HealthRequests = lazy(() => import("@/pages/admin/saude/requests"));

export const saudeRoutes: RouteObject[] = [
  {
    path: "saude/dashboard",
    element: <HealthDashboard />,
  },
  {
    path: "saude/atendimentos",
    element: <Appointments />,
  },
  {
    path: "saude/tfd",
    element: <TFDManagement />,
  },
  {
    path: "saude/programas",
    element: <HealthPrograms />,
  },
  {
    path: "saude/requests",
    element: <HealthRequests />,
  },
];
