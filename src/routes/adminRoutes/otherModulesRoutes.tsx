
import { RouteObject } from "react-router-dom";
import TransporteIndex from "@/pages/admin/transporte/index";
import OuvidoriaIndex from "@/pages/admin/ouvidoria/index";

export const otherModulesRoutes: RouteObject[] = [
  // Transporte e Mobilidade
  {
    path: "transporte",
    element: <TransporteIndex />,
  },
  
  // Ouvidoria Municipal
  {
    path: "ouvidoria",
    element: <OuvidoriaIndex />,
  },
];
