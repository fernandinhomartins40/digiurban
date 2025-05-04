
import { RouteObject } from "react-router-dom";
import AdministracaoIndex from "@/pages/admin/administracao/index";
import RHPage from "@/pages/admin/administracao/rh/index";
import ComprasPage from "@/pages/admin/administracao/compras/index";

export const administracaoRoutes: RouteObject[] = [
  {
    path: "administracao",
    element: <AdministracaoIndex />,
  },
  {
    path: "administracao/rh",
    element: <RHPage />,
  },
  {
    path: "administracao/compras",
    element: <ComprasPage />,
  },
];
