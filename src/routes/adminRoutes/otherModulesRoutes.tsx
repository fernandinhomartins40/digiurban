
import { RouteObject } from "react-router-dom";
import CulturaIndex from "@/pages/admin/cultura/index";
import TurismoIndex from "@/pages/admin/turismo/index";
import HabitacaoIndex from "@/pages/admin/habitacao/index";
import SegurancaPublicaIndex from "@/pages/admin/seguranca/index";
import TransporteIndex from "@/pages/admin/transporte/index";
import OuvidoriaIndex from "@/pages/admin/ouvidoria/index";

export const otherModulesRoutes: RouteObject[] = [
  // Cultura
  {
    path: "cultura",
    element: <CulturaIndex />,
  },
  
  // Turismo
  {
    path: "turismo",
    element: <TurismoIndex />,
  },
  
  // Habitação
  {
    path: "habitacao",
    element: <HabitacaoIndex />,
  },
  
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
