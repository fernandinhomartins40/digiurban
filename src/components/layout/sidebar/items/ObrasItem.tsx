
import React from "react";
import { Building } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getObrasItem = (): SidebarItemProps => ({
  icon: <Building size={18} />,
  title: "Obras Públicas",
  moduleId: "obras",
  children: [
    {
      title: "Dashboard",
      path: "/admin/obras/dashboard",
    },
    {
      title: "Pequenas Obras",
      path: "/admin/obras/pequenas",
    },
    {
      title: "Mapa de Obras",
      path: "/admin/obras/mapa",
    },
    {
      title: "Feedback Cidadão",
      path: "/admin/obras/feedback",
    },
  ],
});
