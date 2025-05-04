
import { RouteObject } from "react-router-dom";
import SegurancaPublicaIndex from "@/pages/admin/seguranca/index";
import TransporteIndex from "@/pages/admin/transporte/index";
import OuvidoriaIndex from "@/pages/admin/ouvidoria/index";

export const otherModulesRoutes: RouteObject[] = [
  // Segurança Pública
  {
    path: "seguranca",
    element: <SegurancaPublicaIndex />,
  },
  
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
