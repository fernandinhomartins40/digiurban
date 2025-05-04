
import { RouteObject } from "react-router-dom";
import OuvidoriaIndex from "@/pages/admin/ouvidoria/index";
import ManifestacoesIndex from "@/pages/admin/ouvidoria/manifestacoes/index";
import RelatoriosIndex from "@/pages/admin/ouvidoria/relatorios/index";
import AtendimentoIndex from "@/pages/admin/ouvidoria/atendimento/index";

export const ouvidoriaRoutes: RouteObject[] = [
  {
    path: "ouvidoria",
    element: <OuvidoriaIndex />,
  },
  {
    path: "ouvidoria/manifestacoes",
    element: <ManifestacoesIndex />,
  },
  {
    path: "ouvidoria/relatorios",
    element: <RelatoriosIndex />,
  },
  {
    path: "ouvidoria/atendimento",
    element: <AtendimentoIndex />,
  },
];
