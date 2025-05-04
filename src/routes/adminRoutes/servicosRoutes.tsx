
import { RouteObject } from "react-router-dom";
import ServicosPublicosIndex from "@/pages/admin/servicos/index";
import SolicitacoesIndex from "@/pages/admin/servicos/solicitacoes/index";
import RegistrosFotograficosIndex from "@/pages/admin/servicos/registros/index";

export const servicosRoutes: RouteObject[] = [
  {
    path: "servicos",
    element: <ServicosPublicosIndex />,
  },
  {
    path: "servicos/solicitacoes",
    element: <SolicitacoesIndex />,
  },
  {
    path: "servicos/registros",
    element: <RegistrosFotograficosIndex />,
  },
];
