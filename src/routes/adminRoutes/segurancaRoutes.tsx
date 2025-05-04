
import { RouteObject } from "react-router-dom";
import SegurancaPublicaIndex from "@/pages/admin/seguranca/index";
import OcorrenciasIndex from "@/pages/admin/seguranca/ocorrencias/index";
import GuardaMunicipalIndex from "@/pages/admin/seguranca/guarda/index";
import CamerasMonitoramentoIndex from "@/pages/admin/seguranca/cameras/index";

export const segurancaRoutes: RouteObject[] = [
  {
    path: "seguranca",
    element: <SegurancaPublicaIndex />,
  },
  {
    path: "seguranca/ocorrencias",
    element: <OcorrenciasIndex />,
  },
  {
    path: "seguranca/guarda",
    element: <GuardaMunicipalIndex />,
  },
  {
    path: "seguranca/cameras",
    element: <CamerasMonitoramentoIndex />,
  },
];
