
import { RouteObject } from "react-router-dom";
import ExecutiveDashboard from "@/pages/admin/executivo/Dashboard";
import AlertsPage from "@/pages/admin/alertas/index";

export const executivoRoutes: RouteObject[] = [
  {
    path: "executivo/dashboard",
    element: <ExecutiveDashboard />,
  },
  {
    path: "alertas",
    element: <AlertsPage />,
  }
];
