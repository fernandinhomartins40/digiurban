
import { RouteObject } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import UserManagement from "@/pages/admin/users/UserManagement";
import { correioRoutes } from "./correioRoutes";
import { gabineteRoutes } from "./gabineteRoutes";
import { adminChatRoutes } from "./chatRoutes";
import { administracaoRoutes } from "./administracaoRoutes";
import { saudeRoutes } from "./saudeRoutes";
import { educacaoRoutes } from "./educacaoRoutes";
import { assistenciaRoutes } from "./assistenciaRoutes";
import { financasRoutes } from "./financasRoutes";
import { agriculturaRoutes } from "./agriculturaRoutes";
import { esportesRoutes } from "./esportesRoutes";
import { culturaRoutes } from "./culturaRoutes";
import { turismoRoutes } from "./turismoRoutes";
import { habitacaoRoutes } from "./habitacaoRoutes";
import { otherModulesRoutes } from "./otherModulesRoutes";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      
      // Module-specific routes
      ...correioRoutes,
      ...gabineteRoutes,
      ...adminChatRoutes,
      ...administracaoRoutes,
      ...saudeRoutes,
      ...educacaoRoutes,
      ...assistenciaRoutes,
      ...financasRoutes,
      ...agriculturaRoutes,
      ...esportesRoutes,
      ...culturaRoutes,
      ...turismoRoutes,
      ...habitacaoRoutes,
      ...otherModulesRoutes,
    ],
  },
];
