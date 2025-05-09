
import { RouteObject } from "react-router-dom";
import RHDashboard from "@/pages/admin/rh/dashboard";
import HRServicesPage from "@/pages/admin/rh/servicos/index";
import HRAttendancePage from "@/pages/admin/rh/atendimento/index";

export const rhRoutes: RouteObject[] = [
  {
    path: "rh",
    children: [
      {
        path: "",
        element: <RHDashboard />,
      },
      {
        path: "dashboard",
        element: <RHDashboard />,
      },
      {
        path: "servicos",
        element: <HRServicesPage />,
      },
      {
        path: "atendimento",
        element: <HRAttendancePage />,
      },
    ],
  },
];
