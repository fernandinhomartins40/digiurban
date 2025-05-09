
import { RouteObject } from "react-router-dom";
import ObrasPublicasIndex from "@/pages/admin/obras/index";
import PequenasObrasIndex from "@/pages/admin/obras/pequenas/index";
import MapaObrasIndex from "@/pages/admin/obras/mapa/index";
import FeedbackCidadaoIndex from "@/pages/admin/obras/feedback/index";

export const obrasRoutes: RouteObject[] = [
  {
    path: "obras",
    element: <ObrasPublicasIndex />,
  },
  // Removed ObrasDashboard route
  {
    path: "obras/pequenas",
    element: <PequenasObrasIndex />,
  },
  {
    path: "obras/mapa",
    element: <MapaObrasIndex />,
  },
  {
    path: "obras/feedback",
    element: <FeedbackCidadaoIndex />,
  },
];
