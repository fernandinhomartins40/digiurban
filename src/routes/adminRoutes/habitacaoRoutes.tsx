
import { RouteObject } from "react-router-dom";
import HabitacaoIndex from "@/pages/admin/habitacao/index";
import ProgramasHabitacionais from "@/pages/admin/habitacao/programas/index";
import InscricoesHabitacionais from "@/pages/admin/habitacao/inscricoes/index";
import UnidadesHabitacionais from "@/pages/admin/habitacao/unidades/index";

export const habitacaoRoutes: RouteObject[] = [
  {
    path: "habitacao",
    element: <HabitacaoIndex />,
  },
  {
    path: "habitacao/programas",
    element: <ProgramasHabitacionais />,
  },
  {
    path: "habitacao/inscricoes",
    element: <InscricoesHabitacionais />,
  },
  {
    path: "habitacao/unidades",
    element: <UnidadesHabitacionais />,
  },
];
