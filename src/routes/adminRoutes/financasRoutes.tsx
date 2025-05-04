
import { RouteObject } from "react-router-dom";
import FinancasIndex from "@/pages/admin/financas/index";
import FinancasDashboard from "@/pages/admin/financas/dashboard/index";
import SolicitacaoGuias from "@/pages/admin/financas/guias/index";
import ConsultarDebitos from "@/pages/admin/financas/debitos/index";
import Certidoes from "@/pages/admin/financas/certidoes/index";

export const financasRoutes: RouteObject[] = [
  {
    path: "financas",
    element: <FinancasIndex />,
  },
  {
    path: "financas/dashboard",
    element: <FinancasDashboard />,
  },
  {
    path: "financas/guias",
    element: <SolicitacaoGuias />,
  },
  {
    path: "financas/debitos",
    element: <ConsultarDebitos />,
  },
  {
    path: "financas/certidoes",
    element: <Certidoes />,
  },
];
