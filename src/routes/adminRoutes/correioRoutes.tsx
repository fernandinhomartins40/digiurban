
import { RouteObject } from "react-router-dom";
import MailDashboard from "@/pages/admin/correio/MailDashboard";
import OficioDigital from "@/pages/admin/correio/OficioDigital";
import TemplateCreator from "@/pages/admin/correio/TemplateCreator";

export const correioRoutes: RouteObject[] = [
  {
    path: "correio/dashboard",
    element: <MailDashboard />,
  },
  {
    path: "correio/oficio-digital",
    element: <OficioDigital />,
  },
  {
    path: "correio/criador-oficios",
    element: <TemplateCreator />,
  },
];
