
import { RouteObject } from "react-router-dom";
import ExecutiveDashboard from "@/pages/admin/executivo/Dashboard";
import AlertsPage from "@/pages/admin/alertas/index";
import { MayorOnlyRoute } from "@/components/auth/MayorOnlyRoute";

export const executivoRoutes: RouteObject[] = [
  {
    path: "executivo/dashboard",
    element: <MayorOnlyRoute><ExecutiveDashboard /></MayorOnlyRoute>,
  },
  {
    path: "alertas",
    element: <MayorOnlyRoute><AlertsPage /></MayorOnlyRoute>,
  }
];
