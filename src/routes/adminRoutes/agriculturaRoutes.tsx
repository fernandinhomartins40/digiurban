
import { RouteObject } from "react-router-dom";
import AgriculturaIndex from "@/pages/admin/agricultura/index";
import ProdutoresRuraisPage from "@/pages/admin/agricultura/produtores/index";
import AssistenciaTecnicaPage from "@/pages/admin/agricultura/assistencia/index";
import ProjetosRuraisPage from "@/pages/admin/agricultura/projetos/index";

export const agriculturaRoutes: RouteObject[] = [
  {
    path: "agricultura",
    element: <AgriculturaIndex />,
  },
  {
    path: "agricultura/produtores",
    element: <ProdutoresRuraisPage />,
  },
  {
    path: "agricultura/assistencia",
    element: <AssistenciaTecnicaPage />,
  },
  {
    path: "agricultura/projetos",
    element: <ProjetosRuraisPage />,
  },
];
