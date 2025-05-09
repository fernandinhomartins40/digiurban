
import { RouteObject } from "react-router-dom";
import BeneficiosPage from "@/pages/admin/assistencia/beneficios/index";
import ProgramasSociaisPage from "@/pages/admin/assistencia/programas/index";
import CRASCREASPage from "@/pages/admin/assistencia/cras/index";
import FamiliaVulneraveisPage from "@/pages/admin/assistencia/familias/index";
import AssistenciaDashboard from "@/pages/admin/assistencia/Dashboard";

export const assistenciaRoutes: RouteObject[] = [
  {
    path: "assistencia/dashboard",
    element: <AssistenciaDashboard />,
  },
  {
    path: "assistencia/beneficios",
    element: <BeneficiosPage />,
  },
  {
    path: "assistencia/programas",
    element: <ProgramasSociaisPage />,
  },
  {
    path: "assistencia/cras",
    element: <CRASCREASPage />,
  },
  {
    path: "assistencia/familias",
    element: <FamiliaVulneraveisPage />,
  },
];
