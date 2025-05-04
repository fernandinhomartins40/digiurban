
import { RouteObject } from "react-router-dom";
import MeioAmbienteIndex from "@/pages/admin/meioambiente/index";
import LicencasIndex from "@/pages/admin/meioambiente/licencas/index";
import DenunciasIndex from "@/pages/admin/meioambiente/denuncias/index";
import CampanhasIndex from "@/pages/admin/meioambiente/campanhas/index";

export const meioAmbienteRoutes: RouteObject[] = [
  {
    path: "meioambiente",
    element: <MeioAmbienteIndex />,
  },
  {
    path: "meioambiente/licencas",
    element: <LicencasIndex />,
  },
  {
    path: "meioambiente/denuncias",
    element: <DenunciasIndex />,
  },
  {
    path: "meioambiente/campanhas",
    element: <CampanhasIndex />,
  },
];
