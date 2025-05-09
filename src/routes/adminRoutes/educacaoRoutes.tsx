
import { RouteObject } from "react-router-dom";
import EscolasPage from "@/pages/admin/educacao/escolas/index";
import MatriculaPage from "@/pages/admin/educacao/matricula/index";
import TransportePage from "@/pages/admin/educacao/transporte/index";
import PessoasPage from "@/pages/admin/educacao/pessoas/index";
import AulasPage from "@/pages/admin/educacao/aulas/index";
import DesempenhoPage from "@/pages/admin/educacao/desempenho/index";
import CalendarioPage from "@/pages/admin/educacao/calendario/index";
import ComunicacaoPage from "@/pages/admin/educacao/comunicacao/index";
import MerendaPage from "@/pages/admin/educacao/merenda/index";
import OcorrenciasPage from "@/pages/admin/educacao/ocorrencias/index";

export const educacaoRoutes: RouteObject[] = [
  {
    path: "educacao/escolas",
    element: <EscolasPage />,
  },
  {
    path: "educacao/matricula",
    element: <MatriculaPage />,
  },
  {
    path: "educacao/transporte",
    element: <TransportePage />,
  },
  {
    path: "educacao/pessoas",
    element: <PessoasPage />,
  },
  {
    path: "educacao/aulas",
    element: <AulasPage />,
  },
  {
    path: "educacao/desempenho",
    element: <DesempenhoPage />,
  },
  {
    path: "educacao/calendario",
    element: <CalendarioPage />,
  },
  {
    path: "educacao/comunicacao",
    element: <ComunicacaoPage />,
  },
  {
    path: "educacao/merenda",
    element: <MerendaPage />,
  },
  {
    path: "educacao/ocorrencias",
    element: <OcorrenciasPage />,
  },
];
