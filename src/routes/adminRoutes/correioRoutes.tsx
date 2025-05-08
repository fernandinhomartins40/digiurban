
import { RouteObject } from "react-router-dom";
import NovoOficio from "@/pages/admin/correio/NovoOficio";
import TemplateCreator from "@/pages/admin/correio/TemplateCreator";
import TemplateLibrary from "@/pages/admin/correio/TemplateLibrary";
import EmailInterno from "@/pages/admin/correio/EmailInterno";

export const correioRoutes: RouteObject[] = [
  {
    path: "correio/email-interno",
    element: <EmailInterno />,
  },
  {
    path: "correio/novo-oficio",
    element: <NovoOficio />,
  },
  {
    path: "correio/criador-oficios",
    element: <TemplateCreator />,
  },
  {
    path: "correio/biblioteca-modelos",
    element: <TemplateLibrary />,
  },
];
