
import { RouteObject } from "react-router-dom";
import AtendimentosPage from "@/pages/admin/saude/atendimentos/index";
import MedicamentosPage from "@/pages/admin/saude/medicamentos/index";
import TFDPage from "@/pages/admin/saude/tfd/index";
import ProgramasPage from "@/pages/admin/saude/programas/index";
import CampanhasPage from "@/pages/admin/saude/campanhas/index";
import ACSPage from "@/pages/admin/saude/acs/index";
import HealthDashboard from "@/pages/admin/saude/Dashboard";

export const saudeRoutes: RouteObject[] = [
  {
    path: "saude/dashboard",
    element: <HealthDashboard />,
  },
  {
    path: "saude/atendimentos",
    element: <AtendimentosPage />,
  },
  {
    path: "saude/medicamentos",
    element: <MedicamentosPage />,
  },
  {
    path: "saude/tfd",
    element: <TFDPage />,
  },
  {
    path: "saude/programas",
    element: <ProgramasPage />,
  },
  {
    path: "saude/campanhas",
    element: <CampanhasPage />,
  },
  {
    path: "saude/acs",
    element: <ACSPage />,
  },
];
