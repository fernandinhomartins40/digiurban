
import { RouteObject } from "react-router-dom";
import RHPage from "@/pages/admin/rh/index";
import HRServicesPage from "@/pages/admin/rh/servicos/index";

export const rhRoutes: RouteObject[] = [
  {
    path: "rh",
    element: <RHPage />,
  },
  {
    path: "rh/servicos",
    element: <HRServicesPage />,
  },
];

