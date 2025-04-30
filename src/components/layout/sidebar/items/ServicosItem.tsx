
import React from "react";
import { Wrench } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getServicosItem = (): SidebarItemProps => ({
  icon: <Wrench size={18} />,
  title: "Serviços Públicos",
  moduleId: "servicos",
  children: [
    {
      title: "Solicitações",
      path: "/admin/servicos/solicitacoes",
    },
    {
      title: "Registro Fotográfico",
      path: "/admin/servicos/registros",
    },
  ],
});
