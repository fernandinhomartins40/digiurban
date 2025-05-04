
import { RouteObject } from "react-router-dom";
import TurismoIndex from "@/pages/admin/turismo/index";
import PontosTuristicos from "@/pages/admin/turismo/pontos/index";
import EventosTuristicos from "@/pages/admin/turismo/eventos/index";
import PromocoesTuristicas from "@/pages/admin/turismo/promocoes/index";

export const turismoRoutes: RouteObject[] = [
  {
    path: "turismo",
    element: <TurismoIndex />,
  },
  {
    path: "turismo/pontos",
    element: <PontosTuristicos />,
  },
  {
    path: "turismo/eventos",
    element: <EventosTuristicos />,
  },
  {
    path: "turismo/promocoes",
    element: <PromocoesTuristicas />,
  },
];
