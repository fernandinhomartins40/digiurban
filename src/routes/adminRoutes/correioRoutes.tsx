
import { RouteObject } from "react-router-dom";
import MailInbox from "@/pages/admin/correio/MailInbox";
import NovoOficio from "@/pages/admin/correio/NovoOficio";
import TemplateCreator from "@/pages/admin/correio/TemplateCreator";

export const correioRoutes: RouteObject[] = [
  {
    path: "correio/dashboard",
    element: <MailInbox />,
  },
  {
    path: "correio/novo-oficio",
    element: <NovoOficio />,
  },
  {
    path: "correio/criador-oficios",
    element: <TemplateCreator />,
  },
];
