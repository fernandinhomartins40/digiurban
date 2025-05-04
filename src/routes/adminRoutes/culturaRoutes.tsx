
import { RouteObject } from "react-router-dom";
import CulturaIndex from "@/pages/admin/cultura/index";
import EventosPage from "@/pages/admin/cultura/eventos/index";
import PatrimonioPage from "@/pages/admin/cultura/patrimonio/index";
import ArtistasPage from "@/pages/admin/cultura/artistas/index";
import { CulturaLayout } from "@/pages/admin/cultura/components/CulturaLayout";

export const culturaRoutes: RouteObject[] = [
  {
    path: "cultura",
    element: <CulturaIndex />,
  },
  {
    path: "cultura/eventos",
    element: <EventosPage />,
  },
  {
    path: "cultura/patrimonio",
    element: <PatrimonioPage />,
  },
  {
    path: "cultura/artistas",
    element: <ArtistasPage />,
  },
];
