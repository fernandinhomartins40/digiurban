
import { RouteObject } from "react-router-dom";
import ComprasPage from "@/pages/admin/compras/index";

export const comprasRoutes: RouteObject[] = [
  {
    path: "compras",
    element: <ComprasPage />,
  },
];

