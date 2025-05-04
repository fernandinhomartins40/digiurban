
import React from "react";
import { Settings } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getServicosItem = (): SidebarItemProps => ({
  icon: <Settings size={18} />,
  title: "Serviços Públicos",
  moduleId: "servicos",
  children: [
    {
      title: "Visão Geral",
      path: "/admin/servicos",
    },
    {
      title: "Solicitações",
      path: "/admin/servicos/solicitacoes",
    },
    {
      title: "Registros Fotográficos",
      path: "/admin/servicos/registros",
    },
  ],
});
