
import { RouteObject } from "react-router-dom";
import TransporteIndex from "@/pages/admin/transporte/index";

export const otherModulesRoutes: RouteObject[] = [
  // Transporte e Mobilidade
  {
    path: "transporte",
    element: <TransporteIndex />,
  },
];
