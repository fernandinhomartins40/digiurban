
import React from "react";
import { ChartBar } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getExecutivoItem = (): SidebarItemProps => ({
  icon: <ChartBar size={18} />,
  title: "Executivo",
  moduleId: "executivo",
  children: [
    {
      title: "Dashboard Consolidado",
      path: "/admin/executivo/dashboard",
    },
    {
      title: "Sistema de Alertas",
      path: "/admin/alertas",
    },
  ],
});
