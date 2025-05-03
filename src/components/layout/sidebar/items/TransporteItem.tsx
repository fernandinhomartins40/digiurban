
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { Bus } from "lucide-react";

export function getTransporteItem(): SidebarItemProps {
  return {
    icon: <Bus size={20} />,
    title: "Transporte e Mobilidade",
    path: "/admin/transporte",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/transporte",
      },
      {
        title: "Linhas de Ônibus",
        path: "/admin/transporte/linhas",
      },
      {
        title: "Infraestrutura",
        path: "/admin/transporte/infraestrutura",
      },
      {
        title: "Sinalização",
        path: "/admin/transporte/sinalizacao",
      },
    ],
    moduleId: "transporte",
  };
}
