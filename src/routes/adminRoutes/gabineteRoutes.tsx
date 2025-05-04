
import { RouteObject } from "react-router-dom";
import MayorDashboard from "@/pages/admin/gabinete/Dashboard";
import AppointmentScheduler from "@/pages/admin/gabinete/AppointmentScheduler";
import DirectRequests from "@/pages/admin/gabinete/DirectRequests";
import PublicPolicies from "@/pages/admin/gabinete/PublicPolicies";
import StrategicPrograms from "@/pages/admin/gabinete/StrategicPrograms";

export const gabineteRoutes: RouteObject[] = [
  {
    path: "gabinete/dashboard",
    element: <MayorDashboard />,
  },
  {
    path: "gabinete/agendamentos",
    element: <AppointmentScheduler />,
  },
  {
    path: "gabinete/solicitacoes",
    element: <DirectRequests />,
  },
  {
    path: "gabinete/politicas",
    element: <PublicPolicies />,
  },
  {
    path: "gabinete/programas",
    element: <StrategicPrograms />,
  },
];
