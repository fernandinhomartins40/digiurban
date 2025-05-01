
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
      path: "/admin/gabinete",
    },
    {
      title: "Agendamentos",
      path: "/admin/gabinete/agendamentos",
    },
    {
      title: "Solicitações Diretas",
      path: "/admin/gabinete/solicitacoes",
    },
    {
      title: "Políticas Públicas",
      path: "/admin/gabinete/politicas",
    },
    {
      title: "Programas Estratégicos",
      path: "/admin/gabinete/programas",
    },
  ],
});
