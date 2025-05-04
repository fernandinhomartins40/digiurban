
import { RouteObject } from "react-router-dom";
import EsportesIndex from "@/pages/admin/esportes/index";
import CompeticoesPage from "@/pages/admin/esportes/competicoes/index";
import EquipesPage from "@/pages/admin/esportes/equipes/index";
import InfraestruturaPage from "@/pages/admin/esportes/infraestrutura/index";

export const esportesRoutes: RouteObject[] = [
  {
    path: "esportes",
    element: <EsportesIndex />,
  },
  {
    path: "esportes/competicoes",
    element: <CompeticoesPage />,
  },
  {
    path: "esportes/equipes",
    element: <EquipesPage />,
  },
  {
    path: "esportes/infraestrutura",
    element: <InfraestruturaPage />,
  },
];
