
import React from "react";
import { Crown } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getGabineteItem = (): SidebarItemProps => ({
  icon: <Crown size={18} />,
  title: "Gabinete do Prefeito",
  moduleId: "gabinete",
  children: [
    {
      title: "Dashboard",
      path: "/admin/gabinete/dashboard",
    },
    {
      title: "Agendamentos",
      path: "/admin/gabinete/agenda",
    },
    {
      title: "Serviços por Cidadão",
      path: "/admin/gabinete/cidadaos",
    },
  ],
});
